"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import FoodDataTable from "@/components/food-data-table";
import FoodGuideWizard, { type FoodWizardRecommendation } from "@/components/food-guide-wizard";
import FoodRadarChart from "@/components/food-radar-chart";
import { hubPageTitle } from "@/lib/hub-ui-i18n";
import type { DataLocale } from "@/lib/types";

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

type DryFoodCompareClientProps = {
  lang: DataLocale;
  foodsData: DryFoodItem[];
};

const copy = {
  zh: {
    lead: "先完成导购向导，系统会基于预算、肠胃和品种痛点筛出 Top 3 并自动滚动到对比图。",
    radarTitle: "干粮 Top 3 雷达对比",
    tableTitle: "干粮严选数据表",
    empty: "完成向导后，这里会出现你的个性化干粮对比。",
  },
  en: {
    lead: "Finish the wizard first. Top 3 dry foods are ranked by budget, gut profile and breed pain points.",
    radarTitle: "Dry food Top 3 radar",
    tableTitle: "Dry food data table",
    empty: "Your personalized dry food comparison appears here after the wizard.",
  },
} as const;

export default function DryFoodCompareClient({ lang, foodsData }: DryFoodCompareClientProps) {
  const t = copy[lang];
  const [recommendations, setRecommendations] = useState<FoodWizardRecommendation[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const selectedFoods = useMemo(
    () =>
      recommendations.map((item) => ({
        brand: item.brand,
        name: item.name,
        protein_dm: item.protein_dm,
        meat_content: item.meat_content,
        score: item.score,
        cost_performance_level: item.cost_performance_level || "A级",
      })),
    [recommendations],
  );

  const wizardData = useMemo(
    () =>
      foodsData.map((x) => ({
        ...x,
        cost_performance_level: x.cost_performance_level ?? "A级",
      })),
    [foodsData],
  );

  const scrollToChart = useCallback(() => {
    chartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white/85 p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{hubPageTitle("dryFoodCompare", lang)}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t.lead}</p>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white/85 p-4 md:p-6">
        <FoodGuideWizard
          foodsData={wizardData}
          lang={lang}
          onRecommendationsChange={setRecommendations}
          onCompleted={scrollToChart}
        />
      </section>

      <section ref={chartRef} className="rounded-3xl border border-zinc-200 bg-white/85 p-4 md:p-6">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">{t.radarTitle}</h2>
        {selectedFoods.length > 0 ? (
          <FoodRadarChart foodsData={selectedFoods} />
        ) : (
          <p className="rounded-2xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">{t.empty}</p>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-zinc-200 bg-white/85 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-zinc-900">{t.tableTitle}</h2>
        <FoodDataTable foodsData={foodsData} lang={lang} />
      </section>
    </div>
  );
}

