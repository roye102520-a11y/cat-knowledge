interface SearchBarProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  name = "q",
  defaultValue = "",
  placeholder = "搜索猫咪问题、用品...",
}: SearchBarProps) {
  return (
    <div
      className="rounded-2xl border border-zinc-200/90 bg-white p-2 sm:p-2.5"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-xl sm:bg-zinc-50/80 sm:p-1">
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-12 min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 sm:border-0 sm:bg-transparent sm:focus:ring-0"
        />
        <button
          type="submit"
          className="btn-primary-soft h-12 min-h-12 shrink-0 border-0 px-6 text-sm shadow-none sm:ml-1 sm:w-auto sm:px-8"
        >
          搜索
        </button>
      </div>
    </div>
  );
}
