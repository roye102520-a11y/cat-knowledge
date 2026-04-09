"use client";

import Link from "next/link";
import { foodToolsCopy } from "@/lib/hub-ui-i18n";
import { withLang, type UiLocale } from "@/lib/localized-path";

export default function FoodToolsCards({ lang }: { lang: UiLocale }) {
  const t = foodToolsCopy(lang);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{t.sectionTitle}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href={withLang(lang, "/food-compare")}
          className="group rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-rose-50 p-5 shadow-sm transition duration-200 hover:scale-[1.05] hover:shadow-md"
        >
          <p className="text-base font-semibold text-zinc-900">{t.canCardTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t.canCardDesc}</p>
        </Link>

        <Link
          href={withLang(lang, "/dry-food-compare")}
          className="group rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-lime-50 p-5 shadow-sm transition duration-200 hover:scale-[1.05] hover:shadow-md"
        >
          <p className="text-base font-semibold text-zinc-900">{t.dryCardTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t.dryCardDesc}</p>
        </Link>
      </div>
    </section>
  );
}

