# ArcadeBloom 改版分阶段执行计划

## 技术地基（已锁定）
- **静态生成器**：Eleventy (11ty) + Nunjucks 模板
- **样式**：Tailwind（开发期继续 CDN，P2 阶段评估迁移 CLI 构建）
- **数据源**：新的 `games-data.js`（schema 重设计）+ 新的 `tags.js`（受控词表）
- **输出**：无扩展名目录式 URL（`/game/<slug>/index.html` 等）
- **隔离**：新建 `src/` 放源码，Eleventy 输出到 `dist/`，旧文件保留到上线后才删
- **上线**：一次性切换，旧 URL 给 410 Gone / 301 到首页

## 目录结构（目标）
```
src/
├── _data/
│   ├── games.js          # 新 schema 的游戏数据
│   ├── tags.js           # 受控标签词表
│   └── site.js           # 站点配置(分类定义、导航等)
├── _includes/
│   ├── base.njk          # <head> + header + footer 骨架
│   ├── header.njk
│   ├── footer.njk
│   └── game-card.njk     # 可复用游戏卡片
├── index.njk             # 首页(分类门户式)
├── game.njk              # 游戏详情页模板 → /game/<slug>/index.html
├── category.njk          # 分类页 → /category/<slug>/index.html
├── tag.njk               # 标签页 → /tag/<slug>/index.html
├── featured.njk          # /featured/
├── new.njk               # /new/
├── search.njk            # /search/ (noindex)
├── about.njk  contact.njk  terms.njk  privacy.njk
└── assets/               # 编译后的 css/js/pic
.eleventy.js              # Eleventy 配置(pagination + permalink)
package.json              # 11ty + 脚本
```

---

## 阶段 0：构建管线地基（1–2 天）
**目标**：从零搭起 Eleventy，跑通"数据 → 一个静态页"的最小闭环。

**任务**
1. 新建 `package.json`，装 `@11ty/eleventy`，加脚本 `npm run build` / `npm run serve`
2. 新建 `.eleventy.js` 配置：Nunjucks 模板、`permalink` 函数（生成无扩展名目录式 URL）、`passthrough` 静态资源
3. 新建 `src/_data/site.js`：定义 6 个分类（slug/name/description）、导航结构
4. 新建 `src/_includes/base.njk`：从现有 `index.html` 提取 `<head>` + header + footer，**移除** `<iframe>` 相关、`data-tw-preload` hack、Google Ads 占位、Recently Played section
5. 新建 `src/index.njk`：最小首页（Hero + 6 分类卡占位 + Featured/New 空位）
6. **修复 OG/Twitter 图片**：补真实 `og-image`，替换所有页面里指向空 `images/` 的引用
7. **验证**：`npm run build` 能生成 `dist/index.html`，本地 `npm run serve` 能打开

**验收**：浏览器禁用 JS 打开首页，能看到 Hero + 分类卡 + header/footer 完整 HTML。

---

## 阶段 1：数据 Schema + 种子数据（2–4 天）
**目标**：定新数据 schema，录入第一批种子游戏（支撑分类页不空壳）。

**任务**
1. **定新 schema**（写入 `src/_data/games.js` 头部注释）：
   ```js
   {
     id, slug, name, category,        // 保留
     tagline,                          // 新：一句话副标题
     about,                            // 原 description，150-250词
     howToPlay,                        // 原 instructions，100-200词
     keyFeatures: [],                  // 新：bullet list
     screenshots: [],                  // 新：3-5张
     sourceName, sourceUrl,            // 新：原作者+官网
     licence,                          // 新：MIT/GPL/proprietary等
     tags: [],                         // 改：受控词表 slug 引用
     addedDate,                        // 新：收录日期，支撑 /new/
     releaseDate,                      // 保留
     featured: false                   // 保留，支撑 /featured/
   }
   ```
   **删除**：`plays`、`rating`（假数据，ADR-0001）、`image`（被 `screenshots` 取代）
