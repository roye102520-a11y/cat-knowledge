import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write_csv(path, headers, rows):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def gen_questions():
    categories = [
        "新手养猫",
        "饮食喂养",
        "肠胃问题",
        "日常护理",
        "行为问题",
        "健康就医",
        "环境布置",
        "多猫家庭",
        "幼猫照护",
        "老年猫照护",
    ]
    symptoms = [
        "不吃猫粮",
        "软便拉稀",
        "频繁呕吐",
        "掉毛严重",
        "黑下巴反复",
        "泪痕明显",
        "半夜跑酷",
        "抓沙发",
        "乱尿",
        "应激躲藏",
        "口臭",
        "体重下降",
        "喝水太少",
        "便秘",
        "舔毛过度",
    ]
    triggers = [
        "换粮太快",
        "搬家应激",
        "清洁不到位",
        "运动不足",
        "饮水不足",
        "作息打乱",
        "猫砂不适应",
        "新猫加入",
        "季节变化",
        "零食过量",
    ]
    products = [
        "益生菌",
        "慢食碗",
        "自动饮水机",
        "豆腐猫砂",
        "矿砂",
        "猫抓板",
        "逗猫棒",
        "费洛蒙喷雾",
        "化毛膏",
        "鱼油",
    ]
    templates = [
        "猫咪{symptom}怎么办（{category}）",
        "为什么猫咪会{symptom}（{category}）",
    ]
    rows = []
    i = 1
    for tpl in templates:
        for c in categories:
            for s in symptoms:
                t = triggers[(i - 1) % len(triggers)]
                p1 = products[(i - 1) % len(products)]
                p2 = products[i % len(products)]
                q = tpl.format(symptom=s, category=c)
                ans = f"常见与{t}有关，建议先观察精神与食欲，调整喂养节奏并做好环境管理，若持续48小时无改善建议就医。"
                rows.append(
                    {
                        "id": f"Q{i:03d}",
                        "question": q,
                        "category": c,
                        "answer": ans,
                        "recommended_products": f"{p1}|{p2}",
                        "seo_title": q.replace("（", " ").replace("）", ""),
                    }
                )
                i += 1
                if i > 300:
                    return rows
    return rows[:300]


def gen_products():
    categories = ["猫粮", "猫砂", "护理用品", "健康用品", "玩具", "出行用品"]
    types = {
        "猫粮": ["幼猫粮", "成猫粮", "低敏粮", "泌尿护理粮", "控重粮"],
        "猫砂": ["豆腐砂", "矿砂", "混合砂", "膨润土", "松木砂"],
        "护理用品": ["洗耳液", "眼部湿巾", "指甲剪", "梳毛针梳", "口腔清洁"],
        "健康用品": ["益生菌", "鱼油", "化毛膏", "乳铁蛋白", "营养膏"],
        "玩具": ["逗猫棒", "猫抓板", "漏食球", "电动玩具", "猫爬架"],
        "出行用品": ["航空箱", "猫包", "车载垫", "牵引绳", "便携水碗"],
    }
    levels = ["budget", "mid", "premium"]
    brands = [
        "鲜朗",
        "爱肯拿",
        "渴望",
        "pidan",
        "petshy",
        "网易",
        "妮可露",
        "福丸",
        "卫仕",
        "MAG",
    ]
    rows = []
    i = 1
    for c in categories:
        for t in types[c]:
            for b in brands:
                level = levels[(i - 1) % 3]
                rows.append(
                    {
                        "id": f"P{i:03d}",
                        "name": f"{b}{t}",
                        "category": c,
                        "type": t,
                        "price_level": level,
                        "description": f"{b} {t}，适合{c}场景，日常使用稳定。",
                    }
                )
                i += 1
                if i > 150:
                    return rows
    return rows[:150]


def gen_diseases():
    disease_names = [
        "猫癣",
        "猫传腹",
        "肠胃炎",
        "上呼吸道感染",
        "杯状病毒",
        "猫鼻支",
        "泌尿道炎症",
        "膀胱炎",
        "胰腺炎",
        "脂肪肝",
        "慢性肾病",
        "甲亢",
        "糖尿病",
        "牙龈炎",
        "耳螨",
        "皮肤过敏",
        "寄生虫感染",
        "跳蚤感染",
        "蜱虫感染",
        "贫血",
        "心肌病",
        "哮喘",
        "胃肠道异物",
        "便秘综合征",
        "角膜炎",
        "结膜炎",
        "中耳炎",
        "口炎",
        "猫瘟",
        "弓形虫感染",
        "真菌性皮炎",
        "细菌性皮炎",
        "食物不耐受",
        "慢性腹泻",
        "关节炎",
        "椎间盘问题",
        "癫痫样发作",
        "肝炎",
        "胆囊问题",
        "胰岛素抵抗",
        "多囊肾",
        "高血压",
        "低血糖",
        "异食癖",
        "肥胖症",
        "脱水",
        "产后低钙",
        "子宫蓄脓",
        "乳腺炎",
        "猫抓病相关感染",
    ]
    rows = []
    for i, name in enumerate(disease_names, 1):
        rows.append(
            {
                "id": f"D{i:03d}",
                "disease_name": name,
                "main_symptoms": "食欲下降、精神差、体重变化或异常行为",
                "common_causes": "感染、免疫力下降、环境应激或基础疾病",
                "care_advice": "先记录症状出现时间与频率，避免自行用药，尽快就医检查。",
                "severity_level": "中高风险",
            }
        )
    return rows


def gen_behaviors():
    behavior_titles = [
        "半夜跑酷",
        "抓沙发",
        "乱尿",
        "乱拉",
        "过度舔毛",
        "攻击主人",
        "咬人",
        "躲藏不出",
        "见人就跑",
        "护食",
        "抢食",
        "偷吃",
        "挑食",
        "叫春期嚎叫",
        "持续喵喵叫",
        "翻垃圾桶",
        "钻床底不出来",
        "追尾巴",
        "啃电线",
        "频繁踩奶",
        "扑脚",
        "突然炸毛",
        "排队堵猫砂盆",
        "新猫冲突",
        "霸占高位",
        "喷尿标记",
        "外出应激",
        "剪指甲抗拒",
        "洗澡抗拒",
        "看病运输应激",
    ]
    rows = []
    for i, title in enumerate(behavior_titles, 1):
        rows.append(
            {
                "id": f"B{i:03d}",
                "behavior": title,
                "scenario": "家庭日常场景",
                "possible_causes": "精力过剩、应激、安全感不足或环境管理问题",
                "training_advice": "先排除健康问题，再做正向引导，增加陪玩和稳定作息。",
                "recommended_items": "逗猫棒|猫抓板|费洛蒙",
            }
        )
    return rows


def main():
    write_csv(
        ROOT / "cat_questions.csv",
        ["id", "question", "category", "answer", "recommended_products", "seo_title"],
        gen_questions(),
    )
    write_csv(
        ROOT / "cat_products.csv",
        ["id", "name", "category", "type", "price_level", "description"],
        gen_products(),
    )
    write_csv(
        ROOT / "cat_diseases.csv",
        ["id", "disease_name", "main_symptoms", "common_causes", "care_advice", "severity_level"],
        gen_diseases(),
    )
    write_csv(
        ROOT / "cat_behaviors.csv",
        ["id", "behavior", "scenario", "possible_causes", "training_advice", "recommended_items"],
        gen_behaviors(),
    )
    print("Generated: cat_questions.csv, cat_products.csv, cat_diseases.csv, cat_behaviors.csv")


if __name__ == "__main__":
    main()
