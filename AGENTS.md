# Repository Guidelines

## Project Structure & Module Organization
ArcadeBloom is a static browser-game portal. Core landing flows live in `index.html`, `all-games.html`, `game-detail.html`, plus marketing pages `about.html`, `contact.html`, `privacy.html`, and `terms.html`. Gameplay metadata is centralized in `games-data.js`; update `GAMES_DATABASE` entries instead of touching HTML. Individual embed builds live under `games/` (for example `games/Chronotron.html`) and should remain self-contained. Shared art assets are stored in `pic/logo/`; reuse existing naming to avoid broken references. SEO artifacts (`sitemap.xml`, `robots.txt`, `manifest.json`) sit at the root and must be regenerated if URLs change.

## Build, Test, and Development Commands
The site ships as static files; no bundler is required. Launch a local server to avoid CORS issues: `npx serve .` or `python -m http.server 8000` from the repo root. Use the same commands when spot-checking updates to embedded games inside `games/`.

## Coding Style & Naming Conventions
Follow the existing 4-space indentation in HTML and JavaScript. Keep HTML tags semantic (header/nav/main/footer) and attributes lowercase with double quotes. In `games-data.js`, append new entries to `GAMES_DATABASE` using consistent property order (`id`, `name`, `slug`, `image`, `description`, `instructions`, `releaseDate`, `rating`, `plays`, `featured`, `tags`, `gameUrl`). Give slugs hyphenated names (for example `slug: "space-rally"`). Always include trailing commas to preserve diff clarity.

## Testing Guidelines
Manual verification is required. After changes, refresh the dev server and confirm: homepage cards render, `all-games.html` search returns the new title, and `game-detail.html?slug=<slug>` loads without console errors. For new standalone game files, smoke-test controls and responsive layout in both desktop and mobile emulation.

## Commit & Pull Request Guidelines
Commits in this repo are short imperative statements, often Chinese (see commit 7d4bcfe). Use that tone or a concise English equivalent. Each commit should reflect a single logical change and reference updated files in the body if context helps. Pull requests should include: summary of the change, manual test notes, affected pages, and before/after screenshots when UI shifts. Link to any tracking issue and call out SEO-impacting edits explicitly.

## Content Updates
When adding games, reuse images under `pic/logo/` (`<game>.png`) and compress to web-friendly sizes. Confirm new entries keep `featured` balanced (<=6 true values) and update marketing copy in `about.html` or `contact.html` only through coordinated content reviews.

