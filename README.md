# 纸屿文学杂志 · ZHIYU Literary Magazine

一本具有纸质刊物气质的独立文学试刊：免费公开阅读，无需注册。项目采用静态网站架构，没有服务器、数据库、广告或付费服务。

- **正式网站**：[https://leobeckham-162632.github.io/zhiyu-magazine/](https://leobeckham-162632.github.io/zhiyu-magazine/)
- **公开仓库**：[Leobeckham-162632/zhiyu-magazine](https://github.com/Leobeckham-162632/zhiyu-magazine)
- **部署状态**：[查看 GitHub Actions](https://github.com/Leobeckham-162632/zhiyu-magazine/actions)
- 默认分支：`main`。托管：GitHub Pages。首次 HTTPS 上线已实测返回 200。
- 具体测试证据和验证范围见 [测试报告](docs/TEST_REPORT.md)。

本站是文学展示与技术实验，非正式登记期刊，无正式刊号。试刊示例作品由 AI 为本站创作，笔名与作者资料均为虚构，并在页面明确标注。不要将试刊示例误认为真实作家的来稿。

## 已有页面与功能

首页包含原创封面、本期主题、卷首语、主编推荐、最新作品、栏目入口与介绍；另有本期及往期目录、全部文章、五个栏目、自动生成的作者档案、独立文章阅读页、站内搜索、关于、站点说明及 404 页面。

文章页提供上/下一篇、相关文章、返回目录和字号调节。支持 Markdown 分节、引用、诗歌换行。搜索支持标题、作者、简介与正文，免费运行于浏览器。核心阅读不依赖 JavaScript。提供 Canonical、Open Graph、RSS 与 Sitemap。

## 使用的技术

- Astro 7、TypeScript、HTML、CSS，以及少量浏览器 JavaScript。
- Markdown + Astro Content Collections：每篇文章一个文件，构建时校验元数据。
- npm + 提交在仓库的 `package-lock.json`，使用 Node.js 24。
- GitHub Actions 使用 Astro 官方 `withastro/action@v6` 构建并上传产物，`actions/deploy-pages@v5` 发布。
- Playwright 仅用于开发测试和生成分享图，不是网站访客需要下载的依赖。
- 系统宋体风格字体及回退方案，无外部字体 CDN、图床和第三方追踪脚本。

部署方式参考 [Astro 官方 GitHub Pages 文档](https://docs.astro.build/en/guides/deploy/github/)。

## 最简单的发表方法：在 GitHub 网页新增文章

1. 打开 [文章文件夹](https://github.com/Leobeckham-162632/zhiyu-magazine/tree/main/src/content/articles)。
2. 点击 **Add file → Create new file**（添加文件 → 创建新文件）。
3. 文件名填写小写英文，例如 `my-new-article.md`，后缀一定是 `.md`。
4. 打开 [可复制的文章模板](docs/ARTICLE_TEMPLATE.md)，点击 **Code** 查看原始文件。复制包括开头和结尾 `---` 在内的全部内容。
5. 将模板粘贴到新文件中，修改标题、笔名、日期、栏目、简介和正文。
6. 点击 **Commit changes**（提交更改），填写“发表：文章标题”，选择直接提交到 `main`，再点击提交。
7. 打开 [Actions](https://github.com/Leobeckham-162632/zhiyu-magazine/actions)，等待这次 **Deploy to GitHub Pages** 出现绿色勾。
8. 打开正式网站，在“全部作品”和对应栏目中找到文章。复制网址发给朋友即可，无需他们登录。

提交后不必修改首页、目录、作者列表或搜索文件。构建会自动生成这些内容。部署完成通常需要几分钟；绿色勾以前，公众可能仍看到上一版。**本地保存和 GitHub 草稿不等于公开发表。**

### Frontmatter 怎么填

文章开头两个 `---` 之间是元数据，下面才是正文。字符串建议保留英文双引号；不要使用全角冒号替换字段后的 `:`。

| 字段 | 填写方式 |
| --- | --- |
| `title` | 文章标题，1–100 字 |
| `subtitle` | 可选副标题，不需要时删除这一行 |
| `slug` | 独立网址的小写英文名，例如 `my-new-article`；全站唯一，发表后尽量不要改 |
| `author` | 作者署名 |
| `authorSlug` | 作者网址的小写英文名，例如 `lin-ting` |
| `authorBio` | 作者简短介绍；同一作者的姓名、authorSlug、简介应在每篇中保持一致 |
| `date` | `YYYY-MM-DD`，如 `2026-10-10`；保留双引号 |
| `category` | 下表中的英文栏目值之一 |
| `summary` | 简介，10–240 字 |
| `issue` | 所属期号，如 `vol-01`，必须已在 `src/data/site.ts` 登记 |
| `featured` | `true` 为主编推荐，`false` 为普通作品；只推荐本期文章 |
| `order` | 本期阅读顺序，从小到大；上/下一篇按此排序，目录按栏目分组 |
| `draft` | `false` 为参与发布，`true` 为不生成页面和索引 |
| `demo` | 本站 AI 示例填写 `true`；你自己已获授权的真实作品填写 `false` |

注意：公开仓库中的 `draft: true` 文件仍然能被别人从 GitHub 阅读，不能用来保存私人或保密稿件。

| 栏目 | `category` 的值 |
| --- | --- |
| 小说 Fiction | `fiction` |
| 散文 Essays | `essays` |
| 诗歌 Poetry | `poetry` |
| 随笔 Notes | `notes` |
| 文学评论 Reviews | `reviews` |

正文段落之间空一行。分节写 `## 小标题`。引用以 `>` 开头。诗歌每行末尾留两个英文空格再回车，空一行表示新诗节。只写普通 Markdown 即可；不要粘贴不可信的 HTML 或脚本，Markdown 中的原生 HTML 可能被框架作为代码渲染。

## 修改与删除文章

**修改**：进入文章文件，点击铅笔图标 **Edit this file**，改完后点 **Commit changes**。默认分支部署成功后，原网址显示新内容。保持 `slug` 不变，可保留原分享链接。

**删除**：进入文件，右上角菜单 **… → Delete file**，再提交。下一次部署会移除它的页面、目录、栏目和索引，旧分享链接将显示 404。如果只是暂时撤下，可以把 `draft` 改为 `true`，但文件内容仍在公开仓库历史中。

不小心改错时，可以通过 GitHub 文件的 **History** 找到旧版本，复制旧内容重新提交。详细步骤见 [发表与回滚说明](docs/PUBLISH.md)。

## 新增一期杂志

1. 打开 [src/data/site.ts](src/data/site.ts)，复制 `issues` 数组中的一期对象。
2. 新对象使用唯一 `id`，如 `vol-02`；填写 `number`、`title`、`month`、`theme`、`subtitle` 和 `editorial`。
3. 先增加该期文章，把它们的 `issue` 填为 `vol-02`。旧文章仍保留 `vol-01`。
4. 准备好后把 `site.currentIssue` 改为 `vol-02`，提交。新一期会出现在首页、目录和往期入口中。

新刊上线时应在一次提交中同时更新期号与文章；也可以先登记期号，后添加文章，最后切换首页。不存在的期号会使构建失败，避免静默产生错误目录。

## 修改刊名、LOGO 与首页文案

- 刊名、英文名、简介、当前期号、卷首语与主题：`src/data/site.ts`。
- 首页大标题、介绍短句和编辑版式：`src/pages/index.astro`。
- 顶部品牌、小标识、导航、页脚：`src/layouts/BaseLayout.astro`。
- 浏览器图标：`public/favicon.svg`。
- 原创封面与窗景：`public/images/island.svg`、`window.svg`。
- 分享预览图：`public/images/social.png`。修改品牌后，在本地调整并运行 `node scripts/create-social.mjs` 重新生成。
- 颜色、字体、移动端排版：`src/styles/global.css`。

`site.tagline` 为可复用文案字段；首页大标题有分行和下划线设计，实际显示文字请在 `index.astro` 修改。系统字体回退不保证所有设备字形完全相同。

## 本地启动（仅用于预览）

1. 安装 [Node.js 24 LTS](https://nodejs.org/)，包含 npm。
2. 在电脑中克隆仓库，或从 GitHub **Code → Download ZIP** 下载并解压。
3. 在项目文件夹打开终端，执行：

```bash
npm ci
npm run dev
```

打开终端提示的地址，默认是 `http://127.0.0.1:4321/zhiyu-magazine/`。停止时按 `Ctrl+C`。

本地网址只能供本机预览。**只有把修改提交并推送到 GitHub，且 Actions 发布成功后，正式公网网站才会更新。**

检查生产版本：

```bash
npm run check
npm run build
npm run test:build
npm run preview -- --port 4322
```

预览地址为 `http://127.0.0.1:4322/zhiyu-magazine/`。构建输出在 `dist/`，不需要提交该文件夹。

## 自动部署与失败排查

工作流文件为 `.github/workflows/deploy.yml`。推送 `main` 自动触发，也可以在 **Actions → Deploy to GitHub Pages → Run workflow** 手动触发。

查看 [部署状态](https://github.com/Leobeckham-162632/zhiyu-magazine/actions)：点击最近一次运行，先看 `build`，再看 `deploy`。二者为绿色才表示成功。构建失败时不会把坏版本发布出去，之前的正式版本会保留。

常见错误：

| 现象 | 怎么处理 |
| --- | --- |
| 提示文章数据不符合 Schema | 按日志指明的文件和字段修复；检查日期、栏目英文值、摘要长度、布尔值与缩进 |
| 重复 slug | 为新文章换一个唯一 slug；不要修改旧文章网址来迁就重复 |
| 未知期号 | 先在 `src/data/site.ts` 登记期号 |
| 同作者资料不一致 | 统一所有使用该 `authorSlug` 的文章中的作者名称与简介 |
| 依赖安装失败 | 查看官方服务状态；在该次运行点击 **Re-run jobs**；本地用 Node 24 和 `npm ci` 复现 |
| Pages 发布权限错误 | 仓库 **Settings → Pages → Build and deployment → Source → GitHub Actions**；检查工作流的 `pages: write`、`id-token: write` 与 `github-pages` 环境 |
| 文章 404 | 确认最近一次工作流成功，地址带 `/zhiyu-magazine/`，slug 正确且 `draft: false` |
| 网站仍是旧内容 | 等待部署完成，刷新或无痕窗口打开；检查改动是否已进入 `main` |

本站的 `astro.config.mjs` 明确设置 `site` 和 `base`。所有内部链接统一调用 `src/utils/urls.ts`，不要直接写不带前缀的 `/articles/...`。改仓库名或迁移账号时需一起更新这些配置、测试脚本中的域名/前缀及文档链接。

## 测试与维护

```bash
# 类型、内容 Schema、生产构建、全部内部页面与资源链接
npm run check
npm run build
npm run test:build

# 首次需要浏览器时安装 Chromium；CI 发布无需此步骤
npx playwright install chromium
# 先在另一个终端启动 npm run preview -- --port 4322
npm run test:browser
# 对正式站点执行同样的匿名浏览器检查
node scripts/browser-qa.mjs https://leobeckham-162632.github.io/zhiyu-magazine/
```

结果和截图写入忽略提交的 `.qa/`；已交付的测试证据保存在 `docs/qa/`。建议定期检查 Actions、执行 `npm audit`，在本地验证依赖更新后再提交 `package.json` 和 `package-lock.json`。不要上传 `node_modules`、`.env`、令牌或私人稿件。

## 以后绑定独立域名

本阶段没有购买域名，也无需购买。将来有自己的域名时：

1. 按 [GitHub 官方域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) 配置 DNS。
2. 在 **仓库 Settings → Pages → Custom domain** 输入域名，等待验证并启用 **Enforce HTTPS**。
3. 在 `public/CNAME` 中写入域名，不含 `https://` 和路径。
4. 修改 `astro.config.mjs`：`site` 为新的 HTTPS 域名，`base` 改为 `/`。
5. 更新 README、脚本内的校验域名与前缀，重新构建、发布，验证首页、文章、图片、搜索、Canonical、RSS 与 Sitemap。

无需改成服务器或数据库架构。

## 目录说明

```text
.github/workflows/deploy.yml   自动校验、构建和发布
public/                       图标与自制视觉资源
src/content/articles/         每篇文章一个 Markdown 文件
src/content.config.ts         文章元数据校验
src/data/site.ts              刊名、栏目、期号、卷首语
src/components/               可复用的文章卡片
src/layouts/                  页面框架与 SEO
src/pages/                    页面路由、RSS、Sitemap、搜索索引
src/styles/                   排版与响应式样式
src/utils/                    网址、文章排序与 XML 转义
scripts/                      构建检查与浏览器测试
docs/                         模板、发表教程、部署说明、测试证据
```

代码采用 MIT 许可证。示例文章和本项目原创视觉采用 CC BY 4.0，参见 [LICENSE](LICENSE)。第三方作品发表前需取得授权并更新相应权利说明。
