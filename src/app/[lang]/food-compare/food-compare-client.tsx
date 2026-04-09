"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import FoodGuideWizard, { type FoodWizardRecommendation } from "@/components/food-guide-wizard";
import FoodRadarChart from "@/components/food-radar-chart";
import { hubPageTitle } from "@/lib/hub-ui-i18n";
import type { DataLocale } from "@/lib/types";

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

type FoodCompareClientProps = {
  lang: DataLocale;
  foods: FoodCompareItem[];
};

const copy = {
  zh: {
    lead: "先完成三步问答，系统会按预算、肠胃与品种痛点给出 Top 3 并自动展示雷达图。",
    radarTitle: "Top 3 罐头雷达对比",
    empty: "完成向导后，这里会出现你专属的对比雷达图。",
  },
  en: {
    lead: "Complete the 3-step wizard to get Top 3 picks by budget, gut profile and breed pain points.",
    radarTitle: "Top 3 radar comparison",
    empty: "Your personalized radar chart appears here after the wizard.",
  },
} as const;

export default function FoodCompareClient({ lang, foods }: FoodCompareClientProps) {
  const c = copy[lang];
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
        cost_performance_level: item.cost_performance_level,
      })),
    [recommendations],
  );

  const scrollToChart = useCallback(() => {
    chartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white/85 p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{hubPageTitle("foodCompare", lang)}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.lead}</p>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white/85 p-4 md:p-6">
        <FoodGuideWizard
          foods={foods}
          lang={lang}
          onRecommendationsChange={setRecommendations}
          onCompleted={scrollToChart}
        />
      </section>

      <section ref={chartRef} className="rounded-3xl border border-zinc-200 bg-white/85 p-4 md:p-6">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">{c.radarTitle}</h2>
        {selectedFoods.length > 0 ? (
          <FoodRadarChart selectedFoods={selectedFoods} />
        ) : (
          <p className="rounded-2xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">{c.empty}</p>
        )}
      </section>
    </div>
  );
}

