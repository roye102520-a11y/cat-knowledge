import type { DataLocale, PriceLevel, ProductCategory, QuestionCategory } from "./types";

/** 用品分类：URL 参数只用 slug，避免表单 GET 提交时中文乱码 */
export const PRODUCT_CATEGORY_SLUGS: Record<string, ProductCategory> = {
  food: "猫粮",
  canned: "主食罐",
  snack: "零食",
  litter: "猫砂",
  care: "护理用品",
  cleaning: "清洁用品",
  gear: "设备",
  deworm: "驱虫",
  health: "健康用品",
  travel: "出行工具",
  toy: "玩具",
};

export const PRODUCT_CATEGORY_TO_SLUG: Record<ProductCategory, string> = {
  猫粮: "food",
  主食罐: "canned",
  零食: "snack",
  猫砂: "litter",
  护理用品: "care",
  清洁用品: "cleaning",
  设备: "gear",
  驱虫: "deworm",
  健康用品: "health",
  出行工具: "travel",
  玩具: "toy",
};

const PRODUCT_CATEGORY_I18N: Record<ProductCategory, { zh: string; en: string }> = {
  猫粮: { zh: "猫粮", en: "Dry food" },
  主食罐: { zh: "主食罐", en: "Wet food" },
  零食: { zh: "零食", en: "Treats" },
  猫砂: { zh: "猫砂", en: "Litter" },
  护理用品: { zh: "护理用品", en: "Care" },
  清洁用品: { zh: "清洁用品", en: "Cleaning" },
  设备: { zh: "设备", en: "Devices" },
  驱虫: { zh: "驱虫", en: "Deworming" },
  健康用品: { zh: "健康用品", en: "Health" },
  出行工具: { zh: "出行工具", en: "Travel" },
  玩具: { zh: "玩具", en: "Toys" },
};

export function parseProductCategoryParam(value: string | null): ProductCategory | undefined {
  if (!value) return undefined;
  if (PRODUCT_CATEGORY_SLUGS[value]) return PRODUCT_CATEGORY_SLUGS[value];
  const allowed: ProductCategory[] = [
    "猫粮",
    "主食罐",
    "零食",
    "猫砂",
    "护理用品",
    "清洁用品",
    "设备",
    "驱虫",
    "健康用品",
    "出行工具",
    "玩具",
  ];
  return allowed.includes(value as ProductCategory) ? (value as ProductCategory) : undefined;
}

/**
 * 问题分类：URL 只用 slug；「行为问题」使用 qcat_behavior，避免与 hub=behavior 同名造成路由/调试混淆。
 * category=behavior 仍解析为行为问题（旧链接兼容）。
 */
export const QUESTION_CATEGORY_SLUGS: Record<string, QuestionCategory> = {
  gut: "肠胃问题",
  qcat_behavior: "行为问题",
  behavior: "行为问题",
  care: "护理问题",
  health: "健康问题",
};

export const QUESTION_CATEGORY_TO_SLUG: Record<QuestionCategory, string> = {
  肠胃问题: "gut",
  行为问题: "qcat_behavior",
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

const PRICE_LEVEL_I18N: Record<PriceLevel, { zh: string; en: string }> = {
  budget: { zh: "入门 / 性价比", en: "Budget / value" },
  mid: { zh: "中档", en: "Mid range" },
  premium: { zh: "高端", en: "Premium" },
};

export function productCategoryUiLabel(category: ProductCategory, lang: DataLocale): string {
  return PRODUCT_CATEGORY_I18N[category][lang];
}

export function productCategoryFilterItems(lang: DataLocale): Array<{ value: string; label: string }> {
  return Object.entries(PRODUCT_CATEGORY_SLUGS).map(([value, category]) => ({
    value,
    label: productCategoryUiLabel(category, lang),
  }));
}

export function priceLevelUiLabel(level: PriceLevel, lang: DataLocale): string {
  return PRICE_LEVEL_I18N[level][lang];
}

export function parsePriceLevelParam(value: string | null): PriceLevel | undefined {
  if (value === "budget" || value === "mid" || value === "premium") {
    return value;
  }
  return undefined;
}
