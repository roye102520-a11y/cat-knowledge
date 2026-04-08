import type { Metadata } from "next";
import CatFoodSafetyDirectory from "@/components/cat-food-safety-directory";
import foods from "@/data/foods.json";
import type { CatFoodItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "饮食禁忌",
  description: "猫咪能不能吃：常见食物安全对照表，含搜索与红绿标签示意。",
};

export default function FoodsPage() {
  return <CatFoodSafetyDirectory items={foods as CatFoodItem[]} />;
}
