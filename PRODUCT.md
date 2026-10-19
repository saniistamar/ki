# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Two web surfaces:

1. **The panel** — the primary frame. A local dev server renders the page;
   the educator reads it in a narrow side panel beside the editor in the
   AI harness (ZCode first), about 400–520px wide. One-way: the panel
   shows what Ki is doing and what it needs; the chat is where the
   educator answers.
2. **The artifact documents** — what Ki makes: quizzes, assignments,
   handouts, worksheets, case studies. Rendered as web pages, exported to
   PDF, slides, and other formats, and tunable by the educator.

## Stack

The design system is plain CSS and static HTML: no build step, no network,
self-contained assets. Ki installs as a folder and must work offline.

Undecided: the stack of the panel's dev server. No choice has been made,
and the design system must not depend on one.

## Users

**The educator** — a teacher, lecturer, or trainer, not a programmer. The
Ki folder is open in their AI harness; they ask in plain words in the
chat and read what Ki shows in the panel. Their job is to turn course
material into usable teaching, fast, without learning a tool or
reading any machinery.

**Students**, downstream — they receive the artifacts as documents and
distributed copies. They never see the panel.

## Product Purpose

Ki turns a plain folder into a teaching workspace. The educator shares
material (syllabus, slides, past quizzes) and asks in plain words; Ki
files the material, reads the course from it, and answers — questions,
findings, proposals — in words, shown in the panel and carried in the
chat. The folder keeps its own history. Making the teaching documents
(quizzes, assignments, handouts, worksheets, case studies) is switched
off in this version: the machinery stays in the folder, nothing runs
it, and Ki says so plainly when asked.

## Positioning

Agent docs are the operating system: one `AGENTS.md` constitution plus
skills, templates, and a check script. Nothing installs, runs, or updates
outside the harness. The mechanism a neighbor could not truthfully copy:
any agentic tool that opens the folder becomes the teaching assistant, and
the educator's own folder stays the product, offline.

## Operating Context

- The educator works in an AI harness, often in a narrow panel beside
  their editor; sessions resume cold, so the panel must stand on its own.
- Two languages at once: the instructor language (what Ki says) and the
  course language (what the artifact's content is written in). The
  artifact skeleton — section headings, question anchors, answer-key
  labels — stays English machinery.
- The educator moves artifacts out of the folder into their own tools:
  print, PDF, slides, an LMS. They will restyle what they receive.
- Ki never grades and never takes irreversible calls.
- Egress rule: no course material leaves the harness. Every asset is
  local.

## Capabilities and Constraints

- Creation is switched off in this version. The two-phase machinery — a
  shape draft (coverage, structure, quantity, one rough sample, open
  choices with defaults) shown for a yes, then polish with the critic
  volley and the checks — stays in the folder, and nothing invokes it.
  The panel renders read-only: no form, no button; the chat is the
  answer channel.
- Ki speaks in plain words, never machinery: no file paths, slugs, git,
  checks, or critic jargon on the panel. Delivery messages name what
  landed, what was checked (honestly), and what needs the educator's eye.
- Standing "what?" offer: the educator can ask for any statement to be
  explained differently.
- Documents are educator-tunable: Ki's styling must survive being opened,
  edited, or restyled by its owner.
- No logo, no imagery, no visual identity exists today; the payload is
  Markdown. Nothing here may require assets Ki cannot author.

## Brand Commitments

- The name is **Ki**.
- Voice: plain, encouraging, unhyped, never condescending. Results are
  reported, not process.
- It must not read as childish or hand-drawn (school-supplies cartoon),
  and must not read as a corporate SaaS dashboard. Both were named by the
  owner as wrong.
- Restraint is the brand posture; the educator's work is the color.

## Evidence on Hand

- `src/courses/example-course/` — a filled reference course
  (Introduction to Statistics, STAT 101): profile with audience, gap,
  outcomes, tone, policies; a rulings file. Real teaching content, safe to
  use as demonstration material.
- `src/templates/` — the five artifact skeletons, the structural truth of
  every document type.
- `src/.agents/skills/create-*/` — what each artifact type must contain.
- Absent, and not to be fabricated: pull quotes, testimonials, metrics,
  logos, photography, institutional marks.

## Product Principles

1. **The educator never reads the machinery.** The surface shows the work
   and the decision, never the system that produced it.
2. **Honest surfaces.** Provenance is visible where it matters (where an
   answer came from; what is unverified); nothing is presented as
   finished that is not.
3. **The educator stays in control.** Drafts gate on a yes; documents
   remain theirs to change; no irreversible step happens silently.
4. **Plain words first.** Anything technical is glossed at first use, in
   the language the educator chose to be spoken to in.
5. **Quiet confidence.** No hype, no gamification, no decoration that a
   working teacher would have to see past.

## Accessibility & Inclusion

The reference course states the bar Ki should hold itself to: materials
are text-first and screen-reader friendly, and color never carries meaning
alone. Content arrives in many languages; the system must render any
script it is given and never rely on a single language's conventions.
The panel is used in a narrow frame, often on a laptop screen, sometimes
with magnification.
