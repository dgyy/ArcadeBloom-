# Repository Guidelines

## Project Structure & Module Organization
- Root pages (`index.html`, `all-games.html`, `game-detail.html`, etc.) power the catalog and marketing experience; update shared components in-place to keep styling coherent.
- `games/` contains individual game builds. Many are single HTML exports; some (for example `games/keep-calm/`) ship their own Vite/Svelte project and `package.json`. Work in the subfolder that matches the game's `slug`.
- Assets live under `pic/` (logos, hero art) and `test-results/` hosts archived Playwright reports; drop new media beside existing files to keep relative paths stable.
- `games-data.js` is the authoritative catalogue. Append new entries, increment `id`, keep fields ordered as shown, and point `gameUrl` to either an external URL or an in-repo HTML path.

## Build, Test, and Development Commands
- Static pages can be previewed from the repo root with `python -m http.server 4173` (or any local static server). Confirm navigation, search, and modal behaviour in Chromium-based and WebKit browsers.
- Game subprojects expose their own npm scripts. Example: `cd games/keep-calm`, `npm install`, `npm run start` for hot reload, `npm run build` to generate the production bundle, and `npm run lint`/`npm run check` for quality gates.

## Coding Style & Naming Conventions
- Use four-space indentation in HTML/JS files and keep Tailwind utility classes grouped semantically (layout → color → effects) to mirror the existing pages.
- Favour kebab-case for directories and file names, and ensure each `slug` in `games-data.js` matches both the directory under `games/` and the URL fragment.
- Keep metadata concise: titles in Title Case, descriptions in sentence case, and tag arrays in alphabetical order when practical.

## Testing Guidelines
- Before committing, smoke-test new content locally, ensuring featured carousels, search, and detail pages load without console errors.
- Framework-based games must pass `npm run build` plus any lint/check scripts they declare; include the resulting `dist` or `build` artefacts if the game relies on them being committed.
- When running end-to-end sweeps, store the Playwright HTML report under `test-results/html-report/` with a date-stamped folder.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative commit style (`change docs`, `sitmap update`); keep subject lines under 50 characters and prefer English unless the change is language-specific.
- Each pull request should summarise scope, list touched pages/games, link tracking issues, and attach before/after screenshots for UI changes.
- Mention any catalogue updates (`games-data.js`) explicitly in the PR body so reviewers can validate the metadata and asset links.
