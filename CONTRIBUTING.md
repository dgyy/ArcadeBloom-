# Contributing to ArcadeBloom

Thanks for your interest in contributing! ArcadeBloom is a curated game directory — contributions that improve the code, data pipeline, or site quality are welcome.

## What you can contribute

### Code contributions (MIT licensed)
- Bug fixes in templates, build scripts, or the data pipeline
- Performance improvements (build speed, CSS size, page load)
- New features (pagination, sorting, search improvements)
- Test coverage improvements

### Content contributions (see CONTENT-LICENSE.md)
- **Game reviews**: if you've played a game and can write an honest 150-250 word review, contributions to `games.js` are welcome. Include your review as a PR with the `about` and `howToPlay` fields filled.
- **New game submissions**: must include verifiable `sourceName`, `sourceUrl`, and `licence`. No hosting links — only outbound links to the author's site.
- **Screenshot capture**: for games without a js13k screenshot, a manually captured screenshot is welcome (must be your own capture, not copied from another site).

## Before you submit a PR

1. **Run validation**: `npm run validate` — zero errors required.
2. **Run tests**: `npm test` — all 30 smoke tests must pass.
3. **Check the build**: `npm run build` — must complete without errors.
4. **Content PRs**: explicitly mention in the PR body that you're adding/modifying catalogue content, so reviewers can check source attribution.

## What NOT to contribute

- **Fabricated data**: no invented play counts, ratings, or reviews. This was the downfall of the old site — see ADR-0001.
- **Self-hosted game links**: ArcadeBloom links out, never hosts. `sourceUrl` must point to the author's own site.
- **Games without verifiable sources**: every entry needs a real author, URL, and licence.
- **Copied content**: reviews must be original. Quoting a game's README for factual details (controls, mechanics) is fine; copying another review site's text is not.

## Adding a game

1. Append to `src/_data/games.js` with all schema fields filled.
2. `category` must be one of the six in `src/_data/site.js`.
3. `tags` must be from the controlled vocabulary in `src/_data/tags.js` (3-5 tags).
4. `sourceUrl` must be an outbound link to the author's site.
5. Run `npm run validate` — zero errors.
6. Run `npm run build` — the detail page, sitemap, and tag pages regenerate automatically.

## Development setup

```bash
npm install
npm run serve   # dev server at http://localhost:8080
```

## Code style

- Four-space indentation in HTML/JS
- Kebab-case for slugs and file names
- Tags from controlled vocabulary only (never free-text)
- Titles in Title Case, descriptions in sentence case
