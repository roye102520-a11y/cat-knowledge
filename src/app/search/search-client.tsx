"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/product-card";
import QuestionCard from "@/components/question-card";
import SearchHistory from "@/components/search-history";
import SearchBar from "@/components/search-bar";
import { searchAllFromRows } from "@/lib/data";
import type { Product, Question } from "@/lib/types";

const suggestKeywords = ["猫拉稀", "猫掉毛", "猫砂", "猫不吃猫粮", "猫抓沙发"];

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

export default function SearchClient({
  initialQuestions,
  initialProducts,
}: {
  initialQuestions: Question[];
  initialProducts: Product[];
}) {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const { sortedQuestions, sortedProducts } = useMemo(() => {
    const { questions, products } = searchAllFromRows(initialQuestions, initialProducts, q);
    const sortedQuestionsLocal = q
      ? [...questions].sort((a, b) => scoreQuestion(b, q) - scoreQuestion(a, q) || a.title.localeCompare(b.title))
      : questions;
    const sortedProductsLocal = q
      ? [...products].sort((a, b) => scoreProduct(b, q) - scoreProduct(a, q) || a.name.localeCompare(b.name))
      : products;
    return { sortedQuestions: sortedQuestionsLocal, sortedProducts: sortedProductsLocal };
  }, [initialQuestions, initialProducts, q]);

  const noResult = q && sortedQuestions.length === 0 && sortedProducts.length === 0;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-xl font-semibold">搜索结果</h1>
        <form method="get" action="/search" acceptCharset="UTF-8">
          <SearchBar key={q || "empty"} defaultValue={q} placeholder="输入关键词：猫拉稀、猫掉毛、猫砂" />
        </form>
        <SearchHistory key={q || "empty"} currentQuery={q} />
      </section>

      {noResult ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-600">没有找到与“{q}”相关的内容，可以试试这些关键词：</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestKeywords.map((item) => (
              <a
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                {item}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold">相关问题 ({sortedQuestions.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {sortedQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} keyword={q} />
            ))}
          </div>
          {sortedQuestions.length === 0 ? <p className="text-sm text-zinc-500">未找到相关问题。</p> : null}
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold">相关用品 ({sortedProducts.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} keyword={q} />
            ))}
          </div>
          {sortedProducts.length === 0 ? <p className="text-sm text-zinc-500">未找到相关用品。</p> : null}
        </div>
      </section>
    </div>
  );
}
