"use client";

import { useEffect, useMemo, useState } from "react";
import { getTagsByBreed } from "@/lib/breed-meta";
import {
  foodWizardBreedLabel,
  foodWizardCopy,
  type FoodWizardBreed,
  type FoodWizardBudget,
  type FoodWizardGut,
} from "@/lib/hub-ui-i18n";
import type { DataLocale } from "@/lib/types";

type FoodItem = {
  brand: string;
  name: string;
  price_per_g: number;
  protein_dm: number;
  meat_content: number;
  cost_performance_level: string;
  score: number;
  safety_tags: string[];
  efficacy_tags: string[];
};

export type FoodWizardRecommendation = FoodItem & {
  matchTags: string[];
  weightedScore: number;
};

type FoodGuideWizardProps = {
  foods: FoodItem[];
  lang?: DataLocale;
  onRecommendationsChange?: (items: FoodWizardRecommendation[]) => void;
  onCompleted?: () => void;
};

const BREED_OPTIONS: FoodWizardBreed[] = ["金吉拉", "布偶猫", "英短", "全品种/通用"];
const BUDGET_OPTIONS: FoodWizardBudget[] = ["low", "mid", "high"];
const GUT_OPTIONS: FoodWizardGut[] = ["normal", "sensitive"];

function hitBudget(pricePerG: number, budget: FoodWizardBudget): boolean {
  if (budget === "low") return pricePerG <= 0.12;
  if (budget === "mid") return pricePerG <= 0.18;
  return true;
}

function hitGut(food: FoodItem, gut: FoodWizardGut): boolean {
  if (gut === "normal") return true;
  const tags = new Set(food.safety_tags);
  return tags.has("无胶") && tags.has("无谷");
}

export default function FoodGuideWizard({
  foods,
  lang = "zh",
  onRecommendationsChange,
  onCompleted,
}: FoodGuideWizardProps) {
  const copy = foodWizardCopy(lang);
  const [step, setStep] = useState(0);
  const [breed, setBreed] = useState<FoodWizardBreed>("全品种/通用");
  const [budget, setBudget] = useState<FoodWizardBudget>("mid");
  const [gut, setGut] = useState<FoodWizardGut>("normal");

  const breedTags = useMemo(() => getTagsByBreed(breed), [breed]);

  const rankedFoods = useMemo(() => {
    const filtered = foods.filter((food) => hitBudget(food.price_per_g, budget) && hitGut(food, gut));
    const withWeight: FoodWizardRecommendation[] = filtered.map((food) => {
      const matched = food.efficacy_tags.filter((tag) => breedTags.includes(tag as (typeof breedTags)[number]));
      const weight = matched.length * 12;
      return {
        ...food,
        matchTags: matched,
        weightedScore: food.score + weight,
      };
    });
    return withWeight.sort((a, b) => b.weightedScore - a.weightedScore || b.score - a.score).slice(0, 3);
  }, [foods, budget, gut, breedTags]);

  useEffect(() => {
    onRecommendationsChange?.(rankedFoods);
  }, [rankedFoods, onRecommendationsChange]);

  useEffect(() => {
    if (step === 3 && rankedFoods.length > 0) {
      onCompleted?.();
    }
  }, [step, rankedFoods.length, onCompleted]);

  const canPrev = step > 0;
  const canNext = step < 3;

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/85 p-5">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">{copy.title}</h2>
        <p className="text-sm text-zinc-600">{copy.subtitle}</p>
      </header>

      <div className="relative min-h-[196px] overflow-hidden">
        <div
          key={step}
          className="animate-in fade-in-0 slide-in-from-right-2 duration-200 space-y-3"
        >
          {step === 0 ? (
            <>
              <p className="text-sm font-medium text-zinc-800">{copy.qBreed}</p>
              <div className="grid grid-cols-2 gap-2">
                {BREED_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBreed(item)}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      breed === item
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {foodWizardBreedLabel(item, lang)}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <p className="text-sm font-medium text-zinc-800">{copy.qBudget}</p>
              <div className="grid grid-cols-1 gap-2">
                {BUDGET_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBudget(item)}
                    className={`rounded-xl border px-3 py-2 text-sm text-left transition ${
                      budget === item
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {copy.budget[item]}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <p className="text-sm font-medium text-zinc-800">{copy.qGut}</p>
              <div className="grid grid-cols-1 gap-2">
                {GUT_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGut(item)}
                    className={`rounded-xl border px-3 py-2 text-sm text-left transition ${
                      gut === item
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {copy.gut[item]}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <p className="text-sm font-medium text-zinc-800">{copy.resultTitle}</p>
              {rankedFoods.length === 0 ? (
                <p className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600">{copy.empty}</p>
              ) : (
                <ul className="space-y-2">
                  {rankedFoods.map((food) => {
                    const matchReason =
                      food.matchTags.length > 0
                        ? `${copy.matchPrefix}${foodWizardBreedLabel(breed, lang)}: ${food.matchTags[0]}`
                        : copy.matchFallback;
                    return (
                      <li key={`${food.brand}-${food.name}`} className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
                        <p className="text-sm font-medium text-zinc-900">
                          {food.brand} · {food.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">{matchReason}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </div>

      <footer className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 3 ? setStep(0) : setStep((s) => Math.max(0, s - 1)))}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          {step === 3 ? copy.restart : copy.back}
        </button>
        {canNext ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
          >
            {copy.next}
          </button>
        ) : <span />}
      </footer>
    </section>
  );
}

