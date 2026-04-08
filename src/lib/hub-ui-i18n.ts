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

