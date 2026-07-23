# Google Search Console integration (issue #16)

## Status

**Code complete; owner configuration required to populate the weekly report.**
The weekly snapshot (`scripts/build-metrics-snapshot.js`) calls
`scripts/lib/search-console.js` → `collectGSC()`. Without credentials it
degrades gracefully (slot marked `wired: false`).

## Owner setup (cannot be done from code)

1. In Google Cloud, create a service account (e.g. `arcadebloom-gsc-reader`).
2. Enable the **Google Search Console API** for the project.
3. Grant the service account **read-only** access to the
   `arcadebloom.com` domain property in Search Console (Property settings →
   Users and permissions → Add user → Restricted).
4. Download the service account JSON key.
5. Add it as a GitHub encrypted repository secret named `GSC_CREDENTIALS`
   (paste the entire JSON contents). NEVER commit this JSON to the repo.
6. The `growth-report.yml` workflow reads `GSC_CREDENTIALS` at run time and
   passes it to the snapshot script. No other workflow references it.

## Cohort separation (mandatory)

The 2026-07-22 sitemap submission is the **new-site start**. The 1,128
principal excluded URLs at baseline were legacy shapes (`/game-detail...`,
`/games/...`, retired static pages) — NOT the current `/game/<slug>/` pages.

`search-console.js` enforces this:
- every returned row is tagged `cohort: 'new'` or `cohort: 'legacy'`
- legacy rows are excluded from the `newPages` totals
- the `cohortNote` field records the rule in every snapshot

Never merge the two cohorts in trend calculations. The baseline record
(`docs/metrics/baseline-2026-07-22.json`) records the legacy shapes explicitly.

## Credential safety

- `GSC_CREDENTIALS` lives only in GitHub encrypted secrets.
- The script never logs the private key or token. Errors surface only the
  HTTP status, never the credentials.
- The token is scoped to `webmasters.readonly` — no write path exists.
