# Circle Club hosting exception

Accepted 2026-09-17 at the site owner's explicit request to host the supplied game and prominently list it.

Circle Club is served as a standalone static game at `/play/circle-club/`, with its directory entry at `/game/circle-club/`. Its production source lives in `src/static/play/circle-club/`. The supplied files were found in `games/病毒式传播网站/` (the requested `evidence/games/` was empty); those originals are untouched. Only runtime assets are published, without the development server or tests.

This narrowly amends ADR-0001/0011: third-party catalogue games remain outbound links. An exact identity, slug and URL allowlist in `scripts/lib/hosted-games.js` permits this entry through the shared content policy. The same description and duplicate gates still apply. Local play links do not emit outbound click analytics. The homepage gives the game a dedicated first-screen feature; featured, category, new and search discovery also include it.

The owner authorized hosting the supplied files. No separate author identity, public reuse licence or AI disclosure was supplied: credit the Circle Club project, use NOASSERTION and omit AI labels. This does not grant visitors a redistribution licence. Records remain in browser localStorage. Challenge scores are unverified URL parameters, not a leaderboard.

Asset references are relative to the game path; shared links preserve that path. No iframe or retired `/games/` route is restored. Deployment follows the existing Pages build and publication process.

`src/static/media/circle-club.png` is a browser capture of the supplied game for catalogue cards, not an externally copied image.
