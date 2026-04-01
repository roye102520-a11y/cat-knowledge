import type {
  Guide,
  PriceLevel,
  Product,
  ProductCategory,
  ProductOrigin,
  Question,
  QuestionCategory,
} from "@/lib/types";

const notionToken = process.env.NOTION_TOKEN;

const questionCategoryFallback: QuestionCategory = "健康问题";
const productCategoryFallback: ProductCategory = "护理用品";
const priceLevelFallback: PriceLevel = "mid";

type LooseRecord = Record<string, unknown>;

function toRecord(value: unknown): LooseRecord {
  return value && typeof value === "object" ? (value as LooseRecord) : {};
}

function getProp(properties: LooseRecord, keys: string[]) {
  for (const key of keys) {
    if (properties[key] !== undefined) return properties[key];
  }
  return undefined;
}

function richTextToString(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      const obj = toRecord(item);
      const text = obj.plain_text;
      return typeof text === "string" ? text : "";
    })
    .join("");
}

function toTitle(prop: unknown): string {
  const p = toRecord(prop);
  return richTextToString(p.title ?? p.rich_text ?? []);
}

function toText(prop: unknown): string {
  const p = toRecord(prop);
  const type = typeof p.type === "string" ? p.type : "";
  if (type === "rich_text") {
    return richTextToString(p.rich_text);
  }
  if (type === "title") {
    return richTextToString(p.title);
  }
  if (type === "select") {
    const select = toRecord(p.select);
    return typeof select.name === "string" ? select.name : "";
  }
  if (type === "multi_select" && Array.isArray(p.multi_select)) {
    return p.multi_select
      .map((item) => {
        const obj = toRecord(item);
        return typeof obj.name === "string" ? obj.name : "";
      })
      .filter(Boolean)
      .join("、");
  }
  return "";
}

function toSelect(prop: unknown): string {
  const p = toRecord(prop);
  const select = toRecord(p.select);
  return typeof select.name === "string" ? select.name : "";
}

function toMultiSelectList(prop: unknown): string[] {
  const p = toRecord(prop);
  if (!Array.isArray(p.multi_select)) return [];
  return p.multi_select
    .map((item) => {
      const obj = toRecord(item);
      return typeof obj.name === "string" ? obj.name : "";
    })
    .filter(Boolean);
}

function toListFromText(prop: unknown): string[] {
  const raw = toText(prop);
  if (!raw) return [];
  return raw
    .split(/[\n;,；，、]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCategory(value: string): QuestionCategory {
  if (value === "肠胃问题" || value === "行为问题" || value === "护理问题" || value === "健康问题") {
    return value;
  }
  return questionCategoryFallback;
}

function toProductCategory(value: string): ProductCategory {
  if (
    value === "猫粮" ||
    value === "主食罐" ||
    value === "零食" ||
    value === "猫砂" ||
    value === "护理用品" ||
    value === "健康用品" ||
    value === "玩具"
  ) {
    return value;
  }
  return productCategoryFallback;
}

function toProductOrigin(value: string): ProductOrigin | undefined {
  if (value === "国产" || value === "进口") return value;
  return undefined;
}

function toPriceLevel(value: string): PriceLevel {
  if (value === "budget" || value === "mid" || value === "premium") return value;
  return priceLevelFallback;
}

function toPurchaseUrl(prop: unknown): string | undefined {
  if (!prop) return undefined;
  const p = toRecord(prop);
  if (p.type === "url" && typeof p.url === "string") {
    const u = p.url.trim();
    return /^https?:\/\//i.test(u) ? u : undefined;
  }
  const text = toText(prop).trim();
  return /^https?:\/\//i.test(text) ? text : undefined;
}

export function isNotionConfigured() {
  return Boolean(
    notionToken &&
      process.env.NOTION_DB_QUESTIONS_ID &&
      process.env.NOTION_DB_PRODUCTS_ID &&
      process.env.NOTION_DB_GUIDES_ID,
  );
}

async function queryNotionDatabase(databaseId: string): Promise<LooseRecord[]> {
  if (!notionToken) return [];
  const all: LooseRecord[] = [];
  let cursor: string | undefined;
  for (;;) {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!response.ok) return all.length ? all : [];
    const json = toRecord(await response.json());
    const results = json.results;
    if (!Array.isArray(results)) break;
    all.push(...results.map((item) => toRecord(item)));
    if (json.has_more !== true) break;
    const next = json.next_cursor;
    if (typeof next !== "string" || !next) break;
    cursor = next;
  }
  return all;
}

export async function fetchQuestionsFromNotion(): Promise<Question[]> {
  if (!process.env.NOTION_DB_QUESTIONS_ID) return [];
  const rows = await queryNotionDatabase(process.env.NOTION_DB_QUESTIONS_ID);
  return rows.map((rowObj) => {
    const props = toRecord(rowObj.properties);
    const title = toTitle(getProp(props, ["title", "标题"]));
    const category = toCategory(toSelect(getProp(props, ["category", "问题分类"])));
    const description = toText(getProp(props, ["description", "问题描述"]));
    const causes = toMultiSelectList(getProp(props, ["causes"]));
    const solutions = toListFromText(getProp(props, ["solutions", "处理方案"]));
    const recommended_products = toListFromText(getProp(props, ["recommended_products", "推荐用品"]));
    return {
      id: typeof rowObj.id === "string" ? rowObj.id : crypto.randomUUID(),
      title,
      category,
      description,
      causes: causes.length ? causes : toListFromText(getProp(props, ["causes", "常见原因"])),
      solutions,
      recommended_products,
    };
  });
}

export async function fetchProductsFromNotion(): Promise<Product[]> {
  if (!process.env.NOTION_DB_PRODUCTS_ID) return [];
  const rows = await queryNotionDatabase(process.env.NOTION_DB_PRODUCTS_ID);
  return rows.map((rowObj) => {
    const props = toRecord(rowObj.properties);
    const purchase_url = toPurchaseUrl(getProp(props, ["purchase_url", "购买链接", "商品链接", "链接"]));
    const originRaw = toSelect(getProp(props, ["origin", "产地", "国产进口"]));
    const origin = originRaw ? toProductOrigin(originRaw) : undefined;
    return {
      id: typeof rowObj.id === "string" ? rowObj.id : crypto.randomUUID(),
      name: toTitle(getProp(props, ["name", "名称"])),
      category: toProductCategory(toSelect(getProp(props, ["category", "用品分类"]))),
      type: toSelect(getProp(props, ["type", "用品类型"])) || toText(getProp(props, ["type", "用品类型"])),
      price_level: toPriceLevel(toSelect(getProp(props, ["price_level", "价格等级"]))),
      description: toText(getProp(props, ["description", "描述", "推荐理由"])),
      ...(origin ? { origin } : {}),
      ...(purchase_url ? { purchase_url } : {}),
    };
  });
}

export async function fetchGuidesFromNotion(): Promise<Guide[]> {
  if (!process.env.NOTION_DB_GUIDES_ID) return [];
  const rows = await queryNotionDatabase(process.env.NOTION_DB_GUIDES_ID);
  return rows.map((rowObj) => {
    const props = toRecord(rowObj.properties);
    const content = toListFromText(getProp(props, ["content", "内容正文", "清单项"]));
    return {
      id: typeof rowObj.id === "string" ? rowObj.id : crypto.randomUUID(),
      title: toTitle(getProp(props, ["title", "标题"])),
      content,
    };
  });
}
