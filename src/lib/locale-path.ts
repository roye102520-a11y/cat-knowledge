/** 路径首段为语言前缀时的合法取值 */
export const LOCALE_SEGMENTS = ["zh", "en"] as const;
export type LocaleSegment = (typeof LOCALE_SEGMENTS)[number];

/**
 * 从 `usePathname()` 等得到的路径中去掉 Next `basePath`（GitHub Pages 子路径部署）。
 * 无配置或未命中时原样返回（已以 `/` 开头）。
 */
export function stripNextBasePath(pathname: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim().replace(/\/$/, "");
  if (!base) {
    return pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  }
  const p = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === base || p.startsWith(`${base}/`)) {
    const rest = (p.slice(base.length) || "/").trim() || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return p;
}

/**
 * 根据当前 pathname（可先经 `stripNextBasePath`）生成切换语言后的路径（仍不含 basePath）。
 * - /zh、/zh/about → /en、/en/about
 * - /en、/en/about → /zh、/zh/about
 * - 无前缀（视为中文站）→ 在路径前加 /en
 */
export function getAlternateLocalePath(pathname: string): string {
  const normalized = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "zh") {
    const rest = segments.slice(1);
    return rest.length ? `/en/${rest.join("/")}` : "/en";
  }
  if (segments[0] === "en") {
    const rest = segments.slice(1);
    return rest.length ? `/zh/${rest.join("/")}` : "/zh";
  }

  if (normalized === "/") return "/en";
  return `/en${normalized}`;
}

/** 结合 basePath 剥离后再切换语言（供 LanguageSwitcher） */
export function getAlternateLocalePathFromBrowserPathname(pathname: string | null): string {
  const raw = pathname === null || pathname === "" ? "/" : pathname;
  const internal = stripNextBasePath(raw);
  return getAlternateLocalePath(internal);
}

/** 切换按钮文案：展示即将切换到的语言 */
export function getSwitchLabel(pathname: string | null): "EN" | "中文" {
  const internal = stripNextBasePath(pathname === null || pathname === "" ? "/" : pathname);
  const segments = internal.split("/").filter(Boolean);
  return segments[0] === "en" ? "中文" : "EN";
}
