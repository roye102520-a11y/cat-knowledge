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
    <div className="flex flex-wrap gap-2">
      <Link
        href={hrefAll}
        scroll={false}
        className={`rounded-full border px-3 py-1 text-sm no-underline ${
          !activeValue
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
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
            className={`rounded-full border px-3 py-1 text-sm no-underline ${
              activeValue === value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
