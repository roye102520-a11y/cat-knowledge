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
    <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          搜索
        </button>
      </div>
    </div>
  );
}
