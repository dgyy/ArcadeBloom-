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
ArcadeBloom now has an Eleventy/Nunjucks static build, compiled Tailwind CSS, catalogue validation, and Playwright smoke tests. The retired hand-written HTML and client-side `games-data.js` renderers are legacy artifacts and are not part of the current site.

### Static site generator (锁定): Eleventy (11ty)
**Chosen stack:** Eleventy + Nunjucks templates + compiled Tailwind + `src/_data/games.js` as the catalogue source. Chosen because: zero client-side JS by default (pure static), low template complexity, fast generation of thousands of pages, and mature SEO-site tooling. Astro and a hand-rolled generator remain rejected alternatives.

### Template convention (易错点): frontmatter must come first
**YAML frontmatter (`---` ... `---`) MUST be the first thing in every `.njk` file.** A Nunjucks comment `{# ... #}` placed before the opening `---` silently breaks frontmatter parsing — `title`/`description`/`permalink` fields are then ignored, and pages ship with empty titles (a fatal SEO bug that affected index/featured/new until caught in the SEO review).

Rule: put any `{# ... #}` template comment AFTER the closing `---`, never before. `scripts/validate-data.js` does not currently catch this — a build-time check that every generated `index.html` has a non-empty `<title>` is the safety net (added to smoke tests).

### Fake-data mechanism (要删除的代码)
The retired renderers fabricated minimum play counts and displayed unsupported `plays` and `rating` values. Those fields and renderers are absent from the current catalogue and must never be reintroduced without a real measurement or rating system.

### Game entry (游戏条目)
The atomic catalogue unit: a uniquely identified browser game with controlled classification, original editorial guidance, evidence images where available, verified source and licence attribution, publication dates, and an outbound source URL. It never contains fabricated plays or ratings and never implies that ArcadeBloom hosts the game.

### Game detail page (游戏详情页) — 模板已定
**Fixed editorial template** (per ADR-0004, TBD numbering), replacing the legacy iframe-player model:

```
/game/<slug>/
├─ H1 title + category/tags + primary outbound Play action
├─ Screenshot gallery (3–5 images)
├─ About (150–250 words, original copy)
├─ How to Play (100–200 words, controls + strategy)
├─ Key Features (bullet list)
├─ Source & Licence (transparent attribution: author, source URL, licence)
├─ One labelled ad after Source & Licence
└─ More in this Category (internal links to /category/<cat>/)
```

**The legacy `game-detail.html` was an iframe player page** (it rendered the game in an `<iframe id="game-iframe">`). The new directory detail page is a **review/guide page** — no iframe, no in-page play. The play action is always an outbound link to the author's site. This is the structural difference between "hosting portal" and "directory".

### Catalogue scale strategy (目录规模策略)
**Scale phase complete:** 2,019 entries were live when the evidence gate was adopted. Machine-readable sources established broad catalogue coverage, but 1,754 entries still carry factual placeholder prose and are not treated as fully reviewed merely because they are published.

**Evidence phase:** automated review upgrades entries in search-value order, beginning with the Growth cohort. Each approved review is grounded in direct browser evidence plus verified source and licence information.

**Accepted trade-off:** existing entries retain provisional indexing for launch speed, while all new entries fail closed until evidence review passes. Catalogue scale never substitutes for evidence quality.

### js13kGames as primary seed source (调研证实)
- **Data**: `https://js13kgames.com/{YEAR}.js` — length-prefixed binary blob, all entries per year (name + author + award flag). 14 years, 2,483 entries total.
- **Playable URL** (stable, verified): `https://play.js13kgames.com/{slug}/`
- **Screenshot**: `https://play.js13kgames.com/{slug}/.c.jpg`
- **Source repo**: `https://github.com/js13kGames/{slug}` (licence via GitHub API per repo; many are NONE/unset — acceptable for a directory that only links out).
- **Compliance**: js13k rules retain author ownership; directory linking is permitted. No code redistribution.
- Per-year counts: 2012→62, 2013→70, 2014→129, 2015→160, 2016→127, 2017→253, 2018→273, 2019→245, 2020→227, 2021→223, 2022→167, 2023→163, 2024→187, 2025→197.

### Outbound link (外链 / source link)
The canonical play action on a directory game page. Points to the author's own site. Distinct from any internal asset link.

## Growth

### Indie browser-game explorer (独立浏览器游戏探索者)
An English-language visitor looking for independent, open-source, experimental, or technically distinctive browser games, including game-jam and small-footprint work. This is ArcadeBloom's initial audience; the site does not target the generic expectation of playing a mass-market catalogue without leaving the portal.
_Avoid_: Gamer, everyone who plays free online games

### Qualified organic visit (合格自然访问)
A human visit arriving from an organic search result at a catalogue or editorial page, with a credible opportunity to evaluate a game and continue to its source. Bot requests, uptime checks, asset requests, and raw Cloudflare visitor counts are not qualified organic visits.
_Avoid_: Traffic, visit count, Cloudflare unique visitor

### Growth validation cycle (增长验证周期)
A 120-day measurement period whose final 28 days must produce at least 10,000 Google Search impressions, 300 Qualified organic visits from Google, and 30 Outbound Play clicks while visit-to-Play conversion remains at or above 10%. Search Console and Anonymous Play measurement are authoritative; edge request counts are diagnostic only.
_Avoid_: Traffic target, launch period, Cloudflare baseline

### Growth cohort (增长批次)
The first evidence-focused publishing set for a Growth validation cycle: at least 100 fully reviewed game pages and eight evidence-led Collections, beginning with the 50 most complete existing entries and all Featured games. Provisionally indexed placeholder entries remain outside the cohort and do not block its progress.
_Avoid_: Content batch, all catalogue games, publishing quota

