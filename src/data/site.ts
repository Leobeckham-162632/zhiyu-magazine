// 修改刊名、首页文案与期号，从这里开始。作者资料由文章自动汇总。
export const site = {
  name: '纸屿', english: 'ZHIYU LITERARY MAGAZINE',
  description: '在文字之间，留一座岛。一本收存日常、想象与远方的独立文学试刊。',
  currentIssue: 'vol-01', tagline: '让文字，有处靠岸。',
};
export const categories = [
  { id: 'fiction', name: '小说', english: 'Fiction', description: '让另一种生活，在此发生。' },
  { id: 'essays', name: '散文', english: 'Essays', description: '从日常的纹理中，认出时间。' },
  { id: 'poetry', name: '诗歌', english: 'Poetry', description: '语言停顿的地方，风仍在吹。' },
  { id: 'notes', name: '随笔', english: 'Notes', description: '一些未完的念头，一些途中的光。' },
  { id: 'reviews', name: '文学评论', english: 'Reviews', description: '在阅读中相遇，在追问中抵达。' },
] as const;
export const issues = [{
  id: 'vol-01', number: '01', title: '2026 年秋季试刊', month: '2026 / 10',
  theme: '岸边来信', subtitle: '写给缓慢的日常',
  editorial: '我们想把一本刊物做得像一处岸边：走累了可以坐下，不必急着抵达什么地方。本期的文字从一扇窗、一班渡船、一盏旧灯开始。它们并不试图解释整个世界，只愿替那些容易被略过的事物，多留一会儿灯。愿你翻到某一页时，听见自己的生活。',
}];
export function categoryById(id: string) {
  const category = categories.find((item) => item.id === id);
  if (!category) throw new Error(`未知栏目：${id}`);
  return category;
}
export function issueById(id: string) {
  const issue = issues.find((item) => item.id === id);
  if (!issue) throw new Error(`期号 ${id} 未登记，请先在 src/data/site.ts 新增该期。`);
  return issue;
}
