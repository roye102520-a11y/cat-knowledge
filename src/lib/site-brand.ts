/** 全站品牌名（导航、浏览器标题、Open Graph 等） */
export const SITE_BRAND_NAME = "Cat Knowledge";

/** 中文一句话介绍（meta description 等） */
export const SITE_TAGLINE_ZH = "新手友好的养猫问题、疾病与行为库、用品与指南";

/** 英文站点首页等用的描述 */
export const SITE_TAGLINE_EN =
  "Cat care Q&A, behavior & health guides, products, and long reads—warm, guardian-friendly, vet-aware.";

/**
 * 英文页 SEO `<title>`：`核心标题 - Cat Knowledge`。
 * 与根 layout 的 `title.template` 并用时请配合 `title: { absolute: … }`，避免重复品牌名。
 * 若原稿只有中文标题，传入中文版 title 即可保证英文路由下标题不留白。
 */
export function englishDocumentTitle(coreTitle: string): string {
  const s = coreTitle.trim();
  if (!s || s === SITE_BRAND_NAME) return SITE_BRAND_NAME;
  return `${s} - ${SITE_BRAND_NAME}`;
}
