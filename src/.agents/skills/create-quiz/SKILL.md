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

## Draft shape

- Coverage: the topics in order, each named with its source — the
  material file or the profile outcome. Aim at the gap when the profile
  carries one.
- Structure: the block plan (for example: warm-up multiple choice, then
  short answers, then one essay), with points per block.
- Quantity and mix: the question count, the type blend, and how many
  questions touch the gap.
- One sample: one full stem with its options or answer line, wording
  rough and marked rough.
- Open choices: total points, time limit, and the exam-materials rule
  (closed book, calculator allowed) — each with its stated default.

## Notes

- Name which course-profile outcomes the quiz serves, in the header.
- Every answer-key entry carries a rationale — what the answer shows, and
  what misconception each distractor names. A rationale-less key is a
  defect.
- Every answer-key entry names its source — the course material it came
  from — or carries the honest flag "unverified — check this one". An
  unverified answer is named as unverified, never padded.
- Multiple-choice distractors are plausible: each one names a real
  misconception, never an absurd option.
- "With research": the deep-research workflow is reserved. Use
  `courses/<course>/material/` and say plainly when it runs out. Never pad
  with invented citations.
