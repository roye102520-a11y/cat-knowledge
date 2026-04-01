import guides from "@/data/guides.json";
import homeContent from "@/data/home-content.json";
import productZones from "@/data/product-zones.json";
import products from "@/data/products.json";
import questions from "@/data/questions.json";
import type {
  AiAnswerResult,
  Guide,
  PriceLevel,
  Product,
  ProductCategory,
  ProductZone,
  Question,
  QuestionCategory,
  QuestionHubParam,
} from "@/lib/types";
import { fetchGuidesFromNotion, fetchProductsFromNotion, fetchQuestionsFromNotion, isNotionConfigured } from "@/lib/notion";

/** `STATIC_EXPORT=1`（`npm run build:share`）时构建纯静态包，构建期不请求 Notion，避免 prerender 失败 */
function isStaticExportBuild() {
  return process.env.STATIC_EXPORT === "1" || process.env.STATIC_EXPORT === "true";
}

export async function getQuestions(): Promise<Question[]> {
  if (isStaticExportBuild()) {
    return questions as Question[];
  }
  if (isNotionConfigured()) {
    const notionRows = await fetchQuestionsFromNotion();
    if (notionRows.length > 0) return notionRows;
  }
  return questions as Question[];
}

export async function getProducts(): Promise<Product[]> {
  if (isStaticExportBuild()) {
    return products as Product[];
  }
  if (isNotionConfigured()) {
    const notionRows = await fetchProductsFromNotion();
    if (notionRows.length > 0) return notionRows;
  }
  return products as Product[];
}

export async function getGuides(): Promise<Guide[]> {
  if (isStaticExportBuild()) {
    return guides as Guide[];
  }
  if (isNotionConfigured()) {
    const notionRows = await fetchGuidesFromNotion();
    if (notionRows.length > 0) return notionRows;
  }
  return guides as Guide[];
}

export function getProductZones(): ProductZone[] {
  return productZones as ProductZone[];
}

export async function getZonesWithProducts(): Promise<Array<ProductZone & { products: Product[] }>> {
  const zones = getProductZones();
  const rows = await getProducts();
  const byId = new Map(rows.map((p) => [p.id, p]));
  return zones.map((z) => ({
    ...z,
    products: z.product_ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p)),
  }));
}

