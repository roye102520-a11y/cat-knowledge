interface TagProps {
  children: string;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
      {children}
    </span>
  );
}
