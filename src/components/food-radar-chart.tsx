"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CostPerformanceLevel = "S级" | "A级" | "B级" | "C级" | string;

export type CatFoodRadarItem = {
  brand: string;
  name: string;
  protein_dm: number;
  meat_content: number;
  score: number;
  cost_performance_level: CostPerformanceLevel;
};

type FoodRadarChartProps = {
  selectedFoods: CatFoodRadarItem[];
};

type RadarRow = {
  metric: string;
  [foodKey: string]: string | number;
};

const CHART_COLORS = ["#FFB7B2", "#E2F0CB", "#FFDAC1"];

const METRIC_LABELS = {
  protein: "蛋白质",
  meat: "含肉量",
  score: "综合评分",
  value: "性价比",
} as const;

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function valueLevelToPercent(level: CostPerformanceLevel): number {
  if (level === "S级") return 100;
  if (level === "A级") return 85;
  if (level === "B级") return 70;
  if (level === "C级") return 50;
  return 0;
}

function normalizeFood(food: CatFoodRadarItem) {
  return {
    protein: clampPercent((food.protein_dm / 60) * 100),
    meat: clampPercent(food.meat_content),
    score: clampPercent(food.score),
    value: clampPercent(valueLevelToPercent(food.cost_performance_level)),
  };
}

function buildRadarRows(foods: CatFoodRadarItem[]): RadarRow[] {
  const rows: RadarRow[] = [
    { metric: METRIC_LABELS.protein },
    { metric: METRIC_LABELS.meat },
    { metric: METRIC_LABELS.score },
    { metric: METRIC_LABELS.value },
  ];

  foods.forEach((food, idx) => {
    const key = `food_${idx}`;
    const normalized = normalizeFood(food);
    rows[0][key] = normalized.protein;
    rows[1][key] = normalized.meat;
    rows[2][key] = normalized.score;
    rows[3][key] = normalized.value;
  });

  return rows;
}

export default function FoodRadarChart({ selectedFoods }: FoodRadarChartProps) {
  const foods = selectedFoods.slice(0, 3);
  const chartData = buildRadarRows(foods);

  if (foods.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-6 text-center text-sm text-zinc-500">
        请先选择要对比的猫罐头
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full rounded-2xl border border-zinc-200 bg-white/80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke="#E9DED8" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#6B5E57", fontSize: 13 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#9D8E86", fontSize: 11 }} />
          <Tooltip
            formatter={(value: number | string | undefined) => {
              const n = typeof value === "number" ? value : Number(value ?? 0);
              return `${Math.round(Number.isFinite(n) ? n : 0)}%`;
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #F0E5DE",
              background: "#FFF9F6",
            }}
          />
          <Legend />
          {foods.map((food, idx) => {
            const key = `food_${idx}`;
            const color = CHART_COLORS[idx];
            return (
              <Radar
                key={key}
                name={`${food.brand} ${food.name}`}
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={0.5}
                strokeWidth={2.5}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

