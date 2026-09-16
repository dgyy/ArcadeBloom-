# Circle Club

一个面向全球玩家的全英文画圆小游戏：打开即玩、松手评分、每日挑战、最近 30 次本机纪录、携带分数的好友挑战链接、PNG 战绩卡。没有账号和外部服务，不收集玩家资料，不虚构排行榜或在线人数。

## 本地运行

需要 Node.js 18 或以上，无需安装依赖。

```sh
npm start
```

打开 http://localhost:3000 。`PORT` 环境变量可更改端口。运行 `npm test` 验证评分和挑战参数。

## 发布

将 `index.html`、`style.css`、`app.js`、`game.js`、`favicon.svg` 放到任意支持 HTTPS 的静态网站托管根目录即可。也可运行 Node 服务并由 HTTPS 反向代理转发。分享地址自动使用当前域名，无需配置。只有发布到可公开访问的域名后，外部朋友才能打开链接；localhost 仅供本机使用。

Copy link 按钮仅复制纯 URL，不调用系统分享面板或任何社交平台；剪贴板权限不可用时提供手动选择和复制。下载战绩卡可与挑战链接一同发送。分享卡不含二维码。

## 玩法与实现

鼠标或触摸围绕中心一笔画圆。键盘聚焦画布，回车开始，方向键画线，Shift 微调，回车结束，Esc 重置。圆度按半径偏差、首尾距离、角度覆盖与冗余路径评分；每日模式额外比较目标大小，同一 UTC 日期的目标一致，进入或切换模式时选择日期。好友链接中的日期会固定题目。

成绩保存在 localStorage，禁用存储时仍可玩。分享分数是趣味挑战参数，并非服务端验证的竞技成绩。实际传播效果取决于发布渠道和玩家反馈。

## SEO 与 AI 搜索可读性

正式网址为 https://arcadebloom.com/play/circle-club/ ，目录介绍为 https://arcadebloom.com/game/circle-club/ 。HTML 已包含 canonical、搜索摘要、Open Graph / Twitter 分享信息、VideoGame 与 WebPage 结构化数据，以及无需 JavaScript 即可读取的玩法、评分和常见问题。挑战参数不改变 canonical。

本目录是独立运行副本；网站实际发布 `src/static/play/circle-club/`。本次 SEO 正文、元数据和样式已同步两处。正式网址和分享图片使用 ArcadeBloom 的绝对地址；如果将游戏迁移至其他域名，需要同步修改这些地址及结构化数据。`robots.txt`、站点地图和 `llms.txt` 由主站提供，不在游戏子目录重复配置。

这些改动改善可抓取性与事实可引用性，不保证排名、收录或 AI 引用。
