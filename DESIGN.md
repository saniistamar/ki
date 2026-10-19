---
name: Ki
description: The exercise book and the teacher's red margin — paper, ink, and a margin that carries the review.
colors:
  paper: "#f1f2ef"
  paper-2: "#e8eae4"
  paper-3: "#dcded7"
  ink: "#20324f"
  ink-deep: "#17273e"
  ink-2: "#55657e"
  ink-3: "#9aa09b"
  red: "#b8372e"
  red-2: "#dfb3ae"
  rule: "#cfd3d5"
  rule-2: "#b2b8bf"
  rule-blue: "#c3cdd8"
  paper-print: "#ffffff"
  select-tint: "#cfd7e4"
typography:
  voice:
    fontFamily: '"Source Serif 4", Georgia, "Iowan Old Style", "Times New Roman", serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  ui:
    fontFamily: '"Public Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.09em"
  typed:
    fontFamily: '"Courier Prime", ui-monospace, "SFMono-Regular", Menlo, monospace'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  control: "2px"
  none: "0"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.15rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.15rem"
  select:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0.55rem 2rem 0.55rem 0.75rem"
  attention-line:
    textColor: "{colors.red}"
    typography: "{typography.typed}"
  artifact-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  document-question-row:
    textColor: "{colors.ink}"
    typography: "{typography.voice}"
    width: "66ch"
  rubric:
    textColor: "{colors.ink}"
    typography: "{typography.voice}"
    padding: "0.75rem 0.75rem 0.75rem 0"
---

# Design System: Ki

## Overview

**Creative North Star: "The marked-up page"**

Ki's screens are pages from an exercise book. The ground is cool paper, not
cream; the work is set in ink; and the margin — a faint blue rule with the
review written beside the line it belongs to — is the signature move. In the
panel, Ki's ink is the work and the educator's red is the marking; in the
documents, the question numbers hang in the same margin. The world is quiet
and document-dense: restraint is the brand posture, and the educator's work
is the color. Nothing is decorative; every line on the page is either a rule
the page owns or a mark someone made on it.

The system refuses the chat category's chrome and the corporate dashboard —
both named by the owner as wrong. No bubbles around messages, no avatar, no
card-with-accent-border, no wallpaper gradient. Chrome is deleted wherever
type can carry the state: a rule, a margin note, or a label does the work.
It must not read as childish or hand-drawn, and it must not read as SaaS
furniture.

Two surfaces share the one world. The **panel** is narrow and
conversation-first, designed at 440px, read beside an editor. The **artifact
documents** — quizzes, worksheets, handouts, assignments, case studies — are
restrained in the same world, printable, and the educator's to restyle. The
system is plain CSS and static HTML: no JavaScript, no network, no build
step; the faces are embedded locally. Light only — a dark theme is deferred,
and the tokens are where it will land.

**Key Characteristics:**

