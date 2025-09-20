# Repository Guidelines

## Project Structure & Module Organization
ArcadeBloom ships as static pages. Core flows live in `index.html`, `all-games.html`, and `game-detail.html`; marketing copy sits in `about.html`, `contact.html`, `privacy.html`, and `terms.html`. Gameplay metadata belongs in `games-data.js`—update `GAMES_DATABASE` entries instead of editing HTML. Individual embeds stay under `games/` (for example `games/Chronotron.html`) and should remain self-contained. Shared logos reside in `pic/logo/`. SEO artifacts (`sitemap.xml`, `robots.txt`, `manifest.json`) sit at the root and must be regenerated if URLs change.

## Build, Test, and Development Commands
- `npx serve .` — launch a local server from the repo root to avoid CORS issues.
- `python -m http.server 8000` — lightweight alternative dev server.
Serve from the project root before opening any `games/*.html` files so embedded assets load correctly.

## Coding Style & Naming Conventions
Use 4-space indentation in HTML and JavaScript. Keep HTML semantic with lowercase tags and double-quoted attributes. In `games-data.js`, append new objects with fields ordered `id`, `name`, `slug`, `image`, `description`, `instructions`, `releaseDate`, `rating`, `plays`, `featured`, `tags`, `gameUrl`, using hyphenated slugs and trailing commas. Reuse existing filenames when adding art under `pic/logo/`.

## Testing Guidelines
Manual verification only. After changes, refresh the dev server and confirm: homepage cards render correctly, `all-games.html` search surfaces new titles, and `game-detail.html?slug=<slug>` loads without console errors. For new embeds, smoke-test controls and layout on desktop and mobile breakpoints.

## Commit & Pull Request Guidelines
Write short imperative commit messages; many in history are Chinese, an equivalent English command is acceptable. Scope each commit to a single logical change. Pull requests should summarize the update, list manual test notes, flag affected pages, and include before/after screenshots for UI tweaks. Call out SEO-impacting edits explicitly and link any tracking issues.

## Content & Asset Updates
When adding games, point metadata to the existing image under `pic/logo/`. Keep the number of `featured: true` entries at or below six to balance the homepage. Compress new assets before committing and coordinate any marketing copy updates in `about.html` or `contact.html` with the content team.
