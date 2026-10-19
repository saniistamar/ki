// Ki's panel server: zero-dependency, loopback-only. Serves the current
// ask from the workspace's .ki/panel/ files (or a demo state), the design
// system's assets, and the answer route that writes answer.json. The
// contract is in ./README.md.

import { createServer } from "node:http";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { watch as watchCb } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPanel, validateAsk } from "./render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const designDir = resolve(here, "..", "design");
const demoDir = join(here, "demo");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const PORT = Number(flag("port") ?? 4400);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error("Port must be a number between 1 and 65535.");
  process.exit(1);
}
const DEMO = flag("demo");
// Demo mode without an explicit --root stays out of any real workspace.
const ROOT = resolve(
  flag("root") ?? (DEMO ? mkdtempSync(join(tmpdir(), "ki-panel-")) : process.cwd())
);
const panelDir = join(ROOT, ".ki", "panel");

const readJson = async (p) => {
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return null; // malformed or missing reads as absent
  }
};

// A rejected ask is named in the server log (the agent's task output),
// then served as idle: the surface never invents a state Ki did not write.
const checkedAsk = async (p) => {
  const ask = await readJson(p);
  if (!ask) return null;
  const error = validateAsk(ask);
  if (error) {
    console.warn(`panel: ${p} rejected — ${error}`);
    return null;
  }
  return ask;
};

const loadState = async () => {
  if (DEMO) {
    const ask = await readJson(join(demoDir, `${DEMO}.json`));
    return { ask, settled: (await readJson(join(demoDir, "_settled.json"))) ?? [] };
  }
  const [ask, settled] = await Promise.all([
    checkedAsk(join(panelDir, "ask.json")),
    readJson(join(panelDir, "settled.json")),
  ]);
  return { ask, settled: Array.isArray(settled) ? settled : [] };
};

const loadPending = async (ask) => {
  const answer = await readJson(join(panelDir, "answer.json"));
  return answer && ask && answer.id === ask.id ? answer : null;
};

const atomicWrite = async (p, text) => {
  const tmp = `${p}.${Math.random().toString(36).slice(2)}.tmp`;
  await writeFile(tmp, text, "utf8");
  await rename(tmp, p);
};

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".md": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const NOSNIFF = { "x-content-type-options": "nosniff" };

// The loopback bind is not the trust boundary by itself: a page the
// educator browses can still address 127.0.0.1. Host must name this
// machine (this kills DNS rebinding), and a cross-origin post to the
// answer route is refused (a browser form post always carries Origin).
const hostOk = (req) =>
  req.headers.host === `127.0.0.1:${PORT}` || req.headers.host === `localhost:${PORT}`;
const originOk = (req) => {
  const origin = req.headers.origin;
  return (
    !origin || origin === `http://127.0.0.1:${PORT}` || origin === `http://localhost:${PORT}`
  );
};

// Serve a file that must stay inside `base`. Anything that escapes is a 404.
// Under /doc everything renders as plain text: workspace files never
// execute as pages on the panel's origin.
const serveInside = async (res, base, rel, plainOnly = false) => {
  const target = resolve(join(base, rel));
  if (target !== resolve(base) && !target.startsWith(resolve(base) + sep)) {
    res.writeHead(404, { "content-type": "text/plain", ...NOSNIFF });
    res.end("not found");
    return;
  }
  try {
    const body = await readFile(target);
    const type = plainOnly
      ? "text/plain; charset=utf-8"
      : TYPES[target.slice(target.lastIndexOf("."))] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": type, "cache-control": "no-cache", ...NOSNIFF });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain", ...NOSNIFF });
    res.end("not found");
  }
};

