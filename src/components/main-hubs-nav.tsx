"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLang, type UiLocale } from "@/lib/localized-path";
import { foodToolsCopy } from "@/lib/hub-ui-i18n";
import { SITE_BRAND_NAME } from "@/lib/site-brand";
import { siteHubsForLocale } from "@/lib/site-hubs";

function IconMenu(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={props.className}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={props.className}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function MainHubsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const lang: UiLocale = getLocaleFromPathname(pathname);
  const hubs = siteHubsForLocale(lang);
  const tools = foodToolsCopy(lang);
  const homeHref = withLang(lang, "/");
  const cannedHref = withLang(lang, "/food-compare");
  const dryHref = withLang(lang, "/dry-food-compare");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navAria = lang === "en" ? "Site navigation" : "站点导航";
  const menuOpen = lang === "en" ? "Close menu" : "关闭菜单";
  const menuClosed = lang === "en" ? "Open menu" : "打开菜单";

  return (
    <nav aria-label={navAria} className="bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-0 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <Link
              href={homeHref}
              className="shrink-0 text-xl font-semibold tracking-tight text-zinc-800 decoration-transparent transition hover:text-zinc-600"
            >
              {SITE_BRAND_NAME}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-zinc-800 transition hover:bg-[var(--color-primary-muted)] md:hidden"
              aria-expanded={open}
              aria-controls="main-hub-links"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? menuOpen : menuClosed}</span>
              {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
          <ul
            id="main-hub-links"
            className={`mt-0 flex-col gap-1 border-t py-3 md:mt-0 md:flex md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-1.5 md:border-0 md:py-0 ${open ? "flex" : "hidden md:flex"}`}
            style={{ borderColor: "var(--header-border)" }}
          >
            {hubs.map((hub) => (
              <li key={hub.href} className="w-full md:w-auto">
                <Link
                  href={hub.href}
                  title={hub.description}
                  className="inline-flex w-full max-w-none items-center rounded-full border border-transparent px-3 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:border-[var(--card-border)] hover:bg-[var(--color-primary-muted)] md:max-w-[11rem] md:text-center md:text-sm"
                  onClick={() => setOpen(false)}
                >
                  {hub.title}
                </Link>
              </li>
            ))}
            <li className="w-full md:w-auto">
              <div className="inline-flex w-full max-w-none flex-col rounded-2xl border border-transparent px-3 py-2 text-left text-sm font-medium text-zinc-800 transition hover:border-[var(--card-border)] hover:bg-[var(--color-primary-muted)] md:max-w-[14rem]">
                <span className="text-sm font-semibold">{tools.navTools}</span>
                <div className="mt-1 flex flex-col gap-1 md:flex-row md:flex-wrap md:gap-2">
                  <Link href={cannedHref} className="text-xs text-zinc-600 underline-offset-2 hover:underline" onClick={() => setOpen(false)}>
                    {tools.canCardTitle}
                  </Link>
                  <Link href={dryHref} className="text-xs text-zinc-600 underline-offset-2 hover:underline" onClick={() => setOpen(false)}>
                    {tools.dryCardTitle}
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
