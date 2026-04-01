import Link from "next/link";
import { SITE_BRAND_NAME } from "@/lib/site-brand";
import { SITE_HUBS } from "@/lib/site-hubs";

export default function MainHubsNav() {
  return (
    <nav aria-label="站点导航" className="bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link
            href="/"
            className="shrink-0 text-xl font-semibold tracking-tight text-zinc-900 decoration-transparent transition hover:text-zinc-700"
          >
            {SITE_BRAND_NAME}
          </Link>
          <ul className="flex flex-wrap items-center justify-start gap-1.5 md:justify-end">
            {SITE_HUBS.map((hub) => (
              <li key={hub.href}>
                <Link
                  href={hub.href}
                  title={hub.description}
                  className="inline-flex max-w-[11rem] items-center rounded-full border border-transparent px-3 py-2 text-center text-xs font-medium text-zinc-800 transition hover:border-zinc-200 hover:bg-zinc-100 sm:max-w-none sm:text-sm"
                >
                  {hub.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
