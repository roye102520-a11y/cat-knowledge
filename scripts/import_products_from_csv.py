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

VALID_CATEGORIES = frozenset({"猫粮", "猫砂", "护理用品", "健康用品", "玩具"})
VALID_LEVELS = frozenset({"budget", "mid", "premium"})


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
            item: dict = {
                "id": pid,
                "name": name,
                "category": cat,
                "type": (row.get("type") or "").strip(),
                "price_level": pl,
                "description": (row.get("description") or "").strip(),
            }
            if url:
                item["purchase_url"] = url
            rows_out.append(item)

    OUT_PATH.write_text(json.dumps(rows_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows_out)} products to {OUT_PATH}")


if __name__ == "__main__":
    main()
