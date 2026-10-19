# Ki design system

One visual world, two surfaces. The world is an exercise book and the
teacher's red margin: paper, ink, ruled lines, and a margin that carries the
review beside the line it belongs to. Everything Ki shows the educator
follows this world by default — inside the five artifact types and outside
them.

- **The panel** — Ki's conversation frame: narrow, conversation-first,
  screen-first.
- **The documents** — the artifacts Ki makes. Restrained in the same world,
  exported to PDF or slides, and the educator's to restyle.

Open `preview.html` to see every page and the whole system at once.

## Files

| File | Holds |
| --- | --- |
| `tokens.css` | Colour roles, the three type voices, space, geometry, one motion token |
| `ki.css` | Base, browser surfaces, the panel and its components, the spec sheet |
| `documents.css` | The document layer and the print rules |
| `fonts/` | Embedded Open Font License faces, their `fonts.css` and licences |
| `pages/` | The panel and one demonstration page per artifact type |
| `preview.html` | The gallery: palette, voices, marks, pages, states |

Load order: `fonts/fonts.css`, `tokens.css`, `ki.css`, then `documents.css`
on a document page.

## The rules

- **Ink is Ki's voice; red is the educator's.** `--ki-red` is spent only on
  attention — a flag that needs the educator's eye — never on decoration,
  headings, or states of the interface. Every red mark carries words beside
  it, because colour never carries meaning alone.
- **Never set text in `--ki-ink-3` or `--ki-red-2`.** They are marks and
  rules. Body text is `--ki-ink` (11.5:1); labels and secondary text are
  `--ki-ink-2` (5.2:1).
- **The skeleton stays English.** Headings, the `Q1.` and `1.` anchors, the
  key labels `Q1 —`, and the header block are structure that
  `scripts/check.py` reads. Render them exactly; the content around them
  follows the course language.
- **No network, no build step. The documents carry no script.** The system
  is plain CSS and static HTML, self-contained in the folder. Do not add a
  hosted font, a CDN, or a build dependency. The panel surface may carry
  scripts and libraries that structure the work — the served panel page
  adds one live-update listener, and the page works without it; a document
  page never carries a script.
- **The world is the default.** Whatever Ki hands the educator outside the
  five artifact types — a lite data analysis, a custom app, a one-off page —
  defaults to these tokens, voices, and marks. The five drawn type marks
  stay with the five types; anything else renders under its own plain
  label.
- **Chrome is deleted where type can carry it.** No bubbles around messages,
  no card standing in for a label, no accent stripes. A rule or a margin
  note does the work.
- **The margin is the signature.** In the panel it carries ticks,
  provenance notes and the red mark, beside the row each belongs to. In a
  document it carries the question numbers. Do not turn it into a sidebar
  or a second column of content.
- **One authored moment.** A mark lands in two steps (`.ki-arrive`,
  `--ki-step`). Do not add entrances, easing curves, or hover effects to
  sections.

## Tokens

Colour: `--ki-paper`, `--ki-paper-2`, `--ki-paper-3`, `--ki-ink`,
`--ki-ink-2`, `--ki-ink-3`, `--ki-red`, `--ki-red-2`, `--ki-rule`,
`--ki-rule-2`, `--ki-rule-blue`.

