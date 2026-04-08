import type { UiLocale } from "@/lib/localized-path";

export function siteFooterCopy(lang: UiLocale) {
  if (lang === "en") {
    return {
      disclaimerLines: [
        "Community tips are not a substitute for in-person veterinary care.",
        "Use for quick reference and sharing in chat groups.",
      ],
      feedbackLead: "Feedback or suggestions:",
      emailVisible: "371243762@qq.com",
    };
  }
  return {
    disclaimerLines: [
      "群友经验仅供参考，健康问题不能替代专业兽医诊断。",
      "适合新手快速查阅，也适合群聊内转发分享。",
    ],
    feedbackLead: "问题或意见欢迎发邮件：",
    emailVisible: "371243762@qq.com",
  };
}
