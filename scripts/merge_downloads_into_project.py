#!/usr/bin/env python3
"""
将 src/data/downloads-import/ 下四份 CSV（来自 Downloads）合并进项目：
- 问题 -> notion-import/questions.csv（按标题去重）
- 用品 -> notion-import/products.csv（按名称去重）
- 疾病 -> notion-import/diseases_extended.csv（新建）
- 行为 -> 转为问题行写入 questions.csv（标题「猫咪…」去重）
"""
from __future__ import annotations

import csv
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DL = ROOT / "src/data/downloads-import"
Q_OUT = ROOT / "src/data/notion-import/questions.csv"
P_OUT = ROOT / "src/data/notion-import/products.csv"
D_OUT = ROOT / "src/data/notion-import/diseases_extended.csv"

QUESTION_FIELDS = ["title", "category", "description", "causes", "solutions", "recommended_products"]
PRODUCT_FIELDS = ["name", "category", "type", "price_level", "description", "purchase_url"]

CAT_MAP = {
    "基础问题": "护理问题",
    "日常护理": "护理问题",
    "饮食": "肠胃问题",
    "行为问题": "行为问题",
    "健康问题": "健康问题",
    "护理问题": "护理问题",
}

PRICE_MAP = {
    "低": "budget",
    "中": "mid",
    "高": "premium",
    "中-高": "mid",
    "低-中": "budget",
}

PROD_CAT_MAP = {
    "猫粮": ("猫粮", "主粮"),
    "湿粮": ("主食罐", "湿粮"),
    "主食罐": ("主食罐", "湿粮"),
    "零食": ("零食", "奖励零食"),
    "猫砂": ("猫砂", "猫砂"),
    "猫砂盆": ("猫砂", "猫砂盆"),
    "猫砂垫": ("猫砂", "猫砂垫"),
    "猫砂盆配件": ("猫砂", "猫砂盆配件"),
    "猫碗": ("护理用品", "食具"),
    "猫窝": ("护理用品", "猫窝"),
    "饮水设备": ("护理用品", "饮水设备"),
    "喂食设备": ("护理用品", "喂食设备"),
    "玩具": ("玩具", "玩具"),
    "护理用品": ("护理用品", "护理用品"),
    "健康用品": ("健康用品", "健康用品"),
    "药品": ("健康用品", "药品"),
    "营养品": ("健康用品", "营养品"),
    "驱虫药": ("驱虫", "驱虫药"),
    "出行用品": ("护理用品", "出行用品"),
    "清洁用品": ("护理用品", "清洁用品"),
    "洗澡用品": ("护理用品", "洗澡用品"),
    "储存用品": ("护理用品", "储存用品"),
    "防护用品": ("护理用品", "防护用品"),
    "监控设备": ("护理用品", "监控设备"),
    "其他": ("护理用品", "其他"),
}


def norm(s: str) -> str:
    return (s or "").strip()


def clean_text(s: str) -> str:
    s = html.unescape(norm(s))
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s.replace("\n", " "))
    return s.strip()


def split_causes(raw: str) -> str:
    raw = clean_text(raw)
    if not raw:
        return ""
    for sep in ["。", "；", "，"]:
        if sep in raw[:40]:
            parts = [p.strip() for p in re.split(r"[，、；]", raw) if p.strip()]
            if parts:
                return "；".join(parts[:12])
    return raw[:300]


def split_products(raw: str) -> str:
    raw = clean_text(raw).replace("、", "；").replace(",", "；")
    return raw


def split_solutions(raw: str) -> str:
    raw = clean_text(raw)
    return raw[:2000] if len(raw) > 2000 else raw


def load_existing_questions_titles() -> set[str]:
    titles: set[str] = set()
    with Q_OUT.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            t = norm(row.get("title", ""))
            if t:
                titles.add(t)
    return titles


def load_existing_product_names() -> set[str]:
    names: set[str] = set()
    with P_OUT.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            n = norm(row.get("name", ""))
            if n:
                names.add(n)
    return names


def append_questions_rows(rows: list[dict]) -> None:
    if not rows:
        return
    with Q_OUT.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        existing = list(reader)
        fieldnames = reader.fieldnames or QUESTION_FIELDS
    existing.extend(rows)
    with Q_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        for r in existing:
            w.writerow({k: r.get(k, "") for k in fieldnames})


def append_products_rows(rows: list[dict]) -> None:
    if not rows:
        return
    with P_OUT.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        existing = list(reader)
        fieldnames = reader.fieldnames or PRODUCT_FIELDS
    existing.extend(rows)
    with P_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        for r in existing:
            w.writerow({k: r.get(k, "") for k in fieldnames})


