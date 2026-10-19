// The panel's end-to-end check: boots the real server on a throwaway
// root and an ephemeral port, then asserts the loop the contract
// promises — health, rendering, assets, traversal refusal, the host
// guard, crash-proof malformed URLs, the refusal of every answer post,
// and the doc route. Exits nonzero on any miss. Run with: pnpm check

import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { request } from "node:http";

const here = dirname(fileURLToPath(import.meta.url));
const root = mkdtempSync(join(tmpdir(), "ki-panel-check-"));
const panelDir = join(root, ".ki", "panel");
mkdirSync(panelDir, { recursive: true });

const failures = [];
const ok = (name, cond) => {
  if (!cond) failures.push(name);
};

const child = spawn(
  process.execPath,
  [join(here, "server.mjs"), "--port", "0", "--root", root, "--demo", "ask"],
  { stdio: ["ignore", "pipe", "pipe"] }
);
let serverLog = "";
child.stdout.on("data", (d) => (serverLog += d));
child.stderr.on("data", (d) => (serverLog += d));

const cleanup = () => {
  child.kill();
  try {
    rmSync(root, { recursive: true, force: true });
  } catch {}
};
process.on("exit", cleanup);

// Wait for the banner that names the ephemeral port.
let port = 0;
{
  const banner = /http:\/\/127\.0\.0\.1:(\d+)/;
  for (let i = 0; i < 50 && !port; i++) {
    const m = banner.exec(serverLog);
    if (m) port = Number(m[1]);
    else await new Promise((r) => setTimeout(r, 100));
  }
  if (!port) {
    console.error(`server check: the server never named its port\n${serverLog}`);
    process.exit(1);
  }
}
const base = `http://127.0.0.1:${port}`;

// A raw request with a chosen Host header (fetch forbids setting it).
const rawGet = (hostHeader, pathName) =>
  new Promise((resolve) => {
    const req = request(
      { host: "127.0.0.1", port, path: pathName, headers: { Host: hostHeader } },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.end();
  });
const rawPost = (hostHeader, pathName, origin, body) =>
  new Promise((resolve) => {
    const req = request(
      {
        host: "127.0.0.1",
        port,
        path: pathName,
        method: "POST",
        headers: {
          Host: hostHeader,
          Origin: origin,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
      (res) => {
        let b = "";
        res.on("data", (c) => (b += c));
        res.on("end", () => resolve({ status: res.statusCode, body: b }));
      }
    );
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.end(body);
  });

// Rendering and assets. The panel takes no input: no form, no button,
// no re-answer link reaches the page.
{
  const page = await (await fetch(`${base}/`)).text();
  ok("ask renders", page.includes("Do students get a formula sheet") && page.includes("ki-choices"));
  ok("choices are words", page.includes("Yes — the sheet from week 2") && page.includes("default"));
  ok("the panel takes no input", !page.includes("<form") && !page.includes("<button") && !page.includes("/?edit"));
  ok("the answer line shows", page.includes("Answer in the chat."));
  ok("listener rides", page.includes("/listen.js"));
  ok("settled strip", page.includes("ki-settled"));

  const css = await (await fetch(`${base}/design/ki.css`)).text();
  ok("design css served", css.includes("Ki design system"));
  const panelCss = await (await fetch(`${base}/panel.css`)).text();
  ok("serving css served", panelCss.includes("ki-settled"));
  const fonts = await (await fetch(`${base}/design/fonts/fonts.css`)).text();
  ok("fonts css served", fonts.includes("Source Serif"));
}

// Traversal is refused on both static routes.
{
  const r1 = await fetch(`${base}/design/%2e%2e/package.json`);
  ok("design traversal refused", r1.status === 404);
  const r2 = await fetch(`${base}/doc/%2e%2e/package.json`);
  ok("doc traversal refused", r2.status === 404);
}

// The host must name this machine; every post to the answer route is
// refused, whatever its origin, and nothing is written.
{
  const r = await rawGet("evil.example", "/");
  ok("foreign host refused", r.status === 403);
  const p1 = await rawPost(
    `127.0.0.1:${port}`,
    "/answer",
    "http://evil.example",
    "id=q-31c9&turn=ask&value=hmm"
  );
  ok("cross-origin post refused", p1.status === 403);
  const p2 = await rawPost(
    `127.0.0.1:${port}`,
    "/answer",
    `http://127.0.0.1:${port}`,
    "id=q-31c9&turn=ask&value=hmm"
  );
  ok("loopback post refused too", p2.status === 403);
  ok("no answer file written", !existsSync(join(panelDir, "answer.json")));
}

// A malformed URL is answered, not fatal: the server stays up.
{
  const r = await fetch(`${base}/%zz`);
  ok("malformed path answered", r.status === 400 || r.status === 404);
  const h = await fetch(`${base}/healthz`);
  ok("server survives malformed path", h.ok && (await h.text()) === "ok");
}

// The doc route serves workspace files as plain text.
{
  const file = join(root, "courses", "stat-101", "quizzes", "quiz-04.md");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, "# Quiz 4\n");
  const r = await fetch(`${base}/doc/courses%2Fstat-101%2Fquizzes%2Fquiz-04.md`);
  ok("doc route serves", r.status === 200 && (await r.text()).includes("Quiz 4"));
  ok("doc route is plain text", (r.headers.get("content-type") ?? "").startsWith("text/plain"));
}

if (failures.length) {
  console.error(`server check: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("server check: the loop holds");
process.exit(0);
