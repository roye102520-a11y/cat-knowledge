import { notFound } from "next/navigation";
import AiClient from "@/app/[lang]/ai/ai-client";
import { getProducts, getQuestions } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";

type Props = { params: Promise<{ lang: string }> };

export default async function AiPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;

  const [initialQuestions, initialProducts] = await Promise.all([getQuestions(lang), getProducts(lang)]);

  return <AiClient lang={lang} initialQuestions={initialQuestions} initialProducts={initialProducts} />;
}
