# ArcadeBloom Domain Glossary

Updated 2026-09-06. Current positioning: ADR-0011. Historical growth and evidence documents describe the previous direction.

## ArcadeBloom

An outbound-link directory of niche browser games: independent projects, game-jam surprises, unusual experiments and AI games. Visitors discover a game, read a short introduction and continue to the creator's site. We do not host third-party games.
Avoid: review platform, trust index, compatibility laboratory, self-hosted game portal.

## Game entry

A game with a stable slug and upstream `sourceKey`, genre and controlled tags, a short introduction, getting-started instructions, features, available screenshots, creator, official play URL, licence information and dates. Unknown licences are `NOASSERTION`; unknown release dates are `unknown`. Never fabricate ratings, play counts, pricing, account requirements, screenshots or provenance.

`src/_data/games.js` is the published catalogue. New entries use monotonic IDs and preserve existing slugs. Retired root HTML, `games/` and `games-data.js` are not current source.

## AI gameplay

AI participates in the experience: generated story responses, conversational characters, semantic judging or other model-driven mechanics. Stored as `ai.types: ['ai-gameplay']`. Conventional pathfinding or scripted opponents alone do not justify this label.

## AI-assisted creation

The creator describes using AI tools to help make code, art, audio or other parts of the game. Stored as `ai.types: ['ai-assisted']`. It does not imply AI runs during play. A game may carry both types. Each `ai` object also includes `note`, an official `sourceUrl` supporting the disclosure, and `checkedDate`. This is source attribution, not a gameplay assessment or a quality score. Omit unknown AI use.

## Listing check

A lightweight check of the official source, creator, licence information, relevant content and duplicates before publishing. AI can help organize sourced descriptions; direct playthrough evidence, model assessment and scoring are not required. Known broken links should be corrected or unlisted. Repeat transient failures before declaring a link unavailable.

## Hosted creator scenarios

A publicly published scenario on a third-party creation platform may be listed separately when it has a stable direct play/share URL and a named creator. Platform landing pages remain separate catalogue entries. Use a platform-scoped `sourceKey` for the scenario and attribute the scenario creator rather than the host. Do not copy platform descriptions or cover art without permission; use `NOASSERTION` when the scenario has no stated licence.

AI Dungeon scenarios are accepted only from their creator or with the creator's explicit permission. They must be Published, use a direct AI Dungeon share URL and carry an Everyone or Teen content rating. Private, Unlisted, Mature and Unrated scenarios are excluded. Discover is not bulk-imported or scraped. The platform's official explanation can support `ai-gameplay`; the catalogue introduction must be independently written from creator-supplied facts.

## Indexable entry

A known catalogue entry passing `scripts/lib/directory-policy.js`: source information, an outbound HTTP(S) URL and useful non-placeholder text. Minimum guards are five words for tagline, 30 for introduction and 10 for getting started. Concise copy is preferred; there is no long-form review target. `directoryStatus: draft|unlisted` excludes the entry; absent status means listed. Strict catalogue validation still blocks malformed entries and duplicate identities/URLs.

The same policy controls robots, sitemap, RSS and Collection membership. Historical evidence and registry states have no indexing effect. Never modify `evidence/index-manifest.json` to grant eligibility.

## Category and tag

The six locked genres are Puzzle, Action, Arcade, Strategy, Racing & Sports, and Simulation (`puzzle`, `action`, `arcade`, `strategy`, `racing-sports`, `simulation`). Tags come from `src/_data/tags.js`, split into gameplay and mood groups. No free-text tags. Categories need 20 games for navigation; tags need eight for a generated page. AI types are independent of genre and do not use the gameplay/mood tag vocabulary.

## Discovery pages

- `/`: picks, latest additions, AI games, genres and a creator submission invitation.
- `/featured/`: selected games, not a rating or fabricated popularity ranking.
- `/new/`: newest by actual `addedDate`.
- `/ai-games/`: AI gameplay and AI-assisted creation, grouped separately. A game may appear in both. Browsable from launch; noindex until eight content-qualified games.
- `/game/<slug>/`: title, introduction, how to begin, available screenshots, AI disclosure where relevant, creator/licence and an outbound Play action.
- `/submit/`: prepares an email draft locally; the visitor sends it. Email instructions work without JavaScript. No database submission is implied.
- `/search/`: client-side discovery over statically accessible game pages; noindex.

## Collection

A themed selection answering a real interest: five to twelve content-qualified games, an introduction, a distinct reason to include each and a useful summary. Avoid duplicate lists and keyword permutations. Gameplay evidence references are not required.

## Platform and publication

Eleventy + Nunjucks + compiled Tailwind; complete static HTML for content pages. Frontmatter must be first in `.njk` files. Cloudflare Pages deploys `dist/` from `main`. Keep outward Play links with `rel="noopener nofollow"`. No iframe copies or Tailwind CDN.

Publication uses PRs with schema, build and Playwright checks. No routine gameplay assessment pipeline. Retired capture/assess/publish workflows are manual archival tools. Self-developed daily games are outside the current scope.

## Attribution, measurement and operating boundaries

Sources include official creator sites, source repositories and jam/itch.io pages. Use verifiable origins rather than competitor distribution portals. Linking to a work does not grant permission to copy its code or images.

Outbound Play clicks are measured anonymously in aggregate; cookies, user profiles and fabricated counts are not part of the directory. Ads stay labelled and separated from Play actions. Detail pages have at most one ad after Source & Licence and before related games. Paid placements never determine editorial selection.

Existing zero-cost and opt-in correspondence constraints remain. Account onboarding, new spending and destructive production changes require relevant authorization; routine work does not. Sending messages to creators is not implied by checking or listing a game.
