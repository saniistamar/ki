#!/usr/bin/env python3
"""check.py — structure checks for Ki course artifacts.

One mode per artifact type. Honest checks only: every finding is
observable in the file's structure. Checks that would judge clarity or
subject-matter correctness do not exist here; the workflow declares them
absent instead of faking one.

Usage: python3 check.py --type <quiz|assignment|handout|worksheet|
case-study|profile> <file>

Exit 0: no findings. Exit 1: findings printed, one per line.
"""

import argparse
import re
import sys
from pathlib import Path

PLACEHOLDER = re.compile(
    r"\b(TODO|TBD|FIXME)\b|\[placeholder\]", re.IGNORECASE
)
QUESTION = re.compile(r"^### Q(\d+)\.")
ANSWER = re.compile(r"^(?:#{1,4}\s+)?Q(\d+)\s*[—-]")
NUMBERED = re.compile(r"^\d+\.\s+\S")
EXERCISE = re.compile(r"^### (\d+)\.")
BULLET = re.compile(r"^-\s+\S")
TABLE_ROW = re.compile(r"^\|")

TYPES = ("quiz", "assignment", "handout", "worksheet", "case-study", "profile")


def headings(text):
    """Return (level, line_index, title) for every markdown heading."""
    out = []
    for i, line in enumerate(text.splitlines()):
        m = re.match(r"^(#+)\s+(.*)$", line)
        if m:
            out.append((len(m.group(1)), i, m.group(2)))
    return out


def section_body(text, name):
    """Body of the first section whose heading title contains `name`
    (case-insensitive). Body runs to the next heading of the same or
    higher level. Returns [] when the section is missing."""
    hs = headings(text)
    lines = text.splitlines()
    for idx, (level, i, title) in enumerate(hs):
        if name.lower() in title.lower():
            end = len(lines)
            for level2, j, _ in hs[idx + 1:]:
                if level2 <= level:
                    end = j
                    break
            return lines[i + 1:end]
    return None


def nonblank(lines):
    return [l for l in (lines or []) if l.strip()]


def common_findings(text, findings):
    lines = text.splitlines()
    if not lines or not re.match(r"^#\s+\S", lines[0]):
        findings.append("no H1 title on the first line")
    for i, line in enumerate(lines):
        if PLACEHOLDER.search(line):
            findings.append(f"placeholder marker on line {i + 1}: {line.strip()!r}")
    hs = headings(text)
    for idx, (level, i, title) in enumerate(hs):
        end = len(lines)
        for level2, j, _ in hs[idx + 1:]:
            if level2 <= level:
                end = j
                break
        body = lines[i + 1:end]
        if not nonblank(body):
            findings.append(f"empty section: {title!r}")


def check_quiz(text, findings):
    key = section_body(text, "answer key")
    if key is None:
        findings.append("missing Answer key section")
        return
    questions = {m.group(1) for m in (QUESTION.match(l) for l in text.splitlines()) if m}
    answers = {m.group(1) for m in (ANSWER.match(l) for l in key) if m}
    if not questions:
        findings.append("no questions found (expected ### Q<n>. headings)")
    for q in sorted(questions - answers, key=int):
        findings.append(f"Q{q} has no answer-key entry")
    for a in sorted(answers - questions, key=int):
        findings.append(f"answer key has Q{a} but no such question")
    if not nonblank(section_body(text, "instructions")):
        findings.append("empty or missing Instructions section")


def check_assignment(text, findings):
    if section_body(text, "rubric") is None:
        findings.append("missing Rubric section")
    else:
        rows = [l for l in section_body(text, "rubric") if TABLE_ROW.match(l)]
        if len(rows) < 3:
            findings.append("rubric table needs a header row, a separator, and at least one criterion row")
    if not nonblank(section_body(text, "deliverables")):
        findings.append("empty or missing Deliverables section")
    if not nonblank(section_body(text, "due")):
        findings.append("empty or missing Due section")


def check_case_study(text, findings):
    dq = section_body(text, "discussion questions")
    if dq is None:
        findings.append("missing Discussion questions section")
    else:
        items = [l for l in dq if NUMBERED.match(l)]
        if len(items) < 2:
            findings.append("at least two numbered discussion questions required")
    if not nonblank(section_body(text, "facilitation notes")):
        findings.append("empty or missing Facilitation notes section")


def check_handout(text, findings):
    terms = section_body(text, "key terms")
    if terms is None:
        findings.append("missing Key terms section")
    elif not any(BULLET.match(l) for l in terms):
        findings.append("Key terms section needs at least one bulleted term")
    h2s = [h for h in headings(text) if h[0] == 2]
    if len(h2s) < 3:
        findings.append("a handout needs at least three sections (Purpose, Key terms, and one more)")


def check_worksheet(text, findings):
    if not nonblank(section_body(text, "instructions")):
        findings.append("empty or missing Instructions section")
    exercises = [l for l in text.splitlines() if EXERCISE.match(l)]
    if len(exercises) < 3:
        findings.append("a worksheet needs at least three numbered exercises (### 1. ...)")


def check_profile(text, findings):
    lo = section_body(text, "learning outcomes")
    if lo is None:
        findings.append("missing Learning outcomes section")
    elif not any(NUMBERED.match(l) for l in lo):
        findings.append("Learning outcomes needs at least one numbered outcome")
    if not nonblank(section_body(text, "audience")):
        findings.append("empty or missing Audience section")
    if section_body(text, "assessment mix") is None:
        findings.append("missing Assessment mix section")


CHECKS = {
    "quiz": check_quiz,
    "assignment": check_assignment,
    "case-study": check_case_study,
    "handout": check_handout,
    "worksheet": check_worksheet,
    "profile": check_profile,
}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--type", required=True, choices=TYPES)
    ap.add_argument("file")
    args = ap.parse_args()

    path = Path(args.file)
    if not path.is_file():
        print(f"error: no such file: {path}", file=sys.stderr)
        return 1
    text = path.read_text(encoding="utf-8")

    findings = []
    common_findings(text, findings)
    CHECKS[args.type](text, findings)

    if findings:
        for f in findings:
            print(f"finding: {f}")
        return 1
    print(f"ok: {args.type} {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
