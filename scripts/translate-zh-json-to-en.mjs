/**
 * 调用 OpenAI Chat Completions，将 src/data/zh/*.json 译为英文并写入 src/data/en/。
 *
 * 用法：
 *   OPENAI_API_KEY=sk-... node scripts/translate-zh-json-to-en.mjs
 *   node scripts/translate-zh-json-to-en.mjs --only home-content.json
 *
 * 密钥：环境变量 → 项目 `.env.local` / `.env` → 上一级目录 → 用户目录 `~/.env.local` / `~/.env`
 * 兼容变量名：OPENAI_API_KEY、OPENAI_KEY、OPENAI_SECRET_KEY、OPENAI_TOKEN（及 trim 后非空）
 *
 * 可选环境变量：
 *   OPENAI_BASE_URL   默认 https://api.openai.com/v1（可换兼容接口）
 *   OPENAI_MODEL      默认 gpt-4o-mini
 *   OPENAI_CHUNK      数组分批条数，默认 24
 *
 * 注意：Question / Product 的 category、origin、CommunityPost.type 等枚举须保持中文，
 * 与 src/lib/types.ts 一致；脚本在系统提示中强制模型不得翻译这些字段。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ZH = path.join(ROOT, "src", "data", "zh");
const EN = path.join(ROOT, "src", "data", "en");

const FILES = [
  "questions.json",
  "products.json",
  "guides.json",
  "product-zones.json",
  "home-content.json",
  "foods.json",
  "community.json",
];

const SYSTEM_PROMPT = `You are a senior pet-care editor and translator for cats (Felis catus). Translate Chinese copy to warm, natural English suitable for guardians—accurate on nutrition and clinical terms, never alarmist, vet-aware.

STRICT RULES (violations break the app):
1. Output ONLY a single valid JSON value. No markdown, no code fences, no commentary.
2. Preserve the exact key structure (all keys, nesting, array order and length).
3. NEVER translate or alter these fields/values when they are Chinese enums or technical ids:
   - "id", "anchor", "product_ids", "purchase_url", "created_at"
   - "category" on questions and products (keep Chinese exactly: 肠胃问题, 行为问题, 猫粮, 主食罐, …)
   - "origin" if present (keep 国产 or 进口)
   - "type" on community posts (keep 养猫经验 or 用品推荐)
   - "price_level" (keep budget, mid, premium)
   - "safe" (boolean)
4. In home-content.json "category_cards", keep "href" and "emoji" unchanged; translate "title" and "hint" only.
5. Translate: titles, descriptions, causes, solutions, recommended_products, guide content lines, zone text, food name/reason, community title/content, search_examples, hot_question_titles, content_sources_note.
6. Keep the same number of array elements as input. For foods.json, array order must match so the site can zip-merge rows.

Tone: gentle, reassuring, professional pet-domain English.`;

function loadDotEnvFiles() {
  const parent = path.join(ROOT, "..");
  const home = os.homedir();
  const candidates = [
    path.join(ROOT, ".env.local"),
    path.join(ROOT, ".env"),
    path.join(parent, ".env.local"),
    path.join(parent, ".env"),
    path.join(home, ".env.local"),
    path.join(home, ".env"),
  ];
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    let text = fs.readFileSync(envPath, "utf-8");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    for (const line of text.split(/\r?\n/)) {
      let t = line.trim();
      if (!t || t.startsWith("#")) continue;
      if (t.toLowerCase().startsWith("export ")) t = t.slice(7).trim();
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
}

function resolveOpenAiKey() {
  const names = [
    "OPENAI_API_KEY",
    "OPENAI_KEY",
    "OPENAI_SECRET_KEY",
    "OPENAI_TOKEN",
    "OPEN_API_KEY",
  ];
  for (const n of names) {
    const v = process.env[n];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

/** 扫 .env 里定义了哪些变量名（不打印值），便于排查「有文件但没 Key」 */
function collectDefinedKeys(envPath) {
  if (!fs.existsSync(envPath)) return { keys: [], openaiEmpty: false };
  let text = fs.readFileSync(envPath, "utf-8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const keys = [];
  let openaiEmpty = false;
  for (const line of text.split(/\r?\n/)) {
    let t = line.trim();
    if (!t || t.startsWith("#")) continue;
    if (t.toLowerCase().startsWith("export ")) t = t.slice(7).trim();
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    keys.push(key);
    if (/^OPENAI_(API_KEY|KEY|SECRET_KEY|TOKEN)$/i.test(key) || /^OPEN_API_KEY$/i.test(key)) {
      if (!val.trim()) openaiEmpty = true;
    }
  }
  return { keys, openaiEmpty };
}

function explainMissingApiKey() {
  const parent = path.join(ROOT, "..");
  const home = os.homedir();
  const candidates = [
    path.join(ROOT, ".env.local"),
    path.join(ROOT, ".env"),
    path.join(parent, ".env.local"),
    path.join(parent, ".env"),
    path.join(home, ".env.local"),
    path.join(home, ".env"),
  ];
  const found = candidates.filter((p) => fs.existsSync(p));
  const projLocal = path.join(ROOT, ".env.local");
  const hint = fs.existsSync(projLocal) ? collectDefinedKeys(projLocal) : null;

  const lines = [
    "Missing a non-empty OpenAI API key.",
    "",
    "Script looks for (first hit wins): OPENAI_API_KEY, OPENAI_KEY, OPENAI_SECRET_KEY, OPENAI_TOKEN, OPEN_API_KEY",
    "",
    `Project root: ${ROOT}`,
    found.length
      ? `Env files that exist (loaded, but no usable key above): ${found.join("; ")}`
      : "No .env.local / .env in project, parent, or home.",
    "",
  ];

  if (hint && hint.keys.length > 0) {
    const uniq = [...new Set(hint.keys)].filter((k) => !/^OPENAI_|^OPEN_API_KEY$/i.test(k));
    if (uniq.length > 0) {
      lines.push(
        `In ${projLocal} you already have: ${uniq.slice(0, 20).join(", ")}${uniq.length > 20 ? ", …" : ""}`,
      );
    }
    if (hint.openaiEmpty) {
      lines.push("Detected OPENAI_* / OPEN_API_KEY line but value is empty — paste sk-... right after = (no space before key).");
    } else if (!hint.keys.some((k) => /^OPENAI_|^OPEN_API_KEY$/i.test(k))) {
      lines.push('Add one line: OPENAI_API_KEY=sk-proj-...   (or put the same in ~/.env.local)');
    }
    lines.push("");
  }

  lines.push(
    "No API key at all? Skip machine translation:",
    "  npm run data:sync-en-from-zh",
    "",
    "One-off without editing files:",
    "  OPENAI_API_KEY=sk-... npm run data:translate-en",
  );
  return lines.join("\n");
}

function stripFence(s) {
  let t = s.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "");
    t = t.replace(/\s*```\s*$/i, "");
  }
  return t.trim();
}

async function callOpenAI(userContent) {
  const key = resolveOpenAiKey();
  if (!key) throw new Error(explainMissingApiKey());

  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new Error("Invalid API response shape");
  return text;
}

async function translateJsonFragment(filename, label, jsonValue) {
  const payload = JSON.stringify(jsonValue);
  const user = `Task: translate this JSON fragment to English per system rules.\nFile: ${filename}\nLabel: ${label}\nJSON:\n${payload}`;
  const raw = await callOpenAI(user);
  const cleaned = stripFence(raw);
  return JSON.parse(cleaned);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateFile(filename) {
  const srcPath = path.join(ZH, filename);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Skip (missing): ${srcPath}`);
    return;
  }
  const rawText = fs.readFileSync(srcPath, "utf-8");
  const data = JSON.parse(rawText);
  const chunk = Math.max(4, parseInt(process.env.OPENAI_CHUNK || "24", 10) || 24);

  let out;
  if (Array.isArray(data) && data.length > chunk) {
    out = [];
    for (let i = 0; i < data.length; i += chunk) {
      const part = data.slice(i, i + chunk);
      const label = `rows ${i}..${i + part.length - 1} (total ${data.length})`;
      const translated = await translateJsonFragment(filename, label, part);
      if (!Array.isArray(translated) || translated.length !== part.length) {
        throw new Error(`${filename}: chunk length mismatch at offset ${i}`);
      }
      out.push(...translated);
      console.log(`  ${filename}: ${out.length}/${data.length}`);
      await sleep(400);
    }
  } else {
    out = await translateJsonFragment(filename, "full document", data);
  }

  const destPath = path.join(EN, filename);
  fs.mkdirSync(EN, { recursive: true });
  fs.writeFileSync(destPath, `${JSON.stringify(out, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${destPath}`);
}

async function main() {
  loadDotEnvFiles();
  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;
  const todo = only ? FILES.filter((f) => f === only) : FILES;
  if (only && todo.length === 0) {
    console.error(`Unknown file: ${only}`);
    process.exit(1);
  }
  for (const f of todo) {
    console.log(`Translating ${f} …`);
    await translateFile(f);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
