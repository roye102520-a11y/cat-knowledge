import type {
  CatFoodItem,
  CommunityPost,
  Guide,
  DataLocale,
  PriceLevel,
  Product,
  ProductCategory,
  ProductZone,
  Question,
  QuestionCategory,
  QuestionHubParam,
  AiAnswerResult,
} from "@/lib/types";
import { fetchGuidesFromNotion, fetchProductsFromNotion, fetchQuestionsFromNotion, isNotionConfigured } from "@/lib/notion";
import {
  LOCALIZED_DATA_JSON_FILES,
  mergeFoodItemsByName,
  mergeHomeContent,
  mergeRecordsById,
  readLocalizedDataJson,
  tryReadLocalizedJson,
  type LocalizedDataJsonFile,
} from "@/lib/locale-data";
import {
  answerByKnowledgeBaseFromRows,
  filterProductsFromRows,
  filterQuestionsFromRows,
} from "@/lib/knowledge-filters";

export type { LocalizedDataJsonFile };
export type { DataLocale } from "@/lib/types";
export { LOCALIZED_DATA_JSON_FILES, readLocalizedDataJson };

export {
  answerByKnowledgeBaseFromRows,
  filterProductsFromRows,
  filterQuestionsFromRows,
  parseQuestionHub,
  questionCategoriesForHub,
  searchAllFromRows,
  QUESTION_DISEASE_CATEGORIES,
} from "@/lib/knowledge-filters";

/** 英文数据：存在且为数组则按 id 叠中文行序合并；缺文件或坏 JSON 则整表用中文（静默） */
function mergeEnIdOverlay<T extends { id: string }>(zhRows: T[], filename: string): T[] {
  const enRaw = tryReadLocalizedJson<T[]>("en", filename);
  if (!enRaw || !Array.isArray(enRaw)) return zhRows;
  return mergeRecordsById(zhRows, enRaw);
}

/** `STATIC_EXPORT=1`（`npm run build:share`）时构建纯静态包，构建期不请求 Notion，避免 prerender 失败 */
function isStaticExportBuild() {
  return process.env.STATIC_EXPORT === "1" || process.env.STATIC_EXPORT === "true";
}

async function resolveZhQuestions(): Promise<Question[]> {
  const fromDisk = () => tryReadLocalizedJson<Question[]>("zh", "questions.json") ?? [];
  if (isStaticExportBuild()) {
    return fromDisk();
  }
  if (isNotionConfigured()) {
    try {
      const notionRows = await fetchQuestionsFromNotion();
      if (notionRows.length > 0) return notionRows;
    } catch {
      /* 静默退回本地 zh */
    }
  }
  return fromDisk();
}

async function resolveZhProducts(): Promise<Product[]> {
  const fromDisk = () => tryReadLocalizedJson<Product[]>("zh", "products.json") ?? [];
  if (isStaticExportBuild()) {
    return fromDisk();
  }
  if (isNotionConfigured()) {
    try {
      const notionRows = await fetchProductsFromNotion();
      if (notionRows.length > 0) return notionRows;
    } catch {
      /* 静默退回本地 zh */
    }
  }
  return fromDisk();
}

async function resolveZhGuides(): Promise<Guide[]> {
  const fromDisk = () => tryReadLocalizedJson<Guide[]>("zh", "guides.json") ?? [];
  if (isStaticExportBuild()) {
    return fromDisk();
  }
  if (isNotionConfigured()) {
    try {
      const notionRows = await fetchGuidesFromNotion();
      if (notionRows.length > 0) return notionRows;
    } catch {
      /* 静默退回本地 zh */
    }
  }
  return fromDisk();
}

export async function getQuestions(lang: DataLocale): Promise<Question[]> {
  const zhRows = await resolveZhQuestions();
  if (lang === "zh") return zhRows;
  return mergeEnIdOverlay(zhRows, "questions.json");
}

export async function getProducts(lang: DataLocale): Promise<Product[]> {
  const zhRows = await resolveZhProducts();
  if (lang === "zh") return zhRows;
  return mergeEnIdOverlay(zhRows, "products.json");
}

