import Link from "next/link";
import { SITE_BRAND_NAME } from "@/lib/site-brand";
import { SITE_HUBS } from "@/lib/site-hubs";

export default function MainHubsNav() {
  return (
    <nav
      aria-label="站点导航"
      className="border-b border-zinc-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-zinc-900 hover:text-amber-900"
          >
            {SITE_BRAND_NAME}
          </Link>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:max-w-5xl lg:flex-1 lg:flex-wrap lg:justify-end lg:gap-2">
            {SITE_HUBS.map((hub) => (
              <li key={hub.href} className="min-w-0 lg:w-auto lg:max-w-[10rem]">
                <Link
                  href={hub.href}
                  title={hub.description}
                  className="flex min-h-[2.75rem] items-center justify-center rounded-xl border-2 border-zinc-200 bg-zinc-50/80 px-2.5 py-2 text-center text-xs font-semibold leading-snug text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white hover:shadow-md sm:min-h-0 sm:px-3 sm:py-2.5 sm:text-sm"
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
