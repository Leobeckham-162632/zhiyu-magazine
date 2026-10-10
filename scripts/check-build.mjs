import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const base = '/zhiyu-magazine/';
const origin = 'https://leobeckham-162632.github.io';
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
let checkedLinks = 0;
const errors = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="zh-CN"/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `每页需要一个 h1：${file}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith(`${origin}${base}`), `canonical 错误：${file}`);
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = raw.replace(/&amp;/g, '&');
    if (/^(?:#|mailto:|tel:|data:)/.test(value)) continue;
    const link = new URL(value, canonical);
    if (link.origin !== origin) continue;
    checkedLinks++;
    if (!link.pathname.startsWith(base)) { errors.push(`缺少部署前缀 ${file}: ${value}`); continue; }
    let target = path.join(root, decodeURIComponent(link.pathname.slice(base.length)));
    if (link.pathname.endsWith('/')) target = path.join(target, 'index.html');
    try { await stat(target); } catch { errors.push(`目标不存在 ${file}: ${value}`); }
  }
}
const index = JSON.parse(await readFile(path.join(root, 'search-index.json'), 'utf8'));
assert.ok(index.length >= 6, '至少六篇示例');
for (const article of index) {
  const articleFile = path.join(root, article.url.slice(base.length), 'index.html');
  const html = await readFile(articleFile, 'utf8');
  assert.ok(html.includes(article.title));
  assert.ok(article.body.length > 100, `${article.title}正文不完整`);
  if (article.category === 'poetry') assert.ok((html.match(/<br\s*\/?\s*>/g) ?? []).length >= 10, '诗歌换行应保留');
}
assert.deepEqual(errors, [], errors.join('\n'));
const bytes = (await Promise.all(files.map((file) => stat(file)))).reduce((sum, item) => sum + item.size, 0);
const result = { checkedAt: new Date().toISOString(), htmlPages: htmlFiles.length, articles: index.length, internalLinksAndAssets: checkedLinks, bytes, errors };
await mkdir('.qa', { recursive: true });
await writeFile('.qa/build.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
