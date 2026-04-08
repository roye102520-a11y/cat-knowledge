/** 全站主导航：5 个内容菜单 + AI 问答；选购专区见页脚 */
export const SITE_HUBS: {
  href: string;
  title: string;
  description: string;
}[] = [
  {
    href: "/questions",
    title: "养猫问题",
    description: "以真实搜索问题为主：全库检索与分类筛选。",
  },
  {
    href: "/questions?hub=disease",
    title: "猫咪健康",
    description: "肠胃、症状、皮肤与健康护理等高频搜索。",
  },
  {
    href: "/questions?hub=behavior",
    title: "猫咪行为",
    description: "乱尿、抓挠、应激、作息等行为向问答。",
  },
  {
    href: "/products",
    title: "猫咪用品",
    description: "猫粮、猫砂、玩具等；未来可承接推荐与变现。",
  },
  {
    href: "/guide",
    title: "新手指南",
    description: "接猫、清单、喂养与环境长文（含文档摘录）。",
  },
  {
    href: "/ai",
    title: "AI问答",
    description: "输入自然语言，从知识库检索并拼接摘要回答（RAG）。",
  },
];

/** 二级入口：场景选购清单 */
export const SITE_FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/articles", label: "科普长文" },
  { href: "/foods", label: "饮食禁忌" },
  { href: "/zones", label: "选购专区" },
];
