# Discover indie and AI games through a lightweight outbound directory

## Status

Accepted, 2026-09-06. Explicitly approved by the owner in the product-direction discussion.

## Decision

ArcadeBloom is a niche browser-game aggregation site for independent projects,
game-jam entries, experimental play and AI games. Discovery and useful introductions
are the product. Reviews, ratings, compatibility assessments and a trust index are
not product concepts. An owned daily game is outside this implementation scope.

Third-party games remain outbound links to their creators. The existing six genres,
clean URLs, Eleventy build and attribution requirements remain in force.

AI metadata distinguishes `ai-gameplay` (AI participates in play) and `ai-assisted`
(AI helped production). A game may carry both. Every classification includes a
creator disclosure URL, explanation and source-check date. Unknown AI use is omitted,
never guessed from appearance or conventional scripted opponents. AI is a discovery
dimension, not a seventh genre or an automatic quality ranking.

## Listing and indexing

The listing process checks the official link, creator, available licence information,
duplicates and directory fit. Introductions and getting-started text must be
source-grounded; gameplay capture and model assessment are not required. Unknown
licences use `NOASSERTION` / `noassertion`.

`scripts/lib/directory-policy.js` is shared by game robots, sitemap, RSS and Collection
validation. A known catalogue entry needs attribution and an outbound HTTP(S) URL,
a meaningful tagline (five words), introduction (30 words) and getting-started text
(10 words), without placeholder wording. These are minimum stub guards, not a request
for padded copy. Strict schema and duplicate checks still block builds.
`directoryStatus: draft|unlisted` prevents indexing; omission means listed.

The AI landing page is browsable immediately but remains noindex and outside the
sitemap until eight content-qualified AI games exist. Category/tag thresholds remain
20/8. Search, submissions and deeper pagination remain noindex. Historical manifests,
registry and evidence are retained unchanged as archives, not indexing permissions.

## Submission and publication

`/submit/` prepares a local email draft for `hello@arcadebloom.com`; users explicitly
send through their email app. A no-JavaScript email route remains available. No backend
receipt is claimed and no new paid service is introduced.

Published scenarios hosted on creation platforms can be separate catalogue entries when they have stable direct links and creator attribution. AI Dungeon scenarios use an opt-in route: accept only creator submissions or entries with explicit creator permission, and only at Everyone or Teen rating. Do not bulk-import Discover, reproduce platform copy or reuse cover images without permission. The existing AI Dungeon platform entry remains the umbrella listing; each accepted scenario receives its own platform-scoped identity and direct outbound URL.

Publication still uses small PRs, catalogue checks, Collection checks, build and
Playwright gates. Evidence-record and registry gates are retired from CI. Old
capture/assess/publish automation is manual-only archival tooling, without scheduled
or chained execution. No external communication is sent by this change.

## Superseded decisions

Supersedes ADR-0004, ADR-0006 and ADR-0010. Replaces ADR-0008's evidence-integrity gate
with directory-content and AI-disclosure checks; its PR, deployment and rollback
boundaries remain. Historical growth plans are not instructions to restore reviews
or build an owned game.
