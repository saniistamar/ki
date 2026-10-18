# Workflow — creating a course artifact

The spine for every create-* task. The skill profile names the specifics:
template, critic draw, checks, output folder. This file owns the order.

## 1. Understand

- Restate the ask in one sentence: what artifact, for which course,
  covering what.
- Read the course profile. Everything the profile decides — audience,
  outcomes, tone, policies — is fixed. Flag conflicts to the educator
  rather than bending silently. Aim the artifact at the profile's gap
  section when the profile carries one.
- Every question costs the educator attention. Ask only when the answer
  would change the artifact; otherwise state the default and proceed.
- Missing details that change the artifact's shape: ask them together, in
  one round.
- The ask may carry a deadline ("I need it before Tuesday 8am"). Say what
  you will skip to honor it, and keep a usable draft at any interruption:
  the educator can stop you at any point and still get something usable.

## 2. Gather

- Read the template the profile names.
- Read what `material/` holds on the topic. Use it; never invent around
  what exists. Say plainly when the material runs out.
- Name in the artifact's header which course-profile outcomes it serves.

## 3. Draft

- Write the artifact at its final path. The profile names the folder and
  the file-naming pattern: `<week-or-topic>-<artifact>.md` — e.g.
  `week04-quiz.md`, `week07-case-study.md`.
- Fill every section the template and the profile's checks require. Leave
  nothing a check will flag.

## 4. Review

- Fire the profile's two critics as separate subagents (stance profile at
  `.agents/skills/_pedagogy/roster/<stance>.md`). Write the brief and the
  returns under `.work/<artifact-slug>/` — the artifact itself travels as
  a file path. The brief carries: the artifact's file path, the course
  profile path, the educator's ask verbatim, the stance profile path.
  Never your own summary of the draft — anchor is contamination.
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

## 5. Check

    python3 scripts/check.py --type <type> <path>

- Exit 0, or fix every finding and run again.
- No interpreter: perform the same checks by reading, and label them
  "manual checks" in the delivery message.

## 6. Deliver

- Record rulings made since the draft in `courses/<course>/rulings.md`.
- Commit silently: `<area>: <subject>` in the imperative —
  `quizzes: add week 4 quiz on confidence intervals`.
- Tell the educator in plain words: what was made and where it landed,
  which outcomes it serves, what the reviewers said, what was checked
  (named honestly — real checks or "manual checks"), what needs their eye
  (dates, points), and any parked findings.
- Offer the sibling format when one fits: "this quiz can become a
  worksheet — say the word."
- End with a "Next moves:" line — the plain-words follow-ups (harder,
  shorter, next week).
