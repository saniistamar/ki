# Workflow — creating a course artifact

The spine for every create-* task. The skill profile names the specifics:
template, critic draw, checks, output folder, and the draft shape. This
file owns the order.

## 1. Understand

- Restate the ask in one sentence: what artifact, for which course,
  covering what.
- Read the course profile. Everything the profile decides — audience,
  outcomes, tone, language, policies — is fixed. Flag conflicts to the
  educator rather than bending silently. Aim the artifact at the
  profile's gap section when the profile carries one. The artifact's
  content goes in the profile's course language; the template's
  skeleton — section headings, numbering anchors, answer-key labels,
  the header block — stays as the template carries it.
- Every question costs the educator attention. Ask only when the ask is
  ambiguous about which course, which artifact, or which class or
  section. Shape details ride the draft's Open choices; otherwise state
  the default and proceed.
- The ask may carry a deadline ("I need it before Tuesday 8am"). Name
  what you will do less of to honor it — fewer open choices, a tighter
  shape, a shorter artifact — and say the educator can move the deadline
  instead if they would rather; the critic volley and the checks always
  run. The shape draft is what exists at any interruption: something
  concrete to react to, long before the full write.
- A revision ask follows the same spine. One that changes
  coverage, structure, or quantity drafts its change first at
  `.work/<artifact-slug>/change-draft.md`, the same loop scoped to
  the change. A cosmetic edit runs straight to §5, which edits the
  standing artifact.

## 2. Gather

- Read the template the profile names.
- Read what `material/` holds on the topic. Use it; never invent around
  what exists. Say plainly when the material runs out.
- Name in the artifact's header which course-profile outcomes it serves.

## 3. Draft the shape

- Write the draft to `.work/<artifact-slug>/draft.md`. The slug is the course
  and the final file's stem (`intro-statistics-week04-quiz`), so
  two courses on one week never share a folder. The draft never lands
  at the final path and never commits.
- Every draft carries the same five fields:
  - **Coverage** — the topics or sections, each named with its source:
    the material file or the profile outcome.
  - **Structure** — the order and rough length.
  - **Quantity and mix** — the counts and the blend.
  - **One sample** — one instance written out, marked rough.
  - **Open choices** — the unset dials, each with a stated default.
- A draft may be rough, never wrong. A sample not grounded in the
  material carries a visible "?". The draft's prose follows the
  instructor language. The sample instance follows the course language.
  The field names are machinery and stay English.
- The profile's Draft shape section names what each field carries for
  this artifact type.
- The shape ask (§4) shows the draft in chat.

## 4. The shape ask

- One message, plain words, showing the draft: here is the shape — is
  it right?
- The educator's signal: yes, adjust, or wrong shape.
  - **Yes** — write the settled choices into the draft file: each Open
    choice collapses to the value the educator took. A yes that carries
    quality words ("yes — and make them harder") rides as a named
    polish directive in the draft file. Go to §5.
  - **Adjust** — return the full revised draft with the changes named
    first, the same five fields, and overwrite the draft file. Adjusts
    are unlimited: the educator re-affirms a shape seen whole.
  - **Wrong shape** — re-draft.
- A live "just write it" skips this gate for the ask it answers, never
  the session. Say so and go to §5.
- The draft aligns shape, not quality. Quality work happens once, in
  §5, on the shape the educator affirmed.

## 5. Polish

- First creation writes the artifact at its final path, from the
  affirmed draft file — never from the chat. When the draft file is
  gone at polish time, rebuild it from the conversation and say so.
  The profile names the folder and the file-naming pattern:
  `<week-or-topic>-<artifact>.md` — e.g. `week04-quiz.md`,
  `week07-case-study.md`.
- A revision edits the standing artifact at its final path. A
  structural revision applies its affirmed change-draft to the
  artifact in place, scoping the volley to the change; a cosmetic
  edit just runs. The base is never a stale shape outline.
- Fill every section the template and the profile's checks require. Leave
  nothing a check will flag. Leave no draft marker behind: no rough
  flag, no "?" flag, no Open-choices block. The checks do not detect
  these — scan the artifact yourself before delivery.
- Fire the profile's two critics as separate subagents (stance profile at
  `.agents/skills/_pedagogy/roster/<stance>.md`). Write the brief and the
  returns under `.work/<artifact-slug>/` — the artifact itself travels as
  a file path. The brief carries: the artifact's file path, the course
  profile path, the educator's ask verbatim — the affirmed draft's
  directives included — and the stance profile path. The draft itself
  never travels in the brief. Never your own summary of the artifact —
  anchor is contamination. Review quality
  within the shape the educator affirmed: a return that objects to the
  shape itself does not block — surface it to the educator in the
  delivery message, never silently reworked.
- A verdict of `objection` or `rework` blocks a finished handover. Fix and
  re-fire the same stance; two fix rounds maximum. After that, remaining
  objections go to the educator as named tradeoffs: the artifact commits
  as held (`quizzes: hold week 4 quiz pending educator call`) and is never
  presented as finished.
- When two critics impose contradictory settlement conditions, no fix
  satisfies both: that is a tension. Apply the most reversible default
  and put the tension to the educator in the delivery message.
- A `pass` must name what remains unexamined. Returns that overlap on one
  finding or stay surface-level are a failed volley: re-fire once with
  fresh contexts; a second failure is reported to the educator.
- When review runs inline (no delegation in this session), the volley
  rules that need fresh contexts do not apply: each stance is adopted
  once, in order, and a verdict's evidence — not its independence — is
  what settles a finding. The delivery message says the review was
  inline.
- Every finding examined and set aside is named in the delivery message.
  Nothing drops silently.
- Run the artifact's checks before delivery:

      python3 scripts/check.py --type <type> <path>

- Exit 0, or fix every finding and run again. No interpreter: perform
  the same checks by reading, and label them "manual checks" in the
  delivery message.

## 6. Deliver

- Record rulings made since the educator affirmed the draft — the
  Open-choice defaults that survived, and every judgment call made in
  polish — in `courses/<course>/rulings.md`.
- Commit silently: `<area>: <subject>` in the imperative —
  `quizzes: add week 4 quiz on confidence intervals`.
- Tell the educator in plain words: what was made and where it landed,
  which outcomes it serves, what the reviewers said, what was checked
  (named honestly — real checks or "manual checks"), what needs their eye
  (dates, points), and any parked findings.
- Offer the sibling format when one fits: "this quiz can become a worksheet —
  say the word."
- End with a "Next moves:" line — the plain-words follow-ups (harder,
  shorter, next week).
