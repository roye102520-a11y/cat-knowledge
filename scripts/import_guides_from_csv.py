#!/usr/bin/env python3
"""从 src/data/notion-import/guides.csv 生成 src/data/guides.json。"""
from __future__ import annotations

import csv
import json
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "src/data/notion-import/guides.csv"
OUT_PATH = ROOT / "src/data/guides.json"

NAMESPACE = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")


# 使用 ||| 分隔，避免正文中的中文分号「；」被误切分
def split_paragraphs(raw: str) -> list[str]:
    parts = [p.strip() for p in (raw or "").split("|||") if p.strip()]
    return parts


def main() -> None:
    out: list[dict] = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = (row.get("title") or "").strip()
            if not title:
                continue
            gid = str(uuid.uuid5(NAMESPACE, title))
            item: dict = {
                "id": gid,
                "title": title,
                "content": split_paragraphs(row.get("content") or ""),
            }
            anchor = (row.get("anchor") or "").strip()
            if anchor:
                item["anchor"] = anchor
            out.append(item)
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(out)} guides to {OUT_PATH}")


if __name__ == "__main__":
    main()
