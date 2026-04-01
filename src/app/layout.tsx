import type { Metadata } from "next";
import Link from "next/link";
import MainHubsNav from "@/components/main-hubs-nav";
import { SITE_BRAND_NAME, SITE_TAGLINE_ZH } from "@/lib/site-brand";
import { SITE_FOOTER_LINKS } from "@/lib/site-hubs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_BRAND_NAME,
    template: `%s · ${SITE_BRAND_NAME}`,
  },
  description: SITE_TAGLINE_ZH,
  openGraph: {
    title: SITE_BRAND_NAME,
    description: SITE_TAGLINE_ZH,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_BRAND_NAME,
    description: SITE_TAGLINE_ZH,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full text-zinc-900" style={{ backgroundColor: "var(--page-bg)" }}>
        <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md">
          <MainHubsNav />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
        <footer className="mt-8 border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-5 text-xs leading-6 text-zinc-500 sm:px-6">
            <p>
              群友经验仅供参考，健康问题不能替代专业兽医诊断。
              <br />
              适合新手快速查阅，也适合群聊内转发分享。
            </p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {SITE_FOOTER_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-zinc-600 underline hover:text-zinc-900">
                  {l.label}
                </Link>
              ))}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
