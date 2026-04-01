export type QuestionCategory = "肠胃问题" | "行为问题" | "护理问题" | "健康问题";

/** URL 参数 hub：疾病库 / 行为库；未传或非法值视为「问题库（核心）」全量 */
export type QuestionHubParam = "disease" | "behavior";

export interface Question {
  id: string;
  title: string;
  description: string;
  category: QuestionCategory;
  causes: string[];
  solutions: string[];
  recommended_products: string[];
}

export type ProductCategory = "猫粮" | "零食" | "猫砂" | "护理用品" | "健康用品" | "玩具";
export type PriceLevel = "budget" | "mid" | "premium";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  type: string;
  price_level: PriceLevel;
  description: string;
  /** 可选：直达购买页（电商/官网），未配置则卡片不显示按钮 */
  purchase_url?: string;
}

export interface Guide {
  id: string;
  title: string;
  content: string[];
}

/** AI 问答页检索结果（客户端静态包与服务端共用结构） */
export type AiAnswerResult = {
  answer: string;
  related_questions: Question[];
  related_products: Product[];
};

/** 选购专区：按场景/目录思路分组，与用品库分类正交 */
export interface ProductZone {
  id: string;
  title: string;
  subtitle: string;
  tips: string;
  product_ids: string[];
}

export type CommunityPostType = "养猫经验" | "用品推荐";

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  title: string;
  content: string;
  created_at: string;
}
