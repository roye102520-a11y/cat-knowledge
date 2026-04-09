import fs from "node:fs";
import path from "node:path";
import type { CatFoodItem, DataLocale } from "@/lib/types";

const DATA_ROOT = path.join(process.cwd(), "src", "data");

/** 按语言分目录的站点数据 JSON（不含 notion-import 等） */
export const LOCALIZED_DATA_JSON_FILES = [
  "questions.json",
  "products.json",
  "guides.json",
  "product-zones.json",
  "home-content.json",
  "foods.json",
  "community.json",
] as const;

export type LocalizedDataJsonFile = (typeof LOCALIZED_DATA_JSON_FILES)[number];

function jsonPath(lang: DataLocale, filename: string): string {
  return path.join(DATA_ROOT, lang, filename);
}

/**
 * 安全读取：`src/data/{lang}/{filename}`。文件不存在或 `JSON.parse` 失败时返回 `null`（不抛错、不打日志）。
 * 兼容 Next `output: 'export'`：仅在构建/服务端 Node 环境读盘。
 */
export function tryReadLocalizedJson<T>(lang: DataLocale, filename: string): T | null {
  try {
    const p = jsonPath(lang, filename);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** 与 `tryReadLocalizedJson` 相同，但失败时抛错（仅用于确知文件必须存在的内部脚本等） */
export function readLocaleJson<T>(lang: DataLocale, filename: string): T {
  const v = tryReadLocalizedJson<T>(lang, filename);
  if (v !== null) return v;
  throw new Error(`[locale-data] Missing or invalid JSON: ${jsonPath(lang, filename)}`);
}

/**
 * 业务读取入口：先 `lang`，再对语言另一种，再空结构。静默兜底，避免 /en 白屏。
 */
export function readLocalizedDataJson<T>(lang: DataLocale, filename: LocalizedDataJsonFile): T {
  const primary = tryReadLocalizedJson<T>(lang, filename);
  if (primary !== null) return primary;
  const altLang: DataLocale = lang === "en" ? "zh" : "en";
  const secondary = tryReadLocalizedJson<T>(altLang, filename);
  if (secondary !== null) return secondary;
  return (filename === "home-content.json" ? ({}) : ([])) as T;
}

/**
 * 按 id 合并：英文缺 id 时用中文条（静默，不打印控制台）。
 * 英文多出的 id 追加在末尾。
 */
export function mergeRecordsById<T extends { id: string }>(zhRows: T[], enRows: T[]): T[] {
  const enById = new Map(enRows.map((r) => [r.id, r]));
  const out: T[] = [];
  for (const z of zhRows) {
    const e = enById.get(z.id);
    if (e) {
      enById.delete(z.id);
      out.push(e);
    } else {
      out.push(z);
    }
  }
  for (const [, row] of enById) {
    out.push(row);
  }
  return out;
}

/** 饮食禁忌：优先按数组同序合并；长度不一致时退回按 name 匹配（静默） */
export function mergeFoodItemsByName(zhItems: CatFoodItem[], enItems: CatFoodItem[]): CatFoodItem[] {
  if (zhItems.length > 0 && zhItems.length === enItems.length) {
    return zhItems.map((z, i) => {
      const e = enItems[i]!;
      return {
        name: typeof e.name === "string" && e.name.trim() ? e.name : z.name,
        safe: typeof e.safe === "boolean" ? e.safe : z.safe,
        reason: typeof e.reason === "string" && e.reason.trim() ? e.reason : z.reason,
      };
    });
  }

  const enByName = new Map(enItems.map((f) => [f.name, f]));
  const out: CatFoodItem[] = [];
  for (const z of zhItems) {
    const e = enByName.get(z.name);
    if (e) {
      enByName.delete(z.name);
      out.push(e);
    } else {
      out.push(z);
    }
  }
  for (const [, row] of enByName) {
    out.push(row);
  }
  return out;
}

/** home-content：浅合并顶层字段，英文缺的键用中文 */
export function mergeHomeContent(
  zh: Record<string, unknown>,
  en: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!en) return { ...zh };
  return { ...zh, ...en };
}

/** 干粮严选数据：读取 `src/data/{lang}/dry-foods-radar.json`，不存在或损坏时返回 null */
export function tryReadDryFoodsRadarJson<T>(lang: DataLocale): T | null {
  return tryReadLocalizedJson<T>(lang, "dry-foods-radar.json");
}
