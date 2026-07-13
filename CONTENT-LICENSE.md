# Content License — ArcadeBloom

> The **source code** of this project is licensed under the MIT License (see
> [LICENSE](./LICENSE)). The **content** — game reviews, screenshots, and the
> catalogue data — is **NOT** covered by MIT and is not open source.

## What is "code" (MIT licensed)

- `.eleventy.js`, `tailwind.config.js`, `playwright.config.js`
- `src/**/*.njk` (templates), `src/_includes/` (layout fragments)
- `src/styles/styles.css` (the Tailwind directives + design tokens)
- `scripts/*.js` (the data pipeline: fetch, build, validate)
- `tests/*.js` (smoke tests)

You may copy, modify, and reuse the code under MIT terms.

## What is "content" (all rights reserved)

The following are **NOT** licensed for reuse under MIT:

- **`src/_data/games.js`** — the game catalogue (reviews, how-to-play guides,
  key features, taglines). Each entry's `about`/`howToPlay` is original
  editorial content or paraphrased from the game author's own README. The
  catalogue is the product of this site; it is not free to copy wholesale.
- **`src/_data/tags.js`** — the controlled tag vocabulary and descriptions.
- **`src/static/screenshots/`** — game screenshots. These belong to the
  respective game authors (downloaded from js13kGames' official CDN). They are
  included here for the site to function; they are not licensed for
  redistribution.
- **`src/static/og-image.*`, `src/static/favicon.*`** — brand assets.

## If you fork this repo

You are welcome to:
- Copy the code architecture, templates, and build pipeline (under MIT).
- Build your own directory site using this codebase.
- Write your own catalogue content for your own games.

You may **not**:
- Copy `games.js` reviews and publish them as your own.
- Redistribute the screenshots from `src/static/screenshots/`.
- Clone the ArcadeBloom brand (logo, og-image, domain).

## Game data attribution

Each game entry in `games.js` records `sourceName`, `sourceUrl`, and `licence`
per entry. The games themselves belong to their respective authors. ArcadeBloom
links to the original sources; it does not host or redistribute game code.