2. **定受控标签词表**（`src/_data/tags.js`）：~40 个，分两组
   - 玩法细分：roguelike, tower-defense, match-3, platformer, bullet-hell, turn-based, sandbox, idle…
   - 场景情绪：quick-fix, brain-burner, couch-co-op, zen, hardcore, retro, minimal…
   - 每个标签：`{ slug, name, group, description }`（description 支撑标签页 SEO）
3. **种子录入**：从已锁定的 3 类来源（GitHub 开源合集 + 独立官网 + Jam）录首批
   - 优先从 `html5_games_resources.csv` 的 9 个合集起步（hextris/2048/HexGL/BrowserQuest 等），这些来源明确、可批量
   - **硬约束**：每个游戏必须填齐 `sourceName/sourceUrl/licence`，无来源不下发
   - **目标量**：每分类 ≥20（共 ≥120），未达标的分类先隐藏不出现在导航

**验收**：`src/_data/games.js` ≥120 条，每条 schema 字段完整、来源可验证；6 分类各 ≥20。

---

## 阶段 2：内容页面生成（2–3 天）
**目标**：所有页面类型生成静态 HTML，跑通全站。

**任务**
1. **游戏详情页** `src/game.njk`（固定模板，按 ADR）：
   - H1 + 元信息（分类/收录日期/来源）+ 截图画廊 + About + How to Play + Key Features + Source & Licence 归属块 + **"Play on <source> →" 外链 CTA**（唯一 play 动作，`rel="noopener nofollow"`）+ 同分类推荐
   - JSON-LD：`VideoGame` + `BreadcrumbList`，字段真实（**不输出假的 rating/aggregateRating**）
   - **无 iframe、无站内播放器**
2. **分类页** `src/category.njk`：分类介绍（200-400 词，避免薄内容）+ 分页（每页 24 个）+ 排序（newest/featured）+ 面包屑
3. **标签页** `src/tag.njk`：标签说明 + 游戏列表；**薄内容守卫**：游戏数 <8 的标签不生成页面（Eleventy 里用 collection 过滤）
4. **聚合页** `featured.njk` / `new.njk`：分别按 `featured` / `addedDate` 排序，页脚注明口径（"Editor picks" / "Ordered by added date"）
5. **搜索页** `search.njk`：`<meta name="robots" content="noindex,follow">`，纯客户端 JS 过滤（读 games data），query 参数驱动
6. **静态页** about/contact/terms/privacy：从现有 HTML 迁移内容到 njk 模板，**重写** marketing 文案（现有文案讲"play instantly"，要改成"discover & navigate to the best web games"反映新定位）

**验收**：`npm run build` 生成全站，抽样 5 个游戏页/3 个分类页/2 个标签页：禁用 JS 可见完整内容；canonical 自洽；无假数据字段。

---

## 阶段 3：SEO 基建（1–2 天）
**目标**：可抓取/可索引性达标。

**任务**
1. **sitemap 自动生成**：用 `@11ty/eleventy-plugin-sitemap` 或自写，只含规范 URL（无扩展名带尾斜杠），`lastmod` 随数据文件变更；分片（每 sitemap ≤5000 URL，虽初期用不上但结构就位）
2. **sitemap index** + `robots.txt` 指向（重写现有 robots.txt 的 Sitemap 行）
3. **JSON-LD 全站**：
   - 首页：`WebSite` + `SearchAction`（target 指向真实 `/search/?q={query}`）
   - 游戏页：`VideoGame` + `BreadcrumbList`
   - 分类/标签页：`CollectionPage` + `BreadcrumbList`
   - 清理 `Organization` 占位字段（不存在的电话/社媒移除）
4. **canonical 校验**：每个页面 canonical = 自身 URL，带尾斜杠，与 sitemap 一致
5. **OG/Twitter 图**：补真实分享图，所有页面统一

**验收**：Rich Results Test 跑通首页 + 游戏页；sitemap 抽样 30 条 URL 全部 200 + canonical 自洽。

---

