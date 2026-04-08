"use server";

import { answerByKnowledgeBase, type DataLocale } from "@/lib/data";
import type { AiAnswerResult } from "@/lib/types";

export type { AiAnswerResult };

export async function runAiAnswer(query: string, lang: DataLocale): Promise<AiAnswerResult> {
  const q = query.trim();
  if (!q) {
    return {
      answer: "请输入具体问题，例如：猫咪一直叫怎么办。",
      related_questions: [],
      related_products: [],
    };
  }
  return answerByKnowledgeBase(q, lang);
}
