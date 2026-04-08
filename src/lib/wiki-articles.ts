import fs from "fs";
import path from "path";
import { renderMarkdownWithToc, type ArticleTocItem } from "@/lib/article-markdown";
import { parseFrontMatter, type SeoArticleMeta } from "@/lib/seo-articles";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type WikiLocale = "zh" | "en";

export type WikiArticle = {
  slug: string;
  /** URL 中的语言 */
  requestedLang: WikiLocale;
  /** 实际采用的 Markdown 语言（英文缺失退回时为 zh） */
  contentLang: WikiLocale;
  meta: SeoArticleMeta;
  html: string;
  toc: ArticleTocItem[];
  /** 请求英文但只有中文版时 */
  isTranslationFallback: boolean;
  /** 请求中文但中文稿缺失或损坏且英文稿可用时 */
  isEnBodyOnZhUrl: boolean;
};

function isWikiLocale(s: string): s is WikiLocale {
  return s === "zh" || s === "en";
}

function sanitizeSlug(slug: string): string | null {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safe || safe !== slug) return null;
  return safe;
}

function collectSlugsInDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** 供 generateStaticParams：任意语言出现过的 slug × zh/en 均生成页面 */
export function listWikiStaticParams(): { lang: string; slug: string }[] {
  const zhDir = path.join(CONTENT_ROOT, "zh");
  const enDir = path.join(CONTENT_ROOT, "en");
  const slugs = new Set([...collectSlugsInDir(zhDir), ...collectSlugsInDir(enDir)]);
  const out: { lang: string; slug: string }[] = [];
  for (const slug of slugs) {
    out.push({ lang: "zh", slug }, { lang: "en", slug });
  }
  return out;
}

export function wikiDirectory(lang: WikiLocale): string {
  return path.join(CONTENT_ROOT, lang);
}

function tryBuildWikiArticle(
  slug: string,
  requestedLang: WikiLocale,
  filePath: string,
  contentLang: WikiLocale,
  flags: { isTranslationFallback: boolean; isEnBodyOnZhUrl: boolean },
): WikiArticle | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { meta, body } = parseFrontMatter(raw);
    const { html, toc } = renderMarkdownWithToc(body);
    return {
      slug,
      requestedLang,
      contentLang,
      meta,
      html,
      toc,
      isTranslationFallback: flags.isTranslationFallback,
      isEnBodyOnZhUrl: flags.isEnBodyOnZhUrl,
    };
  } catch {
    return null;
  }
}

/**
 * 读取 wiki 文章：优先对应语言文件；缺失或读/解析失败时静默回退另一语言。
 */
export function loadWikiArticle(rawLang: string, rawSlug: string): WikiArticle | null {
  if (!isWikiLocale(rawLang)) return null;
  const slug = sanitizeSlug(rawSlug);
  if (!slug) return null;

  const zhPath = path.join(CONTENT_ROOT, "zh", `${slug}.md`);
  const enPath = path.join(CONTENT_ROOT, "en", `${slug}.md`);

  if (rawLang === "zh") {
    const zh = tryBuildWikiArticle(slug, "zh", zhPath, "zh", {
      isTranslationFallback: false,
      isEnBodyOnZhUrl: false,
    });
    if (zh) return zh;
    return tryBuildWikiArticle(slug, "zh", enPath, "en", {
      isTranslationFallback: false,
      isEnBodyOnZhUrl: true,
    });
  }

  const en = tryBuildWikiArticle(slug, "en", enPath, "en", {
    isTranslationFallback: false,
    isEnBodyOnZhUrl: false,
  });
  if (en) return en;
  return tryBuildWikiArticle(slug, "en", zhPath, "zh", {
    isTranslationFallback: true,
    isEnBodyOnZhUrl: false,
  });
}

export function wikiPageTitle(meta: SeoArticleMeta, requestedLang: WikiLocale): string {
  if (requestedLang === "en") {
    return meta.title_en?.trim() || meta.title_zh?.trim() || "Wiki";
  }
  return meta.title_zh?.trim() || meta.title_en?.trim() || "百科";
}

export function wikiPageDescription(meta: SeoArticleMeta, requestedLang: WikiLocale): string {
  if (requestedLang === "en") {
    return (
      meta.description_en?.trim() ||
      meta.description_zh?.trim() ||
      "Cat care wiki article."
    );
  }
  return (
    meta.description_zh?.trim() ||
    meta.description_en?.trim() ||
    "猫咪百科条目。"
  );
}
