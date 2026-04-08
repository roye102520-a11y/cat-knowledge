"use client";

import { useRouter, usePathname } from "next/navigation";
import { getAlternateLocalePathFromBrowserPathname, getSwitchLabel } from "@/lib/locale-path";

/**
 * 悬浮语言切换：将 /zh/... 与 /en/... 互切；无前缀路径会进入 /en/...（假定当前为中文视图）。
 * 支持 NEXT_PUBLIC_BASE_PATH（GitHub Pages 子路径）：先剥 base 再算目标路径。
 */
export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const nextPath = getAlternateLocalePathFromBrowserPathname(pathname);
  const label = getSwitchLabel(pathname);

  return (
    <button
      type="button"
      onClick={() => router.push(nextPath)}
      title={label === "EN" ? "Switch to English" : "切换到中文"}
      aria-label={label === "EN" ? "Switch to English" : "切换到中文"}
      className="fixed right-[4.75rem] top-3 z-[200] flex h-9 min-w-[2.75rem] select-none items-center justify-center rounded-xl border border-white/50 bg-white/35 px-3 text-xs font-semibold tracking-wide text-zinc-800 shadow-sm backdrop-blur-xl transition-transform duration-150 ease-out hover:bg-white/50 active:scale-95 md:right-5 md:top-4 md:h-10 md:min-w-[3.25rem] md:text-sm"
      style={{ boxShadow: "0 4px 24px rgba(66, 42, 40, 0.08)" }}
    >
      {label}
    </button>
  );
}
