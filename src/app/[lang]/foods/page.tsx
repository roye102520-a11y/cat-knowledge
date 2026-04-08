import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatFoodSafetyDirectory from "@/components/cat-food-safety-directory";
import { getFoods } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";
import { englishDocumentTitle } from "@/lib/site-brand";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isUiLocale(raw) ? raw : "zh";
  if (lang === "en") {
    const titleAbs = englishDocumentTitle("Food safety");
    const description = "Can my cat eat this? Searchable table with quick OK / avoid tags.";
    return {
      title: { absolute: titleAbs },
      description,
      openGraph: { title: titleAbs, description, type: "website" },
      twitter: { card: "summary", title: titleAbs, description },
    };
  }
  const title = "饮食禁忌";
  const description = "猫咪能不能吃：常见食物安全对照表，含搜索与红绿标签示意。";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function FoodsPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;

  const foods = getFoods(lang);
  return <CatFoodSafetyDirectory items={foods} lang={lang} />;
}
