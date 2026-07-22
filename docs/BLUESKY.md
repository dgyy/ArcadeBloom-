# Bluesky distribution (issue #19)

## Status

**Code complete; owner configuration required to activate.** This is the ONLY
external automatic distribution channel in the 120-day cycle (operating
constraint 8). RSS (#18) is the owned feed; Bluesky mirrors it.

## Owner setup (cannot be done from code)

1. Create the `@arcadebloom.bsky.social` account (or a custom-handle account)
   once. This is the only account — never create alternates.
2. Generate an app password (Settings → App passwords). Do NOT use the main
   password.
3. Add two GitHub encrypted repository secrets:
   - `BLUESKY_HANDLE` (e.g. `arcadebloom.bsky.social`)
   - `BLUESKY_APP_PASSWORD`
   - Optional `BLUESKY_PDS` if using a custom PDS (defaults to bsky.social).
4. The `growth-distribute.yml` workflow reads these at run time. Without them
   it no-ops gracefully.

## Guarantees (enforced in code, tested)

- **Deduplication**: a URL already in the ledger is never reposted.
- **Weekly cap**: at most three posts per ISO week. The fourth is skipped.
- **Post-deploy gate**: triggered by `distribution-ready` from
  `post-deploy.yml` (#14) — a rolled-back deploy never posts.
- **No engagement automation**: the client only calls `createRecord` for
  `app.bsky.feed.post`. It NEVER likes, follows, replies, sends DMs, or
  cross-posts (ADR-0005). There is no code path that does so.

## What gets posted

Only the site's own eligible reviews and Collections (the same eligibility as
the RSS feed, #18). Provisional/grandfathered content is never posted.

## Ledger

`evidence/bluesky-posted.json` (gitignored) records posted URLs + per-week
counts. If it is lost, dedup resets — the cap still holds for the current week.
