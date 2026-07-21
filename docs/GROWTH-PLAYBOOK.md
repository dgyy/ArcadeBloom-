# ArcadeBloom 流量增长手册

> 技术基建已完成（2019 个唯一游戏页、结构化数据、AI SEO、严格数据校验）。
> 流量的下一个瓶颈是 **内容质量** 和 **域名权重**。本文档是可执行的增长动作清单。
>
> 2026-07-21 数据清洗说明：原 3000 条中移除了 1015 条同源或同 URL
> 重复项，并为旧站内 slug 生成 301。当前基线必须以 `sourceKey` 唯一数为准。

## 核心诊断：流量为什么起不来

| 瓶颈 | 现状 | 为什么致命 |
|---|---|---|
| **内容质量** | 严格校验仍报告 5751 条内容提示 | 大量正文偏短或仍含占位措辞 |
| **域名权重** | 新站，0 外链 | 没有信任投票，排名无法突破 |
| **分类失衡** | arcade 1591 / racing-sports 43 | Arcade 占比约 80%，来源过于集中 |

**优先级：内容质量 > 外链建设 > 分类平衡**

---

## 第一阶段：内容升级（持续，最高优先级）

### 为什么最重要
批量低质内容会拖累整站质量。严格校验目前仍报告 5751 条短正文或占位措辞提示；新增页面前，应先明确哪些页面达到可索引标准。

### 升级标准（每篇评测）
- **150-250 词原创 about**：基于真实信息（GitHub README / 实际游玩 / 作者描述）
- **100-200 词 howToPlay**：真实操作说明 + 策略建议
- **3-6 条 keyFeatures**：具体特性，不是泛泛的"好玩"
- **绝不能编造**——旧站就是栽在这

### 升级优先级（按流量价值排序）
1. **已知高搜索量游戏**：Hextris、2048、PROXX（手写已有，但可加深）
2. **js13k 获奖作品**：award=64 的 ~100 个（高知名度，有截图）
3. **经典开源游戏**：Tetris、Snake、2048 变体（高搜索量长尾）
4. **其余长尾**：按 addedDate 逐步推进

### 升级 SOP（已验证可行）
```bash
# 1. 获取游戏的 README（真实信息源）
gh api repos/js13kGames/{slug}/readme --jq .content | base64 -d

# 2. 基于 README 真实内容写评测，加入 scripts/upgrade-reviews.js

# 3. 应用 + 重新生成
node scripts/upgrade-reviews.js
node scripts/write-games-js.js
npm run validate  # 确保无错误

# 4. 构建测试
npm run build && npm test
```

已示范 4 篇（13c-defense / van-helsing / galaxy-raid / space-janitor），每篇 144-179 词。

### 目标节奏
- 每周升级 20-30 篇 → 3-4 个月覆盖头部 300 篇
- 或者：集中升级 top 50 高价值游戏（覆盖 80% 搜索流量）

---

## 第二阶段：外链建设（新站获取初始权重）

### 为什么重要
外链是 Google 排名最重要的信号之一。新站从 0 外链起步，没有"信任投票"，即使内容好也排不上去。这是新站最难但也最值得投入的阶段。

### 立即可做的渠道（按 ROI 排序）

#### 1. 游戏开发社区（精准受众，高相关外链）
- **itch.io 社区论坛**：发帖介绍 ArcadeBloom（"我做了一个 web 游戏目录站"）
- **js13kGames Discord**：你在收录他们的作品，社区会欢迎
- **Reddit r/js13k / r/webgames / gamedev**：真诚参与，不要纯推广
- **Hacker News "Show HN"**：技术受众喜欢 Eleventy + 目录站的故事

**发帖要点**：讲"我为什么做这个"（旧站托管站转型外链目录的决策故事），不要只丢链接。技术决策（ADR）本身就是好内容。

#### 2. 被收录作者的互利外链
- 给每个被收录的游戏作者发邮件/Twitter："你的 X 游戏被 ArcadeBloom 收录了，这里有评测页 [link]"
- 作者大概率会转发/链接——这是最自然的高质量外链
- 2019 个已审核发布游戏 = 2019 个潜在作者触达对象

#### 3. GitHub（你已经在那）
- 仓库 README 加线上链接和截图
- 开源数据管线（fetch-js13k.js 等）可能被其他开发者引用
- GitHub Pages 做个项目主页指向 arcadebloom.com

#### 4. 内容营销（赚取外链）
- 写 "Best js13k Games of All Time" 类榜单文章（你已有数据）
- "How to Build a Game Directory with Eleventy" 技术博文
- "The State of Browser Games 2026" 数据报告（以去重后的结构化数据为准）

#### 5. 目录提交
- Product Hunt 发布（需要好的介绍文案 + 截图）
- 提交到 game-directory-of-directories（如 crazygames 的 submit 页）
- 开源目录（awesome-lists 等）

### 外链建设纪律
- **不要买链接**（Google 会惩罚）
- **不要批量发垃圾评论**
- **追求相关性 > 数量**：1 个游戏相关站的外链 > 100 个无关站
- **每个渠道真诚参与**，不是丢链接就走

---

## 第三阶段：分类平衡（内容扩展的自然结果）

### 现状
| 分类 | 数量 | 达标(≥20) |
|---|---|---|
| Arcade | 1591 | ✓ |
| Puzzle | 120 | ✓ |
| Strategy | 83 | ✓ |
| Action | 81 | ✓ |
| Simulation | 70 | ✓ |
| Racing & Sports | 43 | ✓ |

### 怎么补
分类失衡是 js13k 单一来源的本质（它是 arcade jam）。要平衡需引入其他来源：

1. **扩展 GitHub/GitLab 浏览器游戏来源**——重点补 action/puzzle/strategy/simulation
2. **独立作者官网**——手动发现，质量最高但增长慢
3. **经典游戏复刻**（Tetris/Snake/Breakout 变体）——高搜索量长尾

每补一个分类到 20，它就从"seeding"状态毕业，进入导航栏。

---

## 第四阶段：监测与迭代

### 必须跟踪的指标
| 指标 | 工具 | 频率 |
|---|---|---|
| Google 收录页数 | Search Console > Coverage | 每周 |
| 核心查询排名 | Search Console > Performance | 每周 |
| AI 引擎引用 | ChatGPT/Perplexity 手动测 | 每月 |
| 外链增长 | Search Console / Ahrefs 免费版 | 每月 |
| 有机流量 | Search Console / GA4 | 每月 |

### 预期时间线（诚实估计）
- **0-1 个月**：Google 开始收录（新站沙盒期，收录慢）
- **1-3 个月**：长尾词开始有展示（"js13k 2023 games" 等）
- **3-6 个月**：头部游戏页有排名（如果内容升级到位 + 有初始外链）
- **6-12 个月**：稳定流量增长（外链积累 + 内容深度提升）

**新站流量不会一夜爆发。** 技术做好是地基，内容和外链是长期积累。前 3 个月是最难的——看不到结果但要持续做。

---

## 立即行动清单（本周可做）

- [ ] 提交 sitemap 到 Google Search Console（如果还没做）
- [ ] 写一篇 "Show HN" 或 Reddit 帖子，讲 ArcadeBloom 的转型故事
- [ ] 给 5 个被收录的 js13k 作者发消息告知收录（争取转发/外链）
- [ ] 继续内容升级：每周 20 篇头部游戏评测
- [ ] 检查 Search Console 的收录状态
