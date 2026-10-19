---
name: create-worksheet
description: Create a student worksheet — numbered exercises with answer space, instructions a student can follow alone, and an estimated time. Use when the educator asks for a worksheet, practice problems, or in-class exercises.
---

# create-worksheet

Load `.agents/skills/_pedagogy/workflow.md` first; it is the spine, this
file is the profile.

## Trigger

"Create a worksheet", "practice problems", "in-class exercises" — for a
named course.

## Profile

- Template: `templates/worksheet.md`
- Output: `courses/<course>/worksheets/<week-or-topic>-worksheet.md`
- Critics, fire both: `.agents/skills/_pedagogy/roster/novice-eyes.md`,
  `.agents/skills/_pedagogy/roster/assumption-auditor.md`
- Checks: `python3 scripts/check.py --type worksheet <file>`

## Draft shape

- Coverage: the skill drilled, and the material the exercises draw
  from.
- Structure: the scaffold gradient — which exercises walk the path,
  which walk it with less support, which go alone, and the final
  transfer stretch.
- Quantity and mix: the exercise count, the split across support
  levels, the estimated minutes, and alone or in pairs.
- One sample: one exercise at the middle, guided level, wording rough.
- Open choices: length and time, an exit-ticket exercise or none, and
  whether the instructor notes carry full answers or only the marks of
  a good answer — each with its stated default.

## Notes

- Name which course-profile outcomes the worksheet serves, in the header.
- Exercises scaffold: early ones walk the path, later ones walk it alone,
  the last stretch asks for a small transfer the student has not seen
  verbatim.
- Every exercise carries visible answer space (a blank line block or an
  answer prompt) — a worksheet with nowhere to write is a defect.
- Instructor notes (what good answers look like) go at the end, clearly
  marked as not for distribution.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
