import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getZonesWithProducts } from "@/lib/data";

export default async function ZonesPage() {
  const zones = await getZonesWithProducts();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-5">
        <h1 className="text-xl font-semibold tracking-tight">选购专区</h1>
        <p className="mt-2 text-sm text-zinc-600">
          按「场景 / 养猫路径」分组展示用品；与「猫咪用品库」的货架分类是两套维度——这里偏真实动线，用品库偏品类与价位。
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {zones.map((z) => (
            <a
              key={z.id}
              href={`#${z.id}`}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-zinc-700 hover:bg-zinc-100"
            >
              {z.title}
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          需要按「猫粮/零食/猫砂」货架浏览请前往{" "}
          <Link href="/products" className="underline">
            猫咪用品库
          </Link>
          ；喂养与照护流程见{" "}
          <Link href="/guide" className="underline">
            新手养猫指南
          </Link>
          。
        </p>
      </section>

      {zones.map((zone) => (
        <section key={zone.id} id={zone.id} className="scroll-mt-24 space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <div>
            <h2 className="text-lg font-semibold">{zone.title}</h2>
            <p className="text-sm text-zinc-600">{zone.subtitle}</p>
            <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">{zone.tips}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {zone.products.map((product) => (
              <ProductCard key={`${zone.id}-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
