import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HtmlLangSetter from "@/components/html-lang-setter";
import LanguageSwitcher from "@/components/language-switcher";
import MainHubsNav from "@/components/main-hubs-nav";
import { SITE_BRAND_NAME, SITE_TAGLINE_EN, SITE_TAGLINE_ZH } from "@/lib/site-brand";
import { siteFooterCopy } from "@/lib/site-footer-ui";
import { siteFooterLinksForLocale } from "@/lib/site-hubs";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";
  if (lang === "en") {
    return {
      title: { absolute: SITE_BRAND_NAME },
      description: SITE_TAGLINE_EN,
      openGraph: { title: SITE_BRAND_NAME, description: SITE_TAGLINE_EN, type: "website" },
      twitter: { card: "summary", title: SITE_BRAND_NAME, description: SITE_TAGLINE_EN },
    };
  }
  return { title: SITE_BRAND_NAME, description: SITE_TAGLINE_ZH };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const footerLinks = siteFooterLinksForLocale(lang);
  const copy = siteFooterCopy(lang);

  return (
    <>
      <HtmlLangSetter lang={lang} />
      <LanguageSwitcher />
      <header
        className="sticky top-0 z-10 border-b shadow-[0_1px_0_rgba(66,42,40,0.04)] backdrop-blur-md"
        style={{ background: "var(--header-bg)", borderColor: "var(--header-border)" }}
      >
        <MainHubsNav />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="mt-8 border-t" style={{ background: "var(--footer-bg)", borderColor: "var(--footer-border)" }}>
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs leading-6 text-zinc-500 sm:px-6">
          <p>
            {copy.disclaimerLines.map((line, i) => (
              <span key={i}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
          <p className="mt-2 text-zinc-600">
            {copy.feedbackLead}{" "}
            <a
              href="mailto:371243762@qq.com"
              className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-950 hover:decoration-zinc-500"
            >
              {copy.emailVisible}
            </a>
          </p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-zinc-600 underline hover:text-zinc-900">
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </footer>
    </>
  );
}
