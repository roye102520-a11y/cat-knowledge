import type { NextConfig } from "next";

/** 设置 STATIC_EXPORT=1 时生成可分享的纯静态站（out/）；默认不走导出，便于 next start / 动态数据 */
const staticExport = process.env.STATIC_EXPORT === "1" || process.env.STATIC_EXPORT === "true";

/**
 * GitHub Pages 项目站地址为 https://用户.github.io/仓库名/ 时需设置子路径。
 * 本地 zip 分享勿设 BASE_PATH；CI 由 workflow 自动写入。
 */
const basePathRaw = (process.env.BASE_PATH || "").trim().replace(/\/$/, "");
const basePath = basePathRaw ? basePathRaw : undefined;

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
