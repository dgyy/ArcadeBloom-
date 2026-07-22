# Repository Guidelines

## What this site is
ArcadeBloom is an **outbound-link game directory** — we review browser games and link to each author's own site. We do not host third-party games. Every catalogue entry must have a verifiable source (author, play URL, licence). See `CONTEXT.md` and `docs/adr/` for the positioning decisions.

## Project Structure & Module Organization
- `src/` is the Eleventy source. `src/_data/` holds the catalogue (`games.js`, `tags.js`, `site.js`); `src/_includes/` holds Nunjucks layout fragments; `src/*.njk` are page templates.
- `.eleventy.js` configures the build: Nunjucks templates, custom filters (`whereEq`, `sortByDateDesc`, `paragraphs`, `toJSON`, etc.), the `populatedTags` collection, and clean-URL output.
- `dist/` is the build output (gitignored). Deploy this directory.
- `scripts/` holds the data pipeline: `fetch-js13k.js` + `build-catalogue.js` (js13k import), `fetch-leereilly.js` + `merge-leereilly.js` (open-source browser games), `write-games-js.js` (regenerate `games.js`), and `validate-data.js` (schema checks).
- `docs/adr/` records architectural decisions. `CONTEXT.md` is the domain glossary. Both are authoritative — read them before non-trivial changes.
- Legacy files (`games/`, `index.html` at root, `game-detail.html`, `js/`, `games-data.js`, `all-games.html`, etc.) are **retired** and scheduled for deletion after the cutover. Do not edit them.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run serve` — build CSS + Eleventy dev server with live reload.
- `npm run build` — runs `validate:strict` first, then clean + CSS + screenshots + Eleventy renders to `dist/`.
- `npm run build:css` — compile Tailwind only (JIT scans `src/**/*.njk` per `tailwind.config.js`).
- `npm run validate` — audit mode: schema checks (slug uniqueness, category/tags in controlled vocab, required fields, no legacy `plays`/`rating`/`gameUrl`) plus advisory warnings. **Must pass before commit.**
- `npm run validate:strict` — strict mode: structural warnings (duplicate URLs, missing gameplay tags, `licenceStatus`/`sourceKey` presence+consistency, id monotonicity) escalate to blocking errors. This is the gate bot-generated PRs are held to; the CI workflow (`.github/workflows/ci.yml`) runs it on every PR. Content-quality warnings (word count, placeholder wording) stay advisory in both modes.
- `npm test` — rebuild + run Playwright smoke tests against `dist/` (served by `http-server`).

CSS is **not** loaded from the Tailwind CDN — it is compiled at build time into `/css/styles.css` (16KB minified). Editing styles means changing `src/styles/styles.css` (Tailwind directives + custom design tokens) and rebuilding; do not re-introduce `<script src="cdn.tailwindcss.com">` (it causes FOUC and a production warning).

Local preview without Eleventy: serve `dist/` after building — `npx http-server dist -p 4173`.

## Coding Style & Naming Conventions
- Four-space indentation in HTML/JS; Tailwind utility classes grouped semantically (layout → color → effects).
- Kebab-case for slugs, file names, and tag references. A game's `slug` equals its URL fragment (`/game/<slug>/`).
- Metadata: titles in Title Case, descriptions in sentence case, tags from the controlled vocabulary only (never free-text).

## Catalogue Schema (authoritative — see `src/_data/games.js` header)
```
id, slug, name, category, tagline, about, howToPlay, keyFeatures[],
screenshots[], sourceName, sourceUrl, licence, tags[], addedDate, releaseDate, featured
```
**Removed vs legacy:** `plays`, `rating`, `image`, `gameUrl` (fabricated data / self-hosting fields — per ADR-0001, never re-introduce).

## Adding Games
1. Append to `src/_data/games.js` (or run the import scripts for bulk sources).
2. Fill every schema field. `category` ∈ the 6 in `site.js`; `tags` ∈ the controlled vocab in `tags.js`; `sourceUrl` is always an outbound link.
3. Run `npm run validate` — zero errors required.
4. Run `npm run build` — the detail page, sitemap, and tag pages regenerate automatically.
5. Thin-content guards: categories need ≥20 games to appear in the nav; tags need ≥8 games to generate a page.

## Testing Guidelines
- `npm run validate` + `npm test` must pass before commit. The smoke suite checks: no console errors, outbound CTAs carry `rel="noopener nofollow"`, content visible without JS, no legacy iframe/fake-data artifacts, and SEO essentials (canonical, JSON-LD, sitemap, noindex on `/search/`).
- Store Playwright HTML reports under `test-results/html-report/` date-stamped when running full sweeps.

## Commit & Pull Request Guidelines
- Short imperative subject lines under 50 chars; prefer English unless the change is language-specific.
- PR body must list touched pages/games and explicitly call out any `games-data.js`/`games.js` catalogue changes for metadata review.
- For UI changes, attach before/after screenshots.

## Deployment
- Target: **Cloudflare Pages**, deploying `dist/` from the `main` branch.
- Build command: `npm run build`. Output directory: `dist`.
- `_redirects` (in `src/static/`, copied to `dist/`) handles legacy-URL retirement (410 Gone for removed content, 301 for moved static pages).
- Clean URLs work by default: Cloudflare Pages resolves `/game/<slug>/` to `/game/<slug>/index.html`.

## Agent skills

### Issue tracker

Issues live as GitHub issues; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles map 1:1 to GitHub labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
