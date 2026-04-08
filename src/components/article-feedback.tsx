"use client";

import { useCallback, useState } from "react";

type Vote = "useful" | "not_useful";

const STORAGE_PREFIX = "article-feedback-v1:";

export default function ArticleFeedback({ slug }: { slug: string }) {
  const key = `${STORAGE_PREFIX}${slug}`;
  const [vote, setVote] = useState<Vote | null>(() => {
    if (typeof window === "undefined") return null;
    const v = sessionStorage.getItem(key);
    return v === "useful" || v === "not_useful" ? v : null;
  });
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnPaws = useCallback((clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setPops((p) => [...p, { id, x: clientX, y: clientY }]);
    window.setTimeout(() => {
      setPops((p) => p.filter((b) => b.id !== id));
    }, 850);
  }, []);

  const onVote = (v: Vote, e: React.MouseEvent<HTMLButtonElement>) => {
    sessionStorage.setItem(key, v);
    setVote(v);
    spawnPaws(e.clientX, e.clientY);
  };

  return (
    <section className="app-panel relative mt-8 overflow-visible p-5" aria-label="文章反馈">
      <p className="text-sm font-medium text-zinc-800">这篇对你有帮助吗？</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(e) => onVote("useful", e)}
          disabled={vote !== null}
          className="btn-primary-soft border-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          有用
        </button>
        <button
          type="button"
          onClick={(e) => onVote("not_useful", e)}
          disabled={vote !== null}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--card-border)] bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          没用
        </button>
      </div>
      {vote ? <p className="mt-3 text-xs text-zinc-500">感谢反馈（本次会话内已记录）。</p> : null}

      <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
        {pops.map((p) => (
          <span key={p.id} className="article-paw-pop fixed text-2xl" style={{ left: p.x, top: p.y, zIndex: 101 }}>
            🐾
          </span>
        ))}
      </div>
    </section>
  );
}
