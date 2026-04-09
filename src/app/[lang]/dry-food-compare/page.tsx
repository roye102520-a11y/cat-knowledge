import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DryFoodCompareClient from "@/app/[lang]/dry-food-compare/dry-food-compare-client";
import fallbackDryFoodsRaw from "@/data/raw/dry-foods-radar.json";
import { hubBreadcrumbLabel, hubPageTitle } from "@/lib/hub-ui-i18n";
import { isUiLocale, type UiLocale, withLang } from "@/lib/localized-path";
import { tryReadDryFoodsRadarJson } from "@/lib/locale-data";
import { englishDocumentTitle } from "@/lib/site-brand";

type Props = { params: Promise<{ lang: string }> };

type DryFoodItem = {
  brand: string;
  name: string;
  price_per_g: number;
  protein_dm: number;
  meat_content: number;
  carbs_est: number;
  safety_tags: string[];
  efficacy_tags: string[];
  score: number;
  factory?: string;
  cost_performance_level?: string;
};

function safeReadDryFoods(lang: UiLocale): DryFoodItem[] {
  const primary = tryReadDryFoodsRadarJson<DryFoodItem[]>(lang);
  if (Array.isArray(primary)) return primary;
  const fallback = tryReadDryFoodsRadarJson<DryFoodItem[]>(lang === "en" ? "zh" : "en");
  if (Array.isArray(fallback)) return fallback;
  return Array.isArray(fallbackDryFoodsRaw) ? (fallbackDryFoodsRaw as DryFoodItem[]) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";
  if (lang === "en") {
    const titleAbs = englishDocumentTitle(hubPageTitle("dryFoodCompare", "en"));
    const description = "Breed-aware dry food selector with wizard, radar comparison and sortable data table.";
    return {
      title: { absolute: titleAbs },
      description,
      openGraph: { title: titleAbs, description, type: "website" },
      twitter: { card: "summary", title: titleAbs, description },
    };
  }
  const title = hubPageTitle("dryFoodCompare", "zh");
  const description = "按品种痛点、预算与肠胃偏好筛选干粮，输出雷达对比与严选数据表。";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function DryFoodComparePage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const foodsData = safeReadDryFoods(lang);

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
        <span className="text-zinc-900">{hubBreadcrumbLabel("dryFoodCompare", lang)}</span>
      </nav>

      <DryFoodCompareClient lang={lang} foodsData={foodsData} />
    </div>
  );
}

