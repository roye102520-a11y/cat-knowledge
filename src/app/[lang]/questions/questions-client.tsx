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
  questionCategoryOptionsForHub,
  questionHubUiLabel,
} from "@/lib/knowledge-filters";
import { appPath } from "@/lib/app-path";
import { hubPageTitle } from "@/lib/hub-ui-i18n";
import type { UiLocale } from "@/lib/localized-path";
import { withLang } from "@/lib/localized-path";
import {
  QUESTION_CATEGORY_TO_SLUG,
  parseQuestionCategoryParam,
} from "@/lib/query-param-filters";
import type { Question } from "@/lib/types";

function hubTabs(lang: UiLocale) {
  return [
    { key: "core" as const, label: questionHubUiLabel(undefined, lang), href: withLang(lang, "/questions") },
    { key: "disease" as const, label: questionHubUiLabel("disease", lang), href: withLang(lang, "/questions?hub=disease") },
    { key: "behavior" as const, label: questionHubUiLabel("behavior", lang), href: withLang(lang, "/questions?hub=behavior") },
  ];
}

const copy = {
  zh: {
    eyebrow: "QUESTIONS",
    diseaseTitle: "猫咪健康",
    behaviorTitle: "猫咪行为",
    coreTitle: hubPageTitle("questions", "zh"),
    heroHint: "搜索症状 / 行为 / 健康问题",
    diseaseSub:
      "涵盖肠胃与症状护理、皮肤与被毛照护、健康与老年相关问答；严重或急性情况请尽早就医。",
    behaviorSub: "乱尿乱抓、应激、作息与多猫相处等行为向经验；若伴随病痛需先排除医学原因。",
    coreSub: "以用户搜索问题为主组织内容；可按标签筛选或搜索，不只看分类名。",
    searchPh: "搜索问题，例如：猫呕吐、猫抓沙发、母猫绝育",
    searchBtn: "30秒找答案",
    hotSearches: ["呕吐", "换粮指南", "疫苗建议"] as const,
    toolTitle: "严选工具入口",
    toolSub: "用结构化工具快速缩短决策时间",
    canDataset: "罐头数据集",
    breedWizard: "品种感知向导",
    empty: "没有找到匹配的问题。",
    navAria: "问题子库切换",
  },
  en: {
    eyebrow: "QUESTIONS",
    diseaseTitle: "Cat health",
    behaviorTitle: "Behavior",
    coreTitle: hubPageTitle("questions", "en"),
    heroHint: "Search symptoms / behavior / health questions",
    diseaseSub: "Digestion, symptoms, skin and senior care Q&A. Seek a vet for emergencies.",
    behaviorSub: "Litter issues, scratching, stress and routines. Rule out pain or illness first.",
    coreSub: "Search and filter user-style questions across the library.",
    searchPh: "Search, e.g. vomiting, scratching, spay",
    searchBtn: "Answer in 30s",
    hotSearches: ["Vomiting", "Food switch", "Vaccine advice"] as const,
    toolTitle: "Curated tools",
    toolSub: "Use focused tools to decide faster",
    canDataset: "Canned dataset",
    breedWizard: "Breed-aware wizard",
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
  const categories = questionCategoryOptionsForHub(hub, lang);

  const questions = filterQuestionsFromRows(initialQuestions, q, category, hub, lang);

  const title = hub === "disease" ? c.diseaseTitle : hub === "behavior" ? c.behaviorTitle : c.coreTitle;
  const subtitle = hub === "disease" ? c.diseaseSub : hub === "behavior" ? c.behaviorSub : c.coreSub;
  const tabs = useMemo(() => hubTabs(lang), [lang]);
  const questionsPath = withLang(lang, "/questions");

  return (
    <div className="space-y-5 pt-10">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-rose-500">{c.eyebrow}</p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-[2rem]">{title}</h1>
        <p className="text-base leading-7 text-zinc-700">{c.heroHint}</p>
        <p className="mx-auto max-w-3xl text-sm leading-7 text-zinc-600">{subtitle}</p>
      </div>

      <nav aria-label={c.navAria} className="flex min-h-12 flex-wrap gap-3 rounded-2xl border-0 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
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
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-[var(--color-accent-green)]"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <form className="space-y-4" method="get" action={appPath(questionsPath)} acceptCharset="UTF-8">
        {hub ? <input type="hidden" name="hub" value={hub} /> : null}
        {activeCategorySlug ? <input type="hidden" name="category" value={activeCategorySlug} /> : null}
        <SearchBar
          key={`${q}-${hub ?? ""}-${activeCategorySlug ?? ""}`}
          defaultValue={q}
          placeholder={c.searchPh}
          submitLabel={c.searchBtn}
          icon="🐱"
          size="hero"
        />
        <div className="flex flex-wrap justify-center gap-2">
          {c.hotSearches.map((tag) => (
            <Link
              key={tag}
              href={`${withLang(lang, `/questions?q=${encodeURIComponent(tag)}${hub ? `&hub=${hub}` : ""}${activeCategorySlug ? `&category=${activeCategorySlug}` : ""}`)}`}
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 transition hover:bg-rose-100"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <CategoryFilter
          pathname={questionsPath}
          items={categories.map((cat) => ({
            value: QUESTION_CATEGORY_TO_SLUG[cat.value],
            label: cat.label,
          }))}
          paramName="category"
          activeValue={activeCategorySlug}
          allLabel={lang === "en" ? "All" : "全部"}
        />
      </form>

      <aside className="app-panel rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4">
        <p className="text-sm font-semibold text-amber-900">{c.toolTitle}</p>
        <p className="mt-1 text-xs text-amber-800">{c.toolSub}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Link href={withLang(lang, "/foods")} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-800">
            {c.canDataset}
          </Link>
          <Link href={withLang(lang, "/food-compare")} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-800">
            {c.breedWizard}
          </Link>
        </div>
      </aside>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} lang={lang} />
        ))}
      </div>
      {questions.length === 0 ? <p className="text-sm text-zinc-500">{c.empty}</p> : null}
    </div>
  );
}
