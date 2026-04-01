"use client";

import { useState } from "react";
import type { Product, Question } from "@/lib/types";

interface AskResponse {
  answer: string;
  related_questions: Question[];
  related_products: Product[];
}

export default function AiQaClient() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/ask?q=${encodeURIComponent(question)}`);
      const data = (await response.json()) as AskResponse;
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <h2 className="text-lg font-semibold">AI问答</h2>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入问题，例如：猫咪拉稀怎么办"
          className="h-11 flex-1 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
        />
        <button className="h-11 rounded-lg bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-700" type="submit">
          {loading ? "回答中..." : "提问"}
        </button>
      </form>

      {result ? (
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          <p>{result.answer}</p>
          {result.related_questions.length > 0 ? (
            <p>相关问题：{result.related_questions.map((item) => item.title).join("、")}</p>
          ) : null}
          {result.related_products.length > 0 ? (
            <p>相关用品：{result.related_products.map((item) => item.name).join("、")}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
