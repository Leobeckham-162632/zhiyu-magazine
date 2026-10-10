import type { APIRoute } from 'astro';
import { getArticles, articlePath } from '../utils/articles';
import { absolute } from '../utils/urls';
import { escapeXml as x } from '../utils/xml';
import { categories, issues } from '../data/site';
export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const paths = ['', 'articles/', 'categories/', 'authors/', 'issues/', 'about/', 'colophon/', ...categories.map((category) => `categories/${category.id}/`), ...issues.map((issue) => `issues/${issue.id}/`), ...new Set(articles.map((article) => `authors/${article.data.authorSlug}/`)), ...articles.map(articlePath)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${x(absolute(path))}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
