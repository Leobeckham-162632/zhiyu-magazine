import type { APIRoute } from 'astro';
import { getArticles, articlePath } from '../utils/articles';
import { categoryById } from '../data/site';
import { url } from '../utils/urls';
export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const index = articles.map(({ data, body, ...entry }) => ({
    title: data.title, author: data.author, summary: data.summary,
    category: data.category, categoryName: categoryById(data.category).name,
    date: data.date, url: url(articlePath({ ...entry, data, body })),
    // 索引只作为文本显示，浏览器端不把搜索结果作为 HTML 执行。
    body: (body ?? '').replace(/<[^>]*>/g, '').replace(/[#*_>`]/g, ''),
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
