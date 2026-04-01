import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const outDir = path.join(root, "src", "data", "notion-import");

fs.mkdirSync(outDir, { recursive: true });

const questions = JSON.parse(fs.readFileSync(path.join(dataDir, "questions.json"), "utf-8"));
const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf-8"));
const guides = JSON.parse(fs.readFileSync(path.join(dataDir, "guides.json"), "utf-8"));

function escapeCsv(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function writeCsv(filePath, headers, rows) {
  const headerLine = headers.map(escapeCsv).join(",");
  const lines = rows.map((row) => headers.map((h) => escapeCsv(row[h] ?? "")).join(","));
  fs.writeFileSync(filePath, [headerLine, ...lines].join("\n"), "utf-8");
}

writeCsv(
  path.join(outDir, "questions.csv"),
  ["title", "category", "description", "causes", "solutions", "recommended_products"],
  questions.map((q) => ({
    title: q.title,
    category: q.category,
    description: q.description,
    causes: Array.isArray(q.causes) ? q.causes.join("；") : "",
    solutions: Array.isArray(q.solutions) ? q.solutions.join("；") : "",
    recommended_products: Array.isArray(q.recommended_products) ? q.recommended_products.join("；") : "",
  })),
);

writeCsv(
  path.join(outDir, "products.csv"),
  ["name", "category", "type", "price_level", "description", "purchase_url"],
  products.map((p) => ({
    name: p.name,
    category: p.category,
    type: p.type,
    price_level: p.price_level,
    description: p.description,
    purchase_url: typeof p.purchase_url === "string" ? p.purchase_url : "",
  })),
);

writeCsv(
  path.join(outDir, "guides.csv"),
  ["title", "content"],
  guides.map((g) => ({
    title: g.title,
    content: Array.isArray(g.content) ? g.content.join("；") : "",
  })),
);

console.log("Exported CSV files to:", outDir);
