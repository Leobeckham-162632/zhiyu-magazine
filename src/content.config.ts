import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '请使用小写英文、数字和短横线');
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1).max(100), subtitle: z.string().max(160).optional(), slug,
    author: z.string().min(1), authorSlug: slug,
    authorBio: z.string().default('纸屿试刊示例作者，虚构笔名。'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式为 YYYY-MM-DD')
      .refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, '日期必须真实有效'),
    category: z.enum(['fiction', 'essays', 'poetry', 'notes', 'reviews']),
    summary: z.string().min(10).max(240), issue: slug,
    featured: z.boolean().default(false), order: z.number().int().nonnegative().default(100),
    draft: z.boolean().default(false), demo: z.boolean().default(true),
  }),
});
export const collections = { articles };
