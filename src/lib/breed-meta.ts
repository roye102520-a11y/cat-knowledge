export type BreedPainPoint =
  | "排毛助消化"
  | "美毛护肤"
  | "肠胃呵护"
  | "玻璃胃友好"
  | "高营养补充"
  | "高能发腮"
  | "低脂控卡"
  | "强壮骨骼";

export type BreedPainPoints = BreedPainPoint[];

export const BREED_MAP: Record<string, BreedPainPoints> = {
  金吉拉: ["排毛助消化", "美毛护肤", "肠胃呵护"],
  波斯猫: ["排毛助消化", "美毛护肤", "肠胃呵护"],
  布偶猫: ["玻璃胃友好", "美毛护肤", "高营养补充"],
  英短: ["高能发腮", "低脂控卡", "强壮骨骼"],
  美短: ["高能发腮", "低脂控卡", "强壮骨骼"],
  "全品种/通用": [],
};

export function getTagsByBreed(breedName: string): BreedPainPoints {
  const normalized = breedName.trim();
  return BREED_MAP[normalized] ?? [];
}

