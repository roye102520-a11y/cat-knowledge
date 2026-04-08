import { stripNextBasePath } from "@/lib/locale-path";

/** 全站 UI 语言（与 URL 第一段一致） */
export type UiLocale = "zh" | "en";

export function isUiLocale(s: string): s is UiLocale {
  return s === "zh" || s === "en";
}

/**
 * 将站内路径（可含 ?query #hash）加上语言前缀。
 * @param path 如 `/questions`、`/questions?hub=disease`、`/guide#anchor`
 */
export function withLang(lang: UiLocale, pathWithQueryHash: string): string {
  const raw = pathWithQueryHash.trim() || "/";
  const match = raw.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const pathname = (match?.[1] ?? "/").trim() || "/";
  const query = match?.[2] ?? "";
  const hash = match?.[3] ?? "";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/") return `/${lang}${query}${hash}`;
  return `/${lang}${p}${query}${hash}`;
}

/** pathname 来自 usePathname()：去掉 basePath 后取当前 UI 语言 */
export function getLocaleFromPathname(pathname: string | null): UiLocale {
  if (!pathname) return "zh";
  const p = stripNextBasePath(pathname);
  const seg = p.split("/").filter(Boolean)[0];
  return seg === "en" ? "en" : "zh";
}
