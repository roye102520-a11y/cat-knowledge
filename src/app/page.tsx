import { redirect } from "next/navigation";

/** 根路径 → 默认中文站（无语言前缀的旧链接由 middleware 与 next.config redirects 接住） */
export default function RootPage() {
  redirect("/zh");
}