export async function getPopularQuestions(): Promise<Question[]> {
  const rows = await getQuestions();
  const preferred = homeContent.hot_question_titles as string[];
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

/** 归入「猫咪疾病库」的分类：症状、护理与健康向问答 */
export const QUESTION_DISEASE_CATEGORIES: QuestionCategory[] = ["肠胃问题", "健康问题", "护理问题"];

export function parseQuestionHub(value: string | undefined): QuestionHubParam | undefined {
  if (value === "disease" || value === "behavior") return value;
  return undefined;
}

export function questionCategoriesForHub(hub: QuestionHubParam | undefined): QuestionCategory[] {
  if (hub === "disease") return [...QUESTION_DISEASE_CATEGORIES];
  if (hub === "behavior") return ["行为问题"];
  return ["肠胃问题", "行为问题", "护理问题", "健康问题"];
}

/** 基于已加载的问题列表过滤（静态导出页的客户端与服务器共用） */
export function filterQuestionsFromRows(
  rows: Question[],
  query: string,
  category?: QuestionCategory,
  hub?: QuestionHubParam,
): Question[] {
  let categoryEffective = category;
  if (hub === "behavior" && category && category !== "行为问题") {
    categoryEffective = undefined;
  }
  if (hub === "disease" && category && !QUESTION_DISEASE_CATEGORIES.includes(category)) {
    categoryEffective = undefined;
  }

  const normalized = query.trim().toLowerCase();
  const scoped =
    hub === "disease"
      ? rows.filter((q) => QUESTION_DISEASE_CATEGORIES.includes(q.category))
      : hub === "behavior"
        ? rows.filter((q) => q.category === "行为问题")
        : rows;

  return scoped.filter((q) => {
    const hitCategory = categoryEffective ? q.category === categoryEffective : true;
    if (!normalized) {
      return hitCategory;
    }
    const text = [
      q.title,
      q.description,
      ...q.causes,
      ...q.solutions,
      ...q.recommended_products,
    ]
      .join(" ")
      .toLowerCase();
    return hitCategory && text.includes(normalized);
  });
}

export async function filterQuestions(
  query: string,
  category?: QuestionCategory,
  hub?: QuestionHubParam,
): Promise<Question[]> {
  const rows = await getQuestions();
  return filterQuestionsFromRows(rows, query, category, hub);
}

export async function searchAll(query: string): Promise<{ questions: Question[]; products: Product[] }> {
  return {
    questions: await filterQuestions(query),
    products: await filterProducts(query),
  };
}

/** 纯函数：供静态导出站点的 AI 页在浏览器端直接检索，无需 Server Action */
export function answerByKnowledgeBaseFromRows(
  questionRows: Question[],
  productRows: Product[],
  query: string,
): AiAnswerResult {
  const q = query.trim();
  if (!q) {
    return {
      answer: "请输入具体问题，例如：猫咪一直叫怎么办。",
      related_questions: [],
      related_products: [],
    };
  }
  const result = searchAllFromRows(questionRows, productRows, q);
  const topQuestions = result.questions.slice(0, 2);
  const topProducts = result.products.slice(0, 3);

  if (topQuestions.length === 0 && topProducts.length === 0) {
    return {
      answer:
        "知识库里暂时没有直接命中该问题。建议补充更具体症状（如持续时间、精神状态、食欲变化）后再搜索，必要时尽快咨询兽医。",
      related_questions: [],
      related_products: [],
    };
  }

  const causeText =
    topQuestions[0]?.causes.length ? `常见原因可能是：${topQuestions[0].causes.join("、")}。` : "";
  const solutionText =
    topQuestions[0]?.solutions.length ? `建议优先处理：${topQuestions[0].solutions.join("；")}。` : "";
  const productText = topProducts.length
    ? `可参考用品：${topProducts.map((p) => p.name).join("、")}。`
    : "";

  return {
    answer: `${causeText}${solutionText}${productText}以上为群友经验整理，不能替代专业兽医诊断。`,
    related_questions: topQuestions,
    related_products: topProducts,
  };
}

export async function answerByKnowledgeBase(query: string): Promise<AiAnswerResult> {
  const [qRows, pRows] = await Promise.all([getQuestions(), getProducts()]);
  return answerByKnowledgeBaseFromRows(qRows, pRows, query);
}

/** 基于已加载的用品列表过滤（静态导出页的客户端用） */
export function filterProductsFromRows(
  rows: Product[],
  query: string,
  category?: ProductCategory,
  priceLevel?: PriceLevel,
): Product[] {
  const normalized = query.trim().toLowerCase();
  return rows.filter((p) => {
    const hitCategory = category ? p.category === category : true;
    const hitPrice = priceLevel ? p.price_level === priceLevel : true;
    if (!normalized) {
      return hitCategory && hitPrice;
    }
    const text = [p.name, p.category, p.type, p.description, p.origin].filter(Boolean).join(" ").toLowerCase();
    return hitCategory && hitPrice && text.includes(normalized);
  });
}

export function searchAllFromRows(
  questionRows: Question[],
  productRows: Product[],
  query: string,
): { questions: Question[]; products: Product[] } {
  return {
    questions: filterQuestionsFromRows(questionRows, query),
    products: filterProductsFromRows(productRows, query),
  };
}

export async function filterProducts(
  query: string,
  category?: ProductCategory,
  priceLevel?: PriceLevel,
): Promise<Product[]> {
  const rows = await getProducts();
  return filterProductsFromRows(rows, query, category, priceLevel);
}
