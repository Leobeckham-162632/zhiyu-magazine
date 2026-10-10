# 部署与账号权限

## 实际配置

| 项目 | 配置 |
| --- | --- |
| GitHub 身份 | `Leobeckham-162632` |
| 公开仓库 | `Leobeckham-162632/zhiyu-magazine` |
| 默认分支 | `main` |
| 正式网站 | https://leobeckham-162632.github.io/zhiyu-magazine/ |
| Pages 来源 | GitHub Actions，API `build_type: workflow` |
| HTTPS | Pages API `https_enforced: true`，公网 HTTPS 已实测 |
| Node.js | 24 |
| 构建 | `npm run check && npm run build && npm run test:build` |
| 输出目录 | `dist/` |
| 工作流 | `.github/workflows/deploy.yml` |
| 部署环境 | `github-pages` |
| 触发 | 推送 `main` 或手动 `workflow_dispatch` |

账号已通过 GitHub CLI OAuth 登录。完成任务时实测拥有新仓库管理员权限，可以创建公开仓库、推送代码、提交工作流和管理 Pages。未在仓库保存访问令牌、密码或个人邮箱。

## 自动部署

构建作业使用 `actions/checkout@v7` 与 Astro 官方 `withastro/action@v6` 安装依赖、执行类型与链接检查、构建并上传 Pages 产物。部署作业使用 `actions/deploy-pages@v5` 发布，地址来自其 `page_url` 输出。

工作流只申请 `contents: read`、`pages: write`、`id-token: write`。仓库中的 `package-lock.json` 随源码提交。`node_modules`、`.astro`、`dist`、`.env` 与本地临时结果被忽略。

## 路径注意

`site: 'https://leobeckham-162632.github.io'`，`base: '/zhiyu-magazine'`，`trailingSlash: 'always'`。每个内部网址使用 `src/utils/urls.ts`。文章静态生成为 `articles/<slug>/index.html`，可以独立访问和刷新。

404 的真实产物是 `dist/404.html`。它的 Canonical 指向 `/zhiyu-magazine/404.html`，并使用 `noindex`。不要把不存在的 `/404/` 当成一个正常栏目页面。

## Pages 设置入口

已经通过 API 启用，无需再次手动操作。迁移仓库或排查权限时，入口为：

[仓库 Settings → Pages](https://github.com/Leobeckham-162632/zhiyu-magazine/settings/pages) → **Build and deployment → Source → GitHub Actions**。

查看 [Actions](https://github.com/Leobeckham-162632/zhiyu-magazine/actions)，绿色勾表示本次运行成功，失败时点开具体步骤查看日志。

## 验证部署

1. 检查 `build` 和 `deploy` 结论为 `success`。
2. 从 Pages API 或工作流环境输出读取真实网址，不靠猜测。
3. 无登录请求正式首页，确认 HTTPS、200 状态和正文。
4. 无登录 Chromium 直接进入文章并刷新，检查样式资源、链接与搜索。
5. 新增文章并再次部署，确认公众页面更新。

首次运行：[38055746272](https://github.com/Leobeckham-162632/zhiyu-magazine/actions/runs/38055746272)，2026-10-10 21:27（台北时间）发布成功，匿名首页请求 200。后续运行和测试结果见测试报告。

## 参考

- [Astro 官方 GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

本阶段没有创建付费资源，没有购买域名，没有引入外部数据库。
