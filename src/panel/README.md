# The panel contract

Ki's panel is a local page that shows the educator the one thing Ki
needs from them. The agent writes small JSON files. The server this
folder ships renders them through the design system (`../design/`).
The agent never writes HTML. This file is the whole contract: an
agent reading only this can write valid JSON.

## Running

From the workspace root:

    node panel/server.mjs

The server binds `127.0.0.1` only, on port `4400`. Flags: `--port
<n>`, `--root <path>` (default: the working directory), `--demo
<state>` (serve one demo state from `panel/demo/`, for testing).
Nothing leaves the machine. Nothing installs.

## The files

All three live in the workspace, under `.ki/panel/`. They are Ki's
machinery. The educator never reads them.

| File | Who writes | What it holds |
| --- | --- | --- |
| `ask.json` | Ki, each turn | The current ask, whole. Overwritten, never appended. |
| `settled.json` | Ki, on consuming an answer | A JSON array, one entry per decided ask, newest last, capped at 20. |
| `answer.json` | The server, on a form post | The educator's pending answer. Ki consumes it by rename, then updates `ask.json` and appends to `settled.json`. |

Write files atomically: write a temp file in the same folder, then
rename it over the target. A malformed or missing file always reads
as absent. Never leave a half-written file behind.

## `ask.json`

Common fields, then one payload per turn type.

    {
      "id": "d-8f42",
      "turn": "draft",
      "course": "Introduction to Statistics · STAT 101 · Week 4 · Quiz",
      …payload
    }

- `id` — short, unique per ask, made up by Ki. The answer and the
  settled entry echo it. An answer whose `id` does not match the
  current ask is not an answer to it.
- `turn` — one of `status`, `ask`, `intake`, `draft`, `deliver`.
- `course` — one plain line for the header, or `null` before the
  first run finishes.

### `status` — what Ki is doing, in plain words

    { "lines": ["Reading your week-3 slides…", "Drafting the shape…"] }

One to three lines. Name the material, never the machinery.

### `ask` — one question that changes the work

    {
      "lead": "One thing changes the questions:",
      "question": "Do students get a formula sheet for this quiz?",
      "input": { "kind": "choice", "choices": ["Yes — the sheet from week 2", "No — from memory"], "default": 0 }
    }

`input.kind` is `choice` (with `choices` and a `default` index) or
`text` (with an optional `hint`). Ask only what changes the artifact;
otherwise state the default and proceed.

### `intake` — a first-run question

Same shape as `ask`, plus an optional `"progress": "Question 2 of 4"`.
Use it only during first run, while `course` is still `null`.

### `draft` — the shape, for a yes

    {
      "lead": "Here's the shape I'd write — is it right?",
      "draft": {
        "coverage":  { "value": "…", "note": "from week-3 slides", "settled": true },
        "structure": { "value": "…", "settled": true },
        "quantity":  { "value": "12 questions · 30 points · 25 minutes", "settled": true },
        "sample":    { "value": "…", "flag": "your slides give the arithmetic, not the claim — check this" },
        "open":      { "choices": ["closed book, calculator allowed", "closed book, no calculator"], "default": 0, "note": "say the word to change it" }
      }
    }

The five fields are fixed, in this order, with these names. `note` is
a provenance line in the margin. `settled: true` draws the tick.
`flag` is attention: red, and it always carries its words. `open` is
the one row the educator answers in place.

### `deliver` — what landed

    {
      "lead": "Written to the shape you agreed. Week 4 quiz, ready for Tuesday.",
      "type": "quiz",
      "title": "Confidence intervals",
      "meta": "Introduction to Statistics · STAT 101 · Week 4 · 30 points · 25 minutes",
      "checks": "Checked for structure, points, and a source on every answer.",
      "attention": ["Two things need your eye: the essay bar, and the unverified answer."],
      "next": "harder last question · a 20-minute version · a worksheet from the same slides",
      "path": "courses/stat-101/quizzes/quiz-04.md"
    }

`type` is one of the five (`quiz`, `worksheet`, `handout`,
`assignment`, `case-study`) or any short plain label for everything
else. The five carry their drawn mark. Anything else renders under its
own label, in the same world — see the rules below. `checks` is
honest: name what was checked, never overclaim. `attention` is zero to
two lines. `path` makes the card's link work.

## `settled.json`

    [
      { "id": "d-8f41", "what": "Topic scope — week 4 quiz", "answer": "weeks 3–4", "at": "13:58" }
    ]

`what` names the decided thing, `answer` the educator's word for it,
`at` a local `HH:MM`. The panel shows the last five entries as the
settled strip.

## `answer.json`

Written by the server from the educator's form post. Ki reads it at
the start of its next turn.

    { "id": "d-8f42", "turn": "draft", "answer": "yes", "open": "closed book, calculator allowed", "changes": ["make the last question harder"], "posted": "2026-10-19T14:02:11Z" }

For `ask` and `intake` turns the field is `value` instead:
`{ "id", "turn", "value": "Yes — the sheet from week 2", "posted" }`.

## The block protocol

1. Ki writes `ask.json`. The block is open.
2. The educator answers in the panel. The server writes
   `answer.json` (a later post overwrites it — a change of mind
   costs one click). The panel shows the recorded line.
3. On its next turn, Ki renames `answer.json` away (consume), then
   updates `ask.json` and appends the settled entry.

Precedence, while a block is open: the panel answer governs. If a
chat message arrives later and answers differently, the chat word is
newer and wins — and Ki says which one it took, in one plain line.
The panel is the input channel for an open block. Chat stays the
channel for everything else.

## The rules

- **Never write HTML.** The renderer owns the markup. These JSON
  fields are the whole surface.
- **Plain words on the surface.** No file paths in `lead`,
  `question`, `lines`, or `attention`. No tool names, no jargon.
  `path` and `id` are machinery and render only as links and hidden
  fields.
- **The skeleton stays English.** Labels, the five field names, the
  type labels. The content follows the course language.
- **Red only with words.** `flag` and `attention` always render with
  their words beside the mark. Never spend red on anything else.
- **Everything Ki shows follows the world.** A lite data analysis, a
  custom app, a one-off page — whatever Ki hands the educator outside
  the five artifact types defaults to the same design system: the
  tokens, the voices, the ink protocol. The five drawn type marks
  stay with the five types; anything else renders under its own
  plain label.
- **One ask at a time.** Overwrite `ask.json`. A new ask supersedes
  the old one; the settled strip is the memory, not the file.

The panel page works with scripting disabled: every control is a
form control and a reload refreshes. The only script the server adds
is the live-update listener.
