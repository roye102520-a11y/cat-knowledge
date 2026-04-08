"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/product-card";
import QuestionCard from "@/components/question-card";
import SearchHistory from "@/components/search-history";
import SearchBar from "@/components/search-bar";
import { appPath } from "@/lib/app-path";
import { searchAllFromRows } from "@/lib/knowledge-filters";
import { scoreEnglishProductMatch, scoreEnglishQuestionMatch } from "@/lib/search-match";
import type { UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import type { Product, Question } from "@/lib/types";

const suggestKeywordsZh = ["猫拉稀", "猫掉毛", "猫砂", "猫不吃猫粮", "猫抓沙发"];
const suggestKeywordsEn = ["diarrhea", "shedding", "litter", "not eating", "scratching"];

function scoreQuestion(item: Question, keyword: string) {
  const text =
    `${item.title} ${item.description} ${item.causes.join(" ")} ${item.solutions.join(" ")}`.toLowerCase();
  const qLower = keyword.toLowerCase();
  if (item.title.toLowerCase() === qLower) return 100;
  if (item.title.toLowerCase().includes(qLower)) return 80;
  if (text.includes(qLower)) return 50;
  return 0;
}

function scoreProduct(item: Product, keyword: string) {
  const text = `${item.name} ${item.category} ${item.type} ${item.description}`.toLowerCase();
  const qLower = keyword.toLowerCase();
  if (item.name.toLowerCase() === qLower) return 100;
  if (item.name.toLowerCase().includes(qLower)) return 80;
  if (text.includes(qLower)) return 50;
  return 0;
}

const copy = {
  zh: {
    title: "搜索结果",
    placeholder: "输入关键词：猫拉稀、猫掉毛、猫砂",
    noResult: (q: string) => `没有找到与“${q}”相关的内容，可以试试这些关键词：`,
    relatedQ: (n: number) => `相关问题 (${n})`,
    relatedP: (n: number) => `相关用品 (${n})`,
    emptyQ: "未找到相关问题。",
    emptyP: "未找到相关用品。",
    suggests: suggestKeywordsZh,
  },
  en: {
    title: "Search results",
    placeholder: "Keywords: diarrhea, litter, scratching…",
    noResult: (q: string) => `No results for “${q}”. Try:`,
    relatedQ: (n: number) => `Questions (${n})`,
    relatedP: (n: number) => `Products (${n})`,
    emptyQ: "No matching questions.",
    emptyP: "No matching products.",
    suggests: suggestKeywordsEn,
  },
} as const;

export default function SearchClient({
  initialQuestions,
  initialProducts,
  lang,
}: {
  initialQuestions: Question[];
  initialProducts: Product[];
  lang: UiLocale;
}) {
  const c = copy[lang];
  const searchPath = withLang(lang, "/search");
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const { sortedQuestions, sortedProducts } = useMemo(() => {
    const { questions, products } = searchAllFromRows(initialQuestions, initialProducts, q, lang);
    const collator = lang === "en" ? "en" : "zh-Hans-CN";
    const sortedQuestionsLocal = q
      ? [...questions].sort((a, b) =>
          lang === "en"
            ? scoreEnglishQuestionMatch(b, q) - scoreEnglishQuestionMatch(a, q) || a.title.localeCompare(b.title, collator)
            : scoreQuestion(b, q) - scoreQuestion(a, q) || a.title.localeCompare(b.title, collator),
        )
      : questions;
    const sortedProductsLocal = q
      ? [...products].sort((a, b) =>
          lang === "en"
            ? scoreEnglishProductMatch(b, q) - scoreEnglishProductMatch(a, q) || a.name.localeCompare(b.name, collator)
            : scoreProduct(b, q) - scoreProduct(a, q) || a.name.localeCompare(b.name, collator),
        )
      : products;
    return { sortedQuestions: sortedQuestionsLocal, sortedProducts: sortedProductsLocal };
  }, [initialQuestions, initialProducts, q, lang]);

  const noResult = q && sortedQuestions.length === 0 && sortedProducts.length === 0;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-xl font-semibold">{c.title}</h1>
        <form method="get" action={appPath(searchPath)} acceptCharset="UTF-8">
          <SearchBar key={q || "empty"} defaultValue={q} placeholder={c.placeholder} />
        </form>
        <SearchHistory key={q || "empty"} currentQuery={q} searchPath={searchPath} />
      </section>

      {noResult ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-600">{c.noResult(q)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.suggests.map((item) => (
              <Link
                key={item}
                href={`${searchPath}?q=${encodeURIComponent(item)}`}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold">{c.relatedQ(sortedQuestions.length)}</h2>
          <div className="grid grid-cols-1 gap-3">
            {sortedQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} keyword={q} />
            ))}
          </div>
          {sortedQuestions.length === 0 ? <p className="text-sm text-zinc-500">{c.emptyQ}</p> : null}
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold">{c.relatedP(sortedProducts.length)}</h2>
          <div className="grid grid-cols-1 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} keyword={q} />
            ))}
          </div>
          {sortedProducts.length === 0 ? <p className="text-sm text-zinc-500">{c.emptyP}</p> : null}
        </div>
      </section>
    </div>
  );
}
