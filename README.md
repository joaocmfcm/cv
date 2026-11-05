
# Personal site

```sh
npm ci
npm run dev
npm run build
```

## Goodreads updates

The site reads `public/goodreads-data.json`. The **Update Goodreads Data** workflow
refreshes it daily at 04:17 UTC, or manually from GitHub Actions, using public
Goodreads custom widgets. No API key, cookies, or additional secrets are needed.
The schedule becomes active once the workflow is on `main`.

To refresh locally (Python 3.12 or newer, standard library only):

```sh
python3 scripts/fetch_goodreads.py
npm run test:goodreads
```

The script reads the widget HTML as data; it never executes the supplied JavaScript.
Both shelves must pass validation before the snapshot is atomically replaced.
HTTP/network failures get bounded retries. Unexpected, empty, or incomplete widget
responses fail the update and preserve the previous snapshot. This also means that
intentionally clearing a shelf will require adjusting the empty-shelf guard.
No timestamps are included, so unchanged books produce no commit.

The Goodreads and Strava workflows share a concurrency group and commit helper to
serialize data writes. The helper rebases onto `main` and retries rejected pushes.
Successful data workflows trigger the existing Pages deployment through
`workflow_run`; pushes made by `GITHUB_TOKEN` do not trigger push workflows.
The deployment checks out the latest `main` to include the generated data commit.
Parser, retry, and snapshot tests use saved widget responses and run on PRs,
pushes to `main`, data updates, and deployments without contacting Goodreads.

Widget changes can break the collector. A failed update remains visible in Actions
while the deployed site continues showing the last successfully saved library.
