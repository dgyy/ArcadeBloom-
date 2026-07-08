# Six fixed top-level categories for the ArcadeBloom directory

## Status
accepted

## Context
The legacy `action / puzzle / casual / sports` taxonomy was discarded with the legacy catalogue (ADR-0001). The outbound-only directory needs a new top-level category set that (a) covers the actual gameplay types produced by the seed sources (open-source GitHub collections, independent author sites, js13k jam entries), (b) keeps each category populated enough to avoid thin empty-shell pages, and (c) maps onto SEO keywords with real search volume.

The category set is an **enumerated dependency**: URL paths, breadcrumb JSON-LD, the nav bar, the sitemap, and every game entry's `category` field all reference it by name. Adding/removing/renaming a category later means rewriting all category landing pages and every game entry that references it.

## Decision
Fix the top-level category set at six:

1. **Puzzle** — logic / sudoku / match / spatial reasoning
2. **Action** — action / shooter / fighting / reflex
3. **Arcade** — classic arcade / retro / score-attack (the primary bucket for js13k jam entries and open-source collection ports)
4. **Strategy** — strategy / tower-defense / tactics / resource management
5. **Racing & Sports** — racing + sports **merged** into one category
6. **Simulation** — simulation / management / idle / sandbox

Slugs (lowercase, kebab-case, no ampersand): `puzzle`, `action`, `arcade`, `strategy`, `racing-sports`, `simulation`.

## Considered Options
- **Six categories (chosen)** — fits Miller's 7±2 nav-bar memory limit; every category has enough seed material to avoid thin pages; "Arcade" separated from "Action" because the jam/collection seed pool is heavily retro-arcade and would otherwise drown Action; "Racing & Sports" merged because neither alone has enough volume at launch (directly fixes the legacy "sports = 11 entries" failure).
- **Eight categories (Puzzle / Action / Arcade / Strategy / Racing / Sports / Adventure / Simulation)** — more SEO surface, but Racing and Sports alone would be thin at launch and risk "empty category" penalties. Rejected; can be split later if volume grows (Racing & Sports → split is a reversible refinement).
- **Four categories (Puzzle / Action / Strategy / Arcade)** — cleanest nav, but abandons Simulation and Racing/Sports SEO keywords entirely. Rejected for long-tail coverage.

## Consequences
- **Adding a category is a breaking change** (URLs, breadcrumbs, every game entry, nav, sitemap). Treat this set as versioned. If we split "Racing & Sports" or add "Adventure" later, do it as an explicit superseding ADR.
- Adventure/RPG live **under Action or Simulation** at launch, surfaced via tags (e.g. `adventure`, `rpg`), not as top-level categories. This keeps the top level at six.
- Racing & Sports being merged is a deliberate launch-state decision, not a permanent claim that they're the same genre — it's a volume pragmatism. Document any future split as a new ADR.
- All six category landing pages must launch with ≥20 seeded entries each, or the category is held back until seeded. No empty categories ship — that was the legacy failure mode.
