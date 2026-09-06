# ArcadeBloom 游戏候选清单

查找日期：2026-09-07。范围：小众浏览器游戏、AI 参与玩法、作者明确披露 AI 辅助制作的游戏。共 20 个候选，建议先整理其中 10 个为正式条目。

这是选题与来源整理，不是游戏评测。玩法描述来自作者、发行商或官方项目；本次未运行完整游戏，也未验证移动端、存档、模型服务或付费流程。页面能打开不代表游戏运行正常。排序依据是网站定位、玩法差异和来源清晰度，不代表质量排名。

分类遵循 CONTEXT.md / ADR-0011：`ai-gameplay` 表示模型参与玩法，`ai-assisted` 表示 AI 辅助制作；未标 AI 不等于确认没有使用 AI。未明确公开的游戏许可证记为 `NOASSERTION` / `noassertion`，不推断截图转载许可。下文链接均为作者、发行商或官方项目来源。

## 建议先整理的 10 个

| 游戏 | 作者 | 类型 | 收录切入点 | 官方入口 |
| --- | --- | --- | --- | --- |
| newdle | minbytes | AI 辅助制作 | 每日字母拼成不同填字布局，收集不同成就 | [作者页](https://minbytes.itch.io/newdle) |
| Whisperline | Layline | AI 辅助制作 | 根据聊天记录与人物关系找出秘密传播路径 | [作者页](https://layline.itch.io/whisperline) |
| TAKEN AS READ | CSAF | AI 辅助制作 | 接受旁白会改变房间规则，怀疑次数有限 | [作者页](https://csaf.itch.io/taken-as-read) |
| Semantris | Google Research | AI 玩法 | 给 AI 语言线索，用语义联想消除词语 | [官方入口](https://research.google.com/semantris/) |
| Quick, Draw! | Google Creative Lab 等 | AI 玩法 | 限时画画，让神经网络猜出物体 | [官方入口](https://quickdraw.withgoogle.com/) |
| Sandspiel | Max Bittker | 创作沙盒，未标 AI | 用沙、水、植物等元素搭出会变化的场景 | [作者入口](https://sandspiel.club/) |
| Orb.Farm | Max Bittker | 生态沙盒，未标 AI | 在小小水缸里布置并观察生态系统 | [作者入口](https://orb.farm/) |
| Combo Pool | NuSan | 弹珠解谜，未标 AI | 用台球碰撞合并同色弹珠，控制场上数量 | [作者页](https://nusan.itch.io/combo-pool) |
| Tiny Islands (2019) | David King Made Some Games | 卡片策略，未标 AI | 抽卡并选择位置，逐步画出自己的岛屿 | [作者页](https://dr-d-king.itch.io/tiny-islands) |
| PICOHOT | Piotr Kulla、Wojciech Dziedzic、Mariusz Tarkowski | 动作，未标 AI | PICO-8 风格的“移动才推进时间”射击 | [作者页](https://tarkovsky.itch.io/picohot) |

其中两款 Google 实验用于展示不同 AI 玩法；首页主推仍以独立创作者作品为主，避免站点变成知名 AI 产品导航。

### 1. newdle

- 页面列出 HTML5、英语、鼠标及触摸输入。玩法是每日安排字母构成填字布局，不同安排可获得不同表情成就，周日提供额外字母。
- 作者正文明确说生成式 AI 帮助写代码，AI Disclosure 也列出 Code，可标 `ai-assisted`；没有依据标为运行时 AI。
- 许可证未声明。页面有支持作者入口，确切价格政策和账号要求未确认。
- 来源：[作者游戏页及 AI 声明](https://minbytes.itch.io/newdle)。

### 2. Whisperline

- HTML5。根据证词、聊天截图、关系图还原谁在什么时候知道秘密，再找出说谎者。
- AI Disclosure 为 Code、Graphics、Text，可标 `ai-assisted`。不能把叙事内容直接解释为即时 AI 对话。
- 作者列出英语、巴西葡语和鼠标/触摸输入，并提示 Safari 内嵌页面的存储限制。兼容性未实测。
- 许可证、账号与确切价格政策未确认。来源：[作者游戏页](https://layline.itch.io/whisperline)。

### 3. TAKEN AS READ

- 作者描述：认可一句旁白会使它成为房间里的规则；拒绝次数有限，相互矛盾的规则会形成障碍。页面称共五章、十五个房间。
- 作者明确披露代码、图形、文字使用 AI，音效使用程序合成而非生成式模型。因此标 `ai-assisted`，不额外标运行时 AI。
- 页面有 Run game；作者称免费、自动保存，支持键盘和触摸。许可证和账号要求未确认。
- 来源：[作者游戏页](https://csaf.itch.io/taken-as-read)、[发布说明](https://csaf.itch.io/taken-as-read/devlog/1650676/taken-as-read-is-out-and-it-is-free-in-your-browser)。网页检索工具最初无法读取落地页，随后普通浏览器成功读取；不能将前者写成链接失效。

### 4. Semantris

- 输入线索，AI 按关联程度选择场上词语；官方解释其模型学习对话中的语言关联。可标 `ai-gameplay`，但不写成生成式聊天游戏。
- 来源：[游戏入口](https://research.google.com/semantris/)、[Google Research 原理与游戏说明](https://research.google.com/semanticexperiences/about.html)。
- 普通浏览器返回 HTTP 200；未实际游玩。许可证、当前费用和账号条件未确认。属于机构实验，不作为独立开发者作品介绍。

### 5. Quick, Draw!

- 官方页面描述在 20 秒内画出指定物体，让神经网络猜测。可标 `ai-gameplay`。
- 页面署名包括 Jonas Jongejan、Henry Rowley、Takashi Kawashima、Jongmin Kim、Nick Fox-Gieg，以及 Google Creative Lab / Data Arts。
- 官方还说明绘画会参与公开绘画数据集；不能将数据集的许可当成整个游戏或素材的许可。
- 来源：[官方游戏页、说明与署名](https://quickdraw.withgoogle.com/)。游戏许可证、当前费用和账号条件未确认。

### 6. Sandspiel

- 创作型落沙模拟，可放置不同元素，项目介绍支持分享和延伸别人的创作。程序模拟本身不构成 AI 标签依据。
- 来源：[游戏](https://sandspiel.club/)、[作者代码仓库](https://github.com/MaxBittker/sandspiel)。仓库标注 MIT；外部作品、玩家上传内容和截图权利仍需按素材来源处理。
- 本次读取到元素工具栏，未测试上传或账号流程；不承诺所有功能无需登录。

### 7. Orb.Farm

- 布置水、藻类、细菌、鱼等，观察封闭水生生态系统；适合与 Sandspiel 放在同一创作沙盒专题。
- 来源：[游戏](https://orb.farm/)、[作者仓库](https://github.com/MaxBittker/orb.farm)。仓库标注 MIT。
- 本次读取到官方生态系统简介，未验证存档或跨设备行为；不因自动演化标 AI。

### 8. Combo Pool

- 台球碰撞与同色合成结合，球数增加会消耗生存空间/生命资源；作者提供鼠标、键盘说明及色盲模式。
- 官方列 HTML5，并明确声明未使用生成式 AI。
- 作者页的素材许可证是 CC-BY-NC-SA 4.0，不是通用代码授权，也不能当成商业站点任意复制素材的许可。整体游戏许可证暂记 NOASSERTION。
- 来源：[作者页与控制说明](https://nusan.itch.io/combo-pool)。

### 9. Tiny Islands (2019)

- HTML5，数字 roll-and-write 游戏，以卡片替代骰子，选择布局并绘制岛屿。
- 来源：[作者游戏页](https://dr-d-king.itch.io/tiny-islands)。使用该作者页面，不使用同名网站或猜测的作者域名。
- 许可证、账号、确切价格政策未确认。AI 使用情况不作判断。

### 10. PICOHOT

- 作者将其描述为三名 SUPERHOT 团队成员制作的 PICO-8 致敬作品，包含故事关卡与无尽模式；时间随玩家移动推进。
- 页面列 HTML5 和下载版，输入为键盘，明确声明未使用生成式 AI。
- 来源：[作者页与完整署名](https://tarkovsky.itch.io/picohot)。许可证未声明，不将原作品品牌归属推导为任意转载权。

## 第二批 7 个

| # | 游戏 / 官方来源 | 作者 | 玩法与分类依据 | 入口、许可及取舍 |
| --- | --- | --- | --- | --- |
| 11 | [Neural Breach](https://ganzlabs.itch.io/neural-breach) | Mark GanZ | 与四个 AI 守卫对话寻找密码；作者另披露 Code、Text 使用 AI，可同时标两类 | HTML5、开发中演示；作者提示 API 配额有限、服务可能中断。许可未声明；适合实验性 AI 专题 |
| 12 | [Spin & Solve](https://n8soft.itch.io/spinandsolve) | Nathan Smith Manley / N8Soft | 转轮获得奖励或惩罚，猜字母补全短语；AI Disclosure 是 Code，标 ai-assisted | HTML5；作者称免费、由支持者资助。许可未声明。页面的自适应对手不足以证明模型驱动玩法 |
| 13 | [Artificial Puzzle](https://eugene3d.itch.io/artificial-puzzle) | Eugène3D | 使用 AI 生成图片的拼图；明确 Graphics 披露，标 ai-assisted | HTML5 和桌面下载，35–500 块选项；许可未声明。玩法较常见，可补充休闲类别 |
| 14 | [We Become What We Behold](https://ncase.itch.io/wbwwb) | Nicky Case | 用新闻取景表现群体情绪循环，未标 AI | HTML5；作者标代码 Unlicense、素材 CC0，但引用的第三方内容需单独处理。带黑色幽默及暴力内容，简介须准确 |
| 15 | [The Evolution of Trust](https://ncase.me/trust/) | Nicky Case | 合作与博弈论互动游戏，未标 AI | [官方仓库](https://github.com/ncase/trust)为 CC0-1.0，列出的第三方资源仍有各自许可。适合互动思考专题 |
| 16 | [Townscaper 浏览器演示](https://oskarstalberg.com/Townscaper/) | Oskar Stålberg | 放置建筑生成水上小镇，未标 AI | [发行商公告](https://rawfury.com/try-townscaper-for-free-in-your-browser/)确认免费浏览器体验，公告注明较小网格且无保存；这是历史公告的限制说明，当前功能未实测。不可写成免费完整版；许可未声明 |
| 17 | [Agent Breaker](https://play.lakera.ai/agent-breaker) | Lakera | 在其提供的挑战应用中完成 AI 安全解谜，属于面向技术兴趣用户的 AI 玩法 | 当前落地页提供挑战与计分；未实际参与。旧 Gandalf 地址会跳转到这里，不能沿用旧名称介绍新入口。许可、账户及费用未确认 |

## 暂留候选池的 3 个

### 18. Infinite Craft — Neal Agarwal

- [作者入口](https://neal.fun/infinite-craft/)，[作者官方 iOS 页面](https://apps.apple.com/us/app/infinite-craft-by-neal/id6499235533)可补充名称、作者和组合元素玩法来源。
- 本次网页检索可以读取部分页面，普通浏览器遇到 403 验证页面，未绕过。不能据此宣称游戏已下线。
- 尚未从本次读到的作者材料中取得足够明确的 AI 实现说明，正式添加 AI 元数据前补充第一方出处，不能仅凭二手介绍填写模型名称。
- 许可证未知。已有目录中出现一个 `neal-fun` 条目，指向 `https://kaloodinaz.github.io/neal-fun`，并非本候选的作者入口。这里仅记录来源疑点，未修改旧条目。

### 19. Contexto — 当前页面署名 Daydash

- [官方入口](https://contexto.me/)当前跳转到英文首页，显示每日模式、无限模式、登录和去广告入口。
- 作为语义猜词方向的候选保留；本次尚未取得可引用的官方算法说明，暂不决定 AI 分类或沿用网上流传的旧作者署名。
- `/en/daily` 在此次浏览器访问中回到首页，当前具体玩法路径、说明页和账号条件需要补充。许可未确认。

### 20. Sort the Court! — Graeme Borland 等

- [作者页](https://graebor.itch.io/sort-the-court)列 HTML5，署名包括代码 Graeme Borland、绘图 amymja、音乐 Bogdan Rybak；适合王国抉择方向。
- 作者明确提醒旧版在新系统上可能有问题，并将更新后的移动/多语言体验导向 Poki。需明确最终收录的是哪个版本，不能直接承诺作者页完整支持移动端。
- 许可证未知，未标 AI；先保留候选，不据旧页面填兼容性承诺。

## 去重与后续编辑安排

对当前 `src/_data/games.js` 的 2021 条记录按候选名称、slug、官方 URL 片段和 sourceKey 做初步检索，20 个候选未命中同名/同入口；发现上述 `neal-fun` 近似项。此检查不是跨语言别名的完全去重，生成正式条目时仍按最终 URL/sourceKey 校验。

建议首批整理表中 10 个：5 个 AI 相关作品与 5 个独立作品。已有 AI Dungeon、Circuits Royale 不算本次新发现。新增 5 个 AI 条目后共 7 个，仍低于当前 AI 页面 8 个合格条目的索引阈值；可以随后补 Spin & Solve，不能为了数量提前添加尚不明确的 AI 标签。

可从这批内容形成两个专题方向：

- **把世界搭出来**：Sandspiel、Orb.Farm、Tiny Islands、Townscaper 等，再补足 5–12 个合适作品后成专题。
- **文字也能成为玩法**：newdle、Whisperline、TAKEN AS READ、Semantris，加上适合的现有游戏。

正式条目继续使用简短玩法介绍、如何开始、作者外链及 AI 说明。截图优先查作者明确提供的宣传素材和使用条件，未取得合适素材时不伪造实机画面。最初的查找阶段只更新了本清单。

## 首批落实（2026-09-07）

用户确认继续后，已将上表首批 10 款加入 `src/_data/games.js`，并同步到再生成输入 `scripts/js13k-games-merged.json`。新增 ID 为 3037–3046；目录共 2031 款，AI 条目共 7 款。新增 `drawing` 受控玩法标签用于 Quick, Draw!，未达到标签页面生成阈值。

五款新增 AI 游戏均附具体作者说明与来源。Sandspiel、Orb.Farm 使用作者仓库的 MIT 许可，其余八款使用 NOASSERTION；发布日期未知时保留 unknown，截图暂为空。10 款均通过目录内容资格检查，并已生成详情页、外链及 sitemap 条目。尚未部署网站。

验证：`npm run validate` 和 `npm test`（含严格校验与完整构建）通过；另检查了新增 10 页在禁用 JavaScript 后的标题、介绍及作者链接，以及再生成数据一致性。完整测试报告位于 `test-results/html-report/2026-09-07/`，执行日志为 `test-results/catalogue-2026-09-07-test.log`。旧条目的内容质量提示仍为非阻塞警告。
