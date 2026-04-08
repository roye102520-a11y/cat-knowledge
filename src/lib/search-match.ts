import type { DataLocale, Product, Question } from "@/lib/types";

/** 英文检索用：小写、连字符当空格，便于与 token 对齐 */
export function normalizeEnglishHaystack(s: string): string {
  return s.toLowerCase().replace(/-/g, " ");
}

/** 英文查询拆成词元：空白 + 连字符分词，去首尾标点；忽略大小写在调用方处理 */
export function tokenizeEnglishSearchQuery(raw: string): string[] {
  const s = raw.trim().toLowerCase();
  if (!s) return [];
  return s
    .split(/\s+/)
    .flatMap((piece) =>
      piece
        .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "")
        .split(/-+/u)
        .filter(Boolean),
    )
    .filter((t) => t.length > 0);
}

/**
 * 英文：整段包含，或「每个词元」在全文子串命中 / 在某单词上前缀命中（如 diarrh → diarrhea）。
 * 中文：整段子串匹配（保持原有连续命中行为）。
 */
export function haystackMatchesLocaleSearch(haystackRaw: string, query: string, lang: DataLocale): boolean {
  const q = query.trim();
  if (!q) return true;

  if (lang === "zh") {
    return haystackRaw.toLowerCase().includes(q.toLowerCase());
  }

  const haystack = normalizeEnglishHaystack(haystackRaw);
  const phrase = normalizeEnglishHaystack(q);
  if (haystack.includes(phrase)) return true;

  const tokens = tokenizeEnglishSearchQuery(q);
  if (tokens.length === 0) {
    return phrase.length === 0 || haystack.includes(phrase);
  }
  return tokens.every((t) => englishTokenMatchesInHaystack(haystack, t));
}

export function englishTokenMatchesInHaystack(haystack: string, token: string): boolean {
  if (!token) return true;
  if (haystack.includes(token)) return true;
  const words = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  return words.some((w) => w.startsWith(token));
}

/** 英文结果排序：标题全词元命中优先，其次整句包含，再次正文命中 */
export function scoreEnglishQuestionMatch(item: Question, query: string): number {
  const tokens = tokenizeEnglishSearchQuery(query);
  if (tokens.length === 0) return 0;
  const title = normalizeEnglishHaystack(item.title);
  const body = normalizeEnglishHaystack(
    `${item.description} ${item.causes.join(" ")} ${item.solutions.join(" ")} ${item.recommended_products.join(" ")}`,
  );
  const phrase = normalizeEnglishHaystack(query.trim());
  if (title === phrase) return 100;
  if (title.includes(phrase)) return 90;
  if (tokens.every((t) => englishTokenMatchesInHaystack(title, t))) return 80;
  if (tokens.every((t) => englishTokenMatchesInHaystack(body, t))) return 50;
  return 30;
}

export function scoreEnglishProductMatch(item: Product, query: string): number {
  const tokens = tokenizeEnglishSearchQuery(query);
  if (tokens.length === 0) return 0;
  const title = normalizeEnglishHaystack(item.name);
  const body = normalizeEnglishHaystack(
    [item.category, item.type, item.description, item.origin].filter(Boolean).join(" "),
  );
  const phrase = normalizeEnglishHaystack(query.trim());
  if (title === phrase) return 100;
  if (title.includes(phrase)) return 90;
  if (tokens.every((t) => englishTokenMatchesInHaystack(title, t))) return 80;
  if (tokens.every((t) => englishTokenMatchesInHaystack(body, t))) return 50;
  return 30;
}
