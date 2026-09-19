# ArcadeBloom

> Discover indie browser games, game-jam surprises and AI experiments. Read a short introduction, then play at the creator's site.

🌐 **Live site**: [arcadebloom.com](https://arcadebloom.com)

## What this is

ArcadeBloom is an **outbound game directory** focused on independent projects and unusual ideas. Each game page introduces the game, explains how to begin, credits its creator and links to the official play URL. Third-party games generally stay with their creators. Circle Club is an owner-authorized hosting exception, playable directly on ArcadeBloom (see [ADR-0013](docs/adr/0013-circle-club-hosting.md)).

The [AI games section](https://arcadebloom.com/ai-games/) distinguishes AI during gameplay from AI-assisted creation, using creator disclosures. `/submit/` prepares a local email draft for game suggestions. The current product decision is [ADR-0011](docs/adr/0011-indie-and-ai-game-directory.md); gameplay assessments and the former trust index are retired.

The catalogue spans six categories — Puzzle, Action, Arcade, Strategy, Racing & Sports, Simulation — seeded from:
- **js13kGames** competition entries (2012–2025, 2483 entries total)
- **Open-source GitHub** game collections
- **Independent author sites** (hextris.io, proxx.app, etc.)

## Play Circle Club

[Play Circle Club](https://arcadebloom.com/play/circle-club/) · [Game details](https://arcadebloom.com/game/circle-club/)

Draw one circle with a mouse, touch or keyboard, then release to see your score. Free draw and a daily target-size challenge are available without an account. The latest thirty scores stay in browser localStorage; challenge links carry a score and mode, plus the date for daily challenges. Shared scores are not a verified leaderboard.

The game is available in the homepage's hosted-game section and the complete `/play/` library, as well as directory discovery and search.

- Runtime files: `src/static/play/circle-club/`, copied into `dist/play/circle-club/` by Eleventy. Maintain this production copy; the original supplied `games/` folder is not a build input.
- Catalogue entry: `circle-club` in `src/_data/games.js`; screenshot: `src/static/media/circle-club.png`.
- Hosting policy: `scripts/lib/hosted-games.js` allows only the exact approved identity, slug and URL. Other catalogue games keep outbound Play links.
- Keep game asset paths relative so the game and its shared links work under `/play/circle-club/`. Local Play actions do not emit outbound-click analytics.
- Regression coverage: `tests/hosted-game.spec.js` checks discovery, drawing, scoring, sharing, mobile layout and the hosting exception.

No public reuse licence or AI disclosure was supplied for Circle Club. Its catalogue licence is `NOASSERTION`; hosting permission does not grant redistribution rights.

## More games hosted here

[Pulse Lock](https://arcadebloom.com/play/pulse-lock/) is a twenty-round timing challenge with narrowing windows, late shifting targets, precision scoring, chain multipliers and three lives. [Echo Vault](https://arcadebloom.com/play/echo-vault/) is a twelve-chamber memory challenge with three-to-nine tile sequences, reverse and mirror recall, and optional replays.

Both include UTC daily courses, fresh practice runs, same-course friend links, PNG score cards, local records, keyboard/touch support and optional synthesized audio. Source and maintenance instructions are in [games/README.md](games/README.md). Eleventy copies the named runtime files directly, so changes also work with `npm run serve`. See [ADR-0014](docs/adr/0014-shareable-hosted-games.md). Shareable mechanics do not guarantee viral growth.

## Homepage discovery

The homepage leads with one hosted game, then up to four other hosted games, four editorial picks, interest navigation and six recent additions. The full hosted library is at `/play/`. Hosted entries are derived from the approved hosting rules and do not repeat in the homepage's directory sections.

Homepage artwork shows gameplay elements rather than full-page screenshots. To refresh the built-in games' board images, serve a local build and run `node scripts/capture-home-boards.js http://127.0.0.1:4174`, then rebuild. Catalogue records and indexability policy are unchanged.

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
npm run build       # strict validation + CSS + assets + Eleventy → dist/
npm run serve       # dev server with live reload
npm run validate    # validate catalogue schema
npm test            # build + Playwright regression suite
```

Preview an existing build: `npx http-server dist -p 4173`, then open `http://localhost:4173/play/circle-club/` to play locally.

## Project structure

```
src/
├── _data/          # games.js, tags.js, site.js (catalogue + config)
├── _includes/      # base.njk, game-card.njk, ad-banner.njk
├── *.njk           # page templates (index, game, category, tag, ...)
└── static/         # static assets, robots.txt, headers, llms.txt
    ├── play/circle-club/ # standalone hosted game
    └── media/      # checked-in Circle Club screenshot
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
- **ADR-0012**: Content-qualified discovery and source archives
- **ADR-0013**: Circle Club hosting exception and prominent directory placement

See [`CONTEXT.md`](CONTEXT.md) for the current domain glossary and [implementation notes](docs/directory-launch-2026-09-06.md) for this change. Older growth plans describe the previous direction.

## Licence

**Code** is MIT licensed — see [LICENSE](LICENSE). This includes templates, build scripts, data pipeline, and tests.

**Content is NOT open source** — see [CONTENT-LICENSE.md](CONTENT-LICENSE.md):
- `src/_data/games.js` (introductions, how-to-play guides) — editorial content, all rights reserved
- `src/static/screenshots/` — belongs to respective game authors (downloaded at build time, not committed)
- Brand assets (logo, og-image, favicon) — not for redistribution
- `src/static/play/circle-club/` and `src/static/media/circle-club.png` — no public reuse licence declared; excluded from the site-code MIT grant

If you fork this repo, you may copy the architecture and code, but you must write your own catalogue content. Do not copy the descriptions or redistribute the screenshots.

Each catalogued game retains its own licence (recorded per entry in `games.js`).
