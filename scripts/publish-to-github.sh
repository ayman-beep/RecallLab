#!/usr/bin/env bash
# Publish this repository to a public GitHub repo named "RecallLab".
#
#   ./scripts/publish-to-github.sh <your-github-username>
#
# Requires either the GitHub CLI (`gh auth login`) or an existing push
# credential / SSH key. Run it from the repository root.
set -euo pipefail

REPO_NAME="${REPO_NAME:-RecallLab}"
USERNAME="${1:-}"

if [[ -z "$USERNAME" ]]; then
  echo "usage: $0 <your-github-username>" >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  echo "error: run this from the repository root" >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "→ Creating public repo ${USERNAME}/${REPO_NAME} with the GitHub CLI…"
  gh repo create "${USERNAME}/${REPO_NAME}" --public --source=. --remote=origin --push
else
  REMOTE="https://github.com/${USERNAME}/${REPO_NAME}.git"
  echo "→ GitHub CLI not authenticated."
  echo "  1. Create an empty public repo named ${REPO_NAME} at https://github.com/new"
  echo "  2. Press Enter here once it exists (or Ctrl-C to abort)."
  read -r _
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE"
  else
    git remote add origin "$REMOTE"
  fi
  git push -u origin "$BRANCH"
fi

echo
echo "Done: https://github.com/${USERNAME}/${REPO_NAME}"
echo "Next: Netlify → Add new site → Import an existing project → pick ${REPO_NAME}."
echo "      Build settings are read from netlify.toml (command: npm run build, publish: dist)."
