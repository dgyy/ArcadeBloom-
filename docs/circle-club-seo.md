# Circle Club SEO and AI-search content

Implemented 2026-09-17.

## Search intent and canonical URLs

The playable page targets “draw a perfect circle”, “circle drawing game” and Circle Club by describing the actual game. This is a content-intent choice, not a measured keyword-volume claim. The English interface retains English copy; no untranslated language alternates are declared.

- Play: https://arcadebloom.com/play/circle-club/
- Catalogue introduction and licence: https://arcadebloom.com/game/circle-club/
- Share parameters (`score`, `mode`, `day`) resolve to the same parameter-free canonical and Open Graph URL. They still work during gameplay.

The two pages have distinct purposes and self-canonicals; both refer to the same VideoGame entity at `/play/circle-club/#game`. No invented review scores, author identity, release dates or AI-use claims are added.

## Implementation

The standalone HTML supplies title, description, preview controls, absolute Open Graph/Twitter image metadata and JSON-LD describing WebPage, VideoGame, WebSite and publisher. Static instructions explain controls, scoring factors from `game.js`, UTC challenge selection, local storage and editable share scores. This text is visible to visitors and crawlers without opening a JavaScript dialog. No hidden keyword blocks or special instructions to AI systems are used.

The existing root robots file permits crawling; the sitemap already includes play and catalogue URLs. The existing `llms.txt` now acknowledges hosting and links to factual game information. It is a supplemental navigation document, not a recognized ranking requirement or an indexing guarantee.

The requested `games/病毒式传播网站/` copy and production `src/static/play/circle-club/` received matching metadata, guide and style updates. Only the production directory is built by Eleventy; the local supplied folder is not required by CI.

## Verification and measurement

`tests/circle-seo.spec.js` checks static content without JavaScript, canonical handling on shared URLs, structured entity identity, preview-image availability, mobile overflow and root discovery documents. `tests/hosted-game.spec.js` checks drawing, scoring and sharing. HTML reports/screenshots remain under `test-results/`.

After deployment, inspect the play URL in Google Search Console and Bing Webmaster Tools, request a recrawl if needed, and compare impressions/clicks for the game URLs. Use Bing AI Performance where available to observe citations. No search-console submissions, dashboard settings, indexing status or traffic gains are claimed by this implementation. CDN bot access and the public response should be checked after deployment; a local build cannot verify dashboard-level rules.

## Official references checked

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): normal search eligibility, crawlable text and structured data matching visible content; no special AI schema or text file required.
- [Google: structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- [Bing: AI Performance introduction](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview): observation of AI citations, not a promise of visibility.
