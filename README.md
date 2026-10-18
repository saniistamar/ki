# Ki

**Your first quiz, about ten minutes from now.**

Ki turns a folder into a teaching workspace. You ask in plain words —
"set up a course called Intro Statistics", "create a quiz for week 4 on
confidence intervals" — and an AI assistant writes the quiz,
assignment, handout, worksheet, or case study into the folder. Every
draft is reviewed from independent angles and checked before it is
marked done. The folder keeps its own history, so an earlier version of
anything can be recovered. You never read or run any of the machinery.

Ki works with any tool that reads an AGENTS.md file and can run its
commands — ZCode, Codex, Cursor, Amp, Gemini CLI, GitHub Copilot, and
others.

## Install with one paste

1. Create a new, empty folder for your teaching workspace and open it
   in your AI tool.
2. Paste this into the chat:

   ```text
   Install Ki into this folder. Ki is distributed at
   https://github.com/saniistamar/ki. Do this:

   1. Download the zip from
      https://github.com/saniistamar/ki/releases/latest/download/ki.zip
      to a temporary place outside this folder.
   2. List the zip's contents. Before unpacking, check this folder:
      stop and ask me if any file or folder here would collide with
      them, or if this folder already holds a `.git` folder or a
      `courses/` folder. Once I open the right folder, I will paste
      this again.
   3. Unpack the zip into this folder, flat — its contents land here,
      not in a subfolder. Delete the downloaded zip afterwards.
   4. Read AGENTS.md in this folder and follow its "First run"
      section: greet me briefly and ask me the intake questions in
      one round.

   Speak to me in plain words. Never show me the machinery. If any step
   fails, tell me plainly what failed, that nothing broke, and how to
   try again.
   ```

3. Answer the questions. That is the whole install.

## Install manually

1. Download the zip from the
   [latest release](https://github.com/saniistamar/ki/releases/latest).
2. Unzip it into a new, empty folder. With a GUI, extract into that
   folder; if a `ki` folder appears, open that one.
3. Open the folder in your AI tool and say "set up a course" — the intake
   starts on its own.

If the download or the unzip fails, nothing is broken. Delete the
partial folder and start again, or paste the install prompt below and
let the assistant handle it.

## Keeping Ki current

Ask "update Ki" in your AI tool whenever you like. The assistant checks for a
newer release, updates the machinery, and leaves every course,
material, and note you own untouched. Your own work lives in your
course folders — profiles, artifacts, materials, judgment-call notes —
and updates never touch it. The machinery (the reference course,
templates, and guides) is replaced on update: keep nothing of yours
inside it. Each update is saved to the folder's history, so you can
always ask for an earlier state back. If your copy of the folder was
made without its hidden files, updates still work, but nothing can be
recovered — the assistant will say so plainly. A failed update never
breaks anything: asking again completes it.

## Development

Ki is agent-docs all the way down: one `AGENTS.md` constitution, a
small skill set, templates, and a check script. The installed system
lives at `src/` in this repo. The release zip is cut from the tracked
`src/` tree and unpacks flat.

- Build the zip: `bash scripts/build.sh`. The version comes from
  `src/KI-VERSION`. The script writes `dist/ki-<version>.zip`.
- Cut a release: push a tag `v<version>`; the workflow builds and
  attaches the zip as `ki.zip`. The manual fallback (the version comes
  from `src/KI-VERSION`, so the tag cannot disagree):

  `v="$(tr -d '[:space:]' < src/KI-VERSION)" && bash scripts/build.sh && cp "dist/ki-$v.zip" dist/ki.zip && gh release create "v$v" --notes "Ki v$v — the teaching workspace system. See the README for install and update." dist/ki.zip`

- Tags are immutable. A defect after a release lands as the next
  version.
- Upgrades are additive: nothing is deleted in an educator's folder,
  and every educator-owned path is preserved by rule.
- License: MIT. See [LICENSE](./LICENSE).
