/**
 * 非 <Link> 场景（如 form action）需手动带上网站子路径。
 * GitHub Actions 构建静态站时设置 BASE_PATH，会写入 NEXT_PUBLIC_BASE_PATH。
 */
export function appPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
