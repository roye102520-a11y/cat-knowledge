"use client";

import Link from "next/link";
import { useState } from "react";

const STORAGE_KEY = "cat_kb_search_history";
const MAX_ITEMS = 5;

interface SearchHistoryProps {
  currentQuery?: string;
  /** 已含语言前缀，如 /zh/search */
  searchPath: string;
}

export default function SearchHistory({ currentQuery, searchPath }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    let base: string[] = [];
    if (!raw) {
      const q = currentQuery?.trim();
      if (!q) return [];
      const next = [q];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    }
    try {
      const parsed = JSON.parse(raw) as string[];
      base = Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
    } catch {
      base = [];
    }
    const q = currentQuery?.trim();
    if (!q) return base;
    const next = [q, ...base.filter((item) => item !== q)].slice(0, MAX_ITEMS);
    if (JSON.stringify(next) !== JSON.stringify(base)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  });

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">最近搜索</p>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          清空
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <Link
            key={item}
            href={`${searchPath}?q=${encodeURIComponent(item)}`}
            className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
