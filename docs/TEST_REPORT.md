# 纸屿测试报告

日期：2026-10-10，Asia/Taipei（UTC+08:00）。JSON 中的时间为 UTC。

正式网站：https://leobeckham-162632.github.io/zhiyu-magazine/

## 已验证

- GitHub 登录账号 `Leobeckham-162632`，新建公开仓库，管理员权限，实际推送工作流成功。
- Pages API 启用 `workflow` 来源、`https_enforced: true`。
- 首次部署运行 [38055746272](https://github.com/Leobeckham-162632/zhiyu-magazine/actions/runs/38055746272)：build/deploy 均 success，匿名公网首页 HTTPS 200，正文包含品牌。
- 七篇版本本地 `npm run check`：0 errors / 0 warnings / 0 hints。
- 生产构建成功：28 个 HTML 页面，另有搜索索引、RSS 与 Sitemap。
- 静态检查：764 个内部链接和资源引用，全部存在，全部兼容项目部署前缀。
- 本地及公网匿名 Chromium：全部 27 个正常 HTML 路由 × 375、768、1024、1440px = 各 108 项响应式检查，无水平溢出、无图片加载失败。
- 全部七篇文章直接访问成功；文章刷新、首页到目录到文章跳转通过。
- 标题、作者、摘要、正文、栏目、无结果、URL 查询与恶意关键词纯文本处理通过。
- 字号放大、重置、键盘跳至正文、关闭 JavaScript 后阅读通过。
- 桌面和手机首页截图已人工查看，编辑式排版、单栏切换与封面显示正常。
- npm 安装审计：0 vulnerabilities（检查当时结果）。

## 已修复

静态链接检查发现 404 页的默认 Canonical 指向 `/404/`，而真实产物为 `/404.html`。已修正并重新构建，链接检查通过。

## 正式部署与新增文章验证

| 阶段 | 提交 | Actions | 结果 |
| --- | --- | --- | --- |
| 首次最小首页 | `396765f` | [38055746272](https://github.com/Leobeckham-162632/zhiyu-magazine/actions/runs/38055746272) | build、deploy success，匿名 HTTPS 200 |
| 完整六篇版本 | `69a202c` | [38056573734](https://github.com/Leobeckham-162632/zhiyu-magazine/actions/runs/38056573734) | build、deploy success，25 个正常页面、100 项视口检查通过 |
| 只新增一篇 Markdown | `a37e25b` | [38056707552](https://github.com/Leobeckham-162632/zhiyu-magazine/actions/runs/38056707552) | build、deploy success，公开作品从 6 增至 7 |

第七篇《给晚归者留一盏灯》的提交只增加 `src/content/articles/a-light-for-latecomers.md`，没有手动修改页面、栏目、目录、作者或搜索文件。约 21:43 的匿名请求确认以下 9 处全部返回 200，且包含新文章标题或 slug：

1. 正式首页
2. 新文章独立网址
3. 全部作品列表
4. 随笔栏目
5. 自动生成的沈灯作者页
6. VOL.01 本期目录
7. 搜索索引（7 篇）
8. RSS
9. Sitemap

公网浏览器也实际搜索到新文章，并验证栏目和目录更新。这是公开发布，未使用 localStorage 保存或发布文章。该篇保留为额外试刊原创示例。

公网测试使用 Playwright 1.62.1 与 Chromium，全新无登录上下文，不复用用户 Cookie，不关闭 HTTPS 证书校验。全部作者页和全部七篇文章均在测试路由中。手机宽度还实际点击搜索、搜索结果、字号按钮和返回目录。不存在的路径返回真正 HTTP 404，并显示纸屿自定义页面。

测试期间未捕获页面 JavaScript 错误或非预期 HTTP 4xx/5xx 资源响应。站点元信息、中文 lang、每页唯一 H1、Canonical 和 Open Graph 已检查。示例作者标签依照作品 `demo` 字段生成，后续真实作品不会一律标成虚构作者。

## 可查看的原始证据

- [生产构建与链接检查](qa/build.json)
- [本地七篇浏览器结果](qa/local-seven-articles.json)
- [六篇公网基线](qa/public-six-articles.json)
- [七篇公网 108 项响应式及功能结果](qa/public-seven-articles.json)
- [只新增 Markdown 后的九处公网更新](qa/update-public.json)
- [桌面首页全页](qa/home-desktop.png)
- [375px 手机首页](qa/home-375.png)
- [768px 平板首页](qa/home-768.png)
- [1024px 首页](qa/home-1024.png)
- [手机文章阅读全页](qa/article-mobile.png)

视口截图已人工查看。JSON 包含各路由、宽度、状态和实际测试时间。构建检查、浏览器检查可用 README 中的命令重复执行；真实失败时脚本返回非零退出码。GitHub Actions 包含类型与静态链接检查，浏览器测试由本地维护流程运行，不宣称每次 CI 都执行浏览器测试。

Git 跟踪文件未包含 node_modules、dist、.env、访问令牌或本地私人文件。七篇示例分布为散文 2、诗歌 2、小说 1、文学评论 1、随笔 1。

## 验证范围

Chromium 桌面浏览器模拟视口，非实体手机、平板或 Safari 实机测试。当前网络访问成功不能证明所有地区、运营商均可访问；GitHub Pages 在不同网络下的连通性仍需由读者实际确认。

自动检查不等于完整无障碍认证，也没有进行负载压力测试。网站无需注册，测试浏览器未复用用户登录状态。

## 交付状态区分

| 状态 | 内容 |
| --- | --- |
| 已验证成功 | 安装、开发预览、构建、类型与 Schema、页面资源、匿名 HTTPS、四档响应式、搜索、阅读、404、真实新增自动发布 |
| 已完成但未做实机验证 | 响应式样式已经浏览器模拟验证；实体手机/平板、Safari/Firefox、屏幕阅读器人工审计未做 |
| 因授权或环境未完成 | 无任务书必需项受阻，无需用户追加授权 |
| 后续可升级 | 独立域名、真实投稿授权管理、更多期号、进一步无障碍审计 |

没有购买域名、建立收费服务或增加后台数据库。