Voices: `--ki-voice` (Source Serif 4, Ki's message and document body),
`--ki-ui` (Public Sans, labels, controls, metadata), `--ki-typed`
(Courier Prime, margin notes and measurements only).

Sizes: `--ki-text-xs` through `--ki-text-display`; leading
`--ki-leading-tight|voice|doc`; tracking `--ki-track-label`.

Space: `--ki-s1` to `--ki-s8`, one scale for both surfaces.

Geometry: `--ki-panel-w` 440px, `--ki-panel-w-max` 560px,
`--ki-margin-w`, `--ki-measure` 68ch, `--ki-doc-w` 46rem.

Motion: `--ki-step`, `--ki-step-ease`.

Measurements use `.ki-num` (typing voice, tabular figures) — points, minutes,
counts, page numbers. Do not set prose in it.

## The panel

```html
<main class="ki-panel">
  <header class="ki-context">
    <p class="ki-context__where">Ki</p>
    <p class="ki-context__when">Introduction to Statistics · <span class="ki-num">Week 4 · Quiz</span></p>
  </header>
  <ol class="ki-thread">
    <li class="ki-turn"> … one turn … </li>
  </ol>
</main>
```

A turn is `<p class="ki-who">` (Ki or You), then `<p class="ki-said">`.

The shape draft is a ruled form whose margin carries the review:

```html
<section class="ki-draft" aria-label="Shape draft">
  <div class="ki-row">
    <div class="ki-row__body">
      <p class="ki-label">Coverage</p>
      <p class="ki-value">…</p>
    </div>
    <div class="ki-row__margin">
      <svg class="ki-tick" …><title>Settled</title>…</svg>
      <p class="ki-note">from your week-3 slides</p>
    </div>
  </div>
</section>
```

The five draft fields keep their order and their names: Coverage, Structure,
Quantity and mix, One sample (marked `.ki-rough`), Open choices.

- An open choice is a standard control — `<select class="ki-select">` or a
  radio pair — with its stated default named in `.ki-default`.
- The decision is `.ki-actions` with `.ki-btn` (Yes, write it) and
  `.ki-btn--quiet` (Adjust).
- Attention is `.ki-attn`: the drawn mark plus the words, inside the margin.
- The delivery is `.ki-artifact`: `.ki-type-code` with the type's drawn
  mark, `.ki-artifact__title`, `.ki-artifact__meta`, the honest
  `.ki-checks` line, the `.ki-attn` line for what needs the educator, and
  `.ki-next`.
- Quiet workspace facts are `.ki-status` lines in the thread.

## The documents

```html
<article class="ki-doc">
  <header class="ki-doc__head">
    <p class="ki-type-code">…mark… Quiz</p>
    <h1 class="ki-doc__title">…</h1>
    <p class="ki-doc__meta">Course · code · week · outcomes · <span class="ki-num">…</span></p>
    <p class="ki-doc__lede">…</p>
  </header>
  <section class="ki-sec">
    <h2 class="ki-sec__title">Questions</h2>
    <div class="ki-q">
      <p class="ki-q__num">Q1</p>
      <div class="ki-q__body"> … </div>
    </div>
  </section>
  <footer class="ki-doc__foot">Built from …</footer>
</article>
```

- A question hangs its number in the margin: `Q1` for a quiz, `1` for an
  exercise. Points sit in `.ki-q__points`: `[2 points]`.
- Options are `.ki-opts` / `.ki-opt` with the letter in `.ki-opt__key`.
- Answer space is `.ki-answer--line` (one line) or `.ki-answer--lines`
  (ruled, three lines). These are the page's writing area — keep them empty.
- The answer key is `.ki-key` with `.ki-key__a` for the answer, `.ki-src`
  for the source line, and `.ki-rationale`.
- An unverified answer carries `.ki-attn` with the words
  `unverified — check this one`. Never soften it into prose.
- Instructor-only sections are `.ki-note-block` with the typed label
  `Instructor notes — not for distribution`.
- The footer names the material the document was built from, in plain
  words: "Built from the week-3 slides you shared."

The type code and its drawn mark come from `preview.html`: quiz (lines),
worksheet (box with tick), handout (page), assignment (steps), case study
(brackets). Use the same mark wherever the type appears, and never a unicode
glyph or an emoji as a mark.

## Print

`documents.css` carries the print layer: a white ground, 16mm page margin,
no shadows, questions and rubric rows kept whole, and the panel and spec
pages hidden. Check any new document in print emulation before delivery. A
narrow window stacks the panel's margin under its row; documents are
designed to hold at 320px and to print.

## Deferred

- A dark theme. The tokens are the place it lands.
- Rendering the documents from the Markdown templates automatically: today
  the templates remain the source of truth, and these pages are the design
  they will be rendered into.
- Any motion beyond the one mark-landing moment.

## Faces

Source Serif 4, Public Sans, and Courier Prime, all under the SIL Open Font
License; the licences sit beside the files in `fonts/`. Latin and Latin-ext
subsets are embedded; other scripts fall back to the reader's system fonts.
