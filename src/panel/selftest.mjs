// The panel self-test: render every demo state plus the idle and live
// states, and assert the anchors the contract promises. The panel takes
// no input, so every render must be free of forms, inputs, buttons, and
// re-answer links. Exits nonzero on any miss. Run with: pnpm test

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderPanel, validateAsk } from "./render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const demoDir = join(here, "demo");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const demo = (name) => readJson(join(demoDir, `${name}.json`));
const settled = readJson(join(demoDir, "_settled.json"));

const failures = [];
function check(name, html, needles) {
  for (const n of needles) {
    if (!html.includes(n)) failures.push(`${name}: missing ${JSON.stringify(n)}`);
  }
}
function absent(name, html, needles) {
  for (const n of needles) {
    if (html.includes(n)) failures.push(`${name}: unexpected ${JSON.stringify(n)}`);
  }
}
const always = ["<!DOCTYPE html>", 'class="ki-panel"', 'ki-context__where">Ki'];
const noInput = ["<form", "<input", "<button", "/?edit"];

// Every demo state renders, validates, carries the shell, no inline
// style, no script, and — the input switch — no affordance anywhere.
for (const f of readdirSync(demoDir)) {
  if (!f.endsWith(".json") || f.startsWith("_")) continue;
  const state = f.replace(/\.json$/, "");
  const ask = demo(state);
  const bad = validateAsk(ask);
  if (bad) failures.push(`${state}: rejected by validateAsk — ${bad}`);
  const html = renderPanel(ask, settled);
  check(state, html, always);
  absent(state, html, ["style=\""]);
  absent(state, html, ["<script"]);
  absent(state, html, noInput);
}

// Validation names the malformed ask instead of rendering it calm.
if (validateAsk({ id: "x", turn: "guess" }) === null) failures.push("validate: unknown turn accepted");
if (validateAsk({ turn: "draft" }) === null) failures.push("validate: missing id accepted");
if (validateAsk({ id: "x", turn: "draft", draft: { coverage: {} } }) === null)
  failures.push("validate: missing draft fields accepted");

// Draft: the five rows and their marks, read-only.
{
  const html = renderPanel(demo("draft"), settled);
  check(
    "draft",
    html,
    [
      "Coverage",
      "Structure",
      "Quantity and mix",
      "One sample",
      "Open choices",
      "ki-draft",
      "ki-tick",
      "ki-rough",
      "from week-3 slides",
      "check this",
      '<span class="ki-num">12 questions · 30 points · 25 minutes</span>',
      "closed book, calculator allowed",
    ]
  );
  absent("draft", html, [...noInput, "What should change?", "Recorded", "ki-actions"]);
}

// The pending and edit options are accepted and ignored: the same
// read-only render whatever a stale caller passes.
{
  const pending = {
    id: "d-8f42",
    turn: "draft",
    answer: "yes",
    open: "closed book, calculator allowed",
    changes: ["make the last question harder"],
  };
  const withPending = renderPanel(demo("draft"), settled, { pending });
  absent("draft-pending", withPending, ["Recorded", "Change the answer", ...noInput]);
  check("draft-pending", withPending, ["closed book, calculator allowed", "ki-draft"]);
  const editing = renderPanel(demo("draft"), settled, { pending, edit: true });
  absent("draft-edit", editing, [...noInput]);
  check("draft-edit", editing, ["closed book, calculator allowed"]);
}

// Ask: the question, the choices as words, the default named.
{
  const html = renderPanel(demo("ask"), settled);
  check(
    "ask",
    html,
    [
      "Do students get a formula sheet",
      "ki-choices",
      "Yes — the sheet from week 2",
      "No — from memory",
      "default",
      "Answer in the chat.",
    ]
  );
  absent("ask", html, ['type="radio"', ">Send</button>", "Recorded"]);
}

// Intake: progress line, the question, no course line yet, no input.
{
  const html = renderPanel(demo("intake"), settled);
  check(
    "intake",
    html,
    ["Question 1 of 4", "What are you teaching", "Setting up your course", "Answer in the chat."]
  );
  absent("intake", html, ['type="text"', 'name="value"']);
}

// Status: plain lines, the dash mark.
{
  const html = renderPanel(demo("status"), settled);
  check("status", html, ["Your week-3 slides are filed", "ki-status"]);
}

// Deliver: the card, the mark, honest checks, attention with words, the link.
{
  const html = renderPanel(demo("deliver"), settled);
  check(
    "deliver",
    html,
    [
      "ki-artifact",
      "ki-type-code",
      "Confidence intervals",
      "ki-checks",
      "need your eye",
      "Next moves",
      "Open the quiz",
      "/doc/courses%2Fstat-101%2Fquizzes%2Fquiz-04.md",
    ]
  );
}

// Settled strip: the label, the lines, the typed time.
check("settled", renderPanel(demo("draft"), settled), ["Settled", "Quiz length", "13:41"]);
absent("settled-none", renderPanel(demo("draft"), []), ["ki-settled"]);

// Idle: quiet, honest.
{
  const html = renderPanel(null, null);
  check("idle", html, [...always, "Nothing needs your eye right now."]);
  absent("idle", html, ["<form", "<script"]);
}

// Live: the listener rides, and only then.
{
  const html = renderPanel(demo("draft"), settled, { live: true });
  check("live", html, ['<script src="/listen.js" defer></script>']);
}

if (failures.length) {
  console.error(`panel self-test: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("panel self-test: all anchors present");
