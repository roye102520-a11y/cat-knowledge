# 猫咪之家 · 分享给他人使用的版本

本项目已支持 **`next build` 静态导出**：构建完成后生成 `out/` 目录，可整夹发给别人、上传到网盘，或挂到任意静态网站托管。

## 一键构建

```bash
cd cat-knowledge-base
npm install
npm run build:share
```

（Windows PowerShell 若报错，可改用：`$env:STATIC_EXPORT="1"; npm run build`）

构建结束后，静态文件在 **`out/`**（已被 `.gitignore` 忽略，不会进 Git）。日常 `npm run build` **不会**生成 `out/`，仍为普通 Next 生产构建，可用 `npm start`。

## 本地预览（推荐）

**不要**直接用浏览器打开 `out/index.html`（`file://` 下路由与脚本可能异常）。请用本地静态服务：

```bash
npm run preview:share
```

浏览器访问终端里提示的地址（默认 `http://localhost:3330`）。

也可手动：`npx serve out -p 3330`

## 发给别人怎么用

1. 将 **`out` 文件夹**打成 zip（或连同本说明一起打包）。
2. 对方解压后，在 `out` **上一级**执行：`npx serve out`（需已安装 Node），或使用 VS Code「Live Server」、Python `python -m http.server` 等指向 `out` 目录。
3. 若上传到 **GitHub Pages / Cloudflare Pages / 阿里云 OSS** 等：把 `out/` **内部全部文件**上传到站点根目录（或按平台要求配置根目录为 `out`）。

## 数据说明

- 静态版（`build:share`）**一律只打包仓库里的 `src/data/*.json`**，构建过程**不会**请求 Notion，无需配置 `NOTION_*`。
- 若你在 Notion 里维护内容，想先写回 JSON 再分享：配置好 `.env.local` 后执行 `npm run notion:sync`，再执行 `npm run build:share`。

## 与线上一致的开发命令

- 日常开发（含服务端、可接 Notion）：`npm run dev`
- 仅验证静态包：`npm run build:share` → `npm run preview:share`
