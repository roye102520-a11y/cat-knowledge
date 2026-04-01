import fs from "fs";
import path from "path";
import { marked } from "marked";

const SEO_DIR = path.join(process.cwd(), "content", "seo-articles");

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

export function loadSeoArticle(slug: string): SeoArticle | null {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  if (safe !== slug) return null;
  const filePath = path.join(SEO_DIR, `${safe}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontMatter(raw);
  const html = marked.parse(body, { async: false }) as string;
  return { slug: safe, meta, bodyMarkdown: body, html };
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
