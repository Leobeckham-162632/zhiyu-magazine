import type { APIRoute } from 'astro';
import { getArticles, articlePath } from '../utils/articles';
import { absolute } from '../utils/urls';
import { escapeXml as x } from '../utils/xml';
import { site } from '../data/site';
export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const items = articles.map((article) => `<item><title>${x(article.data.title)}</title><link>${x(absolute(articlePath(article)))}</link><guid isPermaLink="true">${x(absolute(articlePath(article)))}</guid><description>${x(article.data.summary)}</description><pubDate>${new Date(article.data.date).toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${x(site.name)}</title><link>${x(absolute())}</link><description>${x(site.description)}</description><language>zh-CN</language>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
