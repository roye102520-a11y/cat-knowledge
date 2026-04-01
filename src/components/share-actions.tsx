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
        className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700"
      >
        复制分享链接
      </button>
      <span className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
        {copied ? "已复制，可直接发群" : "适合群聊转发"}
      </span>
    </div>
  );
}
