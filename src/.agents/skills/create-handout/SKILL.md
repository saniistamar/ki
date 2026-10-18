---
name: create-handout
description: Create a course handout — a short reference document for students that explains one topic in plain words, with key terms glossed and a purpose stated. Use when the educator asks for a handout, reference sheet, or summary sheet.
---

# create-handout

Load `.agents/skills/_pedagogy/workflow.md` first; it is the spine, this
file is the profile.

## Trigger

"Create a handout", "a reference sheet", "a summary sheet" — for a named
course.

## Profile

- Template: `templates/handout.md`
- Output: `courses/<course>/handouts/<week-or-topic>-handout.md`
- Critics, fire both: `.agents/skills/_pedagogy/roster/novice-eyes.md`,
  `.agents/skills/_pedagogy/roster/boundary-hunter.md`
- Checks: `python3 scripts/check.py --type handout <file>`

## Notes

- Name which course-profile outcomes the handout serves, in the header.
- Every technical term is glossed at first use in plain words; the Key
  terms section collects them.
- A handout is short. If the topic needs more than roughly two pages of
  markdown, that is a decision for the educator: park it and say why in
  the delivery message.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
