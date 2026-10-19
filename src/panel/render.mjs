// The panel renderer: JSON in, HTML string out. Pure — no file reads,
// no server. The markup is the design system's panel vocabulary from
// ../design/README.md, extended by the serving layer's additions in
// ./serve.css (the settled strip, the word-rendered choices). The panel
// takes no input: no turn renders a form, an input, or a button — the
// educator answers in the harness chat. The form-and-answer code below
// stays in the file, switched off, and nothing calls it. The contract
// lives in ./README.md.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ESC[c]);

const TICK =
  '<svg class="ki-tick" width="12" height="12" viewBox="0 0 12 12" role="img"><title>Settled</title><path d="M1.5 6.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ATTN_MARK =
  '<svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M5 1v12M2 14h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const DASH =
  '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 6h10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';

const MARKS = {
  quiz:
    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 3h10M2 7h10M2 11h6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  worksheet:
    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 2.5h9v9h-9z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5 7.4l1.6 1.6L9.4 5.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  handout:
    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2h6l3 3v7H3z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 2v3h3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  assignment:
    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4.5 3H2v8h2.5M9 3h3M9 7h3M9 11h2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  "case-study":
    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4.5 3.5L2.5 7l2 3.5M9.5 3.5l2 3.5-2 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const TYPE_LABELS = {
  quiz: "Quiz",
  worksheet: "Worksheet",
  handout: "Handout",
  assignment: "Assignment",
  "case-study": "Case study",
};

// The five shape fields, fixed in name and order.
const DRAFT_FIELDS = [
  ["coverage", "Coverage"],
  ["structure", "Structure"],
  ["quantity", "Quantity and mix"],
  ["sample", "One sample"],
  ["open", "Open choices"],
];

const TURNS = new Set(["status", "ask", "intake", "draft", "deliver"]);

// The validation seam: a malformed ask is named, never rendered as calm
// emptiness. The server logs the error and serves the idle page. The
// requiredness here and the README's per-turn "Required" lines are one
// contract: change them together.
export function validateAsk(ask) {
  if (ask == null || typeof ask !== "object") return "ask is not an object";
  if (typeof ask.id !== "string" || !ask.id) return "id missing";
  if (typeof ask.course !== "string" && ask.course !== null) return "course must be a line or null";
  if (!TURNS.has(ask.turn)) return `unknown turn "${esc(String(ask.turn))}"`;
  if (ask.turn === "status") {
    if (!Array.isArray(ask.lines) || !ask.lines.length || !ask.lines.every((l) => typeof l === "string" && l.trim()))
      return "status needs an array of non-empty lines";
  }
  if (ask.turn === "ask" || ask.turn === "intake") {
    if (typeof ask.question !== "string" || !ask.question.trim()) return "question missing";
    const input = ask.input;
    if (input == null || typeof input !== "object") return "input missing";
    if (input.kind === "choice") {
      if (!Array.isArray(input.choices) || !input.choices.length || !input.choices.every((c) => typeof c === "string" && c.trim()))
        return "choice input needs an array of non-empty choices";
      if (
        input.default != null &&
        (!Number.isInteger(input.default) || input.default < 0 || input.default >= input.choices.length)
      )
        return "choice default index is out of range";
    } else if (input.kind !== "text") {
      return `input kind "${esc(String(input.kind))}" is not choice or text`;
    }
  }
  if (ask.turn === "draft") {
    if (typeof ask.lead !== "string" || !ask.lead.trim()) return "draft lead missing";
    const d = ask.draft;
    if (d == null || typeof d !== "object") return "draft object missing";
    for (const [key] of DRAFT_FIELDS) {
      if (d[key] == null || typeof d[key] !== "object") return `draft field "${key}" missing`;
    }
    for (const key of ["coverage", "structure", "sample"]) {
      if (typeof d[key].value !== "string" || !d[key].value.trim())
        return `draft field "${key}" needs a value`;
    }
    const isLine = (v) => typeof v === "string" && v.trim();
    if (!isLine(d.quantity.value) && !isLine(d.quantity.measure))
      return 'draft field "quantity" needs a value or a measure';
    if (!Array.isArray(d.open.choices) || !d.open.choices.length || !d.open.choices.every((c) => typeof c === "string" && c.trim()))
      return "draft open choices missing";
    if (
      d.open.default != null &&
      (!Number.isInteger(d.open.default) || d.open.default < 0 || d.open.default >= d.open.choices.length)
    )
      return "draft open default index is out of range";
  }
  if (ask.turn === "deliver") {
    if (typeof ask.title !== "string" || !ask.title.trim()) return "title missing";
    if (ask.attention != null && !Array.isArray(ask.attention)) return "attention must be an array";
    if (ask.measure != null && (typeof ask.measure !== "string" || !ask.measure.trim()))
      return "measure must be a line";
  }
  return null;
}

const attn = (words) => `<p class="ki-attn">${ATTN_MARK}<span>${esc(words)}</span></p>`;
const statusLine = (text) => `<p class="ki-status">${DASH}${esc(text)}</p>`;
const hidden = (name, value) => `<input type="hidden" name="${name}" value="${esc(value)}">`;

function margin(row, editable) {
  const parts = [];
  if (row.settled) parts.push(TICK);
  if (row.note) parts.push(`<p class="ki-note">${esc(row.note)}</p>`);
  if (row.flag) parts.push(attn(row.flag));
  if (!parts.length) return "";
  return `<div class="ki-row__margin">${parts.join("")}</div>`;
}

function draftRow(key, label, row, editable, pendingOpen) {
  const body = [];
  if (key === "sample") {
    body.push(`<p class="ki-label">${label} <span class="ki-rough">rough</span></p>`);
    body.push(`<p class="ki-value">${esc(row.value)}</p>`);
  } else if (key === "open") {
    body.push(`<p class="ki-label" id="ki-open-label">${label}</p>`);
    const choices = row.choices ?? [];
    const def = choices.indexOf(pendingOpen) >= 0 ? choices.indexOf(pendingOpen) : row.default ?? 0;
    if (editable) {
      const options = choices
        .map((c, i) => `<option${i === def ? " selected" : ""}>${esc(c)}</option>`)
        .join("");
      body.push(
        `<div class="ki-choice"><select class="ki-select" name="open" aria-labelledby="ki-open-label">${options}</select>${def === (row.default ?? 0) && !pendingOpen ? '<span class="ki-default">default</span>' : ""}</div>`
      );
    } else {
      body.push(`<p class="ki-value">${esc(choices[def] ?? "")}</p>`);
    }
  } else if (key === "quantity") {
    body.push(`<p class="ki-label">${label}</p>`);
    const measure = row.measure ? `<span class="ki-num">${esc(row.measure)}</span>` : "";
    const prose = row.value ? ` ${esc(row.value)}` : "";
    body.push(`<p class="ki-value">${measure}${prose}</p>`);
  } else {
    body.push(`<p class="ki-label">${label}</p>`);
    body.push(`<p class="ki-value">${esc(row.value)}</p>`);
  }
  return `<div class="ki-row"><div class="ki-row__body">${body.join("")}</div>${margin(row, editable)}</div>`;
}

function draftTurn(ask, pending, editable) {
  const d = ask.draft ?? {};
  const rows = DRAFT_FIELDS.map(([key, label]) =>
    draftRow(key, label, d[key] ?? {}, editable, pending?.open ?? null)
  ).join("");
  const changes = editable
    ? `<div class="ki-changes"><p class="ki-label" id="ki-changes-label">What should change?</p><textarea class="ki-line" name="changes" rows="2" aria-labelledby="ki-changes-label" placeholder="Optional — one change per line">${esc(pending?.changes?.join("\n") ?? "")}</textarea></div>`
    : "";
  const actions = editable
    ? `<div class="ki-actions"><button class="ki-btn" type="submit" name="answer" value="yes">Yes, write it</button><button class="ki-btn ki-btn--quiet" type="submit" name="answer" value="adjust">Adjust</button></div>`
    : "";
  const inner = `<section class="ki-draft ki-arrive" aria-label="Shape draft">${rows}</section>${changes}${actions}`;
  const body = editable
    ? `<form action="/answer" method="post">${hidden("id", ask.id)}${hidden("turn", ask.turn)}${inner}</form>`
    : inner;
  let recorded = "";
  if (pending) {
    const bits = [pending.answer === "yes" ? "Yes, write it" : "Adjust"];
    if (pending.open) bits.push(esc(pending.open));
    if (pending.changes?.length) bits.push(pending.changes.map(esc).join("; "));
    recorded = `<p class="ki-said">Recorded — ${bits.join(" · ")}.</p><a class="ki-btn ki-btn--quiet" href="/?edit">Change the answer</a>`;
  }
  return `<p class="ki-who">Ki</p><p class="ki-said">${esc(ask.lead)}</p>${body}${recorded}`;
}

function askControl(input, pending) {
  if (input.kind === "choice") {
    const choices = input.choices ?? [];
    let def = input.default ?? 0;
    if (pending?.value) {
      const i = choices.indexOf(pending.value);
      if (i >= 0) def = i;
    }
    return choices
      .map((c, i) =>
        `<label class="ki-choice ki-choice--pick"><input type="radio" name="value" value="${esc(c)}"${i === def ? " checked" : ""}><span>${esc(c)}</span>${i === (input.default ?? 0) && !pending?.value ? '<span class="ki-default">default</span>' : ""}</label>`
      )
      .join("");
  }
  return `<input class="ki-line" type="text" name="value" required placeholder="${esc(input.hint ?? "")}" value="${esc(pending?.value ?? "")}">`;
}

function askTurn(ask) {
  const parts = [`<p class="ki-who">Ki</p>`];
  if (ask.lead) parts.push(`<p class="ki-said">${esc(ask.lead)}</p>`);
  if (ask.progress) parts.push(statusLine(ask.progress));
  parts.push(`<p class="ki-said">${esc(ask.question)}</p>`);
  // The panel takes no input: the choices render as words and the
  // educator answers in the harness chat. askControl's controls above
  // stay defined, switched off.
  const input = ask.input ?? {};
  if (input.kind === "choice") {
    const def = input.default ?? 0;
    parts.push(
      `<ul class="ki-choices">${(input.choices ?? [])
        .map((c, i) => `<li>${esc(c)}${i === def ? ' <span class="ki-default">default</span>' : ""}</li>`)
        .join("")}</ul>`
    );
  } else if (input.hint) {
    parts.push(`<p class="ki-note">${esc(input.hint)}</p>`);
  }
  parts.push(`<p class="ki-note">Answer in the chat.</p>`);
  return parts.join("");
}

function statusTurn(ask) {
  return (ask.lines ?? []).map(statusLine).join("");
}

function deliverTurn(ask) {
  const t = ask.type ?? "";
  const code = MARKS[t] ? `${MARKS[t]} ${TYPE_LABELS[t]}` : esc(t);
  const parts = [`<p class="ki-who">Ki</p>`];
  if (ask.lead) parts.push(`<p class="ki-said">${esc(ask.lead)}</p>`);
  const head = [`<p class="ki-type-code">${code}</p>`];
  head.push(`<h2 class="ki-artifact__title">${esc(ask.title ?? "")}</h2>`);
  if (ask.meta || ask.measure) {
    const measure = ask.measure ? ` · <span class="ki-num">${esc(ask.measure)}</span>` : "";
    head.push(`<p class="ki-artifact__meta">${esc(ask.meta ?? "")}${measure}</p>`);
  }
  const body = [];
  if (ask.checks) body.push(`<p class="ki-checks">${esc(ask.checks)}</p>`);
  for (const a of ask.attention ?? []) body.push(attn(a));
  if (ask.next)
    body.push(`<p class="ki-next">Next moves: <span>${esc(ask.next)}</span></p>`);
  if (ask.path) {
    const label = TYPE_LABELS[t] ?? "work";
    body.push(`<p><a href="/doc/${encodeURIComponent(ask.path)}">Open the ${esc(label.toLowerCase())}</a></p>`);
  }
  parts.push(
    `<article class="ki-artifact ki-arrive"><header class="ki-artifact__head">${head.join("")}</header><div class="ki-artifact__body">${body.join("")}</div></article>`
  );
  return parts.join("");
}

function settledStrip(settled) {
  const entries = (settled ?? []).slice(-5);
  if (!entries.length) return "";
  const lines = entries
    .map(
      (e) =>
        `<li class="ki-settled__line"><span>${esc(e.what)} — ${esc(e.answer)}</span><span class="ki-num">${esc(e.at ?? "")}</span></li>`
    )
    .join("");
  return `<section class="ki-settled" aria-label="Settled this session"><p class="ki-label">Settled</p><ul class="ki-settled__list">${lines}</ul></section>`;
}

/**
 * Render the panel page.
 * @param {object|null} ask     the parsed ask.json, or null when absent
 * @param {Array|null}  settled the parsed settled.json
 * @param {object}      options { live = false, designPrefix = "/design", edit = false, pending = null }
 *   live          inject the live-update listener (the page works without it)
 *   designPrefix  where the design assets are served from
 *   edit          ignored — the input switch keeps it for API shape
 *   pending       ignored — the input switch keeps it for API shape
 */
export function renderPanel(ask, settled, options = {}) {
  const { live = false, designPrefix = "/design", edit = false, pending = null } = options;
  const dp = designPrefix;

  const course = ask?.course ?? null;
  const when = course ?? (ask?.turn === "intake" ? "Setting up your course" : "");
  const whenLine = when ? `<p class="ki-context__when">${esc(when)}</p>` : "";
  const header = `<header class="ki-context"><p class="ki-context__where">Ki</p>${whenLine}</header>`;

  let threadInner;
  if (!ask) {
    threadInner = `<li class="ki-turn">${statusLine("Nothing needs your eye right now.")}<p class="ki-said">Ask for something, and it will show up here.</p></li>`;
  } else {
    // The input switch: the panel takes no answers, so every turn renders
    // read-only. The edit and pending options stay accepted, ignored.
    const editable = false;
    switch (ask.turn) {
      case "draft":
        threadInner = `<li class="ki-turn">${draftTurn(ask, null, editable)}</li>`;
        break;
      case "ask":
      case "intake":
        threadInner = `<li class="ki-turn">${askTurn(ask)}</li>`;
        break;
      case "status":
        threadInner = `<li class="ki-turn">${statusTurn(ask)}</li>`;
        break;
      case "deliver":
        threadInner = `<li class="ki-turn">${deliverTurn(ask)}</li>`;
        break;
      default:
        threadInner = `<li class="ki-turn">${statusLine("Nothing needs your eye right now.")}</li>`;
    }
  }

  const listener = live ? '<script src="/listen.js" defer></script>' : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ki</title>
<link rel="stylesheet" href="${esc(dp)}/fonts/fonts.css">
<link rel="stylesheet" href="${esc(dp)}/tokens.css">
<link rel="stylesheet" href="${esc(dp)}/ki.css">
<link rel="stylesheet" href="/panel.css">
</head>
<body class="ki-panel-page">
<main class="ki-panel">
<h1 class="ki-visually-hidden">Ki — the teaching workspace</h1>
${header}
${settledStrip(settled)}
<ol class="ki-thread">
${threadInner}
</ol>
</main>
${listener}
</body>
</html>
`;
}
