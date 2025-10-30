# 游戏详情页 Google 广告排查报告

## 摘要
- 线上游戏详情页缺少 Google AdSense 引导脚本，自动广告未初始化，导致页面无广告展示。

## 证据
- game-detail.html:569 仅引用站内脚本 games-data.js 和 js/game-detail.js，未包含 <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?...">。
- 其他页面（例如 index.html:515）已正确引入上述脚本，说明模板原本支持该广告方案。
- 通过 curl -L https://arcadebloom.com/game-detail 抓取线上源码并搜索 dsbygoogle，确认无任何匹配结果。

## 根因分析
- 详情页模板遗漏 AdSense 脚本，单独设置 <meta name="google-adsense-account"> 无法触发自动广告加载，导致广告单元未渲染。

## 修复建议
- 将和首页一致的 AdSense 异步脚本加入 game-detail.html 的 <head> 中，确保 /game/{slug} 路径使用该模板。
- 发布后清理 CDN 缓存，并在浏览器开发者工具确认 pagead2.googlesyndication.com 请求出现以及广告位成功渲染。
