import type { UiLocale } from "@/lib/localized-path";
import type { QuestionCategory } from "@/lib/types";

/** 分类标签（canonical `category` 仍为中文枚举，仅 UI 展示随语言切换） */
const CATEGORY_UI: Record<QuestionCategory, { zh: string; en: string }> = {
  肠胃问题: { zh: "肠胃问题", en: "Digestion" },
  行为问题: { zh: "行为问题", en: "Behavior" },
  护理问题: { zh: "护理问题", en: "Care" },
  健康问题: { zh: "健康问题", en: "Health" },
};

export function questionCategoryUiLabel(category: QuestionCategory, lang: UiLocale): string {
  return CATEGORY_UI[category][lang];
}

export function questionCardSectionCopy(lang: UiLocale): { causes: string; solutions: string } {
  return lang === "en"
    ? { causes: "Common causes", solutions: "What to try" }
    : { causes: "常见原因", solutions: "解决方案" };
}

/** 列表项分隔符（与正文语言无关时仍可按界面语言选标点） */
export function questionListJoiners(lang: UiLocale): { causes: string; solutions: string } {
  return lang === "en"
    ? { causes: ", ", solutions: "; " }
    : { causes: "、", solutions: "；" };
}
