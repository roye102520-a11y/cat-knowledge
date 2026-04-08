"use client";

import { useMemo, useState } from "react";
import type { CatFoodItem } from "@/lib/types";

export default function CatFoodSafetyDirectory({ items }: { items: CatFoodItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((f) => f.name.toLowerCase().includes(q) || f.reason.toLowerCase().includes(q));
  }, [items, query]);

  const safeCount = useMemo(() => filtered.filter((f) => f.safe).length, [filtered]);
  const badCount = filtered.length - safeCount;

  return (
    <div className="space-y-6">
      <header className="app-panel p-5">
        <h1 className="text-xl font-semibold text-zinc-900">猫咪饮食禁忌</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          对照表用于日常快速查阅，不能替代兽医诊断。个体差异、剂量与加工方式都会影响风险；有疑问请优先咨询执业兽医。
        </p>
        <label className="mt-4 block text-sm font-medium text-zinc-800">
          <span className="sr-only">搜索食物</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索食物名称或关键词…"
            className="mt-1 w-full rounded-[var(--card-radius)] border border-[var(--card-border)] bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-[var(--card-shadow)] outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-muted)]"
          />
        </label>
        <p className="mt-2 text-xs text-zinc-500">
          当前共 {filtered.length} 条（绿标可食 {safeCount} · 红标禁食或不建议 {badCount}）
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((food) => (
          <li key={food.name}>
            <article className="app-card flex h-full flex-col gap-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-900">{food.name}</h2>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    food.safe ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {food.safe ? "安全" : "禁食 / 不建议"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600">{food.reason}</p>
            </article>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">没有匹配的食物，换个关键词试试。</p>
      ) : null}
    </div>
  );
}
