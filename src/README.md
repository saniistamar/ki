# Welcome to your teaching workspace

This folder is set up so an AI assistant can help you create course
materials — quizzes, assignments, handouts, worksheets, case studies —
while keeping its work organized and reviewable. You never need to read
any of the machinery: just ask in plain words.

## Start here

1. Open this folder in your AI tool.
2. Say what you need, in plain words. For example:
   - "Set up a course called Intro Statistics"
   - "Create a quiz for week 4 on confidence intervals"
   - "Turn my notes on case interviews into a class discussion case study"
3. The assistant will ask a few questions the first time, then get to work.
4. If anything the assistant says doesn't land, just say "what?" — it
   will explain it differently.

## Keeping Ki current

From time to time, just ask: "update Ki". The assistant checks whether a
newer Ki exists, updates the folder's machinery, and leaves your
courses, materials, and notes untouched. Your own work lives in your
course folders — profiles, artifacts, materials, judgment-call notes —
and updates never touch it. The machinery (the reference course,
templates, and guides) is replaced on update: keep nothing of yours
inside it. Every update is recorded in
the folder's history, so you can always ask for the earlier state of
anything back. You never need to know how any of this works. If an
update stops partway, nothing is broken — ask again and it completes.

If your copy of this folder was made without its hidden files (copied
or synced, for example), updates still work, but nothing can be
recovered — the assistant will say so plainly.

## What happens under the hood (you never need to touch this)

- Every draft is reviewed from independent angles with different
  concerns before it is marked done.
- Structural checks run on every artifact.
- Judgment calls the assistant makes alone are written down in each
  course's `rulings.md`, each with what could go wrong if it is wrong.
- The folder keeps its own history, so an earlier version of anything can
  be recovered — you never run any commands for this.

## Where things land

| You ask for | It appears in |
| --- | --- |
| Quiz | `courses/<course>/quizzes/` |
| Assignment | `courses/<course>/assignments/` |
| Handout | `courses/<course>/handouts/` |
| Worksheet | `courses/<course>/worksheets/` |
| Case study | `courses/<course>/case-studies/` |

## Two things worth knowing

- Put your existing slides, notes, and past materials into
  `courses/<course>/material/` — the assistant reads them for context and
  builds from what is there.
- `courses/example-course/` is a filled-in example you can browse or
  delete. Treat it as a read-only reference: updates replace it, so
  keep nothing of yours inside it. If you delete it and want it back
  later, just ask. `library/` is reserved for a future
  deep-research feature.
