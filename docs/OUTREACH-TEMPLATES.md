# 外链建设素材包

> 可直接复制使用的推广文案。每个渠道一份，针对该平台调性定制。
> **核心原则**：讲真实故事（旧站托管→外链目录的转型决策），不是丢链接。

---

## 1. Hacker News — "Show HN" 帖子

**标题（< 80 字符）：**
```
Show HN: ArcadeBloom – A game directory that links out instead of hosting (389 games)
```

**正文：**
```
I run a browser-game site (arcadebloom.com) that used to self-host 366 games — iframed HTML builds scraped from jams, with fabricated play counts and AI-generated descriptions. It ranked poorly and felt dishonest.

So I tore it down and rebuilt it as a directory: we review web games (mostly js13k entries and open-source GitHub projects) and link out to each author's own site. No hosting, no fake metrics, no iframe embeds.

The rebuild:
- Eleventy static site, 416 pages generated in ~0.7s
- 389 games catalogued from three sources (js13k, GitHub open-source, indie author sites)
- Every entry has a verifiable source URL + licence
- Structured data (VideoGame/HowTo/FAQ schema) for each game page
- 30 Playwright smoke tests, zero console errors

The data pipeline scrapes js13k's binary `{YEAR}.js` format (2,483 entries since 2012), cross-references GitHub for licences, and outputs a clean catalogue. The hard part wasn't the build — it was deciding to delete 366 entries and start over.

Happy to answer questions about the architecture, the Eleventy setup, or the "should a directory host games or link out?" decision.
```

**发帖要点**：HN 偏好技术细节 + 诚实的失败故事。强调"删除 366 个假游戏重头来"的决策，这是好内容。

---

## 2. Reddit — r/webgames / r/gamedev

**标题：**
```
I built a browser game directory that only links out (no hosting, no fake play counts)
```

**正文：**
```
I've been running arcadebloom.com and realized the old model — scraping games and hosting them in iframes with fabricated play counts — was both bad for SEO and kind of scummy toward the original creators.

So I rebuilt it as a pure directory: every game links to the author's own site. We write reviews and how-to-play guides, and the play button sends you to the source.

It currently catalogs 389 games, mostly from:
- js13kGames (300+ competition entries, 2012–2025)
- Open-source GitHub games (83 from the leereilly/games collection)
- A few well-known indie titles (Hextris, PROXX, 2048)

If you've made a browser game and want it listed, the criteria are simple: it needs a verifiable source URL and a licence. Drop a link below or use the contact page.

Source code is on GitHub: https://github.com/dgyy/ArcadeBloom-
```

**发帖要点**：Reddit 重视真诚参与。发完帖后 24 小时内回复所有评论。不要在别的帖子刷链接。

---

## 3. 给被收录作者的私信（Twitter/Email）

**主题行（Email）：**
```
Your game [Game Name] is featured on ArcadeBloom
```

**正文：**
```
Hi [Author name],

I run ArcadeBloom (arcadebloom.com), a directory of browser games. We recently catalogued your game [Game Name] with a review and how-to-play guide:

https://arcadebloom.com/game/[slug]/

A few things worth flagging:
- The "Play" button links directly to your site — we don't host or embed your game
- The review is based on your public README; if anything is inaccurate, tell me and I'll fix it
- It's listed under the [category] category with [N] other games

If you'd like the entry updated (better description, corrected controls, different screenshot), just reply. And if you want it removed entirely, that's fine too — no hard feelings.

Either way, nice work on [Game Name]. The [specific detail from README] mechanic is a clever touch.

— [Your name]
arcadebloom.com
```

**要点**：
- 个性化最后一段（引用 README 里的真实细节）
- 提供修改/删除选项（建立信任）
- 不要求外链——但作者自然想分享自己的评测页

**发送节奏**：每天 5-10 封，不要群发。优先发给 award=64 的获奖作者。

---

## 4. GitHub README 更新

在你的 GitHub 仓库 README 顶部加：

```markdown
# ArcadeBloom

> A curated directory of 389 free browser games. We review and link out — we don't host.

🌐 **Live site**: [arcadebloom.com](https://arcadebloom.com)

## What this is
A static game directory built with Eleventy. Each game page has an honest review,
how-to-play guide, and an outbound link to the original author's site.

## Tech stack
- Eleventy (static generation, 416 pages in <1s)
- Tailwind CSS (compiled, 16KB)
- Playwright smoke tests (30 checks)
- Data pipeline: js13k binary parser + GitHub API licence lookup
```

---

## 5. 提交到目录/聚合站

| 平台 | 怎么提交 | 预期 |
|---|---|---|
| Product Hunt | 准备标题/描述/截图，选周二/三发射 | 流量 spike + 1-2 个外链 |
| BetaList | 提交为"early access"项目 | 开发者受众 |
| AlternativeTo | "alternative to CrazyGames/Poki" | 长尾外链 |
| awesome-js13k (GitHub) | PR 添加 arcadebloom 到列表 | 相关性外链 |

---

## 外链建设纪律

- ✅ **追求相关性**：1 个游戏站外链 > 100 个无关站
- ✅ **真诚参与**：社区发帖要回复评论，不是丢链接就走
- ✅ **给作者发消息时个性化**：群发模板会被识别为垃圾
- ❌ **不要买链接**（Google 惩罚）
- ❌ **不要批量发评论/垃圾外链**
- ❌ **不要在 unrelated subreddits 刷链接**
