import type { Metadata } from "next";
import { SITE_BRAND_NAME, SITE_TAGLINE_ZH } from "@/lib/site-brand";
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
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
