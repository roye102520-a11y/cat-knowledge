#!/usr/bin/env node
/**
 * 使用全局（或 PATH 上的）`jsontt`（@parvineyvazov/json-translator）通过 Google 免费翻译，
 * 将 `src/data/zh/*.json` 逐文件译为英文并写入 `src/data/en/*.json`。
 *
 *   npm run translate:free
 *
 * 要求：已安装 `npm i -g @parvineyvazov/json-translator`，且终端能执行 `jsontt`。
 * 若找不到命令，请先确保 `$HOME/.npm-global/bin` 等在 PATH 中（见 npm 全局 prefix 配置）。
 *
 * 单文件失败仅记录错误并继续；最后若有失败则以退出码 1 结束（便于 CI），但绝不会因一个文件异常而中断循环。
 *
 * 注意：自动翻译可能改掉本应为中文枚举的字段（如 category、type）；发布前请对照 `src/lib/types.ts` 抽检。
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ZH_DIR = path.join(ROOT, "src", "data", "zh");
const EN_DIR = path.join(ROOT, "src", "data", "en");

/** 提高找到全局 jsontt 的概率（常见 npm 全局 bin 位置） */
function envWithGlobalNpmBin() {
  const home = os.homedir();
  const extra = [
    path.join(home, ".npm-global", "bin"),
    path.join(home, ".local", "share", "npm", "bin"),
    "/usr/local/bin",
    "/opt/homebrew/bin",
  ].filter((p) => fs.existsSync(p));
  const sep = path.delimiter;
  const pathStr = process.env.PATH || "";
  return { ...process.env, PATH: [...extra, pathStr].join(sep) };
}

function listZhJsonFiles() {
  if (!fs.existsSync(ZH_DIR)) {
    console.error(`Missing directory: ${ZH_DIR}`);
    return [];
  }
  return fs
    .readdirSync(ZH_DIR)
    .filter((f) => f.endsWith(".json") && fs.statSync(path.join(ZH_DIR, f)).isFile())
    .sort();
}

/**
 * @param {string} zhFilePath 绝对路径
 * @param {string} baseName 不含扩展名的文件名（用于 --name，产出 `baseName.en.json`）
 */
function runJsontt(zhFilePath, baseName) {
  const args = [
    zhFilePath,
    "--module",
    "google",
    "--from",
    "zh-CN",
    "--to",
    "en",
    "--name",
    baseName,
    "--concurrencylimit",
    "2",
  ];
  return new Promise((resolve, reject) => {
    const child = spawn("jsontt", args, {
      env: envWithGlobalNpmBin(),
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", (err) => reject(err));
    child.on("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`jsontt exited with code ${code}${signal ? ` (signal ${signal})` : ""}`));
    });
  });
}

/** 将 `zh/foo.en.json` 挪到 `en/foo.json`；跨卷盘时 copy + unlink */
function moveTranslatedToEn(baseName) {
  const intermediate = path.join(ZH_DIR, `${baseName}.en.json`);
  const finalPath = path.join(EN_DIR, `${baseName}.json`);
  if (!fs.existsSync(intermediate)) {
    throw new Error(`expected output not found: ${intermediate}`);
  }
  fs.mkdirSync(EN_DIR, { recursive: true });
  try {
    fs.renameSync(intermediate, finalPath);
  } catch (e) {
    if (e && e.code === "EXDEV") {
      fs.copyFileSync(intermediate, finalPath);
      fs.unlinkSync(intermediate);
    } else {
      throw e;
    }
  }
}

async function main() {
  const files = listZhJsonFiles();
  if (files.length === 0) {
    console.error("No JSON files in src/data/zh");
    process.exitCode = 1;
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const file of files) {
    const baseName = path.basename(file, ".json");
    const zhPath = path.join(ZH_DIR, file);
    console.log(`\n━━━ ${file} ━━━`);

    try {
      await runJsontt(zhPath, baseName);
      moveTranslatedToEn(baseName);
      console.log(`OK → ${path.join("src", "data", "en", file)}`);
      ok += 1;
    } catch (err) {
      failed += 1;
      console.error(`FAILED: ${file}`);
      console.error(err && err.message ? err.message : err);
      const orphan = path.join(ZH_DIR, `${baseName}.en.json`);
      if (fs.existsSync(orphan)) {
        console.error(`(left intermediate file: ${orphan}, you may delete it manually)`);
      }
    }
  }

  console.log(`\nSummary: ${ok} ok, ${failed} failed (total ${files.length})`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("Fatal (should be rare):", e);
  process.exitCode = 1;
});
