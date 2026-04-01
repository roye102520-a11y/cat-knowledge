import { Suspense } from "react";
import { getQuestions } from "@/lib/data";
import QuestionsClient from "./questions-client";

export default async function QuestionsPage() {
  const initialQuestions = await getQuestions();

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">加载中…</p>}>
      <QuestionsClient initialQuestions={initialQuestions} />
    </Suspense>
  );
}
