import Link from "next/link";
import QuestionCard from "@/components/question-card";
import SearchBar from "@/components/search-bar";
import ShareActions from "@/components/share-actions";
import homeContent from "@/data/home-content.json";
import { getPopularQuestions } from "@/lib/data";
import { appPath } from "@/lib/app-path";
import { SITE_BRAND_NAME } from "@/lib/site-brand";
import { SITE_HUBS } from "@/lib/site-hubs";

export default async function Home() {
  const popularQuestions = await getPopularQuestions();
  const examples = homeContent.search_examples as string[];
  const cards = homeContent.category_cards as {
    emoji: string;
    title: string;
    href: string;
    hint: string;
  }[];

  return (
    <div className="space-y-8 sm:space-y-10">
      <section
        className="rounded-3xl border border-zinc-200/90 bg-white px-5 py-8 sm:px-8 sm:py-10"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">知识库 · 服务入口</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl sm:leading-tight">
          {SITE_BRAND_NAME}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">猫咪知识库 · 问答 · 用品 · 新手指南</p>
        <p className="mb-6 mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">
          以真实搜索问题为主：先搜索，再按健康 / 行为 / 用品 / 新手指南浏览。支持 AI 从知识库检索回答。
        </p>
        <form action={appPath("/search")} acceptCharset="UTF-8" method="get">
          <SearchBar placeholder="搜索问题或用品，例如：猫拉稀、猫掉毛、猫砂" />
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">试试</span>
          {examples.map((ex) => (
            <Link
              key={ex}
              href={`/search?q=${encodeURIComponent(ex)}`}
              className="rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-white"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              {ex}
            </Link>
          ))}
        </div>
        <div className="mt-5">
          <ShareActions />
        </div>
      </section>

      <section
        className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">常见问题入口</h2>
        <p className="mb-4 text-sm text-zinc-600">按高频需求进对应分类；更多从顶部导航进入。</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.href + c.title}
              href={c.href}
              className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 text-left transition hover:border-zinc-300 hover:shadow-md sm:p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="text-lg leading-none">{c.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">{c.title}</div>
              <p className="mt-0.5 text-xs leading-snug text-zinc-500">{c.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">全部入口</h2>
        <p className="mb-4 text-sm text-zinc-600">与顶部导航一致；大屏可作目录卡片。</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_HUBS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-zinc-200/90 bg-white p-4 text-left transition hover:border-zinc-300 hover:shadow-md sm:p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="text-sm font-semibold text-zinc-900">{card.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">热门问题</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {popularQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>
    </div>
  );
}
