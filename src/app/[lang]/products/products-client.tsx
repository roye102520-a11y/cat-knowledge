"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CategoryFilter from "@/components/category-filter";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { filterProductsFromRows } from "@/lib/knowledge-filters";
import { appPath } from "@/lib/app-path";
import { hubPageTitle } from "@/lib/hub-ui-i18n";
import type { UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import {
  priceLevelUiLabel,
  productCategoryFilterItems,
  PRODUCT_CATEGORY_TO_SLUG,
  parsePriceLevelParam,
  parseProductCategoryParam,
} from "@/lib/query-param-filters";
import type { PriceLevel, Product } from "@/lib/types";

const levels: PriceLevel[] = ["budget", "mid", "premium"];

const copy = {
  zh: {
    title: hubPageTitle("products", "zh"),
    subtitle:
      "按货架分类与价位筛选：「出行工具」含航空箱、猫包、推车、工字型牵引等；「清洁用品」「设备」见对应标签；食具梳洗等多在「护理用品」。与「选购专区」场景清单互补。",
    placeholder: "搜索用品，例如：豆腐砂、霍曼喂食器、猫粮",
    allPrices: "全部价格",
    empty: "没有找到匹配的用品。",
  },
  en: {
    title: hubPageTitle("products", "en"),
    subtitle:
      "Filter by shelf category and price band. See Buying zones for scenario-based lists; this page is organized by product type.",
    placeholder: "Search: litter, feeder, dry food…",
    allPrices: "All prices",
    empty: "No matching products.",
  },
} as const;

export default function ProductsClient({
  initialProducts,
  lang,
}: {
  initialProducts: Product[];
  lang: UiLocale;
}) {
  const c = copy[lang];
  const productsPath = withLang(lang, "/products");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = parseProductCategoryParam(searchParams.get("category"));
  const priceLevel = parsePriceLevelParam(searchParams.get("price_level"));
  const activeCategorySlug = category ? PRODUCT_CATEGORY_TO_SLUG[category] : undefined;
  const categories = useMemo(() => productCategoryFilterItems(lang), [lang]);

  const products = useMemo(
    () => filterProductsFromRows(initialProducts, q, category, priceLevel, lang),
    [initialProducts, q, category, priceLevel, lang],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{c.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">{c.subtitle}</p>
      </div>
      <form className="space-y-3" method="get" action={appPath(productsPath)} acceptCharset="UTF-8">
        {activeCategorySlug ? <input type="hidden" name="category" value={activeCategorySlug} /> : null}
        {priceLevel ? <input type="hidden" name="price_level" value={priceLevel} /> : null}
        <SearchBar
          key={`${q}-${activeCategorySlug ?? ""}-${priceLevel ?? ""}`}
          defaultValue={q}
          placeholder={c.placeholder}
        />
        <CategoryFilter
          pathname={productsPath}
          items={categories}
          paramName="category"
          activeValue={activeCategorySlug}
          allLabel={lang === "en" ? "All" : "全部"}
        />
        <CategoryFilter
          pathname={productsPath}
          items={levels.map((lv) => ({ value: lv, label: priceLevelUiLabel(lv, lang) }))}
          paramName="price_level"
          activeValue={priceLevel}
          allLabel={c.allPrices}
        />
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? <p className="text-sm text-zinc-500">{c.empty}</p> : null}
    </div>
  );
}
