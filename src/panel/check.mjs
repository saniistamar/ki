// The panel's end-to-end check: boots the real server on a throwaway
// root and asserts the loop the contract promises — health, rendering,
// assets, traversal refusal, host and origin guards, the answer post,
// the recorded state, overwrite, consume, and the doc route. Exits
// nonzero on any miss. Run with: pnpm check

import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { request } from "node:http";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 4419;
const base = `http://127.0.0.1:${PORT}`;
const root = mkdtempSync(join(tmpdir(), "ki-panel-check-"));
const panelDir = join(root, ".ki", "panel");
mkdirSync(panelDir, { recursive: true });

const failures = [];
const ok = (name, cond) => {
  if (!cond) failures.push(name);
};

const child = spawn(
  process.execPath,
  [join(here, "server.mjs"), "--port", String(PORT), "--root", root, "--demo", "draft"],
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

// Wait for the server to answer health.
{
  let up = false;
  for (let i = 0; i < 50 && !up; i++) {
    try {
      const r = await fetch(`${base}/healthz`);
      up = r.ok && (await r.text()) === "ok";
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  if (!up) {
    console.error(`server check: the server never came up\n${serverLog}`);
    process.exit(1);
  }
}

// A raw request with a chosen Host header (fetch forbids setting it).
const rawGet = (hostHeader, path) =>
  new Promise((resolve) => {
    const req = request(
      { host: "127.0.0.1", port: PORT, path, headers: { Host: hostHeader } },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.end();
  });
const rawPost = (hostHeader, path, origin, body) =>
  new Promise((resolve) => {
    const req = request(
      {
        host: "127.0.0.1",
        port: PORT,
        path,
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

// Rendering and assets.
{
  const page = await (await fetch(`${base}/`)).text();
  ok("draft renders", page.includes("Coverage") && page.includes("Quantity and mix"));
  ok("ask id travels", page.includes('name="id" value="d-8f42"'));
  ok("actions present", page.includes("Yes, write it") && page.includes("Adjust"));
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

// The host must name this machine; a cross-origin post is refused.
{
  const r = await rawGet("evil.example", "/");
  ok("foreign host refused", r.status === 403);
  const p = await rawPost(
    `127.0.0.1:${PORT}`,
    "/answer",
    "http://evil.example",
    "id=d-8f42&turn=draft&answer=yes"
  );
  ok("cross-origin post refused", p.status === 403);
}

// The answer loop.
{
  const post = (body) =>
    fetch(`${base}/answer`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });
  const r = await post("id=d-8f42&turn=draft&answer=yes&open=closed+book,+calculator+allowed&changes=make+the+last+question+harder");
  ok("answer posts with redirect", r.status === 303 && r.headers.get("location") === "/");

  const answer = JSON.parse(readFileSync(join(panelDir, "answer.json"), "utf8"));
  ok("answer file shape", answer.id === "d-8f42" && answer.answer === "yes");
  ok("answer open carried", answer.open === "closed book, calculator allowed");
  ok("answer changes carried", answer.changes.includes("make the last question harder"));

  const page = await (await fetch(`${base}/`)).text();
  ok(
    "recorded line echoes the pick",
    page.includes("Recorded — Yes, write it · closed book, calculator allowed")
  );
  ok("change link stays", page.includes("Change the answer"));
  ok("form retired", !page.includes("<form"));

  const edit = await (await fetch(`${base}/?edit`)).text();
  ok("edit reopens with the pick", edit.includes("<form") && edit.includes("<option selected>closed book, calculator allowed</option>"));

  // An empty answer is no answer: the ask stays open.
  await post("id=d-8f42&turn=draft");
  const stillOpen = await (await fetch(`${base}/`)).text();
  ok("empty answer ignored", stillOpen.includes("Recorded — Yes, write it"));

  // A changed post overwrites.
  await post("id=d-8f42&turn=draft&answer=adjust&changes=shorter+essay");
  const changed = JSON.parse(readFileSync(join(panelDir, "answer.json"), "utf8"));
  ok("overwrite works", changed.answer === "adjust");

  // Consuming by rename reopens the ask.
  renameSync(join(panelDir, "answer.json"), join(panelDir, "answer.consumed"));
  const reopened = await (await fetch(`${base}/`)).text();
  ok("consume reopens", reopened.includes("Yes, write it") && reopened.includes("<form"));

  // A stale id does not retire the ask.
  await post("id=zzz&turn=draft&answer=yes");
  const after = await (await fetch(`${base}/`)).text();
  ok("stale answer ignored", after.includes("<form"));
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
