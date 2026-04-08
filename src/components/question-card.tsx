import type { Question } from "@/lib/types";
import HighlightText from "@/components/highlight-text";
import Tag from "@/components/tag";

export default function QuestionCard({ question, keyword }: { question: Question; keyword?: string }) {
  return (
    <article className="app-card p-4">
      <Tag>{question.category}</Tag>
      <h3 className="text-base font-semibold text-zinc-900">
        <HighlightText text={question.title} keyword={keyword} />
      </h3>
      <p className="mt-2 text-sm text-zinc-600">
        <HighlightText text={question.description} keyword={keyword} />
      </p>
      <div className="mt-3 text-sm text-zinc-700">
        <p className="font-medium">常见原因</p>
        <p>
          <HighlightText text={question.causes.join("、")} keyword={keyword} />
        </p>
      </div>
      <div className="mt-2 text-sm text-zinc-700">
        <p className="font-medium">解决方案</p>
        <p>
          <HighlightText text={question.solutions.join("；")} keyword={keyword} />
        </p>
      </div>
    </article>
  );
}
