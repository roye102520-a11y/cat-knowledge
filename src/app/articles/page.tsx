import type { Metadata } from "next";
import EncyclopediaCard from "@/components/encyclopedia-card";
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
      <header className="app-panel p-5">
        <h1 className="text-xl font-semibold text-zinc-900">科普长文 · 猫咪百科选读</h1>
        <p className="mt-1 text-sm text-zinc-600">
          面向分享与检索的结构化长文（含英文 / 中文对照小节），与站内问答、指南数据互补。静态包内同样可用。下方卡片使用统一「百科」样式，未配图时以柔和占位图展示。
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <EncyclopediaCard title={item.title} summary={item.desc} href={`/articles/${item.slug}`} imageAlt="" />
          </li>
        ))}
      </ul>
    </div>
  );
}
