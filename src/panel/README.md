# The panel contract

Ki's panel is a local page that shows the educator the one thing Ki
needs from them. It is one-way communication: Ki writes the small JSON
files, the server this folder ships renders them through the design
system (`../design/`), and the educator answers in the harness chat —
the panel takes no input. The agent never writes HTML. This file is
the whole contract: an agent reading only this can write valid JSON.

## Running

In the educator's workspace (the installed layout):

    node panel/server.mjs

In this repository (the dev layout), the same file sits one level
deeper — `node src/panel/server.mjs`, or `pnpm panel`. The script
entry `pnpm check` runs the renderer self-test and the server's
end-to-end check.

The server binds `127.0.0.1` only, on port `4400`. Flags: `--port
<n>` (`0` picks a free port and the startup line names it), `--root
<path>` (default: the working directory), `--demo <state>` (serve
one demo state from `panel/demo/`; without an explicit `--root` it
uses a throwaway folder that is removed when the server exits, never
a real workspace). Nothing leaves the machine, and the server refuses
requests that do not name it: the Host header must be this machine.
The panel takes no input: every post is refused, whatever its origin.

## The files

Two live in the workspace, under `.ki/panel/`. They are Ki's
machinery. The educator never reads them.

| File | Who writes | What it holds |
| --- | --- | --- |
| `ask.json` | Ki, each turn | The current ask, whole. Overwritten, never appended. |
| `settled.json` | Ki, when a question settles in chat | A JSON array, one entry per decided ask, newest last, capped at 20. |

Write files atomically: write a temp file in the same folder, then
rename it over the target. A malformed or missing file always reads
as absent. Never leave a half-written file behind.

## `ask.json`

Common fields, then one payload per turn type.

    {
      "id": "d-8f42",
      "turn": "ask",
      "course": "Introduction to Statistics · STAT 101 · Week 4 · Quiz",
      …payload
    }

- `id` — short, unique per ask, made up by Ki.
- `turn` — one of `status`, `ask`, `intake`. Two further types,
  `draft` and `deliver`, are accepted and render read-only; they
  belong to the switched-off creation machinery below, and Ki does
  not write them.
- `course` — one plain line for the header, or `null` before the
  first run finishes.

### `status` — what Ki is doing, in plain words

    { "lines": ["Reading your week-3 slides…", "Filing your syllabus…"] }

One to three lines. Name the material, never the machinery.

### `ask` — one question that changes the work

    {
      "lead": "One thing changes the questions:",
      "question": "Do students get a formula sheet for this quiz?",
      "input": { "kind": "choice", "choices": ["Yes — the sheet from week 2", "No — from memory"], "default": 0 }
    }

`input.kind` is `choice` (with `choices` and a `default` index) or
`text` (with an optional `hint`). The choices render as words, the
default marked. The panel takes no input: the educator answers in the
harness chat, and the chat message carries the ask's substance
whatever the panel does. Ask only what changes the work; otherwise
state the default and proceed.

### `intake` — a first-run question

Same shape as `ask`, plus an optional `"progress": "Question 2 of 4"`.
Use it only during first run, while `course` is still `null`.

### Switched off: `draft` and `deliver`

Creation (§Creating an artifact in the constitution) is switched off
in this version, and with it the two turns that carried it: the
`draft` shape ask and the `deliver` delivery card. Their shapes stay
here and in the renderer, kept for the version that carries creation
again. The validator still accepts both, and a stale `ask.json` that
carries one renders read-only, with no way to answer from the panel.

    {
      "lead": "Here's the shape I'd write — is it right?",
      "draft": {
        "coverage":  { "value": "…", "note": "from week-3 slides", "settled": true },
        "structure": { "value": "…", "settled": true },
        "quantity":  { "measure": "12 questions · 30 points · 25 minutes", "value": "Eight distractors name a real misconception.", "settled": true },
        "sample":    { "value": "…", "flag": "your slides give the arithmetic, not the claim — check this" },
        "open":      { "choices": ["closed book, calculator allowed", "closed book, no calculator"], "default": 0, "note": "say the word to change it" }
      }
    }

The five fields are fixed, in this order, with these names. `note` is
a provenance line in the margin. `settled: true` draws the tick.
`flag` is attention: red, and it always carries its words. `open`
names the one dial the educator used to answer in place. `quantity`
splits its measurement from its prose: `measure` is the counts line
("12 questions · 30 points · 25 minutes") and renders in the typed
voice, `value` is the prose beside it.

    {
      "lead": "Written to the shape you agreed. Week 4 quiz, ready for Tuesday.",
      "type": "quiz",
      "title": "Confidence intervals",
      "meta": "Introduction to Statistics · STAT 101 · Week 4",
      "measure": "30 points · 25 minutes",
      "checks": "Checked for structure, points, and a source on every answer.",
      "attention": ["Two things need your eye: the essay bar, and the unverified answer."],
      "next": "harder last question · a 20-minute version · a worksheet from the same slides",
      "path": "courses/stat-101/quizzes/quiz-04.md"
    }

`type` is one of the five (`quiz`, `worksheet`, `handout`,
`assignment`, `case-study`) or any short plain label for everything
else. The five carry their drawn mark. `checks` is honest: name what
was checked, never overclaim. `attention` is zero to two lines.
`path` makes the card's link work.

### Required fields

The server checks every ask against these before rendering. A rejected
ask is named in the server output and served as idle.

| Turn | Required |
| --- | --- |
| `status` | `lines`: an array of non-empty lines |
| `ask`, `intake` | `question`; `input` with `kind` `choice` or `text`; a `choice` carries a non-empty `choices` array; a `default` index, when present, must name one of them |
| `draft` | `lead`; all five fields present; `coverage`, `structure`, `sample` carry a `value`; `quantity` carries a `value` or a `measure`; `open` carries a non-empty `choices` array and an in-range `default` |
| `deliver` | `title`; `attention` and `measure` are arrays and lines respectively when present |

`course` is present in every ask — a plain line or `null`. `id` is
always required. `measure` is always a line of text, never a bare
number.

## `settled.json`

    [
      { "id": "d-8f41", "what": "Topic scope — week 4 quiz", "answer": "weeks 3–4", "at": "13:58" }
    ]

`what` names the decided thing, `answer` the educator's word for it,
`at` a local `HH:MM`. The educator answers in the harness chat; when a
question settles, Ki appends the line. The panel shows the last five
entries as the settled strip.

## The educator answers in the harness

The panel is read-only for the educator: no form renders, and every
post to the answer route is refused before anything is read or
written. The chat is the answer channel. The constitution's rule is
that Ki says the ask's substance in chat, and the educator's word
arrives there, like every word they type. There is no precedence to
arbitrate: the chat word is the word.

## The rules

- **Never write HTML.** The renderer owns the markup. These JSON
  fields are the whole surface.
- **Plain words on the surface.** No file paths in `lead`,
  `question`, `lines`, or `attention`. No tool names, no jargon.
  `path` is machinery and renders only as a link. `id` does not
  render.
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
- **Malformed asks are named, not rendered.** The server checks every
  `ask.json` against the shapes above. A rejected ask logs its reason
  to the server output (where the agent reads it) and serves the idle
  page. An unknown or missing turn is deferred debt, same as error and
  blocked states: the surface never invents a state Ki did not write.

The renderer owns the markup, and its serving layer adds the settled
strip and the word-rendered choices — carried by `panel/serve.css` on
the system's own tokens. The files under `../design/` are not touched.

The panel page works with scripting disabled: a reload refreshes. The
only script the server adds is the live-update listener.