export async function getGuides(lang: DataLocale): Promise<Guide[]> {
  const zhRows = await resolveZhGuides();
  if (lang === "zh") return zhRows;
  return mergeEnIdOverlay(zhRows, "guides.json");
}

export function getProductZones(lang: DataLocale): ProductZone[] {
  const zh = tryReadLocalizedJson<ProductZone[]>("zh", "product-zones.json") ?? [];
  if (lang === "zh") return zh;
  return mergeEnIdOverlay(zh, "product-zones.json");
}

/** 合并后的首页 JSON（search_examples、hot_question_titles、category_cards 等） */
export function getHomeContentRecord(lang: DataLocale): Record<string, unknown> {
  const zh = tryReadLocalizedJson<Record<string, unknown>>("zh", "home-content.json") ?? {};
  if (lang === "zh") return { ...zh };
  const en = tryReadLocalizedJson<Record<string, unknown>>("en", "home-content.json");
  if (!en || typeof en !== "object" || Array.isArray(en)) {
    return { ...zh };
  }
  return mergeHomeContent(zh, en);
}

export function getFoods(lang: DataLocale): CatFoodItem[] {
  const zh = tryReadLocalizedJson<CatFoodItem[]>("zh", "foods.json") ?? [];
  if (lang === "zh") return zh;
  const en = tryReadLocalizedJson<CatFoodItem[]>("en", "foods.json");
  if (!en || !Array.isArray(en)) return zh;
  return mergeFoodItemsByName(zh, en);
}

export function getCommunityPosts(lang: DataLocale): CommunityPost[] {
  const zh = tryReadLocalizedJson<CommunityPost[]>("zh", "community.json") ?? [];
  if (lang === "zh") return zh;
  return mergeEnIdOverlay(zh, "community.json");
}

export async function getZonesWithProducts(lang: DataLocale): Promise<Array<ProductZone & { products: Product[] }>> {
  const zones = getProductZones(lang);
  const rows = await getProducts(lang);
  const byId = new Map(rows.map((p) => [p.id, p]));
  return zones.map((z) => ({
    ...z,
    products: z.product_ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p)),
  }));
}

export async function getPopularQuestions(lang: DataLocale): Promise<Question[]> {
  const rows = await getQuestions(lang);
  const homeContent = getHomeContentRecord(lang);
  const rawTitles = homeContent.hot_question_titles;
  const preferred = Array.isArray(rawTitles) ? (rawTitles as string[]) : [];
  const picked: Question[] = [];
  const seen = new Set<string>();
  for (const t of preferred) {
    const q = rows.find((x) => x.title === t);
    if (q) {
      picked.push(q);
      seen.add(q.id);
    }
  }
  for (const q of rows) {
    if (picked.length >= 8) break;
    if (!seen.has(q.id)) {
      picked.push(q);
      seen.add(q.id);
    }
  }
  return picked.slice(0, 8);
}

export async function filterQuestions(
  query: string,
  lang: DataLocale,
  category?: QuestionCategory,
  hub?: QuestionHubParam,
): Promise<Question[]> {
  const rows = await getQuestions(lang);
  return filterQuestionsFromRows(rows, query, category, hub, lang);
}

export async function searchAll(
  query: string,
  lang: DataLocale,
): Promise<{ questions: Question[]; products: Product[] }> {
  return {
    questions: await filterQuestions(query, lang),
    products: await filterProducts(query, lang),
  };
}

export async function answerByKnowledgeBase(query: string, lang: DataLocale): Promise<AiAnswerResult> {
  const [qRows, pRows] = await Promise.all([getQuestions(lang), getProducts(lang)]);
  return answerByKnowledgeBaseFromRows(qRows, pRows, query, lang);
}

export async function filterProducts(
  query: string,
  lang: DataLocale,
  category?: ProductCategory,
  priceLevel?: PriceLevel,
): Promise<Product[]> {
  const rows = await getProducts(lang);
  return filterProductsFromRows(rows, query, category, priceLevel, lang);
}
