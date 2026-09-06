# ArcadeBloom

> Discover indie browser games, game-jam surprises and AI experiments. Read a short introduction, then play at the creator's site.

🌐 **Live site**: [arcadebloom.com](https://arcadebloom.com)

## What this is

ArcadeBloom is an **outbound game directory** focused on independent projects and unusual ideas. Each game page introduces the game, explains how to begin, credits its creator and links to the official play URL. Third-party games stay with their creators.

The [AI games section](https://arcadebloom.com/ai-games/) distinguishes AI during gameplay from AI-assisted creation, using creator disclosures. `/submit/` prepares a local email draft for game suggestions. The current product decision is [ADR-0011](docs/adr/0011-indie-and-ai-game-directory.md); gameplay assessments and the former trust index are retired.

The catalogue spans six categories — Puzzle, Action, Arcade, Strategy, Racing & Sports, Simulation — seeded from:
- **js13kGames** competition entries (2012–2025, 2483 entries total)
- **Open-source GitHub** game collections
- **Independent author sites** (hextris.io, proxx.app, etc.)

## Tech stack

- **[Eleventy](https://www.11ty.dev/)** — complete static HTML for content pages
- **Tailwind CSS** — compiled at build time (16KB minified, no CDN)
- **Playwright** — smoke and regression tests (discovery, submission, no-JS visibility, SEO)
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
npm test            # build + Playwright regression suite
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
- **ADR-0011**: Indie and AI directory, lightweight listing checks and content-based indexing

See [`CONTEXT.md`](CONTEXT.md) for the current domain glossary and [implementation notes](docs/directory-launch-2026-09-06.md) for this change. Older growth plans describe the previous direction.

## Licence

**Code** is MIT licensed — see [LICENSE](LICENSE). This includes templates, build scripts, data pipeline, and tests.

**Content is NOT open source** — see [CONTENT-LICENSE.md](CONTENT-LICENSE.md):
- `src/_data/games.js` (introductions, how-to-play guides) — editorial content, all rights reserved
- `src/static/screenshots/` — belongs to respective game authors (downloaded at build time, not committed)
- Brand assets (logo, og-image, favicon) — not for redistribution

If you fork this repo, you may copy the architecture and code, but you must write your own catalogue content. Do not copy the descriptions or redistribute the screenshots.

Each catalogued game retains its own licence (recorded per entry in `games.js`).
