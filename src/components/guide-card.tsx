import type { Guide } from "@/lib/types";

export default function GuideCard({ guide }: { guide: Guide }) {
  const anchorId = guide.anchor ? `guide-${guide.anchor}` : undefined;
  return (
    <article
      id={anchorId}
      className={`app-card scroll-mt-24 p-4`}
    >
      <h3 className="text-base font-semibold text-zinc-900">{guide.title}</h3>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
        {guide.content.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
