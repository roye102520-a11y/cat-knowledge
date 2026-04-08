import Image from "next/image";
import Link from "next/link";

export type EncyclopediaCardProps = {
  /** 顶部图片地址（建议放 public 下或使用站内绝对路径，如 /xxx.jpg） */
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  summary: string;
  href: string;
  learnMoreLabel?: string;
};

export default function EncyclopediaCard({
  imageSrc,
  imageAlt = "",
  title,
  summary,
  href,
  learnMoreLabel = "了解更多",
}: EncyclopediaCardProps) {
  return (
    <article className="encyclopedia-card flex h-full flex-col">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{ borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}
      >
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt || title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
        ) : (
          <div
            className="flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/50 to-amber-100/90 text-4xl"
            aria-hidden
          >
            🐱
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 pt-4">
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900">{title}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600">{summary}</p>
        <div>
          <Link href={href} className="btn-primary-soft no-underline">
            {learnMoreLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
