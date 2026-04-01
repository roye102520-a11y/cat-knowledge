/**
 * 从 Notion 拉取问题 / 用品 / 指南，写回 src/data/*.json（与站点解析逻辑一致）
 * 须先配置 .env.local；须先 loadEnv 再动态 import @/lib/notion（否则 NOTION_TOKEN 未注入）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

function loadDotEnv(file: string) {
  if (!fs.existsSync(file)) {
    console.error("未找到", file);
    process.exit(1);
  }
  const text = fs.readFileSync(file, "utf-8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadDotEnv(envPath);

async function main() {
  const { fetchQuestionsFromNotion, fetchProductsFromNotion, fetchGuidesFromNotion, isNotionConfigured } =
    await import("@/lib/notion");

  if (!isNotionConfigured()) {
    console.error("缺少 NOTION_TOKEN 或任一 NOTION_DB_*，请配置 .env.local（见 README）。");
    process.exit(1);
  }

  const [questions, products, guides] = await Promise.all([
    fetchQuestionsFromNotion(),
    fetchProductsFromNotion(),
    fetchGuidesFromNotion(),
  ]);

  const dataDir = path.join(root, "src", "data");
  const files: Array<{ name: string; data: unknown }> = [
    { name: "questions.json", data: questions },
    { name: "products.json", data: products },
    { name: "guides.json", data: guides },
  ];

  for (const { name, data } of files) {
    const filePath = path.join(dataDir, name);
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  }

  console.log(
    `已写入 ${dataDir}: questions ${questions.length} 条, products ${products.length} 条, guides ${guides.length} 条`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
