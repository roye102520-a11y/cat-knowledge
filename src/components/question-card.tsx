"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
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
  const [expanded, setExpanded] = useState(false);
  const sections = questionCardSectionCopy(lang);
  const sep = questionListJoiners(lang);
  const categoryLabel = questionCategoryUiLabel(question.category, lang);
  const conclusion = question.solutions[0] ?? question.description;
  const detailMarkdown = `### ${sections.causes}\n${question.causes.map((item) => `- ${item}`).join("\n")}\n\n### ${sections.solutions}\n${question.solutions
    .map((item) => `- ${item}`)
    .join("\n")}`;
  const detailHtml = useMemo(() => marked.parse(detailMarkdown) as string, [detailMarkdown]);
  const actionText = expanded ? (lang === "en" ? "Collapse" : "收起详情") : lang === "en" ? "Expand" : "展开详情";

  return (
    <article className="app-card p-4">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <Tag>{categoryLabel}</Tag>
        <h3 className="mt-1 text-base font-semibold text-zinc-900">
          <HighlightText text={question.title} keyword={keyword} />
        </h3>
        <p className="mt-2 text-sm text-zinc-700">
          <span className="font-medium text-zinc-900">{lang === "en" ? "Community takeaway:" : "群友结论："}</span>{" "}
          <HighlightText text={conclusion} keyword={keyword} />
        </p>
        <p className="mt-2 text-xs text-zinc-500">{actionText}</p>
      </button>

      <div className={`question-accordion ${expanded ? "open" : ""}`}>
        <div className="question-accordion-inner prose prose-sm mt-3 max-w-none text-zinc-700">
          <p className="text-sm text-zinc-600">
            <HighlightText text={question.description} keyword={keyword} />
          </p>
          <div dangerouslySetInnerHTML={{ __html: detailHtml }} />
          <p className="text-xs text-zinc-500">
            {lang === "en" ? `List view uses ${sep.causes === ", " ? "comma" : "localized"} separators.` : `要点分隔符：${sep.causes}`}
          </p>
        </div>
      </div>
    </article>
  );
}
