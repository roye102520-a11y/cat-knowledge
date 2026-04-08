import { notFound } from "next/navigation";
import GuideCard from "@/components/guide-card";
import { getGuides } from "@/lib/data";
import { isUiLocale, type UiLocale } from "@/lib/localized-path";

const ui = {
  zh: {
    title: "新手养猫指南",
    lead:
      "内容由《猫咪指南》与群聊经验等整理为条目化要点；文末为《新手养猫清单》摘录。用药、剂量、绝育与驱虫以兽医为准。",
  },
  en: {
    title: "New cat guide",
    lead: "Entry-style notes from internal guides and community experience—always confirm dosing and procedures with your vet.",
  },
} as const;

type Props = { params: Promise<{ lang: string }> };

export default async function GuidePage({ params }: Props) {
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
