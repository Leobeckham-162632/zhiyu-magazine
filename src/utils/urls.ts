// 页面、图片、搜索索引统一经此函数加上 GitHub Pages 子路径。
export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export function absolute(path = '') { return new URL(url(path), import.meta.env.SITE).href; }
