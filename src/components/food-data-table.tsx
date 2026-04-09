"use client";

import type { DataLocale } from "@/lib/types";

type FoodDataRow = {
  brand: string;
  name: string;
  price_per_g: number;
  protein_dm: number;
  efficacy_tags: string[];
  score: number;
  factory?: string;
};

type FoodDataTableProps = {
  foodsData: FoodDataRow[];
  lang?: DataLocale;
};

const copy = {
  zh: {
    colName: "品牌及名称",
    colPrice: "单价(元/g)",
    colProtein: "粗蛋白",
    colTags: "核心功效",
    colScore: "严选评分",
    colFactory: "代工厂",
    unknown: "未标注",
  },
  en: {
    colName: "Brand & Product",
    colPrice: "Price (CNY/g)",
    colProtein: "Protein DM",
    colTags: "Core efficacy",
    colScore: "Score",
    colFactory: "Factory",
    unknown: "N/A",
  },
} as const;

const tagColors = [
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-violet-100 text-violet-700 border-violet-200",
];

export default function FoodDataTable({ foodsData, lang = "zh" }: FoodDataTableProps) {
  const t = copy[lang];

  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white/85 shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#FFF7F2] text-zinc-700">
            <th className="px-4 py-3 text-left font-semibold">{t.colName}</th>
            <th className="px-4 py-3 text-left font-semibold">{t.colPrice}</th>
            <th className="px-4 py-3 text-left font-semibold">{t.colProtein}</th>
            <th className="px-4 py-3 text-left font-semibold">{t.colTags}</th>
            <th className="px-4 py-3 text-left font-semibold">{t.colScore}</th>
            <th className="px-4 py-3 text-left font-semibold">{t.colFactory}</th>
          </tr>
        </thead>
        <tbody>
          {foodsData.map((row, idx) => (
            <tr key={`${row.brand}-${row.name}`} className={idx % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"}>
              <td className="px-4 py-3 text-zinc-800">
                <p className="font-medium">{row.brand}</p>
                <p className="text-zinc-600">{row.name}</p>
              </td>
              <td className="px-4 py-3 text-zinc-700">{row.price_per_g.toFixed(2)}</td>
              <td className="px-4 py-3 text-zinc-700">{row.protein_dm.toFixed(1)}%</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {row.efficacy_tags.map((tag, tagIdx) => (
                    <span
                      key={`${row.name}-${tag}`}
                      className={`rounded-full border px-2 py-0.5 text-xs ${tagColors[tagIdx % tagColors.length]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-zinc-800">{row.score}</td>
              <td className="px-4 py-3 text-zinc-700">{row.factory?.trim() || t.unknown}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