## 阶段 4：质量闸门 + 测试（1–2 天）
**目标**：可维护性 + 防回归。

**任务**
1. **数据校验脚本** `scripts/validate-data.js`（CI 可跑）：
   - slug 唯一、格式合法（kebab-case）
   - category ∈ 6 个合法值
   - tags 全部 ∈ 受控词表
   - 必填字段（sourceName/sourceUrl/licence/about/howToPlay）非空
   - screenshots 路径对应的图片文件存在
2. **构建校验**：生成后扫描所有 `index.html`，title/description/canonical 非空且唯一
3. **Playwright 冒烟测试**（复用现有 `@playwright`）：
   - 首页/分类页/游戏页/搜索 无 console error
   - 游戏页外链 CTA 指向正确、`rel="noopener"`
   - 禁用 JS 下关键内容可见
4. **Lighthouse 本地**：首页/列表页/游戏页 LCP/CLS/INP 无严重红项；Tailwind CDN 的 render-blocking 记录为已知项

**验收**：`npm run validate` + `npm run test` 全绿。

---

## 阶段 5：上线切换（1 天）
**目标**：一次性部署，旧站干净退役。

**任务**
1. **部署 dist/** 到托管（Cloudflare Pages / GitHub Pages，配置 clean-URL 重写：`/game/x/` → `/game/x/index.html`）
2. **旧 URL 处理**：
   - 旧 `game-detail.html?slug=*`、`all-games.html`、`js13k2023.html` 等 → 410 Gone（内容已永久移除，不是迁移）
   - 旧 `/about.html` 等 → 301 到新 `/about/`（内容迁移了）
   - 根路径 `/` 直接切新首页
3. **删除旧文件**（上线验证后）：`games/`、`game-detail.html`、`all-games.html`、`js/homepage.js`、`js/game-detail.js`、旧 `games-data.js`、`batch-generator.html.html`、`js13k2023.html`、`add-game.html`
4. **更新 `AGENTS.md`**：反映新构建流程（`npm run build/serve` 替代 `python -m http.server`）
5. **Search Console**：提交新 sitemap，请求重抓取首页

**验收**：线上抽查关键路径 200；旧游戏 URL 返回 410；新 sitemap 被 Search Console 接受。

---

## 阶段 6（P2，上线后持续）：性能与扩充
**非阻塞上线，按需推进：**
- Tailwind CDN → CLI 构建（消除 render-blocking + 生产警告）
- 字体优化（减字重、`font-display: swap`）
- 持续扩充收录（每分类向 50+ 推进）
- 引入真实点击统计 → 达标后解锁 `/popular/` 聚合页
- 受控标签词表扩充（基于实际收录）

---

## 工作量估算
| 阶段 | 工时 | 阻塞条件 |
|---|---|---|
| 0 构建管线 | 1–2 天 | 无 |
| 1 数据+种子 | 2–4 天 | 阶段 0 |
| 2 页面生成 | 2–3 天 | 阶段 1 |
| 3 SEO 基建 | 1–2 天 | 阶段 2 |
| 4 质量闸门 | 1–2 天 | 阶段 2 |
| 5 上线 | 1 天 | 阶段 1-4 |
| **合计** | **8–14 天** | |

## 风险与注意点
- **种子数据是关键路径瓶颈**：阶段 1 的 ≥120 条手工录入（含 source 核实）最耗时，可考虑先从 CSV 里 9 个合集批量起步
- **薄内容守卫必须严格执行**：分类 <20、标签 <8 一律不生成页，否则重蹈旧站覆辙
- **假数据零容忍**：`plays`/`rating`/`formatPlays` 的伪造逻辑连根删除，新 schema 不留这俩字段
- **外链 `rel` 属性**：外链 CTA 用 `rel="noopener nofollow"`（不传递权重给外部，且聚合站常规做法）
- **上线后 410 而非 301**：旧游戏内容是"移除"不是"迁移"，410 告诉 Google 立即删除索引，比 404 快