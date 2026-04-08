import Link from "next/link";
import { notFound } from "next/navigation";
import QuestionCard from "@/components/question-card";
import SearchBar from "@/components/search-bar";
import ShareActions from "@/components/share-actions";
import { getHomeContentRecord, getPopularQuestions } from "@/lib/data";
import { appPath } from "@/lib/app-path";
import { isUiLocale, type UiLocale, withLang } from "@/lib/localized-path";
import { siteHubsForLocale } from "@/lib/site-hubs";
import { SITE_BRAND_NAME } from "@/lib/site-brand";

type Props = { params: Promise<{ lang: string }> };

const homeUi = {
  zh: {
    kicker: "知识库 · 服务入口",
    sub: "猫咪知识库 · 问答 · 用品 · 新手指南",
    lead:
      "以真实搜索问题为主：先搜索，再按健康 / 行为 / 用品 / 新手指南浏览。支持 AI 从知识库检索回答。",
    try: "试试",
    sectionCat: "常见问题入口",
    sectionCatDesc: "按高频需求进对应分类；更多从顶部导航进入。",
    sectionAll: "全部入口",
    sectionAllDesc: "与顶部导航一致；大屏可作目录卡片。",
    sectionHot: "热门问题",
  },
  en: {
    kicker: "Knowledge base",
    sub: "Q&A · Products · Guides · Bilingual UI",
    lead: "Search first, then browse health, behavior, products and starter guides. AI answers use the same knowledge base (not an LLM).",
    try: "Try",
    sectionCat: "Popular entry points",
    sectionCatDesc: "Jump to common needs; use the top nav for more.",
    sectionAll: "All hubs",
    sectionAllDesc: "Same as the header navigation.",
    sectionHot: "Popular questions",
  },
} as const;

export default async function LangHomePage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const u = homeUi[lang];

  const popularQuestions = await getPopularQuestions(lang);
  const homeContent = getHomeContentRecord(lang);
  const examples = homeContent.search_examples as string[];
  const cards = homeContent.category_cards as {
    emoji: string;
    title: string;
    href: string;
    hint: string;
  }[];
  const hubs = siteHubsForLocale(lang);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="app-panel px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">{u.kicker}</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl sm:leading-tight">
          {SITE_BRAND_NAME}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">{u.sub}</p>
        <p className="mb-6 mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">{u.lead}</p>
        <form action={appPath(withLang(lang, "/search"))} acceptCharset="UTF-8" method="get">
          <SearchBar
            placeholder={
              lang === "en"
                ? "Search, e.g. diarrhea, shedding, litter"
                : "搜索问题或用品，例如：猫拉稀、猫掉毛、猫砂"
            }
          />
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">{u.try}</span>
          {examples.map((ex) => (
            <Link
              key={ex}
              href={withLang(lang, `/search?q=${encodeURIComponent(ex)}`)}
              className="rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-white"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              {ex}
            </Link>
          ))}
        </div>
        <div className="mt-5">
          <ShareActions lang={lang} />
        </div>
      </section>

      <section className="app-panel p-5 sm:p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{u.sectionCat}</h2>
        <p className="mb-4 text-sm text-zinc-600">{u.sectionCatDesc}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.href + c.title}
              href={withLang(lang, c.href)}
              className="app-card block p-3.5 text-left no-underline transition sm:p-4"
            >
              <div className="text-lg leading-none">{c.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">{c.title}</div>
              <p className="mt-0.5 text-xs leading-snug text-zinc-500">{c.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-panel p-5 sm:p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{u.sectionAll}</h2>
        <p className="mb-4 text-sm text-zinc-600">{u.sectionAllDesc}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="app-card block p-4 text-left no-underline transition sm:p-5"
            >
              <div className="text-sm font-semibold text-zinc-900">{card.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{u.sectionHot}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {popularQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}
