import { Marked, type Renderer, type Tokens } from "marked";

export type ArticleTocItem = {
  id: string;
  depth: 2 | 3;
  text: string;
};

function slugifyHeading(plain: string, slugCounts: Map<string, number>): string {
  let base = plain
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!base) base = "section";
  const n = slugCounts.get(base) ?? 0;
  slugCounts.set(base, n + 1);
  return n ? `${base}-${n}` : base;
}

function plainFromHeadingToken(token: Tokens.Heading, renderer: Renderer): string {
  const html = renderer.parser.parseInline(token.tokens);
  const stripped = html.replace(/<[^>]+>/g, "").trim();
  if (stripped) return stripped;
  return token.text.replace(/\*\*/g, "").trim();
}

/**
 * 将 Markdown 转为 HTML，并为 h2/h3 生成稳定 id；同时产出目录（顺序与正文一致）。
 */
export function renderMarkdownWithToc(body: string): { html: string; toc: ArticleTocItem[] } {
  const toc: ArticleTocItem[] = [];
  const slugCounts = new Map<string, number>();
  const md = new Marked();
  md.use({
    renderer: {
      heading(this: Renderer, token: Tokens.Heading) {
        const { tokens, depth } = token;
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) {
          return `<h${depth}>${inner}</h${depth}>\n`;
        }
        const plain = plainFromHeadingToken(token, this);
        const id = slugifyHeading(plain, slugCounts);
        toc.push({ id, depth: depth as 2 | 3, text: plain });
        return `<h${depth} id="${id}" class="scroll-mt-28">${inner}</h${depth}>\n`;
      },
    },
  });
  const html = md.parse(body) as string;
  return { html, toc };
}
