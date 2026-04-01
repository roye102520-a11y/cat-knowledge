/**
 * 检查 Notion 为何未生效：环境变量、HTTP 状态、返回条数（不打印 token）
 * 用法：node scripts/notion-health.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

function loadDotEnv(file) {
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
    process.env[key] = val;
  }
}

function mask(s) {
  if (!s || s.length < 8) return s ? "(已设置，过短)" : "(空)";
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

async function queryDb(label, databaseId) {
  const token = process.env.NOTION_TOKEN;
  if (!databaseId) {
    console.log(`[${label}] 未设置 NOTION_DB_*`);
    return;
  }
  const url = `https://api.notion.com/v1/databases/${databaseId.replace(/-/g, "")}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 100 }),
  });
  const bodyText = await res.text();
  let count = 0;
  let errMsg = "";
  try {
    const j = JSON.parse(bodyText);
    if (Array.isArray(j.results)) count = j.results.length;
    if (j.message) errMsg = j.message;
    if (j.code) errMsg = `${j.code}: ${errMsg || bodyText.slice(0, 200)}`;
  } catch {
    errMsg = bodyText.slice(0, 200);
  }
  console.log(`[${label}] HTTP ${res.status} · 本页条数 ${count}${errMsg ? ` · ${errMsg}` : ""}`);
  if (res.ok && count === 0) {
    console.log(`  → 数据库无数据（或视图筛选后为空）；站点会回退到本地 JSON`);
  }
  if (!res.ok) {
    console.log(`  → 请求失败时站点也会回退 JSON（且代码里不打印错误）`);
  }
}

loadDotEnv(envPath);

const token = process.env.NOTION_TOKEN;
const qid = process.env.NOTION_DB_QUESTIONS_ID;
const pid = process.env.NOTION_DB_PRODUCTS_ID;
const gid = process.env.NOTION_DB_GUIDES_ID;

console.log("--- Notion 配置（脱敏）---");
console.log("NOTION_TOKEN", mask(token));
console.log("NOTION_DB_QUESTIONS_ID", qid || "(空)");
console.log("NOTION_DB_PRODUCTS_ID", pid || "(空)");
console.log("NOTION_DB_GUIDES_ID", gid || "(空)");

if (!token || !qid || !pid || !gid) {
  console.log("\n四项缺一即 isNotionConfigured() 为 false，始终用 JSON。");
  process.exit(1);
}

console.log("\n--- API 探测（若 401/403/404 请看说明）---");
await queryDb("questions", qid);
await queryDb("products", pid);
await queryDb("guides", gid);

console.log("\n--- 常见原因 ---");
console.log("1) HTTP 200 但条数 0：库里没行 / Merge CSV 未成功 → 会回退 JSON");
console.log("2) 403：页面未 Connect 到你的 Integration");
console.log("3) 404：Database ID 填错（应是数据库页面 URL 里的 32 位 id）");
console.log("4) 401：Token 无效或已撤销，需到 notion.so/my-integrations 重新生成");
console.log("5) dev 未加载 .env.local：须把 .env.local 放在项目根目录并重启 npm run dev");
