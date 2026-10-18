#!/usr/bin/env bash
# build.sh — cut the flat release zip from the tracked src/ tree.
#
# Reads the version from src/KI-VERSION, stages the tracked src/ files
# (git archive, so working-tree noise never ships), and zips them flat
# (no top folder) into dist/ki-<version>.zip. The release workflow
# attaches the zip as ki.zip. The manual fallback is documented in the
# repo README.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$root"

version="$(tr -d '[:space:]' < src/KI-VERSION)"
if [ -z "$version" ]; then
  echo "build: src/KI-VERSION is empty" >&2
  exit 1
fi

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT
git archive --format=tar "HEAD:src" | tar -x -C "$stage"

mkdir -p dist
rm -f "dist/ki-$version.zip"
(cd "$stage" && zip -qr "$root/dist/ki-$version.zip" .)
echo "build: dist/ki-$version.zip"
