import { notFound } from "next/navigation";
import GuideCard from "@/components/guide-card";
import { getGuides } from "@/lib/data";
import { hubPageTitle } from "@/lib/hub-ui-i18n";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";

const ui = {
  zh: {
    title: hubPageTitle("guides", "zh"),
    lead: "包含新手养猫清单、接猫第一周、幼猫注意事项。",
  },
  en: {
    title: hubPageTitle("guides", "en"),
    lead: "Checklists and first-week notes (same content as /guide).",
  },
} as const;

type Props = { params: Promise<{ lang: string }> };

export default async function GuidesPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isUiLocale(raw)) notFound();
  const lang = raw as UiLocale;
  const t = ui[lang];
  const guides = await getGuides(lang);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t.title}</h1>
      <p className="text-sm text-zinc-600">{t.lead}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}
