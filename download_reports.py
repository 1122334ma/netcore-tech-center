#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量下载磊科检测报告到 public/reports/ 并按产品类别分类。"""
import json
import os
import subprocess
import sys
import time

SKILL_DIR = "C:/Users/Administrator/.workbuddy/plugins/cache/workbuddy-builtin/skill-library/0.5.9"
GET_LINK = os.path.join(SKILL_DIR, "drive", "get_download_link.py")
TOKEN = sys.argv[1] if len(sys.argv) > 1 else ""
LIST_FILE = "reports_list.json"
OUT_DIR = "public/reports"
PROXY = "http://127.0.0.1:7890"

os.makedirs(OUT_DIR, exist_ok=True)


def sanitize(name):
    name = (name or "").strip()
    for ch in '/\\:*?"<>|':
        name = name.replace(ch, "_")
    return name or "unnamed"


def classify(title):
    t = title or ""
    if "NAP" in t:
        return "无线AP"
    if "NBR" in t or "B200" in t or "NFG" in t:
        return "路由器"
    if "CQC" in t or "SRRC" in t or "证书" in t:
        return "认证证书"
    return "交换机"


def get_link(nid):
    try:
        p = subprocess.run(
            ["python3", GET_LINK, "--token-stdin", "--node-id", nid],
            input=TOKEN + "\n", capture_output=True, text=True, timeout=30)
    except Exception:
        return None
    for line in p.stdout.splitlines():
        if line.startswith("KS_DRIVE_DOWNLOAD"):
            try:
                return json.loads(line.split(" ", 1)[1])
            except Exception:
                return None
    return None


def download(url, outp):
    for use_proxy in [False, True]:
        if use_proxy:
            args = ["curl", "-sL", "--max-time", "180", "--proxy", PROXY, "-o", outp, url]
        else:
            args = ["curl", "-sL", "--max-time", "180", "-o", outp, url]
        try:
            r = subprocess.run(args, capture_output=True, timeout=200)
            if r.returncode == 0 and os.path.exists(outp) and os.path.getsize(outp) > 0:
                return True
        except Exception:
            pass
        if os.path.exists(outp):
            try:
                os.remove(outp)
            except Exception:
                pass
    return False


with open(LIST_FILE, encoding="utf-8") as f:
    items = json.load(f)

ok = []
fail = []
for idx, it in enumerate(items):
    nid = it["id"]
    title = it["title"]
    link = get_link(nid)
    if not link or not link.get("download_url"):
        fail.append({"title": title, "reason": "no_link"})
        print(f"[{idx+1}/{len(items)}] FAIL link: {title}", flush=True)
        continue
    fname = sanitize(link["file_name"])
    if not os.path.splitext(fname)[1]:
        ext = (link.get("ext") or "").strip()
        if ext:
            fname += "." + ext
    outp = os.path.join(OUT_DIR, fname)
    if os.path.exists(outp) and os.path.getsize(outp) > 0:
        sz = os.path.getsize(outp)
        ok.append({"title": title, "file": fname, "cat": classify(title), "size": sz})
        print(f"[{idx+1}/{len(items)}] SKIP existed: {fname}", flush=True)
        continue
    if download(link["download_url"], outp):
        sz = os.path.getsize(outp)
        ok.append({"title": title, "file": fname, "cat": classify(title), "size": sz})
        print(f"[{idx+1}/{len(items)}] OK {fname} ({sz//1024}KB)", flush=True)
    else:
        fail.append({"title": title, "reason": "download_failed"})
        print(f"[{idx+1}/{len(items)}] FAIL download: {title}", flush=True)
    time.sleep(0.2)

results = {"ok": ok, "fail": fail}
with open("reports_download_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"\n=== DONE === OK:{len(ok)} FAIL:{len(fail)}", flush=True)
