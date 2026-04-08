import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleFeedback from "@/components/article-feedback";
import ArticleToc from "@/components/article-toc";
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

  const showToc = article.toc.length > 0;

  return (
    <article className="space-y-6">
      <nav className="text-sm text-zinc-600">
        <Link href="/articles" className="underline hover:text-zinc-900">
          科普长文
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{pageTitle(article.meta)}</span>
      </nav>
      <header className="app-panel p-5">
        <h1 className="text-xl font-semibold leading-snug text-zinc-900 md:text-2xl">
          {pageTitle(article.meta)}
        </h1>
        {(article.meta.description_zh || article.meta.description_en) && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            {article.meta.description_zh || article.meta.description_en}
          </p>
        )}
      </header>

      <div
        className={
          showToc
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_15.5rem]"
            : undefined
        }
      >
        <div className="min-w-0 space-y-4">
          {showToc ? (
            <div className="lg:hidden">
              <ArticleToc items={article.toc} variant="mobile" />
            </div>
          ) : null}
          <div className="seo-article-body app-panel p-5 md:p-8" dangerouslySetInnerHTML={{ __html: article.html }} />
          <ArticleFeedback slug={slug} />
        </div>

        {showToc ? (
          <aside className="sticky top-[4.5rem] hidden self-start lg:block">
            <div className="app-panel p-4">
              <ArticleToc items={article.toc} variant="desktop" />
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
