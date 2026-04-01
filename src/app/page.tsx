import Link from "next/link";
import QuestionCard from "@/components/question-card";
import SearchBar from "@/components/search-bar";
import ShareActions from "@/components/share-actions";
import homeContent from "@/data/home-content.json";
import { getPopularQuestions } from "@/lib/data";
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
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-5">
        <h1 className="mt-2 mb-2 text-2xl font-semibold tracking-tight">{SITE_BRAND_NAME}</h1>
        <p className="mt-1 text-sm text-zinc-500">猫咪知识库 · 问答 · 用品 · 新手指南</p>
        <p className="mb-4 mt-3 text-sm text-zinc-600">
          以真实搜索问题为主：先搜索，再按健康 / 行为 / 用品 / 新手指南浏览。支持 AI 从知识库检索回答。
        </p>
        <form action="/search" acceptCharset="UTF-8" method="get">
          <SearchBar placeholder="搜索问题或用品，例如：猫拉稀、猫掉毛、猫砂" />
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500">试试：</span>
          {examples.map((ex) => (
            <Link
              key={ex}
              href={`/search?q=${encodeURIComponent(ex)}`}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:border-zinc-400"
            >
              {ex}
            </Link>
          ))}
        </div>
        <div className="mt-3">
          <ShareActions />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-1 text-lg font-semibold">常见问题入口</h2>
        <p className="mb-3 text-sm text-zinc-600">按高频需求进对应分类；更多从顶部导航进入。</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.href + c.title}
              href={c.href}
              className="rounded-xl border border-zinc-200 p-3 text-left transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50"
            >
              <div className="text-lg leading-none">{c.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">{c.title}</div>
              <p className="mt-0.5 text-xs leading-snug text-zinc-500">{c.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-1 text-lg font-semibold">全部入口</h2>
        <p className="mb-3 text-sm text-zinc-600">与顶部导航一致；大屏可作目录卡片。</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_HUBS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-zinc-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{card.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">热门问题</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {popularQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>
    </div>
  );
}
