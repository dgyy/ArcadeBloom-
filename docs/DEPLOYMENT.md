# ArcadeBloom Deployment Guide (Cloudflare Pages)

## One-time setup (Cloudflare dashboard)

1. **Create project** → Connect to Git → select `dgyy/ArcadeBloom-` → branch `main`.
2. **Build settings:**
   - Framework preset: `None`
   - Build command: `npm run build` (compiles Tailwind CSS, then runs Eleventy)
   - Build output directory: `dist`
   - Root directory: `/` (leave blank)
   - Node version: `18` or later (set via env var `NODE_VERSION=18`)
3. **Environment variables:**
   - `NODE_VERSION` = `18`
   - (Optional, for catalogue regeneration in CI) `GITHUB_TOKEN` — a fine-grained PAT with `public_repo` read scope, used by `scripts/build-catalogue.js` to fetch licences.
4. **Deploy.** First build runs `npm install && npm run build` and serves `dist/`.

## How the build works

```
npm run build  →  eleventy  →  dist/
                                 ├── /index.html              (home)
                                 ├── /game/<slug>/index.html  (3000 detail pages)
                                 ├── /category/<slug>/        (6 category pages)
                                 ├── /tag/<slug>/             (tag pages, only those ≥8 games)
                                 ├── /featured/ /new/ /search/
                                 ├── /about/ /contact/ /terms/ /privacy/
                                 ├── /404.html /410.html
                                 ├── /sitemap.xml /robots.txt
                                 ├── /_redirects /_headers
                                 └── /favicon.ico
```

## URL behaviour (Cloudflare Pages defaults)

- **Clean URLs work automatically**: `/game/hextris/` resolves to `/game/hextris/index.html`. No rewrite rule needed.
- **Trailing slash**: canonical form. Cloudflare Pages serves directory URLs with trailing slash.
- **`_redirects`** (in `dist/`) handles legacy-URL retirement — see the file for the full 410/301 map.

## Legacy URL retirement (cutover)

Per ADR-0001, the old self-hosted catalogue is permanently removed:

| Old URL | Status | Destination |
|---|---|---|
| `/game-detail.html?slug=*` | 410 | `/410.html` |
| `/all-games.html` | 410 | `/410.html` |
| `/js13k2023.html` | 410 | `/410.html` |
| `/batch-generator.html.html` | 410 | `/410.html` |
| `/add-game.html` | 410 | `/410.html` |
| `/games/*` | 410 | `/410.html` |
| `/about.html` | 301 | `/about/` |
| `/contact.html` | 301 | `/contact/` |
| `/terms.html` | 301 | `/terms/` |
| `/privacy.html` | 301 | `/privacy/` |

410 (not 404) tells Google to drop these from the index immediately — the content is gone for good, not temporarily missing.

## Post-deploy checklist

1. **Smoke-test key paths**: `/`, `/category/arcade/`, `/game/hextris/`, `/search/`, `/featured/`, `/new/`.
2. **Legacy URLs return 410**: `curl -I https://arcadebloom.com/game-detail.html?slug=anything` → `410`.
3. **Moved pages 301**: `curl -I https://arcadebloom.com/about.html` → `301` → `/about/`.
4. **Sitemap reachable**: `curl https://arcadebloom.com/sitemap.xml` returns valid XML listing all games.
5. **robots.txt** points to sitemap.
6. **Google Search Console**: submit `/sitemap.xml`, request re-crawl of `/`. Expect old `game-detail.html` URLs to drop from index over 1-4 weeks as 410s propagate.
7. **Delete legacy files** from repo after confirming deploy is stable (see "Legacy file cleanup" below).

## Legacy file cleanup (after stable deploy)

Once the new site is live and confirmed, these retired files should be deleted from the repo (they are not part of the build and only add weight):

```
games/                          # 368 old self-hosted game dirs
index.html                      # old home (replaced by Eleventy output)
game-detail.html                # old iframe player page
all-games.html                  # old catalogue list
js13k2023.html
batch-generator.html.html
add-game.html
js/                             # homepage.js, game-detail.js (old renderers)
games-data.js                   # old catalogue (301KB, fabricated data)
games.xlsx                      # old catalogue spreadsheet
html5_games_resources.csv       # research scratch file (keep if still useful)
pic/                            # 463 old logos — review, keep only reused ones
sitemaps/                       # old split sitemaps
```

**Do this as a separate commit after deploy**, not before — keep a rollback window.

## Local verification before deploy

```bash
npm run validate          # schema checks pass
npm run build             # builds to dist/
npm test                  # 30 smoke tests pass (auto-builds first)
npx http-server dist -p 4173   # manual click-through at http://localhost:4173
```