- One paper ground (#f1f2ef), ink as the only voice color, red reserved for attention.
- Three type voices with strict jobs: serif message, grotesk chrome, typewriter margin.
- The margin: the review sits beside the line it belongs to; question numbers hang in it.
- Chrome deleted where type carries the state.
- Near-square geometry (2px on controls), hairline rules as the form language.
- Depth only where a sheet rests on a ground, or a decision stays pinned.
- One authored motion: a mark lands in two steps. Nothing else moves.
- Colour never carries meaning alone; every red mark carries words.

## Colors

A schoolroom palette kept to two inks on cool paper: almost everything is
rules and marks, and only the words are ink. Light-only today; a dark theme
is deferred and these tokens are where it lands.

### Primary — Ink

- **Deep Ink** (#20324f): Ki's voice. All reading text on both surfaces —
  messages, values, document body, headings, links. 11.5:1 on paper.
- **Ink, Pressed** (#17273e): the same ink a shade darker; the primary
  button's hover ground. Never a text color.
- **Secondary Ink** (#55657e): the quiet voice. Labels, metadata, margin
  notes' words, typed status lines, question numbers, rubric headers. 5.2:1
  on paper.

### Secondary — The Educator's Red

- **Attention Red** (#b8372e): the educator's color, spent only on
  attention — a flag that needs their eye. Always accompanied by words
  beside the mark. 5.2:1 on paper.
- **Soft Red** (#dfb3ae): the mark's soft stroke. A mark, never text.

### Neutral — Paper

- **Cool Paper** (#f1f2ef): the ground of both surfaces. Cool rather than cream.
- **Paper Wash** (#e8eae4): a block the page sets down — instructor-only
  note blocks; the quiet button's hover fill.
- **Sheet Edge** (#dcded7): the deeper ground the panel sheet sits on when
  the page frames it beside an editor.
- **Print Ground** (#ffffff): the ground in print; an ink-light sheet.
- **Selection Tint** (#cfd7e4): the text-selection wash, a browser surface
  rather than a message colour.

### Rules and Marks

- **Hairline Rule** (#cfd3d5): row dividers, answer lines, the quiet
  underline beneath emphasis.
- **Dividing Rule** (#b2b8bf): a rule that divides space — the draft's
  top and bottom edges, the sheet's border, the select's border, the
  context line.
- **Margin Rule** (#c3cdd8): the margin column's vertical line, faintly
  blue like an exercise book.
- **Mark Grey** (#9aa09b): ticks at rest, scrollbars, rules. Marks only.

### Named Rules

**The Red-Reserved Rule.** Red is the educator's, not Ki's. It is spent only
on attention — a flag that needs the educator's eye — never on decoration,
headings, or states of the interface. Every red mark carries its words
beside it, because colour never carries meaning alone.

**The Marks-Are-Not-Ink Rule.** Body text is ink (11.5:1); labels and
secondary text are secondary ink (5.2:1). Mark grey and soft red are marks
and rules, never reading text — the only grey label in the system is a
disabled control's.

## Typography

**Voice (message and document body):** Source Serif 4, with Georgia, Iowan
Old Style, Times New Roman fallbacks
**Chrome (labels, controls, metadata):** Public Sans, with system-ui, Segoe UI, Roboto fallbacks
**Typed (margin notes and measurements):** Courier Prime, with ui-monospace, Menlo fallbacks

**Character:** a workaday schoolbook trio — the serif speaks in sentences,
the grotesk points at things, the typewriter makes the margin's notes. All
three faces are embedded locally as WOFF2 under the SIL Open Font License;
scripts beyond Latin fall back to the reader's system fonts.

### Hierarchy

- **Voice body** (400, 17px, 1.5 in the panel; 1.62 in documents, measure
  capped at 68ch): Ki's messages, draft values (44ch), document body.
- **Voice titles** (600): document titles 28px/1.25 (max 34ch), section and
  artifact titles 22px/1.3; spec pages 28px and their sections 22px.
- **Label** (600, 13px, 1.2, +0.09em, uppercase): field labels, rubric
  headers, the context line; turn markers (You / Ki) at 12px.
- **Typed** (400, 12px): margin notes (1.35), attention lines (1.4), checks
  and source lines, provenance footer (1.6), the `rough` tag and type codes
  (uppercase, +0.04–0.08em).
- **Measurements** (typed, 13px, tabular figures via `.ki-num`): counts,
  points, minutes, page numbers — `12 questions · 30 points · 25 minutes`.

### Named Rules

**The No-Faux-Italic Rule.** The embedded serif has no italic face, and none
is faked: `em` is weight 600 with a hairline underline in the panel, weight
alone in documents. Never an oblique.

**The Typed-Voice Rule.** Courier Prime is the margin's voice — notes,
provenance, and every measurement, aligned in columns by tabular figures.
Never body copy, never buttons, never prose.

## Layout

One spacing scale serves both surfaces: 4, 8, 12, 16, 24, 32, 48, 64px
(`s1`–`s8`). The panel is a narrow column; the documents are a sheet.

**The panel.** Designed at 440px; it breathes to a 560px maximum and never
becomes a page. Padding 24px inline and top, 48px at the foot (inline
padding narrows to 16px at ≥640px). A context line at the top — where and
when, in chrome type — sits on a dividing rule. The thread spaces turns 32px
apart, 12px within a turn; turns are labelled You / Ki in 12px uppercase.
Status lines about the workspace sit in the thread in the typed voice.
The decision row is the panel's one anchored element: sticky at the bottom
edge on paper, under a hairline with an upward shade.

**The draft rows.** Each row is a two-column grid — the line
(`minmax(0, 1fr)`) and the margin (6.5rem column, 14px gap) — padded 16px
vertically, divided by hairlines. At ≤376px the margin turns under its row:
the blue rule drops, a hairline takes over, and the notes wrap horizontally.

**The documents.** A sheet capped at 46rem, padded 48/32/32px (24/16/16px
below 544px). Meta and body hold a 68ch measure; question bodies 66ch,
question text 62ch. A question is a grid: a 2.25rem column for the hanging
number, then the body. Options give each letter key a 1.35rem column.

**Print.** A white ground, 16mm page margin, no shadows; questions and
rubric rows never split; the answer key starts a new page; the panel and
spec pages are hidden. Every new document is checked in print emulation.

### Named Rules

**The English-Skeleton Rule.** The document skeleton — section headings, the
`Q1.` and `1.` anchors, the `Q1 —` answer-key labels, the header block — is
structure the repo's check script (`scripts/check.py`) reads. Render it
exactly, in English; the content around it follows the course language.

## Elevation & Depth

The world is paper-flat. Surfaces are paper; at rest nothing floats. Depth
appears exactly twice, and both times it means something physical: a sheet
lying on a deeper ground, or a decision pinned above the thread. Print
removes both — on paper there is no shadow at all.

### Shadow Vocabulary

- **Sheet lift** (`0 1px 1px rgb(0 0 0 / 5%), 0 8px 22px rgb(0 0 0 / 7%)`):
  a sheet resting on a ground — the delivered artifact, and the panel when
  the page frames it.
- **Decision shade** (`0 -6px 14px rgb(0 0 0 / 4%)`): under the sticky
  decision row, so the anchor reads as pinned over the scroll.

### Named Rules

**The Paper-Flat Rule.** Depth marks a physical sheet or an anchored
decision — never a floating UI layer. No hover lifts, no card shadows, no
stacked overlays.

## Shapes

Near-square. The interactive controls — decision buttons, the select — carry
a 2px radius and nothing else does: sheets, note blocks, and swatches are
square (0). The focus outline follows the same discipline (2px ink, offset
2px, 1px radius).

The form language is the hairline. 1px rules divide rows, underline the
context line and the document head, draw the margin's blue line, rule the
answer areas, and underline emphasis. The sheet and the select carry a 1px
dividing-rule border; nothing is ever a pill, and nothing carries a heavy
stroke.

Marks are drawn, not typed: 14px inline-SVG line icons at 1.4 stroke — one
owned mark per artifact type (quiz: lines; worksheet: box with tick;
handout: page; assignment: steps; case study: brackets) — and the attention
mark, a 10×16 vertical dash with a serif foot. Never a unicode glyph, never
an emoji.

## Components

Components inherit the world's rules: **The Deleted-Chrome Rule** — no
bubbles, no avatar, no card standing in for a label, no accent stripes; a
rule, a margin note, or type itself does the work — and **The Margin Rule**
below.

### Decision Buttons

The educator's one gesture, and the panel's focal moment: a solid button and
a quiet one, nothing else at their scale.

- **Shape:** near-square (2px radius)
- **Primary:** ink ground, paper text; Public Sans 600 at 13px, +0.015em;
  padding `0.7rem 1.15rem`; 1px ink border. Hover: pressed ink (#17273e).
- **Quiet ("Adjust"):** transparent ground, ink text, 1px dividing-rule
  border. Hover: paper wash fill, secondary-ink border.
- **Disabled:** transparent, mark-grey label, hairline border, `not-allowed`
  cursor.
- **The row:** sticky at the panel's bottom on paper, hairline above,
  upward shade; wraps, never scrolls away.

### Open-Choice Select

A standard control, not a styled invention: transparent ground, 1px
dividing-rule border, 2px radius, Public Sans 13px in ink, a drawn chevron
(inline SVG, ink stroke) on the right. Hover deepens the border to secondary
ink. Its stated default is named beside it in the typed voice at 12px in
secondary ink ("default"); a radio pair is the acceptable alternative.

### Attention Line

The educator's red in two inseparable parts: the drawn dash and the words,
in the typed voice at 12px, left-aligned. In the narrow margin the mark
stacks above its words so the longest word never spills past the column.
Never softened into prose, never the words without the mark, never the mark
without the words.

### Artifact Sheet

The delivered artifact as a physical sheet: paper ground, square corners,
1px dividing-rule border, sheet-lift shadow. The head — type code with the
type's drawn mark, title at 22px, metadata in chrome type at 13px in
secondary ink — is divided from the body by a hairline. The body carries, in
order: the honest checks line (typed, 12px, secondary ink), the attention
line for what needs the educator, next moves (chrome type, labels in
secondary ink), and the link (ink, 1px underline in hairline grey, ink on
hover). The sheet arrives with the system's one animation.

### Document Question Row

- **The number hangs in the margin:** typed 13px in secondary ink,
  right-aligned in a 2.25rem column — `Q1` for a quiz, `1` for an exercise.
- **Body:** 66ch; points sit under the question in typed 12px (`[2 points]`).
- **Options:** each letter key in a 1.35rem typed column.
- **Answer areas:** ruled lines (1px dividing rule, 2rem tall, kept empty —
  they are the page's writing area) or a single 26ch line.
- **Breaks:** a question never splits across pages; the answer key starts a
  new page.

### Rubric

A plain collapsed table: hairline rules under each row, headers in label
style (Public Sans 600, 13px, uppercase, +0.09em, secondary ink) on a
dividing-rule underline, the first column at 600 weight, cell padding
`0.75rem 0.75rem 0.75rem 0`. No zebra, no fills.

### The Margin (Signature)

In the panel, each draft row's margin column sits behind the faint blue
rule and carries the review beside the line it belongs to: a tick for a
settled line (ink at rest, mark grey when quiet), the provenance note
(typed, 12px, secondary ink — "from week-3 slides"), and the red attention.
In a document, the margin carries the question numbers.

**The Margin Rule.** The margin carries the review — ticks, provenance,
the red mark, question numbers — beside the line each belongs to. It is
never a sidebar and never a second column of content.

### Type Code

A typed uppercase tag at 12px, +0.08em, secondary ink, paired with the
artifact type's drawn mark (quiz, worksheet, handout, assignment, case
study). The same mark follows the type everywhere it appears — panel
delivery, document head, preview.

**The One-Moment Rule.** The system has one authored motion: a mark lands in
two steps — a clip-path wipe, 140ms, `steps(2, end)`, disabled under
`prefers-reduced-motion`. Paper has no easing; add no entrances, no easing
curves, no hover motion to sections.

## Do's and Don'ts

### Do:

- **Do** spend red only on attention, and only with its words beside the
  mark (#b8372e, 5.2:1 on paper).
- **Do** set all voice text in ink (#20324f) and labels and secondary text
  in secondary ink (#55657e).
- **Do** put the review in the margin, beside the row it belongs to (6.5rem
  column in the panel; hanging numbers in documents).
- **Do** keep the typed voice to margin notes and measurements, with
  tabular figures (`.ki-num`) for counts, points, and minutes.
- **Do** keep answer areas as empty ruled lines and keep questions whole
  across page and print breaks.
- **Do** render the English skeleton exactly (`Q1.`, `Q1 —`, the header
  block) — `scripts/check.py` reads it.
- **Do** check every document in print emulation before delivery (white
  ground, 16mm margin, shadows off).

### Don't:

- **Don't** add chat chrome: no bubbles, no avatar, no card-with-accent-
  border, no wallpaper gradient.
- **Don't** set reading text in mark grey (#9aa09b) or soft red (#dfb3ae) —
  they are marks and rules.
- **Don't** use red for decoration, headings, or states of the interface.
- **Don't** fake an italic — the serif has none; emphasis is weight 600.
- **Don't** add a hosted font, a CDN, a build step, or JavaScript; marks
  are inline SVG, never a unicode glyph or an emoji.
- **Don't** add motion beyond the one mark-landing moment.
- **Don't** turn the margin into a sidebar or a second column of content.
