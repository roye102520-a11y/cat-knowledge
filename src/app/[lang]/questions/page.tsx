import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getQuestions } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";
import QuestionsClient from "@/app/[lang]/questions/questions-client";

type Props = { params: Promise<{ lang: string }> };

export default async function QuestionsPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const initialQuestions = await getQuestions(lang);

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">…</p>}>
      <QuestionsClient initialQuestions={initialQuestions} lang={lang} />
    </Suspense>
  );
}
