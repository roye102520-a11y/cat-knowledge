export type CategoryFilterItem = string | { value: string; label: string };

function normalizeItem(item: CategoryFilterItem): { value: string; label: string } {
  if (typeof item === "string") return { value: item, label: item };
  return item;
}

interface CategoryFilterProps {
  items: CategoryFilterItem[];
  name: string;
  /** 与提交参数一致（通常为英文 slug） */
  activeValue?: string;
  allLabel?: string;
}

export default function CategoryFilter({
  items,
  name,
  activeValue,
  allLabel = "全部",
}: CategoryFilterProps) {
  const normalized = items.map(normalizeItem);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="submit"
        className={`rounded-full border px-3 py-1 text-sm ${
          !activeValue
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
        }`}
        name={name}
        value=""
      >
        {allLabel}
      </button>
      {normalized.map(({ value, label }) => (
        <button
          key={value}
          type="submit"
          className={`rounded-full border px-3 py-1 text-sm ${
            activeValue === value
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
          }`}
          name={name}
          value={value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
