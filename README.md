# ArcadeBloom

> A curated directory of **3000 free browser games**. We review web games and link to each author's own site — we do not host third-party games.

🌐 **Live site**: [arcadebloom.com](https://arcadebloom.com)

## What this is

ArcadeBloom is a **game directory**, not a portal. Each game page holds an honest review, a how-to-play guide, key features, and an outbound link to the original author's site where you actually play. No iframe embeds, no re-hosting, no fabricated play counts.

The catalogue spans six categories — Puzzle, Action, Arcade, Strategy, Racing & Sports, Simulation — seeded from:
- **js13kGames** competition entries (2012–2025, 2483 entries total)
- **Open-source GitHub** game collections
- **Independent author sites** (hextris.io, proxx.app, etc.)

## Tech stack

- **[Eleventy](https://www.11ty.dev/)** — static generation, 416 pages in <1s
- **Tailwind CSS** — compiled at build time (16KB minified, no CDN)
- **Playwright** — 30 smoke tests (no console errors, no-JS visibility, SEO essentials)
- **Cloudflare Pages** — deploys `dist/` from `main`

## Data pipeline

The catalogue is built from real, verifiable sources:

```
scripts/fetch-js13k.js     → parse js13k binary {YEAR}.js (2483 entries)
scripts/fetch-leereilly.js → extract playable games from Games-on-GitHub (83 entries)
scripts/build-catalogue.js → classify + tag + query GitHub API for licences
scripts/fetch-screenshots.js → download js13k screenshots (.c.jpg)
scripts/validate-data.js   → schema checks (slug/category/tags/licence)
scripts/write-games-js.js  → regenerate the catalogue from merged data
```

Every entry has a recorded source (author, URL, licence). No fabricated data.

## Getting started

```bash
npm install
npm run build       # build CSS + Eleventy → dist/
npm run serve       # dev server with live reload
npm run validate    # validate catalogue schema
npm test            # build + 30 Playwright smoke tests
```

Preview without building: `npx http-server dist -p 4173`

## Project structure

```
src/
├── _data/          # games.js, tags.js, site.js (catalogue + config)
├── _includes/      # base.njk, game-card.njk, ad-banner.njk
├── *.njk           # page templates (index, game, category, tag, ...)
└── static/         # css, screenshots, robots.txt, _redirects, llms.txt
scripts/            # data pipeline + validation
docs/               # ADRs, deployment guide, growth playbook
tests/              # Playwright smoke suite
```

## Architectural decisions

Key decisions are documented in [`docs/adr/`](docs/adr/):
- **ADR-0001**: Directory positioning (link out, don't host) + legacy catalogue wipe
- **ADR-0002**: Six fixed top-level categories
- **ADR-0003**: Clean directory-style URLs

See [`CONTEXT.md`](CONTEXT.md) for the domain glossary and [`docs/GROWTH-PLAYBOOK.md`](docs/GROWTH-PLAYBOOK.md) for the traffic strategy.

## Licence

**Code** is MIT licensed — see [LICENSE](LICENSE). This includes templates, build scripts, data pipeline, and tests.

**Content is NOT open source** — see [CONTENT-LICENSE.md](CONTENT-LICENSE.md):
- `src/_data/games.js` (reviews, how-to-play guides) — editorial content, all rights reserved
- `src/static/screenshots/` — belongs to respective game authors (downloaded at build time, not committed)
- Brand assets (logo, og-image, favicon) — not for redistribution

If you fork this repo, you may copy the architecture and code, but you must write your own catalogue content. Do not copy the reviews or redistribute the screenshots.

Each catalogued game retains its own licence (recorded per entry in `games.js`).
