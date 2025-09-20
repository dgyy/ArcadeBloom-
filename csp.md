# Cloudflare CSP 配置指南

## 目标
仅允许 `arcadebloom.com` 域名内嵌游戏详情页，防止第三方站点通过 iframe 引用。通过 Cloudflare 响应头管理，加上 CSP `frame-ancestors`，浏览器将自动拦截外域嵌入。脚本层的防护仍保留作为补充。

## 操作步骤

### 1. 进入 Transform Rules
1. 登录 Cloudflare，选择站点 `arcadebloom.com`。
2. 左侧导航点击 **Rules → Transform Rules**。
3. 打开 **Response Header Modification** 标签页。
4. 点击 **Create rule** 创建新规则。

### 2. 设置匹配条件
让规则只作用在游戏详情页：
- 条件 1：
  - Field: `URI Path`
  - Operator: `exactly matches`
  - Value: `/game-detail.html`
- 若未来有 slug 形式（如 `/game/hextris`），再添加第二个 OR 条件：
  - Field: `URI Path`
  - Operator: `starts with`
  - Value: `/game/`

可以根据当前站点结构选择其中之一；需要时随时在规则里调整。

### 3. 添加响应头
在 “Then…” 区域添加动作：
- Action: **Set static**
- Header name: `Content-Security-Policy`
- Value:
  ```
  frame-ancestors 'self' https://arcadebloom.com https://www.arcadebloom.com;
  ```
说明：`'self'` 表示允许同源嵌入，后面列出允许的额外域名（这里仅保留主站及 www）。

### 4. 命名并部署
- 给规则命名，例如 `Block external iframe for game details`。
- Scope 默认 `All incoming requests` 即可。
- 点击 **Deploy rule** 保存并启用。

## 验证
1. **查看响应头**：访问游戏详情页，浏览器开发者工具 Network 面板中可看到新的 `Content-Security-Policy`。
2. **外站 iframe 测试**：在其他域名用 `<iframe>` 引用详情页，浏览器会因 CSP 拦截；若 CSP 被绕过，页面中已有的脚本也会弹出“访问受限”提示。
3. **确认普通页面不受影响**：检查首页或营销页响应头，未包含该 CSP，说明依旧可以被外链。

## 补充建议
- 如需更严格，可另加 `X-Frame-Options: SAMEORIGIN`（同样通过 Response Header 规则设置）。
- 若站点结构改动，只需调整规则匹配条件或域名列表。
- 每次修改记得刷新 Cloudflare 缓存后再测试。

通过以上配置，游戏详情页既有服务端 CSP 防护，也保留了前端提示，确保只在 ArcadeBloom 官方域内被嵌入。
