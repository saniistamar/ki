# Welcome to your teaching workspace

This folder is set up so Ki can help you with your course. Share your
material — a syllabus, slides, past quizzes — and Ki files it, reads
it, and talks with you in plain words. A local panel beside your
editor shows what Ki is doing and what it needs from you; you answer
in the chat. Making course documents — quizzes, assignments, handouts,
worksheets, case studies — is switched off in this version of Ki.

## Start here

1. Open this folder in your AI tool.
2. Have your source material ready, if any exists — a syllabus,
   slides, last term's quiz. Attach them in chat,
   drop them into this folder, or link them. Ki learns your course
   from them: its shape, level, outcomes, tone, and policies.
3. Say what you need, in plain words. For example:
   - "Set up a course called Intro Statistics"
   - "What do my week-3 slides actually claim?"
   - "Help me plan next week's quiz — what should it cover?"
4. Ki asks for your materials first, then only the questions they
   leave open. Answer them — that is the whole setup.
5. If anything Ki says doesn't land, just say "what?" — it will be
   explained differently.

## Keeping Ki current

From time to time, just ask: "update Ki". Ki checks whether a newer
release exists, updates the folder's machinery, and leaves your
courses, materials, and notes untouched. Your own work lives in your
course folders — profiles, materials, judgment-call notes — and
updates never touch it. The machinery (the reference course,
templates, and guides) is replaced on update: keep nothing of yours
inside it. Every update is recorded in
the folder's history, so you can always ask for the earlier state of
anything back. You never need to know how any of this works. If an
update stops partway, nothing is broken — ask again and it completes.

Want Ki to work differently? Put it in `MY-KI.md` at this folder's
root — your own standing rules for Ki. Updates never touch it.

If your copy of this folder was made without its hidden files (copied
or synced, for example), updates still work, but nothing can be
recovered — Ki will say so plainly.

## What happens under the hood (you never need to touch this)

- Ki's answers come from your material: it reads what you share and
  says plainly when the material runs out.
- Judgment calls Ki makes alone are written down in each
  course's `rulings.md`, each with what could go wrong if it is wrong.
- The folder keeps its own history, so an earlier version of anything can
  be recovered — you never run any commands for this.

## Where things land

| You share | It lands in |
| --- | --- |
| Course material — slides, notes, past quizzes | `courses/<course>/material/` |

## Four things worth knowing

- Your source material — slides, notes, past materials — belongs in
  `courses/<course>/material/`. Attach files in chat or drop them into
  this folder, and Ki files them there, telling you where they went.
  Ki reads them for context and builds from what is there. Nothing of
  yours is ever changed inside that folder.
- The panel is for reading: what Ki is doing, what it needs from you,
  what was already agreed. It takes no input — the chat is where you
  answer.
- Ki talks with you in your language. English is the default — say
  the word to change it.
- `courses/example-course/` is a filled-in example you can browse or
  delete. Treat it as a read-only reference: updates replace it, so
  keep nothing of yours inside it. If you delete it and want it back
  later, just ask. `library/` is reserved for a future
  deep-research feature.
