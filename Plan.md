# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# ArcadeBloom SEO / 完备性改造计划（无用户体系）

目标：在不引入用户登录/管理的前提下，把站点从“参数化详情页 + 客户端注入”升级为“可静态抓取的目录站”，提升收录稳定性、长尾覆盖、站内可发现性与维护效率。

原则：先解决规范化与可索引（P0），再做结构与内容（P1），最后做性能与自动化（P2）。

---

## 阶段 0：现状审计与规范定义（0.5–1 天）

**产出**
- URL 规范文档（是否保留 `.html`、是否尾 `/`、参数策略、大小写规则）。
- 现有问题清单：重复 canonical、参数页收录风险、OG 资源缺失、结构化数据不一致。

**检查项**
- canonical 是否与可访问 URL 一致（例如 `about.html` 等）。
- sitemap 是否只包含规范 URL（目前含大量 `game-detail.html?...` 组合 URL）。
- 结构化数据 `SearchAction.target` 是否对应真实搜索 URL（站内目前更像 `all-games.html?search=...`）。
- OG 图片是否真实存在（仓库无 `images/`，已有 `pic/`）。

---

## 阶段 1：P0 基建（收录稳定性）（1–3 天）

### 1.1 统一 URL 与 canonical（P0）
**决策**：二选一并全站统一（含站内链接 + sitemap + canonical）
- A：规范 URL 使用 `.html`（适配纯静态托管）；
- B：无扩展名 URL（需要托管重写规则）。

**改造任务**
- 修正 `about.html/contact.html/terms.html/privacy.html` 等 canonical，确保与实际可访问 URL 一致。
- 统一全站链接生成逻辑（导航、页脚、卡片链接）。

**验收**
- 任意页面只有一个 canonical，且 200 可访问。
- sitemap 中 URL 与 canonical 完全一致。

### 1.2 游戏页规范化：从参数页到静态页（P0）
**目标**：每个游戏一个可静态抓取的规范页。

**推荐 URL**
- `game/<slug>/index.html`（推荐）或 `game/<slug>.html`（实现简单）。

**改造任务**
- 新增静态生成流程：从 `games-data.js` 生成游戏页 HTML（包含 `title/description/canonical` 等）。
- 保留 `game-detail.html?slug=...` 作为兼容入口：301 到规范页；或 `noindex,follow` + canonical 指向规范页。

**验收**
- 规范游戏页不依赖 JS 执行即可看到游戏标题、简介、玩法/操作、相关推荐（HTML 中可见）。

### 1.3 Sitemap 重构（P0）
**改造任务**
- 生成 `sitemap-index.xml` + 分片（`sitemap-pages.xml`、`sitemap-games-1.xml`…）。
- 只包含规范 URL；`lastmod` 随目录变更更新。
- `robots.txt` 指向新的 sitemap index。

**验收**
- 抽样 100 条 sitemap URL：返回 200、canonical 自洽、不 `noindex`。

### 1.4 结构化数据校准（P0）
**改造任务**
- 站点级 `WebSite/SearchAction`：把 `target` 改为站内真实搜索页。
- 游戏页增加 `VideoGame`/`Game` + `BreadcrumbList`。
- 清理 `Organization` 的占位字段（电话/社媒不存在则移除）。

**验收**
- Rich Results 测试可解析（字段真实且与页面可见内容一致）。


---

## 阶段 2：P1 结构与内容（长尾与内链）（2–6 天）

### 2.1 分类/标签落地页（P1）
**改造任务**
- 生成 `category/<category>/index.html`（分页、排序、可索引）。
- 生成 `tag/<tag>/index.html`（只输出核心标签；分页）。
- 每个聚合页添加 200–400 字简介（避免纯列表薄内容）。

**验收**
- 游戏页 → 分类/标签页双向可达；聚合页有稳定内链与分页。

### 2.2 搜索页产品化（P1）
**改造任务**
- 建立独立 `search.html`（或 `/search/`）并支持 `?q=&category=&tag=` 等参数。
- 首页 `SearchAction.target` 指向真实搜索页。
- 选做：为高频词生成静态专题页（可从搜索日志/站内热门词推断）。

**验收**
- 搜索 URL 可分享、可回显状态；不生成可索引的无限组合页（默认 noindex）。

### 2.3 站点“完备性”页面补齐（P1）
**改造任务**
- 新增 `404.html`（带搜索与推荐）。
- 新增聚合页：`/new/`、`/popular/`、`/featured/`（规则透明）。
- 外链游戏页：保留站内内容落地（介绍/玩法/推荐）+ 外链 CTA。

---

## 阶段 3：P2 性能与质量闸门（1–3 天）

### 3.1 性能（P2）
**改造任务**
- 关键图片：补齐 `width/height`，优先用 WebP（如可行）。
- 字体：减少字重，确保 `font-display: swap`。
- 第三方脚本：延迟非首屏、减少阻塞。

**验收**
- 首页/列表页/游戏页：LCP/CLS/INP 无明显退化（至少本地 Lighthouse 不出现严重红项）。

### 3.2 自动化校验（P2）
**改造任务**
- 添加脚本（本地/CI 可跑）：
  - 校验 `games-data.js`：`slug` 唯一、图片存在、必填字段完整。
  - 校验生成页：`title/description/canonical` 不为空且唯一性抽样通过。
  - 校验 sitemap：URL 200、canonical 自洽。

---

## 里程碑与交付物

- M0：URL 规范确定（阶段 0 完成）。
- M1：规范游戏页 + 新 sitemap 上线（阶段 1 完成）。
- M2：分类/标签/搜索/404 全量可用（阶段 2 完成）。
- M3：性能优化 + 校验脚本（阶段 3 完成）。

---

## 风险与决策点

- 是否使用无扩展名 URL：若托管平台不支持稳定重写，优先 `.html` 规范化。
- 参数页收录失控：短期要么 301 到规范页，要么 `noindex,follow`，并从 sitemap 移除。
- 结构化数据字段真实性：不要输出不真实的电话/评分等，避免带来质量风险。

---

## 推荐执行顺序（最短路径）

1. 修 canonical + 修 SearchAction + 补 OG 资源真实路径。
2. 上“每游戏一静态页”生成流程，并让 `game-detail.html` 变兼容入口。
3. 生成新 sitemap（只含规范 URL）。
4. 加分类/标签/404/聚合页，强化内链。
5. 再做性能与自动化校验。
