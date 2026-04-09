import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FoodCompareClient from "@/app/[lang]/food-compare/food-compare-client";
import fallbackFoodsRaw from "@/data/raw/cat-foods-radar.json";
import { hubBreadcrumbLabel, hubPageTitle } from "@/lib/hub-ui-i18n";
import { isUiLocale, type UiLocale, withLang } from "@/lib/localized-path";
import { tryReadLocalizedJson } from "@/lib/locale-data";
import { englishDocumentTitle } from "@/lib/site-brand";

type Props = { params: Promise<{ lang: string }> };

type FoodCompareItem = {
  brand: string;
  name: string;
  spec: string;
  price_per_g: number;
  single_can_daily_retail: number;
  multi_pack_avg_price: number;
  promotion_lowest_price: number;
  cost_performance_level: string;
  level_desc: string;
  protein_dm: number;
  meat_content: number;
  carbs_est: number;
  safety_tags: string[];
  score: number;
  efficacy_tags: string[];
};

const EMPTY_FOODS: FoodCompareItem[] = [];

function safeReadFoodRadarRows(lang: UiLocale): FoodCompareItem[] {
  const primary = tryReadLocalizedJson<FoodCompareItem[]>(lang, "cat-foods-radar.json");
  if (Array.isArray(primary)) return primary;
  const fallback = tryReadLocalizedJson<FoodCompareItem[]>(lang === "en" ? "zh" : "en", "cat-foods-radar.json");
  if (Array.isArray(fallback)) return fallback;
  if (Array.isArray(fallbackFoodsRaw)) return fallbackFoodsRaw as FoodCompareItem[];
  return EMPTY_FOODS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";

  if (lang === "en") {
    const titleAbs = englishDocumentTitle(hubPageTitle("foodCompare", "en"));
    const description = "Interactive canned food guide with breed-aware Top 3 radar comparison.";
    return {
      title: { absolute: titleAbs },
      description,
      openGraph: { title: titleAbs, description, type: "website" },
      twitter: { card: "summary", title: titleAbs, description },
    };
  }

  const title = hubPageTitle("foodCompare", "zh");
  const description = "根据品种痛点、预算与肠胃偏好生成 Top 3 推荐，并用雷达图直观对比。";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function FoodComparePage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;

  const foods = safeReadFoodRadarRows(lang);

  return (
    <div className="space-y-6">
      <nav className="text-sm text-zinc-600">
        <Link href={withLang(lang, "/")} className="underline hover:text-zinc-900">
          {hubBreadcrumbLabel("home", lang)}
        </Link>
        <span className="mx-2">/</span>
        <Link href={withLang(lang, "/foods")} className="underline hover:text-zinc-900">
          {hubBreadcrumbLabel("foods", lang)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{hubBreadcrumbLabel("foodCompare", lang)}</span>
      </nav>

      <FoodCompareClient lang={lang} foods={foods} />
    </div>
  );
}

