import type { Product } from "@/lib/types";
import HighlightText from "@/components/highlight-text";
import Tag from "@/components/tag";

export default function ProductCard({ product, keyword }: { product: Product; keyword?: string }) {
  return (
    <article className="app-card p-4">
      <div className="mb-2 flex flex-wrap gap-2">
        <Tag>{product.category}</Tag>
        <Tag>{product.type}</Tag>
        {product.origin ? (
          <span className="inline-flex rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs text-violet-800">
            {product.origin}
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-zinc-900">
        <HighlightText text={product.name} keyword={keyword} />
      </h3>
      <p className="mt-2 text-sm text-zinc-600">
        <HighlightText text={product.description} keyword={keyword} />
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="text-sm text-zinc-700">
          价格等级：<span className="font-medium">{product.price_level}</span>
        </p>
        {product.purchase_url ? (
          <a
            href={product.purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-soft text-sm no-underline"
          >
            直达商品
          </a>
        ) : null}
      </div>
    </article>
  );
}
