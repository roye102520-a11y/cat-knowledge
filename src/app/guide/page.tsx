import GuideCard from "@/components/guide-card";
import { getGuides } from "@/lib/data";

export default async function GuidePage() {
  const guides = await getGuides();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">新手养猫指南</h1>
      <p className="text-sm text-zinc-600">
        内容由《猫咪指南》与群聊经验等整理为条目化要点；文末为《新手养猫清单》摘录。用药、剂量、绝育与驱虫以兽医为准。
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}
