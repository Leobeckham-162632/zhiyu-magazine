import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = (process.argv[2] ?? 'http://127.0.0.1:4322/zhiyu-magazine/').replace(/\/?$/, '/');
const isPublic = base.startsWith('https:');
const output = `.qa/${isPublic ? 'public' : 'local'}`;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const checks = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(`JS: ${error.message}`));
  page.on('response', (response) => { if (response.status() >= 400 && !response.url().includes('a-page-that-does-not-exist')) failures.push(`HTTP ${response.status()}: ${response.url()}`); });
  const indexResponse = await context.request.get(`${base}search-index.json`);
  assert.equal(indexResponse.status(), 200);
  const entries = await indexResponse.json();
  const origin = new URL(base).origin;
  const sitemap = await (await context.request.get(`${base}sitemap.xml`)).text();
  const routes = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname.replace(new URL(base).pathname, '')).concat('search/'))];
  // 匿名浏览器直接访问每页，并检查四种视口的布局边界。
  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    await page.locator('h1').waitFor();
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, images: [...document.images].every((image) => image.complete && image.naturalWidth > 0) }));
      assert.ok(layout.scroll <= layout.width + 1, `${route} 在 ${width}px 横向溢出：${layout.scroll}`);
      assert.ok(layout.images, `${route} 图片未加载`);
      if (route === '') await page.screenshot({ path: `${output}/home-viewport-${width}.png` });
      if (['', 'issues/vol-01/', 'articles/a-window-for-autumn/', 'search/'].includes(route) && [375, 1440].includes(width)) await page.screenshot({ path: `${output}/${route.replaceAll('/', '-') || 'home'}-${width}.png`, fullPage: true });
      checks.push({ route, width, status: response.status(), overflow: false });
    }
  }
  const lead = entries.find((entry) => entry.title === '把秋天留在窗台上');
  await page.goto(origin + lead.url, { waitUntil: 'networkidle' });
  assert.equal((await page.reload()).status(), 200);
  const body = page.locator('#article-body');
  const before = await body.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  await page.getByRole('button', { name: '放大字号', exact: true }).click();
  assert.ok(await body.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)) > before);
  await page.getByRole('button', { name: '恢复默认字号' }).click();
  assert.equal(await body.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)), before);
  await page.getByRole('link', { name: '返回本期目录 ↗', exact: true }).click();
  assert.ok(page.url().endsWith('/issues/vol-01/'));
  await page.locator('.toc-row h3 a').first().click();
  assert.ok(page.url().includes('/articles/'));
  await page.getByRole('link', { name: '纸屿首页', exact: true }).click();
  assert.equal(page.url(), base);
  await page.goto(`${base}search/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length >= 6);
  const input = page.getByRole('searchbox');
  for (const term of ['窗台', '林汀', '一枚从旧书里落下', '根才好呼吸']) {
    await input.fill(term); await formSubmit();
    await page.waitForFunction(() => document.querySelectorAll('.search-result').length === 1);
    assert.equal(await page.locator('.search-result h2').innerText(), lead.title);
  }
  await input.fill('不存在的关键词qzx'); await formSubmit();
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length === 0);
  assert.ok((await page.locator('#search-status').innerText()).includes('没有找到'));
  await page.getByRole('button', { name: '清空', exact: true }).click();
  await page.waitForFunction((count) => document.querySelectorAll('.search-result').length === count, entries.length);
  await page.getByLabel('栏目', { exact: true }).selectOption('poetry');
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length === 2);
  await page.goto(`${base}search/?q=${encodeURIComponent('修灯')}`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.search-result h2').innerText(), '修灯的人');
  // 恶意关键词必须只是文本，不能成为标签或脚本。
  await input.fill('<img src=x onerror=alert(1)>'); await formSubmit();
  assert.equal(await page.locator('#search-results img').count(), 0);
  await page.getByRole('button', { name: '清空', exact: true }).click();
  await page.waitForFunction((count) => document.querySelectorAll('.search-result').length === count, entries.length);
  const added = entries.find((entry) => entry.title === '给晚归者留一盏灯');
  if (added) { await input.fill(added.title); await formSubmit(); assert.equal(await page.locator('.search-result h2').innerText(), added.title); await page.goto(`${base}categories/notes/`); assert.ok((await page.locator('main').innerText()).includes(added.title)); await page.goto(`${base}issues/vol-01/`); assert.ok((await page.locator('main').innerText()).includes(added.title)); }
  await page.goto(base); await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), '跳至正文');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'main');
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(base);
  await page.getByRole('link', { name: '搜索作品', exact: true }).click();
  await page.getByRole('searchbox').fill('修灯'); await formSubmit();
  await page.getByRole('link', { name: '修灯的人', exact: true }).click();
  await page.getByRole('button', { name: '放大字号', exact: true }).click();
  await page.getByRole('button', { name: '恢复默认字号', exact: true }).click();
  await page.getByRole('link', { name: '返回本期目录 ↗', exact: true }).click();
  assert.ok(page.url().endsWith('/issues/vol-01/'));
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const noJSPage = await noJS.newPage(); await noJSPage.goto(origin + lead.url);
  assert.ok((await noJSPage.locator('#article-body').innerText()).includes('银杏叶'));
  assert.equal(await noJSPage.locator('#reading-toolbar').isVisible(), false);
  await noJS.close();
  if (isPublic) { const missing = await page.goto(`${base}a-page-that-does-not-exist/`); assert.equal(missing.status(), 404); assert.ok((await page.locator('h1').innerText()).includes('暂未靠岸')); }
  assert.deepEqual(failures, [], failures.join('\n'));
  const result = { testedAt: new Date().toISOString(), base, anonymous: true, articles: entries.length, responsiveChecks: checks.length, routes: routes.length, widths: [375,768,1024,1440], directArticleAndRefresh: true, search: ['标题','作者','简介','正文','空结果','栏目','URL查询','安全文本'], fontControl: true, keyboard: true, mobileInteractions: true, noJavaScriptReading: true, updateArticlePresent: Boolean(added), failures, checks };
  await writeFile(`${output}/result.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, checks: undefined }, null, 2));
  async function formSubmit() { await page.getByRole('button', { name: '搜索', exact: true }).click(); }
} catch (error) {
  await writeFile(`${output}/failure.json`, JSON.stringify({ message: String(error), failures, checks }, null, 2));
  throw error;
} finally { await browser.close(); }
