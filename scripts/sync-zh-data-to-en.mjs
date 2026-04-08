/**
 * 把 src/data/zh/*.json 原样复制到 src/data/en/，无需 API，秒完成。
 * 适合先让 /en 路由有完整数据；之后再跑 data:translate-en 逐步英文化。
 *
 *   npm run data:sync-en-from-zh
 */
import fs from "node:fs";
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

function main() {
  if (!fs.existsSync(ZH)) {
    console.error("Missing:", ZH);
    process.exit(1);
  }
  fs.mkdirSync(EN, { recursive: true });
  let n = 0;
  for (const f of FILES) {
    const src = path.join(ZH, f);
    if (!fs.existsSync(src)) {
      console.warn("skip (no source):", f);
      continue;
    }
    fs.copyFileSync(src, path.join(EN, f));
    console.log("→", f);
    n += 1;
  }
  console.log(`Done. Copied ${n} file(s) to ${EN}`);
}

main();
