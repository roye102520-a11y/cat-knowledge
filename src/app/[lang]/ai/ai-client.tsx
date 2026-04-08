"use client";

import { useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/question-card";
import ProductCard from "@/components/product-card";
import { answerByKnowledgeBaseFromRows } from "@/lib/knowledge-filters";
import type { UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import type { AiAnswerResult, Product, Question } from "@/lib/types";

const copy = {
  zh: {
    title: "AI 问答（知识库检索）",
    lead: "根据站内问答与用品库做关键词检索并拼接摘要，不是大模型生成；严重症状请直接就医。",
    labelQ: "输入问题",
    placeholder: "例如：猫咪一直叫怎么办",
    submit: "从知识库回答",
    pending: "检索中…",
    summary: "回答摘要",
    relQ: "相关问答",
    relP: "相关用品",
    foot: "需要核对原文请",
    footLink: "浏览问题库",
    footEnd: "。",
  },
  en: {
    title: "AI Q&A (knowledge search)",
    lead: "Keyword search over local Q&A and products—not an LLM. See a vet for emergencies.",
    labelQ: "Your question",
    placeholder: "e.g. cat meowing at night",
    submit: "Search knowledge base",
    pending: "Searching…",
    summary: "Summary",
    relQ: "Related Q&A",
    relP: "Related products",
    foot: "Open the full",
    footLink: "question library",
    footEnd: " to read sources.",
  },
} as const;

export default function AiClient({
  lang,
  initialQuestions,
  initialProducts,
}: {
  lang: UiLocale;
  initialQuestions: Question[];
  initialProducts: Product[];
}) {
  const c = copy[lang];
  const questionsHref = withLang(lang, "/questions");
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AiAnswerResult | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      setResult(answerByKnowledgeBaseFromRows(initialQuestions, initialProducts, query, lang));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h1 className="text-xl font-semibold">{c.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">{c.lead}</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-zinc-700">{c.labelQ}</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder={c.placeholder}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? c.pending : c.submit}
          </button>
        </form>
      </section>

      {result && (
        <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <h2 className="text-sm font-semibold text-amber-950">{c.summary}</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">{result.answer}</p>
          {result.related_questions.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.relQ}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {result.related_questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            </div>
          )}
          {result.related_products.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.relP}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.related_products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-500">
            {c.foot}{" "}
            <Link href={questionsHref} className="text-amber-900 underline">
              {c.footLink}
            </Link>
            {c.footEnd}
          </p>
        </section>
      )}
    </div>
  );
}
