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

## Notes

- Name which course-profile outcomes the assignment serves, in the header.
- Rubric criteria are observable behaviors the student work either shows or
  does not — never "understands X". Each criterion has what excellent,
  satisfactory, and needs-work look like.
- Estimated time: state the default aloud unless the educator fixed it.
  Scope cuts (fewer parts, shorter length) are decisions for the educator:
  park them, never make them.
- Due date: leave the line named and say in the delivery message that it
  needs the educator. Never invent a date.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
