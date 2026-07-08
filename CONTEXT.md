# ArcadeBloom Domain Glossary

> Glossary only — no implementation details. Updated as terms resolve during design sessions.

## Core Positioning

### ArcadeBloom
A **game aggregation directory** (真·外链聚合 / catalog site). The site's job is *discovery and curation*: each game page hosts original editorial content (intro, how-to, screenshots, review), and the play action sends the user to the original author's site via an outbound link. ArcadeBloom does **not** host third-party game code.

- **Not**: a self-hosted game portal (Poki/CrazyGames style), not an iframe-wrapper of others' games.
- **Value proposition**: discover → evaluate → navigate to the real source. Think "DiggReader / IMDB / startup-list for web games", not "play everything in one place".

### Legacy self-hosted catalog (遗留问题)
The repo currently contains 366 entries pointing at `./games/<slug>.html` (self-hosted single-file builds, many from js13k-style jams) and only 5 true outbound links. This conflicts with the directory positioning and must be resolved — see ADRs when decisions land.

**Resolution (per ADR-0001):** the legacy 366 are **wiped and rebuilt from zero** as an outbound-only catalogue. The owner has no source/attribution records (`games.xlsx` has no source column) and confirmed retention isn't a priority. `games/`, `game-detail.html`, and the catalogue-rendering `all-games.html` are throwaway — don't refactor them, replace them.

## Page Architecture

### Homepage (首页) — 分类门户式
Static pre-rendered (server-side, crawlers see full HTML — no JS-dependent empty divs):
```
/  (static)
├─ Hero: value proposition + search box
├─ 6 category entry cards (each with intro + game count)
├─ Featured rail (editor picks, 6–8 games)
├─ New rail (latest additions, 8 games)
└─ Footer
```
**Removed:** the legacy `Recently Played` section (depends on localStorage + assumes in-site play — meaningless for an outbound directory where users leave the site on click). **Removed:** the JS-rendered `#new-rail` / `#category-rails` / `#recently-rail` empty-div pattern.

### Static pre-rendering (横切约束 — applies to ALL pages)
Every content page (home, game detail, category, tag, aggregation) must be **statically generated** so crawlers see full HTML without executing JS. The legacy "single template HTML + client-side injection from `games-data.js`" model is dead for content pages. A static-generation step reads the catalogue data and writes complete `index.html` files to each URL directory (per ADR-0003).

This is non-negotiable for an SEO-driven directory: if Google has to run JS to see your content, you've already lost the long tail.

### Build system (起点状态)
**There is no build system today.** No root `package.json`, empty `scripts/`, no SSG. The whole site is hand-written HTML + two client-side renderers (`js/homepage.js`, `js/game-detail.js`) that inject content into empty divs from `games-data.js`. `node_modules` contains only Playwright (test tooling). No CI (`.github/workflows/` empty).

The renovation must **build a static-generation pipeline from scratch** as its first technical milestone — it cannot iterate on existing scripts, because there are no generation scripts to iterate on.

### Static site generator (锁定): Eleventy (11ty)
**Chosen stack:** Eleventy + Nunjucks templates + existing Tailwind (CDN or build) + `games-data.js` as data source. Chosen because: zero client-side JS by default (pure static), lowest learning curve, can reuse existing HTML fragments as templates, fast generation of hundreds of pages, mature SEO-site tooling. Astro rejected (higher learning curve, requires rewriting HTML into `.astro` components). Hand-rolled Node script rejected (reinvents pagination/slug/template wheels).

### Fake-data mechanism (要删除的代码)
The legacy `formatPlays()` in both renderers runs `Math.max(numeric, 20000)` — any play count below 20,000 is silently inflated to 20,000 before display. This is **active fabrication in code**, not just bad data. Combined with the fabricated `plays`/`rating` fields (ADR on aggregation pages), the entire fake-data code path must be deleted in the new build — not "fixed", removed.

### Game entry (游戏条目)
The atomic unit. Fields in `games-data.js`: `id, name, slug, category, image, description, instructions, releaseDate, rating, plays, featured, tags, gameUrl`. **Note:** the schema itself is being redesigned for the outbound-only catalogue (new source/attribution fields) — separate ADR when pinned.

### Game detail page (游戏详情页) — 模板已定
**Fixed editorial template** (per ADR-0004, TBD numbering), replacing the legacy iframe-player model:

```
/game/<slug>/
├─ H1 title + meta (rating / play-time / difficulty)
├─ Screenshot gallery (3–5 images)
├─ About (150–250 words, original copy)
├─ How to Play (100–200 words, controls + strategy)
├─ Key Features (bullet list)
├─ Source & Licence (transparent attribution: author, source URL, licence)
├─ "Play on <author-site> →" outbound CTA  ← the only play action
└─ More in this Category (internal links to /category/<cat>/)
```

**The legacy `game-detail.html` was an iframe player page** (it rendered the game in an `<iframe id="game-iframe">`). The new directory detail page is a **review/guide page** — no iframe, no in-page play. The play action is always an outbound link to the author's site. This is the structural difference between "hosting portal" and "directory".

### Seed scale strategy (300-game launch — 两阶段内容)
**Phase A (build scale):** catalogue metadata for ~300 games is bulk-imported from machine-readable sources, primarily js13kGames (2,483 entries 2012–2025 with stable playable URLs, real authors, screenshots). `about`/`howToPlay` ship as **factual placeholder sentences** (e.g. "<Name> is a <category> game by <author>, submitted to js13k <year>.") — NOT fabricated descriptions. These are honest, verifiable, low-value sentences to be upgraded later.

**Phase B (upgrade quality):** each game's `about`/`howToPlay` is individually rewritten into original 150-250 word reviews, prioritising award winners and high-traffic pages.

