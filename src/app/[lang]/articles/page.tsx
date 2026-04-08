import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EncyclopediaCard from "@/components/encyclopedia-card";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import {
  listSeoArticleSlugs,
  loadCanonicalSeoArticle,
  pageDescriptionForLocale,
  pageTitleForLocale,
} from "@/lib/seo-articles";
import { englishDocumentTitle } from "@/lib/site-brand";
import { hubPageTitle } from "@/lib/hub-ui-i18n";

const ui = {
  zh: {
    title: "科普长文 · 猫咪百科选读",
    lead: "面向分享与检索的结构化长文（含英文 / 中文对照小节），与站内问答、指南数据互补。静态包内同样可用。下方卡片使用统一「百科」样式，未配图时以柔和占位图展示。",
    learnMore: "了解更多",
  },
  en: {
    title: "Articles · wiki-style reads",
    lead: "Structured bilingual-friendly SEO articles aligned with the Q&A library. Cards use a unified layout; empty image slots show a soft placeholder.",
    learnMore: "Read more",
  },
} as const;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";
  if (lang === "en") {
    const titleAbs = englishDocumentTitle(hubPageTitle("articles", "en"));
    const description = "Long-form cat care articles (bilingual sections).";
    return {
      title: { absolute: titleAbs },
      description,
      openGraph: { title: titleAbs, description, type: "website" },
      twitter: { card: "summary", title: titleAbs, description },
    };
  }
  const title = hubPageTitle("articles", "zh");
  const description = "SEO 向养猫科普长文（中英双语小节），可静态托管分享。";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ArticlesIndexPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const t = ui[lang];
  const slugs = listSeoArticleSlugs().sort();
  const items = slugs
    .map((slug) => {
      const a = loadCanonicalSeoArticle(slug);
      if (!a) return null;
      return {
        slug,
        title: pageTitleForLocale(a.meta, lang),
        desc: pageDescriptionForLocale(a.meta, lang),
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="space-y-6">
      <header className="app-panel p-5">
        <h1 className="text-xl font-semibold text-zinc-900">{t.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">{t.lead}</p>
      </header>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <EncyclopediaCard
              title={item.title}
              summary={item.desc}
              href={withLang(lang, `/articles/${item.slug}`)}
              imageAlt=""
              learnMoreLabel={t.learnMore}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
