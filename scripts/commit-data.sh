#!/usr/bin/env bash
set -euo pipefail

data_file="$1"
commit_message="$2"

git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'
git add --force -- "$data_file"

if git diff --cached --quiet; then
  echo "No data changes to commit"
  exit 0
fi

git commit -m "$commit_message"

# Shared workflow concurrency serializes data updates. Rebase also handles a
# human push after checkout; bounded retries handle transient GitHub failures.
for attempt in 1 2 3; do
  git pull --rebase origin main
  if git push origin HEAD:main; then
    exit 0
  fi
  if [ "$attempt" -lt 3 ]; then
    sleep "$((attempt * 5))"
  fi
done

echo 'Unable to push updated data after three attempts' >&2
exit 1
