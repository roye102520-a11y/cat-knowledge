import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleFeedback from "@/components/article-feedback";
import ArticleToc from "@/components/article-toc";
import TranslationComingSoon, { ZhRouteEnglishBodyHint } from "@/components/translation-coming-soon";
import { isUiLocale, withLang } from "@/lib/localized-path";
import {
  listWikiStaticParams,
  loadWikiArticle,
  wikiPageDescription,
  wikiPageTitle,
  type WikiLocale,
} from "@/lib/wiki-articles";
import { englishDocumentTitle } from "@/lib/site-brand";
import { hubBreadcrumbLabel } from "@/lib/hub-ui-i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  return listWikiStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  if (!isUiLocale(raw)) return { title: "Not found" };
  const article = loadWikiArticle(raw, slug);
  if (!article) return { title: "Not found" };
  const L = article.requestedLang;
  const title = wikiPageTitle(article.meta, L);
  let desc = wikiPageDescription(article.meta, L);
  if (L === "en" && article.isTranslationFallback) {
    desc = `Translation in progress—${desc}`;
  }
  if (L === "zh" && article.isEnBodyOnZhUrl) {
    desc = `${desc} (Showing English body: Chinese file missing or unreadable.)`.trim();
  }

  if (L === "en") {
    const titleAbs = englishDocumentTitle(title);
    return {
      title: { absolute: titleAbs },
      description: desc,
      openGraph: { title: titleAbs, description: desc, type: "article" },
      twitter: { card: "summary", title: titleAbs, description: desc },
    };
  }

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary", title, description: desc },
  };
}

export default async function WikiArticlePage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isUiLocale(raw)) notFound();
  const article = loadWikiArticle(raw, slug);
  if (!article) notFound();

  const L = article.requestedLang as WikiLocale;
  const homeHref = withLang(L, "/");
  const title = wikiPageTitle(article.meta, L);
  const desc = wikiPageDescription(article.meta, L);
  const showToc = article.toc.length > 0;
  const feedbackKey = `wiki-${L}-${article.slug}`;

  return (
    <article className="space-y-6">
      <nav className="text-sm text-zinc-600">
        <Link href={homeHref} className="underline hover:text-zinc-900">
          {hubBreadcrumbLabel("home", L)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{hubBreadcrumbLabel("wiki", L)}</span>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{title}</span>
      </nav>

      {article.isTranslationFallback ? (
        <TranslationComingSoon
          variant="inline"
          zhHref={withLang("zh", `/wiki/${article.slug}`)}
          zhTitle={wikiPageTitle(article.meta, "zh")}
          listHref={homeHref}
          listLabel={hubBreadcrumbLabel("home", L)}
        />
      ) : null}

      {article.isEnBodyOnZhUrl ? (
        <ZhRouteEnglishBodyHint
          enHref={withLang("en", `/wiki/${article.slug}`)}
          listHref={homeHref}
          listLabel={hubBreadcrumbLabel("home", L)}
        />
      ) : null}

      <header className="app-panel p-5">
        <h1 className="text-xl font-semibold leading-snug text-zinc-900 md:text-2xl">{title}</h1>
        {(article.meta.description_zh || article.meta.description_en) && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{desc}</p>
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
          <ArticleFeedback slug={feedbackKey} />
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
