import type { Metadata } from "next";
import Link from "next/link";
import { listSeoArticleSlugs, loadSeoArticle, pageDescription, pageTitle } from "@/lib/seo-articles";

export const metadata: Metadata = {
  title: "科普长文",
  description: "SEO 向养猫科普长文（中英双语小节），可静态托管分享。",
};

export default function ArticlesIndexPage() {
  const slugs = listSeoArticleSlugs().sort();
  const items = slugs
    .map((slug) => {
      const a = loadSeoArticle(slug);
      if (!a) return null;
      return { slug, title: pageTitle(a.meta), desc: pageDescription(a.meta) };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-zinc-900">科普长文</h1>
        <p className="mt-1 text-sm text-zinc-600">
          面向分享与检索的结构化长文（含英文 / 中文对照小节），与站内问答、指南数据互补。静态包内同样可用。
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-1">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/articles/${item.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h2 className="text-base font-semibold text-zinc-900">{item.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{item.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
