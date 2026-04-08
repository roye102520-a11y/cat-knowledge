import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LOCALES = new Set(["zh", "en"]);

function stripBasePath(pathname: string): { base: string; rest: string } {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  if (!base) return { base: "", rest: pathname };
  if (pathname === base || pathname === `${base}/`) return { base, rest: "/" };
  if (pathname.startsWith(`${base}/`)) return { base, rest: pathname.slice(base.length) };
  return { base: "", rest: pathname };
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.includes("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-zA-Z0-9]+$/.test(pathname.split("/").pop() || "")
  ) {
    return NextResponse.next();
  }

  const { base, rest } = stripBasePath(pathname);
  const segments = rest.split("/").filter(Boolean);
  const first = segments[0];

  if (first && LOCALES.has(first)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const tail = segments.length > 0 ? `/${segments.join("/")}` : "";
  url.pathname = base ? `${base}/zh${tail}` : `/zh${tail}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
