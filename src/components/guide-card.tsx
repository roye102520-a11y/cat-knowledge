import type { Guide } from "@/lib/types";

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">{guide.title}</h3>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
        {guide.content.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
