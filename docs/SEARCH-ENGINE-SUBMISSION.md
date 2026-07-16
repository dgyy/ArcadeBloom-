# 搜索引擎 Sitemap 提交 + robots.txt 修复清单

## 状态总览

| 搜索引擎 | 提交方式 | 状态 |
|---|---|---|
| **IndexNow (Bing/Yandex)** | API ping | ✅ 已提交（HTTP 202） |
| **Yandex** | ping API | ✅ 已提交（HTTP 200） |
| **Google** | Search Console | ⏳ 需手动提交（旧 ping API 已废弃） |
| **Bing** | Webmaster Tools | ⏳ 需手动提交（旧 ping API 已废弃） |
| **IndexNow 密钥文件** | /arcadebloom2026.txt | ⏳ 需推送上线 |

---

## 🔴 紧急：修复 Cloudflare 屏蔽 AI 爬虫（必须你操作）

**问题**：你在 Cloudflare 开了某个 AI/Bot 管理功能，它自动往 robots.txt 注入了 61 行 "Cloudflare Managed Content"，**屏蔽了所有 AI 爬虫**：

```
User-agent: ClaudeBot       Disallow: /
User-agent: GPTBot          Disallow: /
User-agent: Google-Extended  Disallow: /
User-agent: CCBot           Disallow: /
User-agent: PerplexityBot   Disallow: /  (可能也有)
...
```

这直接**抵消了之前所有 AI SEO 工作**——ChatGPT、Claude、Perplexity、Google AI Overviews 全部无法抓取你的站点。

### 修复步骤（Cloudflare Dashboard）

1. 登录 Cloudflare → 选 arcadebloom.com 域名
2. 进 **Security → Bots**（或 **Security → WAF → Bot fight mode**）
3. 找到 **"AI Audit"** 或 **"AI scraping defense"** 相关开关 → **关闭**
4. 或者进 **Security → Settings**，找 "Block AI bots" / "AI Labyrinth" → **关闭**
5. 验证：等 1-2 分钟后 `curl https://arcadebloom.com/robots.txt` 应该只剩 4 行（你自己的）

> **为什么关闭**：目录站要被 AI 引擎引用才有流量。屏蔽 AI 爬虫 = 放弃 AI 搜索这个流量来源。如果担心训练抓取，可以只屏蔽 CCBot（Common Crawl，纯训练用），保留 ClaudeBot/GPTBot/Google-Extended（搜索+引用用）。

### 理想的 robots.txt（修复后应该回到这个）

```
User-agent: *
Allow: /

Sitemap: https://arcadebloom.com/sitemap.xml
```

---

## ⏳ Google Search Console 提交（需你操作）

1. 打开 https://search.google.com/search-console
2. 添加属性 → URL 前缀 → `https://arcadebloom.com`
3. 验证所有权（推荐：DNS TXT 记录，在 Cloudflare DNS 里加）
4. 进 **Sitemaps** → 提交 `https://arcadebloom.com/sitemap.xml`
5. 等 1-7 天，Google 开始收录 3000+ 页面
6. 提交后检查 **Coverage** 报告，确认无错误

> Google 的旧 ping API (`/ping?sitemap=`) 已于 2023 年废弃（返回 404），**必须通过 Search Console 提交**。

---

## ⏳ Bing Webmaster Tools 提交（需你操作）

1. 打开 https://www.bing.com/webmasters
2. 用 Google 账号或微软账号登录
3. 添加站点 → 验证（同样用 DNS 或 meta tag）
4. 进 **Sitemaps** → 提交 `https://arcadebloom.com/sitemap.xml`
5. Bing 也会把数据同步到 Yahoo 和 DuckDuckGo

> Bing 的旧 ping API 也已废弃（返回 410），**必须通过 Webmaster Tools**。但 IndexNow（已提交）会覆盖 Bing 的快速收录通道。

---

## ✅ IndexNow（已自动提交）

IndexNow 是 Bing/Yandex/Seznam/Naver 联合的协议——提交一次，多个搜索引擎收到通知。

- **已提交**：HTTP 202（接受）
- **密钥文件**：`/arcadebloom2026.txt`（需推送上线后生效）
- **协议**：https://indexnow.org

后续更新页面后，可以重新 ping：
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{"host":"arcadebloom.com","key":"arcadebloom2026","urlList":["https://arcadebloom.com/"]}'
```

---

## 验证提交是否生效

提交后 1-2 周，检查：

| 检查项 | 怎么查 |
|---|---|
| Google 收录 | `site:arcadebloom.com` 在 Google 搜索 |
| Bing 收录 | `site:arcadebloom.com` 在 Bing 搜索 |
| sitemap 状态 | Search Console / Webmaster Tools 的 Sitemaps 报告 |
| AI 引擎引用 | 在 ChatGPT/Perplexity 问 "best browser games" 看是否引用 |

---

## 快速验证命令（提交后用）

```bash
# 检查 robots.txt 是否还屏蔽 AI（修复后应该只有 4 行）
curl https://arcadebloom.com/robots.txt

# 检查 sitemap 可访问
curl -o /dev/null -w "%{http_code}" https://arcadebloom.com/sitemap.xml

# 检查 IndexNow 密钥文件
curl https://arcadebloom.com/arcadebloom2026.txt

# 重新 ping IndexNow（更新内容后）
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{"host":"arcadebloom.com","key":"arcadebloom2026","urlList":["https://arcadebloom.com/sitemap.xml"]}'
```