const LISTENER = 'new EventSource("/events").addEventListener("reload", () => location.reload());\n';

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const path = decodeURIComponent(url.pathname);

  if (!hostOk(req)) {
    res.writeHead(403, { "content-type": "text/plain", ...NOSNIFF });
    res.end("refused");
    return;
  }

  try {
    if (req.method === "GET" && path === "/healthz") {
      res.writeHead(200, { "content-type": "text/plain", ...NOSNIFF });
      res.end("ok");
      return;
    }

    if (req.method === "GET" && (path === "/" || path === "/index.html")) {
      const { ask, settled } = await loadState();
      const pending = await loadPending(ask);
      const html = renderPanel(ask, settled, {
        live: true,
        designPrefix: "/design",
        edit: url.searchParams.has("edit"),
        pending,
      });
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
        ...NOSNIFF,
      });
      res.end(html);
      return;
    }

    if (req.method === "GET" && path === "/panel.css") {
      await serveInside(res, here, "serve.css");
      return;
    }
    if (req.method === "GET" && path === "/listen.js") {
      res.writeHead(200, { "content-type": TYPES[".js"], "cache-control": "no-cache", ...NOSNIFF });
      res.end(LISTENER);
      return;
    }
    if (req.method === "GET" && path.startsWith("/design/")) {
      await serveInside(res, designDir, path.slice("/design/".length));
      return;
    }
    if (req.method === "GET" && path.startsWith("/doc/")) {
      await serveInside(res, ROOT, path.slice("/doc/".length), true);
      return;
    }

    if (req.method === "GET" && path === "/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      });
      res.write("retry: 2000\n\n");
      let timer = null;
      const bump = () => {
        clearTimeout(timer);
        timer = setTimeout(() => res.write("event: reload\ndata: now\n\n"), 60);
      };
      const watchers = [];
      for (const dir of [DEMO ? demoDir : panelDir]) {
        try {
          const w = watchCb(dir, { recursive: true });
          w.on("change", (event, file) => {
            if (!file || /\.(json|css)$/.test(file)) bump();
          });
          watchers.push(w);
        } catch {
          // no state folder yet; nothing to watch
        }
      }
      req.on("close", () => {
        clearTimeout(timer);
        for (const w of watchers) w.close();
      });
      return;
    }

    if (req.method === "POST" && path === "/answer") {
      if (!originOk(req)) {
        res.writeHead(403, { "content-type": "text/plain", ...NOSNIFF });
        res.end("refused");
        return;
      }
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
        if (chunks.reduce((n, c) => n + c.length, 0) > 65536) {
          res.writeHead(413, { "content-type": "text/plain", ...NOSNIFF });
          res.end("too large");
          return;
        }
      }
      const sp = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
      const id = sp.get("id") ?? "";
      const turn = sp.get("turn") ?? "";
      const answer = { id, turn, posted: new Date().toISOString() };
      // The answer shape is part of the contract: only the fields the
      // turn owns are kept, and an answer with no substance is no answer.
      const allowed = turn === "draft" ? ["answer", "open", "changes"] : ["value"];
      let hasSubstance = false;
      for (const key of allowed) {
        const v = sp.get(key) ?? "";
        if (!v) continue;
        answer[key] =
          key === "changes" ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : v;
        if (key !== "changes" || answer[key].length) hasSubstance = true;
      }
      if (id && hasSubstance) {
        await mkdir(panelDir, { recursive: true });
        await atomicWrite(join(panelDir, "answer.json"), `${JSON.stringify(answer, null, 2)}\n`);
      }
      res.writeHead(303, { location: "/", ...NOSNIFF });
      res.end();
      return;
    }

    res.writeHead(404, { "content-type": "text/plain", ...NOSNIFF });
    res.end("not found");
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain", ...NOSNIFF });
    res.end("the panel hit an error");
    console.error(err);
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is busy. Start the panel with --port <other>.`);
    process.exit(1);
  }
  throw err;
});

// Validate the demo name at boot, not on first request.
if (DEMO) {
  readFile(join(demoDir, `${DEMO}.json`), "utf8").then(
    () => {
      server.listen(PORT, "127.0.0.1", () => {
        console.log(`Ki panel on http://127.0.0.1:${PORT} (demo: ${DEMO}, root: ${ROOT})`);
      });
    },
    () => {
      console.error(
        `No demo state "${DEMO}". Run with --demo <status|ask|intake|draft|deliver>.`
      );
      process.exit(1);
    }
  );
} else {
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`Ki panel on http://127.0.0.1:${PORT} (root: ${ROOT})`);
  });
}
