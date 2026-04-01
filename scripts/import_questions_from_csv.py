#!/usr/bin/env python3
"""从 src/data/notion-import/questions.csv 生成 src/data/questions.json（供静态构建与本地开发）。"""
from __future__ import annotations

import csv
import json
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "src/data/notion-import/questions.csv"
OUT_PATH = ROOT / "src/data/questions.json"

NAMESPACE = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")


def split_semicolon(s: str) -> list[str]:
    s = (s or "").strip()
    if not s:
        return []
    return [x.strip() for x in s.split("；") if x.strip()]


def main() -> None:
    rows_out: list[dict] = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = (row.get("title") or "").strip()
            if not title:
                continue
            cat = (row.get("category") or "健康问题").strip()
            qid = str(uuid.uuid5(NAMESPACE, title))
            rows_out.append(
                {
                    "id": qid,
                    "title": title,
                    "category": cat,
                    "description": (row.get("description") or "").strip(),
                    "causes": split_semicolon(row.get("causes") or ""),
                    "solutions": split_semicolon(row.get("solutions") or ""),
                    "recommended_products": split_semicolon(row.get("recommended_products") or ""),
                }
            )

    OUT_PATH.write_text(json.dumps(rows_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows_out)} questions to {OUT_PATH}")


if __name__ == "__main__":
    main()
