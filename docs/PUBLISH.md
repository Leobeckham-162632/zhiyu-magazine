# 发表、修改、撤回与回滚

## 发表一篇文章

1. 在 [文章文件夹](https://github.com/Leobeckham-162632/zhiyu-magazine/tree/main/src/content/articles) 点击 **Add file → Create new file**。
2. 文件名例如 `my-new-article.md`。复制 [文章模板](ARTICLE_TEMPLATE.md) 的原始文本，包括 Frontmatter 两道 `---`。
3. 修改标题、笔名、日期、栏目、简介、slug 和正文，确认你有权公开这篇作品。不要在公开仓库中保存私人信息或未授权稿件。
4. `slug` 必须唯一，用小写英文、数字、短横线，例如 `an-evening-by-the-river`。同一个作者在每篇文章中使用相同 `authorSlug`、姓名和简介。
5. `issue: "vol-01"` 表示第一期；`draft: false` 才会生成网页。你自己的真实作品请写 `demo: false`，不要冒用示例作者的身份。
6. 点击 **Commit changes**，提交到 `main`。
7. 到 [Actions](https://github.com/Leobeckham-162632/zhiyu-magazine/actions) 等待本次 `build` 和 `deploy` 都成功。
8. 通过正式网站的全部作品、栏目或搜索找到它。独立网址为 `https://leobeckham-162632.github.io/zhiyu-magazine/articles/你的slug/`。

首页、目录、作者页面、栏目列表、搜索索引、RSS 与 Sitemap 均自动更新，不需要逐个手动添加链接。

## 怎么确认朋友也能看到

复制完整 HTTPS 文章链接，在无痕窗口中直接打开并刷新。确认标题、正文和图片都正确，再把链接发给朋友。分享的是正式网站网址，不是 `localhost`、本地文件路径或 GitHub 的编辑页面。

若内容仍旧，先检查工作流是否结束并且成功，再刷新浏览器。失败的构建不会替换上一个已发布版本。

## 修改文章

在 GitHub 中打开对应 Markdown，点击铅笔图标，编辑后提交。尽量保持 `slug` 不变，这样原来的分享网址仍可用。修改作者简介时，需要同时统一该作者其他文章的简介，否则校验会指出不一致。

## 撤回文章

暂时下架：将 `draft` 改为 `true` 后提交。彻底从网站移除：在文件页点击 **… → Delete file** 后提交。下一次成功部署会移除其页面与索引，原链接返回 404。

两种操作都不会清除公开 GitHub 历史，不能用来消除已经公开过的敏感信息。不要将公开仓库当作私人草稿箱。

## 改错了怎么办

普通文字错误：直接再编辑一次并提交即可。

需要恢复旧内容：打开该 Markdown 文件的 **History**，点选修改前的版本，打开原始文件复制内容，再回到 `main` 的文件编辑页替换并提交。若文章已删除，从历史中复制它并按原文件名、原 slug 重新创建。新的提交会自动重新部署。

大范围代码回滚可由熟悉 Git 的维护者执行 `git revert <错误提交>` 后推送，保留审计历史。不要为了回滚删除仓库或强制推送覆盖历史。

## 新增期号

按 README 中的“新增一期杂志”步骤修改 `src/data/site.ts`，并给新文章填写对应 `issue`。切换 `site.currentIssue` 后，首页推荐只读取新一期。往期仍有独立目录网址。

## 自动更新验证方法

先发布六篇版本，再只新增一个 Markdown 文件并推送：等待新工作流成功，确认文章独立页、本期目录、随笔栏目、全部文章、作者页、搜索索引、RSS 与 Sitemap 同时出现新作品。这就是实际公开发布，不依赖本机浏览器存储。

本项目用额外示例《给晚归者留一盏灯》进行该项测试；是否成功、对应部署记录和证据见 [TEST_REPORT.md](TEST_REPORT.md)。
