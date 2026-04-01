# Cat Knowledge Base

## 项目概述

一个面向养猫用户的知识库网站，支持：
- 首页浏览
- 问题库（按分类 + 搜索）
- 用品库（按分类/价格 + 搜索）
- 新手指南
- 全站搜索（问题与用品分栏结果）

技术栈：
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Notion（可选后台）+ 本地 JSON（兜底）

---

## 路由结构

- `/` 首页
- `/questions` 问题库
- `/products` 用品库
- `/guide` 新手指南
- `/zones` 选购专区（按场景分组用品）
- `/search` 搜索页

---

## 目录结构

```txt
src/
  app/
    page.tsx
    questions/page.tsx
    products/page.tsx
    guide/page.tsx
    search/page.tsx
  components/
  data/
  lib/
```

### 选购专区数据

- 配置文件：`src/data/product-zones.json`
- 每项含 `title` / `subtitle` / `tips` / `product_ids`，与 `products.json` 中的 `id` 关联。
- 修改专区：编辑 JSON 后刷新页面即可（未接 Notion 时）；若用品来自 Notion，专区仍引用本地 `product-zones.json` 做分组，商品详情以 Notion 或本地 products 为准。

---

## 数据模型

### Questions
- `id`
- `title`
- `category`（肠胃问题 / 行为问题 / 护理问题 / 健康问题）
- `description`
- `causes`（数组）
- `solutions`（数组）
- `recommended_products`（数组）

### Products
- `id`
- `name`
- `category`（猫粮 / 猫砂 / 护理用品 / 健康用品 / 玩具）
- `type`
- `price_level`（budget / mid / premium）
- `description`

### Guides
- `id`
- `title`
- `content`（数组）

---

## Notion 后台接入（推荐）

### 环境变量

复制 `.env.example` 为 `.env.local`：

```env
NOTION_TOKEN=
NOTION_DB_QUESTIONS_ID=
NOTION_DB_PRODUCTS_ID=
NOTION_DB_GUIDES_ID=
```

### 字段映射（兼容中英文）

#### Questions
- `title` 或 `标题`（Title）
- `category` 或 `问题分类`（Select）
- `description` 或 `问题描述`（Text）
- `causes` 或 `常见原因`（Text/Multi-select）
- `solutions` 或 `处理方案`（Text）
- `recommended_products` 或 `推荐用品`（Text）

#### Products
- `name` 或 `名称`（Title）
- `category` 或 `用品分类`（Select）
- `type` 或 `用品类型`（Select/Text）
- `price_level` 或 `价格等级`（Select）
- `description` 或 `推荐理由`（Text）

#### Guides
- `title` 或 `标题`（Title）
- `content` 或 `内容正文` 或 `清单项`（Text）

> 读取优先级：Notion 可用时优先 Notion，否则自动回退本地 JSON。

---

## Notion 与网页如何同步（重要说明）

**没有「自动导出到 Json」按钮，也没有单独的同步软件。**  
做法是：**你在 Notion 里改内容 → 网站下次打开页面时，会向 Notion 在线拉数据**（通过 Notion 官方 API）。因此：

1. **本地开发**：在项目根目录创建 `.env.local`（可复制 `.env.example`），填好下面 4 项后执行 `npm run dev`，刷新浏览器即可看到 Notion 里的最新内容。
2. **线上部署**（如 Vercel）：在项目设置里同样配置这 4 个环境变量并重新部署；用户访问站点时，服务器会用这些变量去请求 Notion。
3. **何时仍显示旧数据（JSON）**：若环境变量没配全、Integration 没共享到数据库、或 Notion 请求失败/返回 0 条，程序会**自动退回** `src/data/*.json`，看起来像「没同步」——请先检查 `.env.local` 与 Notion 分享权限。

### 一次性配置清单（按顺序做）

1. 打开 [Notion Integrations](https://www.notion.so/my-integrations) → 新建 Integration → 复制 **Internal Integration Secret**，填到 `.env.local` 的 `NOTION_TOKEN`。
2. 在 Notion 里建 **3 个数据库**（或导入本项目 `src/data/notion-import/*.csv`），分别对应：问题库、用品库、新手指南。
3. 打开每个数据库页面 → 右上角 **⋯** → **Connections**（或 **Share**）→ 把你的 Integration **连上/邀请**，否则 API 读不到。
4. 取 **Database ID**：打开数据库为全页，浏览器地址类似  
   `https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...`  
   其中 **32 位十六进制**那一段（可带连字符）就是 ID，分别填到：  
   `NOTION_DB_QUESTIONS_ID`、`NOTION_DB_PRODUCTS_ID`、`NOTION_DB_GUIDES_ID`。
5. 字段名需与上文「字段映射」一致（中英文字段名都支持），否则页面可能拿不到内容。
6. 保存 `.env.local` 后**重启** `npm run dev`（改环境变量必须重启）。

### 文档与文件在哪

- 总说明（含本节）：项目根目录 **`cat_knowledge_base.md`**
- 环境变量模板：**`.env.example`**
- 本地数据兜底：**`src/data/questions.json`** 等
- 逻辑代码：**`src/lib/data.ts`**（何时用 Notion / 何时用 JSON）、**`src/lib/notion.ts`**（请求 Notion）

### 两种维护方式对比

| 方式 | 你怎么改内容 | 网页上出现时机 |
|------|----------------|----------------|
| 只用 JSON | 直接改 `src/data/*.json` 后重新部署/刷新 | 立刻（本地）或部署后（线上） |
| 用 Notion | 在 Notion 表格里改，无需改代码 | 刷新页面即会通过 API 拉最新（需环境变量正确） |

---

## CSV 批量导入 Notion

项目已提供导出脚本：

```bash
node scripts/export-notion-csv.mjs
```

导出文件位置：
- `src/data/notion-import/questions.csv`
- `src/data/notion-import/products.csv`
- `src/data/notion-import/guides.csv`

在 Notion 通过 Import CSV 导入即可。

---

## 本地运行与构建

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

---

## 免责声明

本知识库内容基于群友经验整理，仅供参考，不替代专业兽医诊断与治疗建议。
