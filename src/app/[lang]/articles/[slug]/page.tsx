import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleFeedback from "@/components/article-feedback";
import ArticleToc from "@/components/article-toc";
import TranslationComingSoon from "@/components/translation-coming-soon";
import { isUiLocale, type UiLocale, withLang } from "@/lib/localized-path";
import {
  listSeoArticleSlugs,
  pageDescriptionForLocale,
  pageTitleForLocale,
  resolveSeoArticleForRoute,
  type SeoArticle,
} from "@/lib/seo-articles";
import { englishDocumentTitle } from "@/lib/site-brand";
import { hubBreadcrumbLabel } from "@/lib/hub-ui-i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = listSeoArticleSlugs();
  const langs = ["zh", "en"] as const;
  return langs.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";
  const resolved = resolveSeoArticleForRoute(slug, lang);
  if (!resolved) return { title: "Not found" };

  const { article, isTranslationFallback } = resolved;

  if (lang === "en") {
    const coreTitle = pageTitleForLocale(article.meta, "en");
    const titleAbs = englishDocumentTitle(coreTitle);
    let desc = pageDescriptionForLocale(article.meta, "en");
    if (isTranslationFallback) {
      desc = `${desc} (Chinese body shown until English Markdown is available.)`.trim();
    }
    return {
      title: { absolute: titleAbs },
      description: desc,
      openGraph: { title: titleAbs, description: desc, type: "article" },
      twitter: { card: "summary", title: titleAbs, description: desc },
    };
  }

  const title = pageTitleForLocale(article.meta, lang);
  const desc = pageDescriptionForLocale(article.meta, lang);
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary", title, description: desc },
  };
}

function ArticleLayout({
  article,
  lang,
  feedbackKey,
  slug,
  isTranslationFallback,
}: {
  article: SeoArticle;
  lang: UiLocale;
  feedbackKey: string;
  slug: string;
  isTranslationFallback: boolean;
}) {
  const showToc = article.toc.length > 0;
  const title = pageTitleForLocale(article.meta, lang);
  const desc = pageDescriptionForLocale(article.meta, lang);
  const crumbLabel = hubBreadcrumbLabel("articles", lang);

  return (
    <article className="space-y-6">
      <nav className="text-sm text-zinc-600">
        <Link href={withLang(lang, "/articles")} className="underline hover:text-zinc-900">
          {crumbLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{title}</span>
      </nav>

      {lang === "en" && isTranslationFallback ? (
        <TranslationComingSoon
          variant="inline"
          zhHref={withLang("zh", `/articles/${slug}`)}
          zhTitle={pageTitleForLocale(article.meta, "zh")}
          listHref={withLang("en", "/articles")}
          listLabel={hubBreadcrumbLabel("articles", "en")}
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

export default async function ArticlePage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;

  const resolved = resolveSeoArticleForRoute(slug, lang);
  if (!resolved) notFound();

  const { article, isTranslationFallback } = resolved;
  const feedbackKey = `seo-${lang}-${slug}`;

  return (
    <ArticleLayout
      article={article}
      lang={lang}
      feedbackKey={feedbackKey}
      slug={slug}
      isTranslationFallback={isTranslationFallback}
    />
  );
}
