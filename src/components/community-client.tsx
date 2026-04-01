"use client";

import { useMemo, useState } from "react";
import type { CommunityPost, CommunityPostType } from "@/lib/types";
import Tag from "@/components/tag";

const STORAGE_KEY = "cat_kb_community_posts";

export default function CommunityClient({ initialPosts }: { initialPosts: CommunityPost[] }) {
  const [type, setType] = useState<CommunityPostType>("养猫经验");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [posts],
  );

  const submitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const next: CommunityPost = {
      id: `user-${Date.now()}`,
      type,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    const merged = [next, ...posts];
    setPosts(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setTitle("");
    setContent("");
  };

  const restoreLocalPosts = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const localPosts = JSON.parse(raw) as CommunityPost[];
      setPosts(localPosts);
    } catch {
      // ignore invalid local data
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">提交内容</h2>
        <form onSubmit={submitPost} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["养猫经验", "用品推荐"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setType(item)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  type === item ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 hover:bg-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的经验或推荐..."
            rows={4}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700">
              提交
            </button>
            <button
              type="button"
              onClick={restoreLocalPosts}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100"
            >
              恢复本地提交
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">群友经验</h2>
        {sortedPosts.map((post) => (
          <article key={post.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <Tag>{post.type}</Tag>
              <span className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <h3 className="text-base font-semibold">{post.title}</h3>
            <p className="mt-2 text-sm text-zinc-700">{post.content}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
