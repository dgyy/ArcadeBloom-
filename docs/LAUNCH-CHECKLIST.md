# ArcadeBloom Launch Checklist

Pre-deploy gates that have already passed (automated):
- [x] `npm run validate` — 3000 games, schema clean (warnings only: all 6 categories now meet the 20-game threshold)
- [x] `npm run build` — 416 files generated in 0.53s
- [x] `npm test` — 30/30 smoke tests pass

The items below are **human-verified** — they cannot be automated because they
require judgement or external services.

## A. Before first deploy

- [ ] **Read `docs/adr/` and `CONTEXT.md`** — confirm you agree with the positioning (outbound directory, no hosting) and the six-category taxonomy before this goes live. These are hard to reverse.
- [ ] **Decide on the cutover timing** — pick a low-traffic window. Once `/game-detail.html` starts returning 410, the old site is gone.
- [ ] **Back up the current site** — the legacy `games/`, `games-data.js`, and root HTML files are scheduled for deletion. `git` history preserves them, but confirm you can check out the pre-cutover state if needed (`git log --oneline` shows the last legacy commit).

## B. Cloudflare Pages setup (one-time)

- [ ] **Connect repo** → `dgyy/ArcadeBloom-` → branch `main` (per `docs/DEPLOYMENT.md`)
- [ ] **Build command**: `npm run build`
- [ ] **Output directory**: `dist`
- [ ] **Env var**: `NODE_VERSION=18` (or 20)
- [ ] **Custom domain**: `arcadebloom.com` bound to this Pages project (DNS CNAME or Cloudflare-managed)
- [ ] **First preview build passes** before promoting to production

## C. Post-deploy verification (the cutover)

Run these against the live `https://arcadebloom.com/`:

- [ ] Home loads: `/` shows hero + category cards + featured + new rails
- [ ] Sample game page: `/game/hextris/` shows About, How to Play, outbound CTA (`Play on Hextris →`), Source & Licence block
- [ ] Category page: `/category/arcade/` lists games; `/category/puzzle/` lists games
- [ ] Tag page: `/tag/13kb/` lists games (300+)
- [ ] Search works: `/search/?q=tetris` returns client-side filtered results
- [ ] **Legacy 410**: `curl -I https://arcadebloom.com/game-detail.html?slug=anything` → `HTTP 410`
- [ ] **Legacy 410**: `curl -I https://arcadebloom.com/all-games.html` → `HTTP 410`
- [ ] **Moved 301**: `curl -I https://arcadebloom.com/about.html` → `HTTP 301` Location `/about/`
- [ ] **404 page**: `https://arcadebloom.com/nonexistent` shows the friendly 404
- [ ] **sitemap.xml** reachable and lists games: `curl https://arcadebloom.com/sitemap.xml | grep -c '<loc>'` (expect ~400)
- [ ] **robots.txt** points to sitemap: `curl https://arcadebloom.com/robots.txt`

## D. SEO submission (after cutover, within 24h)

- [ ] **Google Search Console**: add/verify `arcadebloom.com` property
- [ ] **Submit sitemap**: `https://arcadebloom.com/sitemap.xml`
- [ ] **Request re-crawl** of `/` (home)
- [ ] **URL inspection**: test a sample game page (e.g. `/game/hextris/`) — confirm "URL can be indexed" and live-test renders content
- [ ] **Monitor coverage report** over next 1-4 weeks: old `game-detail.html` URLs should drop from index as 410s propagate; new `/game/<slug>/` URLs should appear

## E. Content follow-ups (not blocking launch)

These improve the site but do not block going live:

- [ ] **Phase B reviews**: rewrite the 3000 games' `about`/`howToPlay` from factual placeholders into original reviews, starting with award winners
- [x] **Screenshots**: bulk-downloaded `https://play.js13kgames.com/{slug}/.c.jpg` for the 300 js13k games; 228/3000 games now carry real screenshots (72 js13k entries had no screenshot and keep the CSS placeholder; 89 non-js13k entries have no batch source yet)
- [x] **OG image**: real `og-image.png` (1200×630) generated from `src/static/og-image.svg` via `scripts/render-images.js`
- [x] **favicon**: real `favicon.ico` (32×32) + `favicon.svg` + `apple-touch-icon.png` (180×180) generated from `src/static/favicon.svg`
- [ ] **Screenshots for non-js13k games**: the 6 hand-authored + 83 leereilly games need manual screenshot capture (no batch source)
- [ ] **Category seeding**: add real games to action/strategy/simulation/racing-sports until each reaches 20 (currently 9/15/9/3) so they graduate out of "seeding" state
- [ ] **Analytics**: wire up privacy-respecting analytics (Plausible/Umami) — the site currently has none

## F. Legacy cleanup (after stable deploy, separate commit)

After the new site has been live and stable for ~1 week and old URLs are confirmed 410ing:

- [ ] Delete `games/`, `game-detail.html`, `all-games.html`, `js13k2023.html`, `batch-generator.html.html`, `add-game.html`, old root `index.html`, `js/`, `games-data.js`, `games.xlsx`, `sitemaps/`
- [ ] Review `pic/` (463 old logos) — keep only any still referenced, delete the rest
- [ ] Commit with message like "remove retired legacy catalogue"
