import { getCollection, type CollectionEntry } from 'astro:content';
import { issueById } from '../data/site';
export type Article = CollectionEntry<'articles'>;
export async function getArticles() {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  const seen = new Set<string>();
  const authors = new Map<string, { name: string; bio: string }>();
  for (const article of entries) {
    const data = article.data;
    if (seen.has(data.slug)) throw new Error(`重复文章 slug：${data.slug}`);
    seen.add(data.slug); issueById(data.issue);
    const previous = authors.get(data.authorSlug);
    if (previous && (previous.name !== data.author || previous.bio !== data.authorBio)) {
      throw new Error(`作者 ${data.authorSlug} 的姓名或简介不一致，请统一该作者的文章元数据。`);
    }
    authors.set(data.authorSlug, { name: data.author, bio: data.authorBio });
  }
  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug));
}
export const articlePath = (article: Article) => `articles/${article.data.slug}/`;
export const readingMinutes = (article: Article) => Math.max(1, Math.ceil((article.body?.replace(/\s/g, '').length ?? 0) / 350));
export const displayDate = (value: string) => value.replace(/-/g, '.');
