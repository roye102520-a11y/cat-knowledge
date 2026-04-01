"use client";

import { useState } from "react";

export default function ShareActions() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
      >
        复制分享链接
      </button>
      <span className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-4 py-2.5 text-sm text-zinc-600">
        {copied ? "已复制，可直接发群" : "适合群聊转发"}
      </span>
    </div>
  );
}