**Why this trade-off is accepted:** the old site failed partly because of fabricated AI descriptions. The placeholders here are *factual* (true statements about author/year/source), not fabricated. They establish catalogue scale for IA validation and internal-link density, while being explicitly marked for upgrade. The hard rule — verifiable source per entry, no hosting — is preserved.

### js13kGames as primary seed source (调研证实)
- **Data**: `https://js13kgames.com/{YEAR}.js` — length-prefixed binary blob, all entries per year (name + author + award flag). 14 years, 2,483 entries total.
- **Playable URL** (stable, verified): `https://play.js13kgames.com/{slug}/`
- **Screenshot**: `https://play.js13kgames.com/{slug}/.c.jpg`
- **Source repo**: `https://github.com/js13kGames/{slug}` (licence via GitHub API per repo; many are NONE/unset — acceptable for a directory that only links out).
- **Compliance**: js13k rules retain author ownership; directory linking is permitted. No code redistribution.
- Per-year counts: 2012→62, 2013→70, 2014→129, 2015→160, 2016→127, 2017→253, 2018→273, 2019→245, 2020→227, 2021→223, 2022→167, 2023→163, 2024→187, 2025→197.

### Outbound link (外链 / source link)
The canonical play action on a directory game page. Points to the author's own site. Distinct from any internal asset link.

### Seed sources (收录来源边界)
The new outbound-only catalogue is seeded from three source classes only:
1. **Open-source GitHub game collections** — leereilly/games, gabrielecirulli/2048, mozilla/BrowserQuest, BKcore/HexGL, etc. MIT/GPL, verifiable author, has an official URL to link to. Batchable.
2. **Independent author sites** — hextris.io, proxx.app, etc. Highest quality, but discovery is manual (no scraping). Slow growth, high value.
3. **Jam entries / itch.io demos** — js13k entries, itch.io demos. Complex licensing; directory may link out only, never host. Must verify source per entry.

**Explicitly excluded as a seed source:** other distribution platforms (Poki, CrazyGames, Y8, AddictingGames). Linking to competitors routes traffic away and they disallow secondary aggregation. Every outbound entry must have a recorded, verifiable source — no "found it somewhere".

## Taxonomy (重新设计)

### Category (分类) — 旧版已废弃
Legacy top-level set `action, puzzle, casual, sports` had a broken distribution (action 214 / sports 11). `category/*/` dirs exist but are empty — never landed. **The legacy taxonomy is discarded along with the legacy catalogue.** New top-level taxonomy to be designed for the outbound-only directory.

**New top-level category set (locked):**
1. **Puzzle** — 逻辑/解谜/数独/消除
2. **Action** — 动作/射击/格斗/反应
3. **Arcade** — 经典街机/复古/高分挑战（js13k + 开源合集主力）
4. **Strategy** — 策略/塔防/战棋/资源管理
5. **Racing & Sports** — 竞速/体育（合并，避免各自量小变空壳）
6. **Simulation** — 模拟/经营/放置/沙盒

This is an enumerated set: URL paths, breadcrumbs, nav bar, sitemap, and every game's `category` field all depend on it. Changing it later means rewriting all category pages + every game entry — see ADR-0002.

### Tag (标签) — 旧数据不可用，新站用受控词表
Legacy `tags` field is corrupt and unusable: comma-separated strings crammed into a single array element (`["a, b, c"]`), mixed casing, typos (`sprot`), and js13k batch-import entries whose 3rd tag is a stray word ripped from the title (`"the"`, `"a"`, `"blue"`).

**New strategy: controlled vocabulary.** A fixed, finite tag set (~30–50 tags) defined in advance, split into two groups:
- **Gameplay subtypes** — roguelike, tower-defense, match-3, platformer, bullet-hell, etc. (drill-downs under the 6 top-level categories)
- **Scenario/mood** — quick-fix, brain-burner, couch-co-op, zen, hardcore, etc. (the discovery layer that the 6 categories can't express)

Each game references 3–5 tags from the controlled set **by slug** (not free text). Every `/tag/<slug>/` page is a stable, indexed long-tail landing page. The exact tag enumeration is decided during seeding (must match the actual games collected) — but the *policy* (controlled, two groups, slug-referenced, 3–5 per game) is locked now.

**Schema consequence:** `games-data.js`'s `tags` field must change from free-text array to controlled-vocabulary slug references. A separate `tags.js` (or section) defines the canonical tag set with `slug`, `name`, `group`, `description`. No tag page ships with fewer than ~8 games (thin-content guard).

### Collection (合集)
Curated editorial groupings (e.g. "Best 13kb games", "Couch co-op"). `collection/` dir exists but is empty. Distinct from Category (algorithmic) and Tag (bottom-up). Held back until enough editorial content exists to populate.

### Aggregation pages (聚合页)
**Locked set: `/featured/` and `/new/` only.** No `/popular/` at launch.
- `/featured/` — editor-curated picks (transparent: human-selected, not algorithmic).
- `/new/` — ordered by `addedDate` (real, computable from the catalogue).

**Why no `/popular/`:** the legacy `plays` field is fabricated (362 entries = 0, the rest are invented numbers like 22827/45827 shared across unrelated games) and `rating` is 353× the default 4.4. There is no real play-count data to rank by, and faking it risks Google quality penalties. `/popular/` is deferred until real click data exists.

**Schema consequence:** the `plays` and `rating` fields in `games-data.js` are **removed** in the new schema — they carry no real signal and their presence invites fake-data display. Rating may return later if a real rating mechanism is added; play-count only if analytics are wired in. Neither ships as a static fake value.
