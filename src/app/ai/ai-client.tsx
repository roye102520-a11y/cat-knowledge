"use client";

import { useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/question-card";
import ProductCard from "@/components/product-card";
import questionsData from "@/data/questions.json";
import productsData from "@/data/products.json";
import { answerByKnowledgeBaseFromRows } from "@/lib/data";
import type { AiAnswerResult, Product, Question } from "@/lib/types";

const questionRows = questionsData as Question[];
const productRows = productsData as Product[];

export default function AiClient() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AiAnswerResult | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      setResult(answerByKnowledgeBaseFromRows(questionRows, productRows, query));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h1 className="text-xl font-semibold">AI 问答（知识库检索）</h1>
        <p className="mt-1 text-sm text-zinc-600">
          根据站内问答与用品库做关键词检索并拼接摘要，不是大模型生成；严重症状请直接就医。
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-zinc-700">输入问题</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder="例如：猫咪一直叫怎么办"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? "检索中…" : "从知识库回答"}
          </button>
        </form>
      </section>

      {result && (
        <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <h2 className="text-sm font-semibold text-amber-950">回答摘要</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">{result.answer}</p>
          {result.related_questions.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">相关问答</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {result.related_questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            </div>
          )}
          {result.related_products.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">相关用品</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.related_products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-500">
            需要核对原文请{" "}
            <Link href="/questions" className="text-amber-900 underline">
              浏览问题库
            </Link>
            。
          </p>
        </section>
      )}
    </div>
  );
}
