# 养猫群聊智慧知识库

前台：Next.js（App Router）+ TypeScript + Tailwind CSS  
后台：Notion（可选），未配置时自动回退本地 JSON 数据

## 本地启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`

## 页面

- `/` 首页（搜索、8 类入口、热门问题）
- `/questions` 问题库（`?hub=disease` 健康 / `?hub=behavior` 行为）
- `/products` 用品库
- `/guide` 新手指南
- `/search` 搜索页
- `/ai` AI 问答（基于 `answerByKnowledgeBase` 的检索摘要，非大模型）
- `/zones` 选购专区（页脚入口）

信息架构说明见 **`docs/IA_SPEC.md`**。

## 本地问题数据（CSV → JSON）

编辑 `src/data/notion-import/questions.csv` 后执行：

```bash
npm run data:import-questions   # 仅问题库
npm run data:import-guides      # 仅新手指南（含绝育长文等）
npm run data:import-products    # 仅用品库（含监控、猫砂盆等）
npm run data:import-local       # 问题 + 指南 + 用品一次导入
npm run data:merge-downloads  # 将 downloads-import/*.csv 合并进 questions/products（去重）
```

会生成 `src/data/questions.json`（约 350 条）与 `guides.json`。未配置 Notion 时站点使用此文件。

## Notion 后台接入（推荐）

### 1) 准备环境变量

复制 `.env.example` 为 `.env.local`，填入：

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_QUESTIONS_ID=your_questions_database_id
NOTION_DB_PRODUCTS_ID=your_products_database_id
NOTION_DB_GUIDES_ID=your_guides_database_id
```

### 2) 把数据库分享给 Integration

在 Notion 中打开三个数据库，点击 `Share`，把你的 Integration 加进去。

### 3) 字段映射（支持中英文字段名）

#### Questions
- `title` 或 `标题`（title）
- `category` 或 `问题分类`（select）
- `description` 或 `问题描述`（rich_text）
- `causes` 或 `常见原因`（multi_select 或 rich_text）
- `solutions` 或 `处理方案`（rich_text）
- `recommended_products` 或 `推荐用品`（rich_text）

#### Products
- `name` 或 `名称`（title）
- `category` 或 `用品分类`（select）
- `type` 或 `用品类型`（select/rich_text）
- `price_level` 或 `价格等级`（select，值为 `budget` / `mid` / `premium`）
- `description` 或 `推荐理由`（rich_text）

#### Guides
- `title` 或 `标题`（title）
- `content` 或 `内容正文` 或 `清单项`（rich_text）

## 数据读取逻辑

1. 如果 Notion 配置完整且查询到数据：使用 Notion 数据  
2. 否则：自动使用 `src/data/*.json` 本地数据（兜底）

### 把 Notion 写回本地 JSON（静态分享包 / 备份）

配置好 `.env.local` 后执行：

```bash
npm run notion:sync
```

会将当前 Notion 三个库的内容写入 `src/data/questions.json`、`products.json`、`guides.json`（与线上解析逻辑一致）。之后可再执行 `npm run build:share` 生成带新数据的 `out/`。

## 部署建议

- 推荐使用 Vercel
- 在 Vercel 项目里同步配置 `.env.local` 的 Notion 变量
