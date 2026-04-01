import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  listSeoArticleSlugs,
  loadSeoArticle,
  pageDescription,
  pageTitle,
} from "@/lib/seo-articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listSeoArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = loadSeoArticle(slug);
  if (!article) return { title: "未找到" };
  const title = pageTitle(article.meta);
  const desc = pageDescription(article.meta);
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary", title, description: desc },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = loadSeoArticle(slug);
  if (!article) notFound();

  return (
    <article className="space-y-6">
      <nav className="text-sm text-zinc-600">
        <Link href="/articles" className="underline hover:text-zinc-900">
          科普长文
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{pageTitle(article.meta)}</span>
      </nav>
      <header className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h1 className="text-xl font-semibold leading-snug text-zinc-900 md:text-2xl">
          {pageTitle(article.meta)}
        </h1>
        {(article.meta.description_zh || article.meta.description_en) && (
          <p className="mt-2 text-sm text-zinc-600">
            {article.meta.description_zh || article.meta.description_en}
          </p>
        )}
      </header>
      <div
        className="seo-article-body rounded-2xl border border-zinc-200 bg-white p-5 md:p-8"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </article>
  );
}
