import type { DataLocale } from "@/lib/types";

export type HubModuleKey =
  | "home"
  | "questions"
  | "products"
  | "zones"
  | "articles"
  | "guide"
  | "guides"
  | "wiki"
  | "foods"
  | "ai";

type HubLabelSet = {
  nav: string;
  pageTitle: string;
  breadcrumb: string;
};

const HUB_UI: Record<HubModuleKey, Record<DataLocale, HubLabelSet>> = {
  home: {
    zh: { nav: "首页", pageTitle: "首页", breadcrumb: "首页" },
    en: { nav: "Home", pageTitle: "Home", breadcrumb: "Home" },
  },
  questions: {
    zh: { nav: "养猫问题", pageTitle: "养猫问题", breadcrumb: "养猫问题" },
    en: { nav: "Questions", pageTitle: "Questions", breadcrumb: "Questions" },
  },
  products: {
    zh: { nav: "猫咪用品", pageTitle: "猫咪用品库", breadcrumb: "猫咪用品" },
    en: { nav: "Products", pageTitle: "Product library", breadcrumb: "Products" },
  },
  zones: {
    zh: { nav: "选购专区", pageTitle: "选购专区", breadcrumb: "选购专区" },
    en: { nav: "Buying zones", pageTitle: "Buying zones", breadcrumb: "Buying zones" },
  },
  articles: {
    zh: { nav: "科普长文", pageTitle: "科普长文", breadcrumb: "科普长文" },
    en: { nav: "Articles", pageTitle: "Articles", breadcrumb: "Articles" },
  },
  guide: {
    zh: { nav: "新手指南", pageTitle: "新手养猫指南", breadcrumb: "新手指南" },
    en: { nav: "New cat guide", pageTitle: "New cat guide", breadcrumb: "Guide" },
  },
  guides: {
    zh: { nav: "指南", pageTitle: "新手养猫指南", breadcrumb: "指南" },
    en: { nav: "Guides", pageTitle: "New cat guide", breadcrumb: "Guides" },
  },
  wiki: {
    zh: { nav: "百科", pageTitle: "百科", breadcrumb: "百科" },
    en: { nav: "Wiki", pageTitle: "Wiki", breadcrumb: "Wiki" },
  },
  foods: {
    zh: { nav: "饮食禁忌", pageTitle: "饮食禁忌", breadcrumb: "饮食禁忌" },
    en: { nav: "Food safety", pageTitle: "Food safety", breadcrumb: "Food safety" },
  },
  ai: {
    zh: { nav: "AI问答", pageTitle: "AI 问答", breadcrumb: "AI问答" },
    en: { nav: "AI Q&A", pageTitle: "AI Q&A", breadcrumb: "AI Q&A" },
  },
};

export function hubNavLabel(key: HubModuleKey, lang: DataLocale): string {
  return HUB_UI[key][lang].nav;
}

export function hubPageTitle(key: HubModuleKey, lang: DataLocale): string {
  return HUB_UI[key][lang].pageTitle;
}

export function hubBreadcrumbLabel(key: HubModuleKey, lang: DataLocale): string {
  return HUB_UI[key][lang].breadcrumb;
}

export type FoodWizardBreed = "金吉拉" | "布偶猫" | "英短" | "全品种/通用";
export type FoodWizardBudget = "low" | "mid" | "high";
export type FoodWizardGut = "normal" | "sensitive";

const FOOD_WIZARD_BREED_LABELS: Record<FoodWizardBreed, Record<DataLocale, string>> = {
  金吉拉: { zh: "金吉拉", en: "Chinchilla Persian" },
  布偶猫: { zh: "布偶猫", en: "Ragdoll" },
  英短: { zh: "英短", en: "British Shorthair" },
  "全品种/通用": { zh: "全品种/通用", en: "All breeds / General" },
};

const FOOD_WIZARD_COPY: Record<
  DataLocale,
  {
    title: string;
    subtitle: string;
    qBreed: string;
    qBudget: string;
    qGut: string;
    budget: Record<FoodWizardBudget, string>;
    gut: Record<FoodWizardGut, string>;
    next: string;
    back: string;
    restart: string;
    resultTitle: string;
    empty: string;
    matchPrefix: string;
    matchFallback: string;
  }
> = {
  zh: {
    title: "罐头智能推荐",
    subtitle: "按品种痛点、预算与肠胃偏好，给出 Top 3 推荐。",
    qBreed: "猫咪品种",
    qBudget: "你的预算偏好",
    qGut: "肠胃关注程度",
    budget: {
      low: "性价比优先（平价）",
      mid: "均衡型（中档）",
      high: "品质优先（高端）",
    },
    gut: {
      normal: "普通肠胃",
      sensitive: "玻璃胃 / 更敏感",
    },
    next: "下一题",
    back: "上一题",
    restart: "重新选择",
    resultTitle: "推荐结果 Top 3",
    empty: "当前条件下暂无匹配结果，请放宽筛选条件。",
    matchPrefix: "非常适合",
    matchFallback: "匹配你当前的预算与肠胃偏好",
  },
  en: {
    title: "Smart canned food picker",
    subtitle: "Top 3 picks by breed pain points, budget and gut preference.",
    qBreed: "Cat breed",
    qBudget: "Budget preference",
    qGut: "Gut sensitivity",
    budget: {
      low: "Value-first (budget)",
      mid: "Balanced (mid-range)",
      high: "Quality-first (premium)",
    },
    gut: {
      normal: "Normal digestion",
      sensitive: "Sensitive tummy",
    },
    next: "Next",
    back: "Back",
    restart: "Start over",
    resultTitle: "Top 3 recommendations",
    empty: "No matching cans for current filters. Try a broader setup.",
    matchPrefix: "Great fit for",
    matchFallback: "Matches your budget and gut profile",
  },
};

export function foodWizardBreedLabel(breed: FoodWizardBreed, lang: DataLocale): string {
  return FOOD_WIZARD_BREED_LABELS[breed][lang];
}

export function foodWizardCopy(lang: DataLocale) {
  return FOOD_WIZARD_COPY[lang];
}