### Self-funded operation (自给式运行)
ArcadeBloom's growth automation begins with no new paid spend and may use only existing resources, local capacity, and free service allowances. After advertising revenue is actually received, no more than 50% of that cash may be reinvested; exhausted free capacity pauses work rather than lowering evidence standards, borrowing, prepaying, or silently upgrading a service.
_Avoid_: Free forever, estimated revenue, growth budget

### Cloud-only free operation (纯线上免费运行)
An unattended operating model that excludes the owner's local computer and uses only non-billable cloud allowances with paid overage disabled. Capacity exhaustion or provider-policy changes pause queued work; they never authorize charges or weaker evidence, and AI providers remain replaceable.
_Avoid_: Serverless, always-on system, free unlimited automation

### Automated publication gate (自动发布闸门)
The mandatory pull-request boundary between autonomous content generation and production. Small batches may merge without human approval only after all evidence, data, build, browser, link, indexing, advertising, and post-deployment health checks pass; direct writes to the production branch and check bypasses are prohibited.
_Avoid_: Bot commit, direct deployment, manual approval

### Outbound Play click (外链游玩点击)
A human activation of a game's primary Play link that sends the visitor from ArcadeBloom to the verified source site. The rolling 28-day count of these clicks is ArcadeBloom's growth north-star metric.
_Avoid_: Play, page view, request

### Anonymous Play measurement (匿名游玩计量)
First-party aggregate measurement of Outbound Play clicks using game, page, time, referral class, and device class without identifying or tracking a person. It excludes IP retention, cookies, user identifiers, personal profiles, and cross-site tracking.
_Avoid_: User tracking, click profile, Cloudflare request count

### Editorial ad boundary (编辑内容广告边界)
The permanent separation between paid placements and ArcadeBloom's editorial or play actions. Aggregation and collection pages may carry clearly labelled ads; each game detail page may carry at most one labelled ad after Source & Licence and before related games, never near the title, screenshot, review body, or Play action, and never as an interstitial, pop-up, page takeover, or sticky ad.
_Avoid_: Monetization slot, native recommendation, sponsored game

### Index-eligible game entry (可索引游戏条目)
A game entry that passes ArcadeBloom's evidence-backed quality gate and may therefore be submitted for search indexing. New catalogue membership alone does not grant index eligibility; the 2,019 entries present when the gate was adopted are the sole provisional exception.
_Avoid_: Published game, catalogue entry, all games

### Provisionally indexed entry (存量暂准索引条目)
One of the 2,019 game entries already published when the evidence gate was adopted, temporarily allowed to remain indexed without prior review. These entries are reviewed progressively in search-value order and lose provisional status when they pass or fail; newly added games can never receive this status.
_Avoid_: Legacy game, approved game, permanent exception

### Automated evidence review (自动证据审核)
An AI-only assessment grounded in direct evidence from the playable game and its verified source, rather than metadata or generated prose alone. Uncertain or insufficiently evidenced entries remain ineligible for indexing instead of being escalated to a human reviewer.
_Avoid_: AI review, metadata scoring, editorial review

### Creator distribution loop (作者传播回路)
The acquisition loop in which index-eligible games and Collections reach consenting creators and relevant audiences through inbound correspondence, owned channels, and channels that explicitly permit automation, producing qualified visits, corrections, shares, and earned links. It complements organic search without relying on unsolicited outreach.
_Avoid_: Link building, mass outreach, backlink request

### Opt-in creator correspondence (许可式作者通信)
Automated correspondence with a creator who first contacted ArcadeBloom, submitted a game, subscribed, or otherwise gave explicit permission. Unsolicited author email is prohibited during the zero-cost phase; `hello@arcadebloom.com` receives through free routing, while replies and notifications remain limited to consented recipients.
_Avoid_: Creator outreach, cold email, public-address permission

### Autonomous distribution channel (自主分发渠道)
An ArcadeBloom-owned channel, or an external channel whose published rules and official interface explicitly permit automated posting. Unattended posting to general communities, forums, chat servers, or issue trackers is outside this boundary.
_Avoid_: Community, anywhere with an API, social spam

### Bluesky broadcast (Bluesky 自动广播)
ArcadeBloom's sole external autonomous publishing channel during the first Growth validation cycle. It broadcasts no more than three already-published reviews or Collections per week and never follows, likes, replies, sends private messages, or repeats a URL automatically; RSS remains the owned companion channel.
_Avoid_: Social strategy, bot engagement, cross-posting network

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
An evidence-led editorial argument that compares 5–12 index-eligible games in response to one genuine audience question (e.g. "Best js13k puzzle games we tested"). It is distinct from Category (top-level classification) and Tag (controlled attribute), and must add an original comparative conclusion rather than reproduce a card list or keyword variation. Collections are ArcadeBloom's primary search, sharing, and earned-link surface; individual game pages capture specific long-tail intent.
_Avoid_: List page, keyword page, generated roundup

### Aggregation pages (聚合页)
**Locked set: `/featured/` and `/new/` only.** No `/popular/` at launch.
- `/featured/` — editor-curated picks (transparent: human-selected, not algorithmic).
- `/new/` — ordered by `addedDate` (real, computable from the catalogue).

**Why no `/popular/`:** the legacy `plays` field is fabricated (362 entries = 0, the rest are invented numbers like 22827/45827 shared across unrelated games) and `rating` is 353× the default 4.4. There is no real play-count data to rank by, and faking it risks Google quality penalties. `/popular/` is deferred until real click data exists.

**Schema consequence:** the `plays` and `rating` fields in `games-data.js` are **removed** in the new schema — they carry no real signal and their presence invites fake-data display. Rating may return later if a real rating mechanism is added; play-count only if analytics are wired in. Neither ships as a static fake value.
