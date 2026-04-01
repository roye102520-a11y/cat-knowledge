#!/usr/bin/env python3
"""从 src/data/notion-import/products.csv 生成 src/data/products.json。"""
from __future__ import annotations

import csv
import json
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "src/data/notion-import/products.csv"
OUT_PATH = ROOT / "src/data/products.json"

NAMESPACE = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")

VALID_CATEGORIES = frozenset(
    {
        "猫粮",
        "主食罐",
        "零食",
        "猫砂",
        "护理用品",
        "清洁用品",
        "设备",
        "驱虫",
        "健康用品",
        "出行工具",
        "玩具",
    }
)
VALID_LEVELS = frozenset({"budget", "mid", "premium"})
VALID_ORIGINS = frozenset({"国产", "进口"})


def main() -> None:
    rows_out: list[dict] = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = (row.get("name") or "").strip()
            if not name:
                continue
            cat = (row.get("category") or "护理用品").strip()
            if cat not in VALID_CATEGORIES:
                raise SystemExit(f"Invalid category {cat!r} for product {name!r}")
            pl = (row.get("price_level") or "mid").strip()
            if pl not in VALID_LEVELS:
                raise SystemExit(f"Invalid price_level {pl!r} for product {name!r}")
            pid = str(uuid.uuid5(NAMESPACE, name))
            url = (row.get("purchase_url") or "").strip()
            origin = (row.get("origin") or "").strip()
            if origin and origin not in VALID_ORIGINS:
                raise SystemExit(f"Invalid origin {origin!r} for product {name!r} (use 国产 or 进口)")
            item: dict = {
                "id": pid,
                "name": name,
                "category": cat,
                "type": (row.get("type") or "").strip(),
                "price_level": pl,
                "description": (row.get("description") or "").strip(),
            }
            if origin:
                item["origin"] = origin
            if url:
                item["purchase_url"] = url
            rows_out.append(item)

    OUT_PATH.write_text(json.dumps(rows_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows_out)} products to {OUT_PATH}")


if __name__ == "__main__":
    main()
