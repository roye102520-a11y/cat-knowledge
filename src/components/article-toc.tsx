"use client";

import type { ArticleTocItem } from "@/lib/seo-articles";

export default function ArticleToc({
  items,
  variant = "desktop",
}: {
  items: ArticleTocItem[];
  variant?: "desktop" | "mobile";
}) {
  if (items.length === 0) return null;

  const list = (
    <ul className="mt-2 space-y-1 text-sm leading-snug">
      {items.map((item) => (
        <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "0.65rem" : 0 }}>
          <a
            href={`#${item.id}`}
            className="block w-full rounded-lg px-2 py-1.5 text-left text-zinc-700 no-underline transition hover:bg-[var(--color-primary-muted)] hover:text-zinc-900"
          >
            <span className="line-clamp-2">{item.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "mobile") {
    return (
      <details className="app-panel group mb-2 p-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-800 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            本文目录
            <span className="text-xs font-normal text-zinc-500">{items.length} 节</span>
          </span>
        </summary>
        <nav aria-label="文章目录" className="border-t border-[var(--card-border)] pt-2">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="文章目录">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">目录</p>
      <div className="max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-1">{list}</div>
    </nav>
  );
}
