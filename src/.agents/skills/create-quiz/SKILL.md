---
name: create-quiz
description: Create a quiz for a course — numbered questions with types and points, plus a complete answer key where every answer carries a rationale. Use when the educator asks for a quiz, test, or check-for-understanding questions.
---

# create-quiz

Load `.agents/skills/_pedagogy/workflow.md` first; it is the spine, this
file is the profile.

## Trigger

"Create a quiz", "make a test", "check for understanding" — for a named
course.

## Profile

- Template: `templates/quiz.md`
- Output: `courses/<course>/quizzes/<week-or-topic>-quiz.md`
- Critics, fire both: `.agents/skills/_pedagogy/roster/assumption-auditor.md`,
  `.agents/skills/_pedagogy/roster/novice-eyes.md`
- Checks: `python3 scripts/check.py --type quiz <file>`

## Notes

- Name which course-profile outcomes the quiz serves, in the header.
- Every answer-key entry carries a rationale — what the answer shows, and
  what misconception each distractor names. A rationale-less key is a
  defect.
- Multiple-choice distractors are plausible: each one names a real
  misconception, never an absurd option.
- Points and time limit: state the default aloud ("I'll set 20 minutes
  unless you say otherwise, because the weekly quizzes in this course run
  short") unless the educator fixed it in the profile or the ask.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
