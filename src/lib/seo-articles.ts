import fs from "fs";
import path from "path";
import { renderMarkdownWithToc, type ArticleTocItem } from "@/lib/article-markdown";

const SEO_DIR = path.join(process.cwd(), "content", "seo-articles");
/** 英文正文：`/en/articles/[slug]` → `content/en/articles/[slug].md` */
const EN_SEO_ARTICLES_DIR = path.join(process.cwd(), "content", "en", "articles");

export type SeoArticleMeta = {
  title_en?: string;
  title_zh?: string;
  description_en?: string;
  description_zh?: string;
  primary_keywords?: string;
  secondary_keywords?: string;
};

export type SeoArticle = {
  slug: string;
  meta: SeoArticleMeta;
  bodyMarkdown: string;
  html: string;
  toc: ArticleTocItem[];
};

export type { ArticleTocItem };

/** /en/articles下正文实际来自中文稿（文件缺失或损坏时静默回退） */
export type ResolvedSeoArticle = {
  article: SeoArticle;
  isTranslationFallback: boolean;
};

function unquote(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

/** 与 wiki 等本地 Markdown 共用 */
export function parseFrontMatter(raw: string): { meta: SeoArticleMeta; body: string } {
  if (!raw.startsWith("---\n")) {
    return { meta: {}, body: raw };
  }
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    return { meta: {}, body: raw };
  }
  const fm = raw.slice(4, end);
  const body = raw.slice(end + 5);
  const meta: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([\w_]+)\s*:\s*(.+)$/);
    if (m) meta[m[1]] = unquote(m[2]);
  }
  return { meta: meta as SeoArticleMeta, body };
}

export function listSeoArticleSlugs(): string[] {
  if (!fs.existsSync(SEO_DIR)) return [];
  return fs
    .readdirSync(SEO_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function sanitizeArticleSlug(slug: string): string | null {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  if (safe !== slug) return null;
  return safe;
}

/** 读盘 + 解析 + 渲染；不存在或任一步失败返回 null（静默） */
export function tryReadSeoArticleFile(filePath: string, slug: string): SeoArticle | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { meta, body } = parseFrontMatter(raw);
    const { html, toc } = renderMarkdownWithToc(body);
    return { slug, meta, bodyMarkdown: body, html, toc };
  } catch {
    return null;
  }
}

/**
 * 按路由语言解析长文：en 优先 en 目录，失败则静默用 `content/seo-articles` 中文版。
 * 构建期/fs 读盘，兼容 `output: 'export'`。
 */
export function resolveSeoArticleForRoute(slug: string, lang: "zh" | "en"): ResolvedSeoArticle | null {
  const safe = sanitizeArticleSlug(slug);
  if (!safe) return null;

  if (lang === "zh") {
    const article = tryReadSeoArticleFile(path.join(SEO_DIR, `${safe}.md`), safe);
    return article ? { article, isTranslationFallback: false } : null;
  }

  const en = tryReadSeoArticleFile(path.join(EN_SEO_ARTICLES_DIR, `${safe}.md`), safe);
  if (en) return { article: en, isTranslationFallback: false };

  const zh = tryReadSeoArticleFile(path.join(SEO_DIR, `${safe}.md`), safe);
  if (zh) return { article: zh, isTranslationFallback: true };

  return null;
}

/** 中文/canonical：`content/seo-articles/` */
export function loadCanonicalSeoArticle(slug: string): SeoArticle | null {
  const safe = sanitizeArticleSlug(slug);
  if (!safe) return null;
  return tryReadSeoArticleFile(path.join(SEO_DIR, `${safe}.md`), safe);
}

/** 英文稿：`content/en/articles/` */
export function loadEnSeoArticle(slug: string): SeoArticle | null {
  const safe = sanitizeArticleSlug(slug);
  if (!safe) return null;
  return tryReadSeoArticleFile(path.join(EN_SEO_ARTICLES_DIR, `${safe}.md`), safe);
}

/** @deprecated 使用 `loadCanonicalSeoArticle`；行为相同 */
export function loadSeoArticle(slug: string): SeoArticle | null {
  return loadCanonicalSeoArticle(slug);
}

export function pageTitle(meta: SeoArticleMeta): string {
  return meta.title_zh?.trim() || meta.title_en?.trim() || "科普长文";
}

export function pageDescription(meta: SeoArticleMeta): string {
  return (
    meta.description_zh?.trim() ||
    meta.description_en?.trim() ||
    "中英双语养猫科普长文，结构与知识库一致，便于分享与检索。"
  );
}

export function pageTitleForLocale(meta: SeoArticleMeta, lang: "zh" | "en"): string {
  if (lang === "en") {
    return meta.title_en?.trim() || meta.title_zh?.trim() || "Article";
  }
  return meta.title_zh?.trim() || meta.title_en?.trim() || "科普长文";
}

export function pageDescriptionForLocale(meta: SeoArticleMeta, lang: "zh" | "en"): string {
  if (lang === "en") {
    return (
      meta.description_en?.trim() ||
      meta.description_zh?.trim() ||
      "Bilingual cat care article aligned with the knowledge base."
    );
  }
  return (
    meta.description_zh?.trim() ||
    meta.description_en?.trim() ||
    "中英双语养猫科普长文，结构与知识库一致，便于分享与检索。"
  );
}
