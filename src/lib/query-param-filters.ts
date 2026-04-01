import type { PriceLevel, ProductCategory, QuestionCategory } from "./types";

/** 用品分类：URL 参数只用 slug，避免表单 GET 提交时中文乱码 */
export const PRODUCT_CATEGORY_SLUGS: Record<string, ProductCategory> = {
  food: "猫粮",
  litter: "猫砂",
  care: "护理用品",
  health: "健康用品",
  toy: "玩具",
};

export const PRODUCT_CATEGORY_TO_SLUG: Record<ProductCategory, string> = {
  猫粮: "food",
  猫砂: "litter",
  护理用品: "care",
  健康用品: "health",
  玩具: "toy",
};

export function parseProductCategoryParam(value: string | null): ProductCategory | undefined {
  if (!value) return undefined;
  if (PRODUCT_CATEGORY_SLUGS[value]) return PRODUCT_CATEGORY_SLUGS[value];
  const allowed: ProductCategory[] = ["猫粮", "猫砂", "护理用品", "健康用品", "玩具"];
  return allowed.includes(value as ProductCategory) ? (value as ProductCategory) : undefined;
}

/** 问题分类：同样使用 slug */
export const QUESTION_CATEGORY_SLUGS: Record<string, QuestionCategory> = {
  gut: "肠胃问题",
  behavior: "行为问题",
  care: "护理问题",
  health: "健康问题",
};

export const QUESTION_CATEGORY_TO_SLUG: Record<QuestionCategory, string> = {
  肠胃问题: "gut",
  行为问题: "behavior",
  护理问题: "care",
  健康问题: "health",
};

export function parseQuestionCategoryParam(value: string | null): QuestionCategory | undefined {
  if (!value) return undefined;
  if (QUESTION_CATEGORY_SLUGS[value]) return QUESTION_CATEGORY_SLUGS[value];
  const allowed: QuestionCategory[] = ["肠胃问题", "行为问题", "护理问题", "健康问题"];
  return allowed.includes(value as QuestionCategory) ? (value as QuestionCategory) : undefined;
}

export const PRICE_LEVEL_LABELS: Record<PriceLevel, string> = {
  budget: "入门 / 性价比",
  mid: "中档",
  premium: "高端",
};

export function parsePriceLevelParam(value: string | null): PriceLevel | undefined {
  if (value === "budget" || value === "mid" || value === "premium") {
    return value;
  }
  return undefined;
}
