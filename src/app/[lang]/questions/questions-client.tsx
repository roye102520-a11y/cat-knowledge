"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CategoryFilter from "@/components/category-filter";
import QuestionCard from "@/components/question-card";
import SearchBar from "@/components/search-bar";
import {
  filterQuestionsFromRows,
  parseQuestionHub,
  questionCategoriesForHub,
} from "@/lib/knowledge-filters";
import { appPath } from "@/lib/app-path";
import type { UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import {
  QUESTION_CATEGORY_TO_SLUG,
  parseQuestionCategoryParam,
} from "@/lib/query-param-filters";
import type { Question, QuestionCategory, QuestionHubParam } from "@/lib/types";
import { questionCategoryUiLabel } from "@/lib/question-ui-i18n";

function hubTabs(lang: UiLocale) {
  if (lang === "en") {
    return [
      { key: "core" as const, label: "All questions", href: withLang(lang, "/questions") },
      { key: "disease" as const, label: "Health", href: withLang(lang, "/questions?hub=disease") },
      { key: "behavior" as const, label: "Behavior", href: withLang(lang, "/questions?hub=behavior") },
    ];
  }
  return [
    { key: "core" as const, label: "养猫问题（全部）", href: withLang(lang, "/questions") },
    { key: "disease" as const, label: "猫咪健康", href: withLang(lang, "/questions?hub=disease") },
    { key: "behavior" as const, label: "猫咪行为", href: withLang(lang, "/questions?hub=behavior") },
  ];
}

const copy = {
  zh: {
    diseaseTitle: "猫咪健康",
    behaviorTitle: "猫咪行为",
    coreTitle: "养猫问题",
    diseaseSub:
      "涵盖肠胃与症状护理、皮肤与被毛照护、健康与老年相关问答；严重或急性情况请尽早就医。",
    behaviorSub: "乱尿乱抓、应激、作息与多猫相处等行为向经验；若伴随病痛需先排除医学原因。",
    coreSub: "以用户搜索问题为主组织内容；可按标签筛选或搜索，不只看分类名。",
    searchPh: "搜索问题，例如：猫呕吐、猫抓沙发、母猫绝育",
    empty: "没有找到匹配的问题。",
    navAria: "问题子库切换",
  },
  en: {
    diseaseTitle: "Cat health",
    behaviorTitle: "Behavior",
    coreTitle: "Questions",
    diseaseSub: "Digestion, symptoms, skin and senior care Q&A. Seek a vet for emergencies.",
    behaviorSub: "Litter issues, scratching, stress and routines. Rule out pain or illness first.",
    coreSub: "Search and filter user-style questions across the library.",
    searchPh: "Search, e.g. vomiting, scratching, spay",
    empty: "No matching questions.",
    navAria: "Question hubs",
  },
} as const;

export default function QuestionsClient({
  initialQuestions,
  lang,
}: {
  initialQuestions: Question[];
  lang: UiLocale;
}) {
  const c = copy[lang];
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = parseQuestionCategoryParam(searchParams.get("category"));
  const activeCategorySlug = category ? QUESTION_CATEGORY_TO_SLUG[category] : undefined;
  const hub = parseQuestionHub(searchParams.get("hub") ?? undefined);
  const categories = questionCategoriesForHub(hub);

  const questions = useMemo(
    () => filterQuestionsFromRows(initialQuestions, q, category, hub, lang),
    [initialQuestions, q, category, hub, lang],
  );

  const title = hub === "disease" ? c.diseaseTitle : hub === "behavior" ? c.behaviorTitle : c.coreTitle;
  const subtitle = hub === "disease" ? c.diseaseSub : hub === "behavior" ? c.behaviorSub : c.coreSub;
  const tabs = useMemo(() => hubTabs(lang), [lang]);
  const questionsPath = withLang(lang, "/questions");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
      </div>

      <nav aria-label={c.navAria} className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active =
            (t.key === "core" && !hub) || (t.key === "disease" && hub === "disease") || (t.key === "behavior" && hub === "behavior");
          return (
            <Link
              key={t.key}
              href={t.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <form className="space-y-3" method="get" action={appPath(questionsPath)} acceptCharset="UTF-8">
        {hub ? <input type="hidden" name="hub" value={hub} /> : null}
        {activeCategorySlug ? <input type="hidden" name="category" value={activeCategorySlug} /> : null}
        <SearchBar key={`${q}-${hub ?? ""}-${activeCategorySlug ?? ""}`} defaultValue={q} placeholder={c.searchPh} />
        <CategoryFilter
          pathname={questionsPath}
          items={categories.map((cat: QuestionCategory) => ({
            value: QUESTION_CATEGORY_TO_SLUG[cat],
            label: questionCategoryUiLabel(cat, lang),
          }))}
          paramName="category"
          activeValue={activeCategorySlug}
          allLabel={lang === "en" ? "All" : "全部"}
        />
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} lang={lang} />
        ))}
      </div>
      {questions.length === 0 ? <p className="text-sm text-zinc-500">{c.empty}</p> : null}
    </div>
  );
}
