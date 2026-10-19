---
name: create-case-study
description: Create a case study for class discussion or a written assignment — a narrative with real tension and no verdict given, plus discussion questions and facilitation notes for the instructor. Use when the educator asks for a case study or discussion case.
---

# create-case-study

Load `.agents/skills/_pedagogy/workflow.md` first; it is the spine, this
file is the profile.

## Trigger

"Create a case study", "a discussion case", "turn this into a case" — for
a named course.

## Profile

- Template: `templates/case-study.md`
- Output: `courses/<course>/case-studies/<week-or-topic>-case-study.md`
- Critics, fire both: `.agents/skills/_pedagogy/roster/flop-postmortem.md`,
  `.agents/skills/_pedagogy/roster/boundary-hunter.md`
- Checks: `python3 scripts/check.py --type case-study <file>`

## Draft shape

- Coverage: the premise in two sentences — the domain, the tension, and
  what makes it arguable from more than one direction — labeled as
  drawn from material or constructed.
- Structure: the session shape — the case length, the exhibits or data
  artifacts, the question ladder from concrete to principled, and
  discussion or written format.
- Quantity and mix: the question count, the expected session time, and
  in-class or take-home.
- One sample: the premise paragraph and the first question, wording
  rough. The premise is the flavor: the draft rides on it.
- Open choices: the realism level (real names, anonymized, or
  constructed), the data richness, and the student's role in the case
  — each with its stated default.

## Notes

- Name which course-profile outcomes the case study serves, in the header.
- The case has real tension and takes no verdict: it must be arguable from
  more than one direction, or the discussion has nowhere to go.
- Discussion questions are open (no yes/no), ordered from concrete to
  principled.
- Facilitation notes name the expected directions, the common traps, the
  timing, and how to close — a substitute instructor runs the session from
  this section alone.
- Draw the case from `courses/<course>/material/` when it holds anything
  usable; when inventing a scenario, label it as constructed and say so in
  the delivery message.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
