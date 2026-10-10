import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const svg = await readFile('public/images/island.svg', 'utf8');
  await page.setContent(`<html lang="zh-CN"><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#213f35;font-family:"Songti SC","SimSun",serif}.frame{display:flex;padding:55px;width:1200px;height:630px;gap:70px}.copy{flex:1;border-top:1px solid #213f35;padding-top:25px}small{font:13px Arial;letter-spacing:3px}h1{font-size:130px;font-weight:400;margin:25px 0 15px}h2{font-size:35px;font-weight:400;margin:0}p{font-size:20px;color:#62685f;margin-top:50px}img{width:420px;height:520px;object-fit:cover}</style><div class="frame"><div class="copy"><small>ZHIYU LITERARY MAGAZINE</small><h1>纸屿</h1><h2>让文字，有处靠岸。</h2><p>2026 年秋季试刊 · 岸边来信</p></div><img alt="原创岛屿图形" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></div></html>`);
  await mkdir('public/images', { recursive: true });
  await page.screenshot({ path: 'public/images/social.png' });
} finally { await browser.close(); }
