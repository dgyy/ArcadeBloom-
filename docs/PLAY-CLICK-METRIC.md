# Play-click aggregate metric

## Status

**Code complete (issue #5); owner configuration required to go live.**
This is the first-party Play-click measurement introduced in
`GROWTH-AUTOMATION-PLAN.md` Phase 0 deliverable 2.

## What was built

| Artifact | Purpose |
| --- | --- |
| `functions/api/play-click.js` | Cloudflare Pages Function — POST-only endpoint. Validates same-origin, slug allowlist, payload size; upserts a daily aggregate row into D1. |
| `src/static/js/play-click.js` | Browser beacon. On click of `[data-play-slug]`, fires `sendBeacon` (or `fetch(keepalive)`) to `/api/play-click` with `{slug, referral_class, device_class}`. Degrades silently; the outbound link still navigates. |
| `src/_includes/play-cta.njk` | Added `data-play-slug="{{ game.slug }}"`. The `href` is unchanged — still the real `sourceUrl` with `rel="noopener nofollow"`. |
| `src/game.njk` | Loads `/js/play-click.js` (deferred) via a new `{% block scripts %}` in `base.njk`. Game pages only. |
| `src/privacy.njk` | New section 5 ("How we count Play clicks") disclosing exactly what is and is not collected. |
| `scripts/build-catalogue-slugs.js` | Emits `src/_data/catalogue-slugs.json` — the static slug allowlist the endpoint validates against. Run by `npm run build`. |
| `tests/smoke.spec.js` | New "Play-click aggregate beacon" describe block: asserts `data-play-slug`, script load, beacon dispatch, and non-load on non-game pages. |

## Storage schema

Only daily aggregate rows are stored. No raw events, no PII.

```sql
CREATE TABLE IF NOT EXISTS play_click_daily (
    day             TEXT NOT NULL,        -- YYYY-MM-DD (UTC)
    game_slug       TEXT NOT NULL,        -- validated against catalogue
    page_path       TEXT NOT NULL,        -- /game/<slug>/
    referral_class  TEXT NOT NULL,        -- google|bing|owned-social|direct
    device_class    TEXT NOT NULL,        -- desktop|tablet|mobile
    click_count     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, game_slug, page_path, referral_class, device_class)
);
```

Never persisted: IP address, cookie, user ID, full referrer URL, user agent,
or any cross-site identifier.

## Owner setup required (cannot be done from code)

These steps need Cloudflare account ownership. Until they are done the
endpoint still responds 202 but stores nothing (graceful degradation).

1. **Create a D1 database** in Cloudflare for the aggregate rows:
   ```
   wrangler d1 create arcadebloom-play-clicks
   ```
   Run the `CREATE TABLE` above against it.

2. **Bind the database** to the Pages project as `DB`:
   - Cloudflare dashboard → Pages project → Settings → Functions →
     D1 database bindings → Add binding.
   - Variable name: `DB`. Database: the one created in step 1.

3. **Set the `SITE_URL` variable** for the same-origin check:
   - Pages project → Settings → Environment variables →
     Add `SITE_URL = https://arcadebloom.com` (Production + Preview).

4. **Add an edge rate-limit rule** to bound abuse (the endpoint already
   caps payload size, validates slug, and rejects cross-origin; rate-limiting
   is the last layer):
   - Cloudflare → Security → WAF → Rate limiting rules.
   - e.g. cap `/api/play-click` at 30 requests / minute / IP.

5. **Verify the acceptance gate**: visit a game page, click Play, and
   confirm the daily aggregate row for that slug incremented by exactly 1
   and contains no PII columns.

## Why the endpoint is POST-only

GET/HEAD return 405. This prevents CSRF via `<img src="/api/play-click">`
and similar. The browser-side beacon uses POST (sendBeacon / fetch keepalive).

## Relationship to advertising (issue #15)

The Play-click metric is anonymous first-party aggregate measurement. It is
**separate** from AdSense data practices. The privacy page states this
explicitly so the anonymous Play count is never used to imply that ads are
anonymous too.
