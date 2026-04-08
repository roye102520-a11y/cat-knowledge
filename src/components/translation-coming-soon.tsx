import Link from "next/link";

type Variant = "page" | "inline";

/** 翻译降级的轻量条：浅米色、居中、偏暖，非报错感 */
const whisperShellClass =
  "rounded-xl border border-stone-200/50 bg-gradient-to-b from-[#fbf9f5] to-[#f3efe8] px-4 py-2.5 text-center shadow-[0_1px_2px_rgba(66,42,40,0.05)]";

const whisperTextClass = "text-[0.8125rem] leading-relaxed text-stone-600";

const dotSep = <span className="mx-1.5 select-none text-stone-300/90">·</span>;

const linkWarm =
  "font-medium text-rose-900/75 underline decoration-rose-300/55 underline-offset-[3px] transition hover:text-rose-950 hover:decoration-rose-400/70";

const linkMuted =
  "font-medium text-stone-600 underline decoration-stone-300/70 underline-offset-[3px] transition hover:text-stone-800";

/**
 * 英文 Markdown / 长文尚未就绪时的占位：page 为完整卡片；inline 为单行弱提示（温暖、非报错）。
 */
export default function TranslationComingSoon({
  variant = "inline",
  zhHref,
  zhTitle,
  listHref,
  listLabel,
  eyebrow = "English",
}: {
  variant?: Variant;
  /** 中文版同 slug 的链接 */
  zhHref: string;
  zhTitle?: string;
  /** 列表页（如 /en/articles、/en/wiki 上级）— page 模式用 */
  listHref?: string;
  listLabel?: string;
  eyebrow?: string;
}) {
  const isPage = variant === "page";

  if (!isPage) {
    return (
      <div role="status" aria-live="polite" className={whisperShellClass}>
        {zhTitle ? <span className="sr-only">中文版标题：{zhTitle}</span> : null}
        <p className={whisperTextClass}>
          <span className="text-stone-700/88">译文还在温柔整理中</span>
          {dotSep}
          <span>下方暂为中文正文</span>
          {dotSep}
          <span className="text-stone-500/95">English in gentle progress—thanks for waiting</span>
          {zhHref ? (
            <>
              {dotSep}
              <Link href={zhHref} className={linkWarm}>
                中文页
              </Link>
            </>
          ) : null}
          {listHref && listLabel ? (
            <>
              {dotSep}
              <Link href={listHref} className={linkMuted}>
                {listLabel}
              </Link>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-violet-200/85 bg-gradient-to-br from-violet-50/95 via-white to-sky-50/80 p-8 shadow-sm sm:p-10"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-200/35 blur-2xl sm:h-40 sm:w-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-sky-200/30 blur-2xl"
        aria-hidden
      />

      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-violet-600/90">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.75rem]">
        English version on the way
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
        We&apos;re gently polishing a faithful English read—warm, accurate, and pet-first. Below you can still browse
        the Chinese draft; thank you for your patience.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-violet-900/75">英文译文正在路上，当前仍可阅读中文版正文。</p>

      {zhTitle ? (
        <p className="mt-4 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700">Chinese title · </span>
          <span className="text-zinc-600">{zhTitle}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={zhHref}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
        >
          Read the Chinese version
        </Link>
        {listHref && listLabel ? (
          <Link
            href={listHref}
            className="inline-flex items-center justify-center rounded-xl border border-violet-200/90 bg-white/80 px-5 py-2.5 text-sm font-medium text-violet-950 transition hover:border-violet-300 hover:bg-white"
          >
            {listLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

/** Wiki 等：中文 URL 下暂时只得英文正文时的同款轻提示（与 TranslationComingSoon inline 视觉一致） */
export function ZhRouteEnglishBodyHint({
  enHref,
  listHref,
  listLabel,
}: {
  enHref: string;
  listHref: string;
  listLabel: string;
}) {
  return (
    <div role="status" aria-live="polite" className={whisperShellClass}>
      <p className={whisperTextClass}>
        <span className="text-stone-700/88">中文稿暂时缺席</span>
        {dotSep}
        <span>下方为英文原文，思路一样暖</span>
        {dotSep}
        <span className="text-stone-500/95">Chinese draft missing—English notes below</span>
        {dotSep}
        <Link href={enHref} className={linkWarm}>
          English page
        </Link>
        {dotSep}
        <Link href={listHref} className={linkMuted}>
          {listLabel}
        </Link>
      </p>
    </div>
  );
}
