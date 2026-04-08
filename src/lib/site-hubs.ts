import type { UiLocale } from "@/lib/localized-path";
import { hubNavLabel } from "@/lib/hub-ui-i18n";
import { withLang } from "@/lib/localized-path";

export type SiteHubDef = {
  href: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
};

/** 主导航定义（href 不含语言前缀） */
export const SITE_HUBS_DEF: SiteHubDef[] = [
  {
    href: "/questions",
    titleZh: hubNavLabel("questions", "zh"),
    titleEn: hubNavLabel("questions", "en"),
    descriptionZh: "以真实搜索问题为主：全库检索与分类筛选。",
    descriptionEn: "Browse and search real user-style cat care questions.",
  },
  {
    href: "/questions?hub=disease",
    titleZh: "猫咪健康",
    titleEn: "Health",
    descriptionZh: "肠胃、症状、皮肤与健康护理等高频搜索。",
    descriptionEn: "Digestion, symptoms, skin and general health topics.",
  },
  {
    href: "/questions?hub=behavior",
    titleZh: "猫咪行为",
    titleEn: "Behavior",
    descriptionZh: "乱尿、抓挠、应激、作息等行为向问答。",
    descriptionEn: "Litter, scratching, stress, routines and multi-cat behavior.",
  },
  {
    href: "/products",
    titleZh: hubNavLabel("products", "zh"),
    titleEn: hubNavLabel("products", "en"),
    descriptionZh: "猫粮、猫砂、玩具等；未来可承接推荐与变现。",
    descriptionEn: "Food, litter, toys and gear from the product library.",
  },
  {
    href: "/guide",
    titleZh: hubNavLabel("guide", "zh"),
    titleEn: hubNavLabel("guide", "en"),
    descriptionZh: "接猫、清单、喂养与环境长文（含文档摘录）。",
    descriptionEn: "Checklists, settling in, feeding and environment notes.",
  },
  {
    href: "/foods",
    titleZh: "饮食禁忌",
    titleEn: "Food safety",
    descriptionZh: "常见食物能不能吃：对照表检索，红绿标签快速区分风险。",
    descriptionEn: "Quick lookup: foods cats should avoid vs. safer options.",
  },
  {
    href: "/ai",
    titleZh: "AI问答",
    titleEn: "AI Q&A",
    descriptionZh: "输入自然语言，从知识库检索并拼接摘要回答（RAG）。",
    descriptionEn: "Keyword search over the knowledge base with a short summary.",
  },
];

export type SiteHubNavItem = {
  href: string;
  title: string;
  description: string;
};

export function siteHubsForLocale(lang: UiLocale): SiteHubNavItem[] {
  return SITE_HUBS_DEF.map((h) => ({
    href: withLang(lang, h.href),
    title: lang === "en" ? h.titleEn : h.titleZh,
    description: lang === "en" ? h.descriptionEn : h.descriptionZh,
  }));
}

export type SiteFooterLinkDef = {
  href: string;
  labelZh: string;
  labelEn: string;
};

export const SITE_FOOTER_LINKS_DEF: SiteFooterLinkDef[] = [
  { href: "/articles", labelZh: hubNavLabel("articles", "zh"), labelEn: hubNavLabel("articles", "en") },
  { href: "/foods", labelZh: hubNavLabel("foods", "zh"), labelEn: hubNavLabel("foods", "en") },
  { href: "/zones", labelZh: hubNavLabel("zones", "zh"), labelEn: hubNavLabel("zones", "en") },
];

export function siteFooterLinksForLocale(lang: UiLocale): { href: string; label: string }[] {
  return SITE_FOOTER_LINKS_DEF.map((l) => ({
    href: withLang(lang, l.href),
    label: lang === "en" ? l.labelEn : l.labelZh,
  }));
}
