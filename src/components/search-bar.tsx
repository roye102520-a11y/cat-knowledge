interface SearchBarProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  submitLabel?: string;
  icon?: string;
  size?: "default" | "hero";
}

export default function SearchBar({
  name = "q",
  defaultValue = "",
  placeholder = "搜索猫咪问题、用品...",
  submitLabel = "搜索",
  icon,
  size = "default",
}: SearchBarProps) {
  const isHero = size === "hero";
  return (
    <div
      className={`mx-auto rounded-3xl border border-zinc-200/90 bg-white p-2 sm:p-2.5 ${isHero ? "max-w-3xl" : ""}`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-xl sm:bg-zinc-50/80 sm:p-1">
        {icon ? <span className="self-center px-3 text-xl">{icon}</span> : null}
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 sm:border-0 sm:bg-transparent sm:focus:ring-0 ${isHero ? "h-14 min-h-14 text-base" : "h-12 min-h-12 text-sm"}`}
        />
        <button
          type="submit"
          className={`btn-primary-soft shrink-0 border-0 shadow-none sm:ml-1 sm:w-auto sm:px-8 ${isHero ? "h-14 min-h-14 px-7 text-base" : "h-12 min-h-12 px-6 text-sm"}`}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
