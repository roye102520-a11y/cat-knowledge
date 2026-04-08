import type { UiLocale } from "@/lib/localized-path";
import HighlightText from "@/components/highlight-text";
import Tag from "@/components/tag";
import {
  questionCardSectionCopy,
  questionCategoryUiLabel,
  questionListJoiners,
} from "@/lib/question-ui-i18n";
import type { Question } from "@/lib/types";

export default function QuestionCard({
  question,
  keyword,
  lang = "zh",
}: {
  question: Question;
  keyword?: string;
  lang?: UiLocale;
}) {
  const sections = questionCardSectionCopy(lang);
  const sep = questionListJoiners(lang);
  const categoryLabel = questionCategoryUiLabel(question.category, lang);

  return (
    <article className="app-card p-4">
      <Tag>{categoryLabel}</Tag>
      <h3 className="text-base font-semibold text-zinc-900">
        <HighlightText text={question.title} keyword={keyword} />
      </h3>
      <p className="mt-2 text-sm text-zinc-600">
        <HighlightText text={question.description} keyword={keyword} />
      </p>
      <div className="mt-3 text-sm text-zinc-700">
        <p className="font-medium">{sections.causes}</p>
        <p>
          <HighlightText text={question.causes.join(sep.causes)} keyword={keyword} />
        </p>
      </div>
      <div className="mt-2 text-sm text-zinc-700">
        <p className="font-medium">{sections.solutions}</p>
        <p>
          <HighlightText text={question.solutions.join(sep.solutions)} keyword={keyword} />
        </p>
      </div>
    </article>
  );
}