def write_diseases(rows: list[dict]) -> None:
    keys = ["name", "symptoms", "cause", "treatment", "prevention", "is_common", "medicines", "vet_note"]
    with D_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=keys)
        w.writeheader()
        for r in rows:
            w.writerow(r)


def main() -> None:
    q_titles = load_existing_questions_titles()
    p_names = load_existing_product_names()

    new_q: list[dict] = []
    new_p: list[dict] = []
    new_d: list[dict] = []
    new_behavior_q: list[dict] = []

    # --- Questions from cat_questions.csv
    q_path = DL / "cat_questions.csv"
    with q_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = norm(row.get("问题") or row.get("\ufeff问题", ""))
            if not title:
                continue
            if title in q_titles:
                continue
            cat_raw = norm(row.get("分类", ""))
            cat = CAT_MAP.get(cat_raw, "护理问题")
            answer = clean_text(row.get("答案", ""))
            causes = split_causes(row.get("原因", ""))
            sol = split_solutions(row.get("解决方法", ""))
            reco = split_products(row.get("推荐用品", ""))
            seo = norm(row.get("SEO标题", ""))
            src = norm(row.get("来源", ""))
            desc = answer
            if seo and seo not in desc:
                desc = f"{desc}（SEO：{seo}）" if desc else seo
            if src:
                desc = f"{desc}。来源：{src}" if desc else f"来源：{src}"
            new_q.append(
                {
                    "title": title,
                    "category": cat,
                    "description": desc[:2500],
                    "causes": causes,
                    "solutions": sol,
                    "recommended_products": reco,
                }
            )
            q_titles.add(title)

    # --- Behaviors -> question rows
    b_path = DL / "cat_behaviors.csv"
    with b_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            beh = norm(row.get("行为问题", ""))
            if not beh:
                continue
            if beh.startswith("猫"):
                title = beh if ("怎么办" in beh or "行为" in beh or "正常吗" in beh) else f"{beh}怎么办"
            else:
                title = f"猫咪{beh}怎么办"
            if title in q_titles:
                continue
            causes = split_causes(row.get("原因", ""))
            sol = split_solutions(row.get("解决方法", ""))
            is_ok = norm(row.get("是否正常", ""))
            freq = norm(row.get("频率", ""))
            desc = clean_text(f"行为说明：{is_ok}；频率：{freq}".strip("；"))
            new_behavior_q.append(
                {
                    "title": title,
                    "category": "行为问题",
                    "description": desc[:800],
                    "causes": causes,
                    "solutions": sol,
                    "recommended_products": "",
                }
            )
            q_titles.add(title)

    new_q.extend(new_behavior_q)

    # --- Products
    pr_path = DL / "cat_products.csv"
    with pr_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = norm(row.get("产品名称", ""))
            if not name:
                continue
            if name in p_names:
                continue
            kind = norm(row.get("类别", ""))
            cat_t, typ = PROD_CAT_MAP.get(kind, ("护理用品", kind or "用品"))
            appl = norm(row.get("适用猫咪", ""))
            price_txt = norm(row.get("价格区间", ""))
            pl = PRICE_MAP.get(price_txt.replace(" ", ""), "mid")
            reason = clean_text(row.get("推荐理由", ""))
            related = clean_text(row.get("相关问题", ""))
            channel = norm(row.get("购买渠道", ""))
            brands = norm(row.get("品牌推荐", ""))
            desc = reason
            if appl:
                desc += f" 适用：{appl}。"
            if brands:
                desc += f" 品牌参考：{brands}。"
            if related:
                desc += f" 相关问题：{related}。"
            if channel:
                desc += f" 渠道：{channel}。"
            desc += "（条目来自批量导入，链接请自行检索。）"
            new_p.append(
                {
                    "name": name,
                    "category": cat_t,
                    "type": typ,
                    "price_level": pl,
                    "description": desc[:2000],
                    "purchase_url": "",
                }
            )
            p_names.add(name)

    # --- Diseases
    d_path = DL / "cat_diseases.csv"
    with d_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = norm(row.get("疾病名称", ""))
            if not name:
                continue
            new_d.append(
                {
                    "name": name,
                    "symptoms": clean_text(row.get("症状", "")),
                    "cause": clean_text(row.get("原因", "")),
                    "treatment": clean_text(row.get("治疗方法", "")),
                    "prevention": clean_text(row.get("预防措施", "")),
                    "is_common": norm(row.get("是否常见", "")),
                    "medicines": clean_text(row.get("相关药品", "")),
                    "vet_note": clean_text(row.get("是否需就医", "")),
                }
            )

    append_questions_rows(new_q)
    append_products_rows(new_p)
    write_diseases(new_d)

    print(
        f"Merged: +{len(new_q)} questions (incl. behaviors), +{len(new_p)} products, "
        f"wrote {len(new_d)} diseases -> {D_OUT.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
