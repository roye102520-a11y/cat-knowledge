import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";
import ProductsClient from "@/app/[lang]/products/products-client";

type Props = { params: Promise<{ lang: string }> };

export default async function ProductsPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const initialProducts = await getProducts(lang);

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">…</p>}>
      <ProductsClient initialProducts={initialProducts} lang={lang} />
    </Suspense>
  );
}
