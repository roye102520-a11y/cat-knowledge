interface HighlightTextProps {
  text: string;
  keyword?: string;
}

export default function HighlightText({ text, keyword }: HighlightTextProps) {
  const q = keyword?.trim();
  if (!q) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const start = lowerText.indexOf(lowerQ);

  if (start === -1) return <>{text}</>;

  const end = start + q.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded bg-amber-100 px-0.5 text-zinc-900">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}
