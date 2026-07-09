# Cloudflare Pages 配置检查（网站没更新的根因修复）

## 问题
旧站文件（根目录 `index.html` 等）已从 git 删除并推送。但如果 Cloudflare Pages
的构建配置不对，它仍然无法生成新站。**必须确认以下 3 项配置正确。**

## 必须检查的 3 项配置（Cloudflare Dashboard）

进入：Cloudflare → 你的 Pages 项目 → Settings → Builds & deployments

### 1. Build command（构建命令）必须设为：
```
npm run build
```
- 如果是空的或配成了别的（比如 `npm run build:css` 只跑一半），构建会失败或不完整。
- 这会执行 `tailwindcss` 编译 CSS + `eleventy` 生成 HTML。

### 2. Build output directory（输出目录）必须设为：
```
dist
```
- **不能是 `.`（根目录）或空**——之前问题就出在这：根目录有旧 index.html，CF 直接用了它。
- 必须指向 `dist`，因为 `.eleventy.js` 配置输出到 `dist/`。

### 3. 环境变量（Environment variables）必须有：
```
NODE_VERSION = 18
```
（或 20）。如果没有，Cloudflare 用默认 Node 版本，可能与依赖不兼容。

## 验证配置后

1. 改完配置后，进 Cloudflare → Deployments → 找最新部署 → **Retry deployment**（或推一个空提交触发）
2. 等构建完成（约 1-2 分钟），点进 deployment 看 **Build log**：
   - 应该看到 `> eleventy` 和 `Wrote 416 files`
   - 如果看到错误，复制错误信息
3. 构建成功后，访问 https://arcadebloom.com/，确认：
   - title 是 "Discover the Best Free Browser Games — ArcadeBloom"（新）
   - 不再引用 `cdn.tailwindcss.com`（旧）

## 如何确认构建真的成功了

在 Build log 里搜索这些关键行：
```
> arcadebloom@2.0.0 build
> npm run build:css && eleventy
...
[11ty] Copied 237 files / Wrote 416 files in 0.65 seconds
```

如果看到 `Wrote 416 files`，构建就成功了。

## 如果构建失败

最常见错误及解法：

| 错误 | 原因 | 解法 |
|---|---|---|
| `eleventy: command not found` | 依赖没装 | 确认 build command 是 `npm run build`（会先 npm install） |
| `Cannot find module 'tailwindcss'` | 同上 | 同上 |
| 空白输出 / 还是旧站 | output dir 配错 | 改成 `dist` |
| Node 版本错误 | 缺 NODE_VERSION | 加环境变量 `NODE_VERSION=18` |

## 快速触发重新部署（不改代码）

如果改了配置想立刻验证，推一个空提交：
```bash
git commit --allow-empty -m "trigger redeploy" && git push
```
