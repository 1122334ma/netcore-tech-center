#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""读取下载结果，生成 检测报告下载.md 分类页面。"""
import json
from urllib.parse import quote

with open("reports_download_results.json", encoding="utf-8") as f:
    data = json.load(f)
ok = data.get("ok", [])

cats = {}
for it in ok:
    cats.setdefault(it["cat"], []).append(it)

order = ["交换机", "无线AP", "路由器", "认证证书"]

lines = []
lines.append("---\ntitle: 检测报告下载\n---\n")
lines.append("# 磊科检测报告下载\n")
lines.append("> 以下检测报告均来自磊科官方资料库，点击表格中的「下载」按钮即可直接下载，无需跳转网盘。\n")
lines.append("> 也可使用页面右上角搜索框，输入产品型号（如 `NS106PA`、`NAP930`）快速定位。\n")


def fmt(sz):
    if sz >= 1024 * 1024:
        return f"{sz/1024/1024:.1f} MB"
    return f"{sz//1024} KB"


for cat in order:
    items = cats.get(cat, [])
    if not items:
        continue
    lines.append(f"\n## {cat}检测报告（{len(items)} 份）\n")
    lines.append("| 文件名 | 大小 | 下载 |")
    lines.append("| --- | --- | --- |")
    for it in items:
        url = "/reports/" + quote(it["file"], safe="")
        # 表格单元格转义：文件名中的 | 会破坏表格，替换为全角
        disp = it["title"].replace("|", "｜")
        lines.append(f"| {disp} | {fmt(it['size'])} | [⬇ 下载]({url}) |")
    lines.append("")

content = "\n".join(lines)
with open("01-产品中心/检测报告下载.md", "w", encoding="utf-8") as f:
    f.write(content)

print(f"written: 01-产品中心/检测报告下载.md  (total {len(ok)} files)")
for c in order:
    print(f"  {c}: {len(cats.get(c, []))}")
# 总大小
total = sum(it["size"] for it in ok)
print(f"  total size: {total/1024/1024:.1f} MB")
