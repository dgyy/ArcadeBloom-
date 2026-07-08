# ArcadeBloom is a game directory (outbound-link aggregation), not a self-hosted portal

## Status
accepted

## Context
ArcadeBloom's live catalogue (`games-data.js`) contains 372 entries: 366 point at self-hosted single-file HTML builds under `./games/` (many batch-imported from js13k-style jams), and only 5 are true outbound links to the authors' own sites. The owner has repositioned the site as a **真·外链聚合 (outbound-link directory)** — discover/evaluate/navigate, never host third-party code.

That positioning directly conflicts with the legacy self-hosted catalogue. Leaving the 366 as-is would make ArcadeBloom a de-facto game-hosting site with unclear licensing on third-party jam entries, not a directory.

## Decision
1. **ArcadeBloom is a directory only.** Each game page holds original editorial content (intro, how-to-play, screenshots, review). The play action is an outbound link to the author's own site. ArcadeBloom does not host third-party game code.
2. **Wipe the legacy 366 self-hosted entries and rebuild from zero.** The owner has no reliable source/attribution records for them (`games.xlsx` carries only `gameUrl` pointing at `./games/`, no source column; the entries are a mix of jam imports with AI-generated descriptions). Per-entry source discovery across 366 items is not worth the labour, and the catalogue's quality does not justify preservation.
3. `games/` and all `./games/<slug>.html` references are retired. `games-data.js` is rebuilt as an outbound-only catalogue, starting from a curated seed of verifiable-source games.

## Considered Options
- **Wipe all 366 and rebuild from zero (chosen)** — cleanest restart; lets the new information architecture land on a clean foundation; accepts the loss of seed titles/slugs/screenshots as the cost of exiting a low-quality, un-attributed catalogue. The owner confirmed retention isn't a priority.
- **Per-entry outbound-link-or-delist** — preserves salvageable entries, but demands 366 source/licence lookups against a catalogue with no recorded provenance. Rejected: the labour doesn't match the catalogue's value, and the owner doesn't want to invest in triage.
- **Keep self-hosted + add outbound links (hybrid)** — fast, but dilutes the directory positioning, requires two card types / two URL classes / two compliance stories, and re-creates the exact mess we're trying to exit. Rejected.

## Consequences
- The renovation becomes two parallel tracks: (a) **build the new directory IA** (URL/taxonomy/templates), and (b) **seed a fresh outbound catalogue** from a known-good source list. Track (b) replaces the old "migration workflow" — it's now a seeding workflow, not a triage.
- `games-data.js` needs a new field to record source/attribution (e.g. `sourceUrl`, `sourceName`, `licence`) for every outbound entry — separate ADR when that schema is pinned down. No entry ships without a verifiable source.
- Per-entry editorial content (intro + how-to) is the primary content-production surface, since the directory's SEO and value live there.
- The old `games/` tree and `game-detail.html` + `all-games.html` (which render the legacy catalogue) are throwaway. Don't over-invest in refactoring them — they'll be replaced.
