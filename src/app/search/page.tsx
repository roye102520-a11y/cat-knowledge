import { Suspense } from "react";
import { getProducts, getQuestions } from "@/lib/data";
import SearchClient from "./search-client";

export default async function SearchPage() {
  const [initialQuestions, initialProducts] = await Promise.all([getQuestions(), getProducts()]);

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">加载中…</p>}>
      <SearchClient initialQuestions={initialQuestions} initialProducts={initialProducts} />
    </Suspense>
  );
}
