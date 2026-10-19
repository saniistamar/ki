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

## Draft shape

- Coverage: the one topic explained, and the material sections it
  summarizes.
- Structure: the section outline, one line each on what a section
  carries, and whether Key terms and Further reading ride along.
- Quantity and mix: the target length in pages, the worked-example
  count, and roughly how many key terms.
- One sample: one key explanation or worked example, wording rough.
  This is the register carrier: the plain-words tone gets tasted here.
- Open choices: density (teaching walk-through or reference sheet) and
  practice items or none — each with its stated default. When the
  outline runs past two pages, name it as a choice: what to cut to fit,
  or whether to run long.

## Notes

- Name which course-profile outcomes the handout serves, in the header.
- Every technical term is glossed at first use in plain words; the Key
  terms section collects them.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
