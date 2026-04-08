/**
 * 仅内存中的问答/用品过滤与检索（无 fs、无 Notion）。
 * Client Components 应只从此文件导入，禁止从 `@/lib/data` 拉取以免打入 `locale-data`。
 */
import { haystackMatchesLocaleSearch } from "@/lib/search-match";
import type {
  AiAnswerResult,
  DataLocale,
  PriceLevel,
  Product,
  ProductCategory,
  Question,
  QuestionCategory,
  QuestionHubParam,
} from "@/lib/types";

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
  lang: DataLocale = "zh",
): Question[] {
  let categoryEffective = category;
  if (hub === "behavior" && category && category !== "行为问题") {
    categoryEffective = undefined;
  }
  if (hub === "disease" && category && !QUESTION_DISEASE_CATEGORIES.includes(category)) {
    categoryEffective = undefined;
  }

  const scoped =
    hub === "disease"
      ? rows.filter((q) => QUESTION_DISEASE_CATEGORIES.includes(q.category))
      : hub === "behavior"
        ? rows.filter((q) => q.category === "行为问题")
        : rows;

  return scoped.filter((q) => {
    const hitCategory = categoryEffective ? q.category === categoryEffective : true;
    if (!query.trim()) {
      return hitCategory;
    }
    const text = [q.title, q.description, ...q.causes, ...q.solutions, ...q.recommended_products].join(" ");
    return hitCategory && haystackMatchesLocaleSearch(text, query, lang);
  });
}

/** 基于已加载的用品列表过滤（静态导出页的客户端用） */
export function filterProductsFromRows(
  rows: Product[],
  query: string,
  category?: ProductCategory,
  priceLevel?: PriceLevel,
  lang: DataLocale = "zh",
): Product[] {
  return rows.filter((p) => {
    const hitCategory = category ? p.category === category : true;
    const hitPrice = priceLevel ? p.price_level === priceLevel : true;
    if (!query.trim()) {
      return hitCategory && hitPrice;
    }
    const text = [p.name, p.category, p.type, p.description, p.origin].filter(Boolean).join(" ");
    return hitCategory && hitPrice && haystackMatchesLocaleSearch(text, query, lang);
  });
}

export function searchAllFromRows(
  questionRows: Question[],
  productRows: Product[],
  query: string,
  lang: DataLocale = "zh",
): { questions: Question[]; products: Product[] } {
  return {
    questions: filterQuestionsFromRows(questionRows, query, undefined, undefined, lang),
    products: filterProductsFromRows(productRows, query, undefined, undefined, lang),
  };
}

/** 纯函数：供静态导出站点的 AI 页在浏览器端直接检索，无需 Server Action */
export function answerByKnowledgeBaseFromRows(
  questionRows: Question[],
  productRows: Product[],
  query: string,
  lang: DataLocale = "zh",
): AiAnswerResult {
  const q = query.trim();
  if (!q) {
    return {
      answer: "请输入具体问题，例如：猫咪一直叫怎么办。",
      related_questions: [],
      related_products: [],
    };
  }
  const result = searchAllFromRows(questionRows, productRows, q, lang);
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
