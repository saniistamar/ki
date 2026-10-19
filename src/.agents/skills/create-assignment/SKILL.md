---
name: create-assignment
description: Create an assignment for a course — a task students can follow in steps, with named deliverables, a due line, and a rubric whose criteria are observable behaviors. Use when the educator asks for an assignment, homework, problem set, or essay prompt.
---

# create-assignment

Load `.agents/skills/_pedagogy/workflow.md` first; it is the spine, this
file is the profile.

## Trigger

"Create an assignment", "design homework", "a problem set", "an essay
prompt" — for a named course.

## Profile

- Template: `templates/assignment.md`
- Output: `courses/<course>/assignments/<week-or-topic>-assignment.md`
- Critics, fire both: `.agents/skills/_pedagogy/roster/flop-postmortem.md`,
  `.agents/skills/_pedagogy/roster/silent-decisions-finder.md`
- Checks: `python3 scripts/check.py --type assignment <file>`

## Draft shape

- Coverage: the outcome or outcomes moved, and the material the tasks
  draw from.
- Structure: the parts in order (A, B, C), one line each on what the
  student does, with the weight per part.
- Quantity and mix: the task count, the estimated hours, and the
  deliverable form per part (document, code, presentation).
- One sample: one task in its numbered-step shape, wording rough.
- Open choices: estimated time, collaboration policy, and submission
  format — each with its stated default. The due date is never a draft
  default: it stays the educator's line, named and empty.

## Notes

- Name which course-profile outcomes the assignment serves, in the header.
- Rubric criteria are observable behaviors the student work either shows or
  does not — never "understands X". Each criterion has what excellent,
  satisfactory, and needs-work look like.
- Due date: leave the line named and say in the delivery message that it
  needs the educator. Never invent a date.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
