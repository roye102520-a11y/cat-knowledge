"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type CategoryFilterItem = string | { value: string; label: string };

function normalizeItem(item: CategoryFilterItem): { value: string; label: string } {
  if (typeof item === "string") return { value: item, label: item };
  return item;
}

/** 在当前查询串上写入/删除一个键，保留其余参数（含中文 q），避免多枚 submit 互斥导致丢参、编码异常 */
function mergeParamInSearchString(
  current: URLSearchParams,
  paramName: string,
  value: string,
): string {
  const next = new URLSearchParams(current.toString());
  if (value === "") {
    next.delete(paramName);
  } else {
    next.set(paramName, value);
  }
  return next.toString();
}

interface CategoryFilterProps {
  items: CategoryFilterItem[];
  /** 查询参数名，如 category、price_level */
  paramName: string;
  /** 与 URL 中 paramName 一致（英文 slug） */
  activeValue?: string;
  allLabel?: string;
  /** 不含 basePath，如 /products、/questions */
  pathname: string;
}

export default function CategoryFilter({
  items,
  paramName,
  activeValue,
  allLabel = "全部",
  pathname,
}: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const normalized = items.map(normalizeItem);

  const qsAll = mergeParamInSearchString(searchParams, paramName, "");
  const hrefAll = qsAll ? `${pathname}?${qsAll}` : pathname;

  return (
    <div className="flex min-h-12 flex-wrap gap-3 rounded-2xl border-0 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <Link
        href={hrefAll}
        scroll={false}
        className={`inline-flex min-h-12 items-center rounded-xl border-0 px-4 py-2 text-sm no-underline shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition ${
          !activeValue
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-[var(--color-accent-green)]"
        }`}
      >
        {allLabel}
      </Link>
      {normalized.map(({ value, label }) => {
        const qs = mergeParamInSearchString(searchParams, paramName, value);
        const href = qs ? `${pathname}?${qs}` : pathname;
        return (
          <Link
            key={value}
            href={href}
            scroll={false}
            className={`inline-flex min-h-12 items-center rounded-xl border-0 px-4 py-2 text-sm no-underline shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition ${
              activeValue === value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-[var(--color-accent-green)]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
