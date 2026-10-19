// Ki's panel server: zero-dependency, loopback-only. Serves the current
// ask from the workspace's .ki/panel/ files (or a demo state), the design
// system's assets, and the answer route that writes answer.json. The
// contract is in ./README.md.

import { createServer } from "node:http";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { watch as watchCb } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPanel } from "./render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const designDir = resolve(here, "..", "design");
const demoDir = join(here, "demo");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const PORT = Number(flag("port") ?? 4400);
const ROOT = resolve(flag("root") ?? process.cwd());
const DEMO = flag("demo");
const panelDir = join(ROOT, ".ki", "panel");

const readJson = async (p) => {
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return null; // malformed or missing reads as absent
  }
};

const loadState = async () => {
  if (DEMO) {
    const ask = await readJson(join(demoDir, `${DEMO}.json`));
    if (!ask) {
      console.error(`No demo state "${DEMO}". Run with --demo <status|ask|intake|draft|deliver>.`);
      process.exit(1);
    }
    return { ask, settled: (await readJson(join(demoDir, "_settled.json"))) ?? [] };
  }
  const [ask, settled] = await Promise.all([
    readJson(join(panelDir, "ask.json")),
    readJson(join(panelDir, "settled.json")),
  ]);
  return { ask, settled: Array.isArray(settled) ? settled : [] };
};

const loadPending = async (ask) => {
  const answer = await readJson(join(panelDir, "answer.json"));
  return answer && ask && answer.id === ask.id ? answer : null;
};

const atomicWrite = async (p, text) => {
  const tmp = `${p}.tmp`;
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

// Serve a file that must stay inside `base`. Anything that escapes is a 404.
const serveInside = async (res, base, rel) => {
  const target = resolve(join(base, rel));
  if (target !== resolve(base) && !target.startsWith(resolve(base) + sep)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  try {
    const body = await readFile(target);
    const type = TYPES[target.slice(target.lastIndexOf("."))] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": type, "cache-control": "no-cache" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
};

const LISTENER = 'new EventSource("/events").addEventListener("reload", () => location.reload());\n';

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const path = decodeURIComponent(url.pathname);

  try {
    if (req.method === "GET" && path === "/healthz") {
      res.writeHead(200, { "content-type": "text/plain" });
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
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && path === "/panel.css") {
      await serveInside(res, here, "serve.css");
      return;
    }
    if (req.method === "GET" && path === "/listen.js") {
      res.writeHead(200, { "content-type": TYPES[".js"], "cache-control": "no-cache" });
      res.end(LISTENER);
      return;
    }
    if (req.method === "GET" && path.startsWith("/design/")) {
      await serveInside(res, designDir, path.slice("/design/".length));
      return;
    }
    if (req.method === "GET" && path.startsWith("/doc/")) {
      await serveInside(res, ROOT, path.slice("/doc/".length));
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
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
        if (chunks.reduce((n, c) => n + c.length, 0) > 65536) {
          res.writeHead(413, { "content-type": "text/plain" });
          res.end("too large");
          return;
        }
      }
      const sp = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
      const answer = { id: sp.get("id") ?? "", turn: sp.get("turn") ?? "", posted: new Date().toISOString() };
      for (const [k, v] of sp) {
        if (!v || k === "id" || k === "turn") continue;
        answer[k] = k === "changes" ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : v;
      }
      await mkdir(panelDir, { recursive: true });
      await atomicWrite(join(panelDir, "answer.json"), `${JSON.stringify(answer, null, 2)}\n`);
      res.writeHead(303, { location: "/" });
      res.end();
      return;
    }

    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
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

server.listen(PORT, "127.0.0.1", () => {
  const shown = DEMO ? `demo: ${DEMO}` : `root: ${ROOT}`;
  console.log(`Ki panel on http://127.0.0.1:${PORT} (${shown})`);
});
