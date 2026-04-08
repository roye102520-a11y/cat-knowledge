import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProducts, getQuestions } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";
import SearchClient from "@/app/[lang]/search/search-client";

type Props = { params: Promise<{ lang: string }> };

export default async function SearchPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const [initialQuestions, initialProducts] = await Promise.all([getQuestions(lang), getProducts(lang)]);

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">…</p>}>
      <SearchClient initialQuestions={initialQuestions} initialProducts={initialProducts} lang={lang} />
    </Suspense>
  );
}
