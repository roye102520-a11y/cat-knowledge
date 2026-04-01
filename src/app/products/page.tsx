import { Suspense } from "react";
import { getProducts } from "@/lib/data";
import ProductsClient from "./products-client";

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-500">加载中…</p>}>
      <ProductsClient initialProducts={initialProducts} />
    </Suspense>
  );
}
