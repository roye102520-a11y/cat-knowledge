"use client";

import { useEffect } from "react";
import type { UiLocale } from "@/lib/localized-path";

export default function HtmlLangSetter({ lang }: { lang: UiLocale }) {
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);
  return null;
}
