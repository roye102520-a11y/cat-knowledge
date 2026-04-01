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
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <header className="sticky top-0 z-10 shadow-sm">
          <MainHubsNav />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="mt-8 border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-5 text-xs leading-6 text-zinc-500">
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
