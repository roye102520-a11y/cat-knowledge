"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CategoryFilter from "@/components/category-filter";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { filterProductsFromRows } from "@/lib/data";
import { appPath } from "@/lib/app-path";
import {
  PRICE_LEVEL_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  PRODUCT_CATEGORY_TO_SLUG,
  parsePriceLevelParam,
  parseProductCategoryParam,
} from "@/lib/query-param-filters";
import type { PriceLevel, Product } from "@/lib/types";

const categories = Object.entries(PRODUCT_CATEGORY_SLUGS).map(([value, label]) => ({
  value,
  label,
}));

const levels: PriceLevel[] = ["budget", "mid", "premium"];

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = parseProductCategoryParam(searchParams.get("category"));
  const priceLevel = parsePriceLevelParam(searchParams.get("price_level"));
  const activeCategorySlug = category ? PRODUCT_CATEGORY_TO_SLUG[category] : undefined;

  const products = useMemo(
    () => filterProductsFromRows(initialProducts, q, category, priceLevel),
    [initialProducts, q, category, priceLevel],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">猫咪用品库</h1>
        <p className="mt-1 text-sm text-zinc-600">按货架分类与价位筛选；与「选购专区」的场景清单互为补充。</p>
      </div>
      <form className="space-y-3" method="get" action={appPath("/products")} acceptCharset="UTF-8">
        {activeCategorySlug ? <input type="hidden" name="category" value={activeCategorySlug} /> : null}
        {priceLevel ? <input type="hidden" name="price_level" value={priceLevel} /> : null}
        <SearchBar key={`${q}-${activeCategorySlug ?? ""}-${priceLevel ?? ""}`} defaultValue={q} placeholder="搜索用品，例如：豆腐砂、猫粮" />
        <CategoryFilter
          pathname="/products"
          items={categories}
          paramName="category"
          activeValue={activeCategorySlug}
        />
        <CategoryFilter
          pathname="/products"
          items={levels.map((lv) => ({ value: lv, label: PRICE_LEVEL_LABELS[lv] }))}
          paramName="price_level"
          activeValue={priceLevel}
          allLabel="全部价格"
        />
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? <p className="text-sm text-zinc-500">没有找到匹配的用品。</p> : null}
    </div>
  );
}
