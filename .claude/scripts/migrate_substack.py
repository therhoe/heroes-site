#!/usr/bin/env python3
"""One-shot Substack export -> _newsletter/ migration.

Usage:
    python .claude/scripts/migrate_substack.py path/to/export.zip [--dry-run]
    python .claude/scripts/migrate_substack.py path/to/unzipped-export-dir [--dry-run]

Reads the Substack export zip (posts.csv + posts/*.html), and for each
published post:
  - writes _newsletter/<slug>.html (cleaned HTML body, kept verbatim,
    wrapped in {% raw %} so stray Liquid in old posts can't break the build)
  - downloads images to assets/newsletter/<slug>/ and rewrites srcs
  - strips Substack chrome (subscribe widgets, share buttons, polls)

Idempotent: re-running skips image downloads that already exist and
rewrites the .html files in place.

Deps: pip install requests beautifulsoup4
"""

import csv
import io
import json
import mimetypes
import re
import sys
import zipfile
from pathlib import Path

import requests
from bs4 import BeautifulSoup

REPO = Path(__file__).resolve().parents[2]
OUT_DIR = REPO / "_newsletter"
ASSET_DIR = REPO / "assets" / "newsletter"
SUBSTACK_BASE = "https://heroesofecommerce.substack.com/p/"

# Substack chrome to strip entirely (selector -> reason)
STRIP_SELECTORS = [
    ".subscription-widget-wrap",      # subscribe boxes
    ".subscription-widget-wrap-editor",
    ".subscribe-widget",
    ".button-wrapper",                # share / subscribe / comment CTAs
    ".post-footer",
    ".like-button-container",
    ".share-dialog",
    ".poll-embed",                    # interactive, dead without substack js
    ".digest-post-embed",             # cross-post cards
    ".install-substack-app-embed",
]

NOTABLE_SLUGS = [
    "day-9-finally-the-good-stuff-cro",
    "day-13-this-is-whats-missing-in-ab",
    "day-15-its-not-a-redesign-its-a-reset",
    "day-20-step-2-in-the-cro-workflow",
    "day-22-product-page-audits-via-page",
]


def yaml_str(value: str) -> str:
    """Emit a YAML-safe double-quoted scalar via JSON (JSON is valid YAML)."""
    return json.dumps(value, ensure_ascii=False)


def slug_from_filename(name: str) -> str:
    # posts/123456.day-9-foo.html -> day-9-foo
    stem = Path(name).name
    stem = re.sub(r"\.html$", "", stem)
    return stem.split(".", 1)[1] if "." in stem else stem


def ext_from_response(resp, url: str) -> str:
    ctype = (resp.headers.get("content-type") or "").split(";")[0].strip()
    ext = mimetypes.guess_extension(ctype) or ""
    if ext in (".jpe", ".jpeg"):
        ext = ".jpg"
    if not ext:
        m = re.search(r"\.(png|jpe?g|gif|webp|svg|avif)(?:$|\?)", url, re.I)
        ext = "." + m.group(1).lower() if m else ".png"
    return ext


UA = {"User-Agent": "Mozilla/5.0 (site migration; therealheroesofecommerce.com)"}


def fetchable_url(src: str) -> str:
    """Old posts point at Substack's raw S3 bucket, which 403s direct requests.
    Route those through the substackcdn image-fetch proxy instead."""
    if "bucketeer-" in src and "s3.amazonaws.com" in src and "substackcdn.com" not in src:
        from urllib.parse import quote
        return ("https://substackcdn.com/image/fetch/f_auto,q_auto:good/"
                + quote(src, safe=""))
    return src


def download_images(soup: BeautifulSoup, slug: str, dry_run: bool):
    """Download every <img>, rewrite src to /assets/newsletter/<slug>/..."""
    imgs = soup.find_all("img")
    count = 0
    total_bytes = 0
    big_files = []
    slug_dir = ASSET_DIR / slug
    for i, img in enumerate(imgs, 1):
        src = img.get("src") or ""
        if not src.startswith("http"):
            continue
        count += 1
        base = f"image-{i:02d}"
        existing = list(slug_dir.glob(base + ".*")) if slug_dir.exists() else []
        if existing:
            local = existing[0]
        else:
            if dry_run:
                img["src"] = f"/assets/newsletter/{slug}/{base}.ext"
                continue
            try:
                resp = requests.get(fetchable_url(src), timeout=60, headers=UA)
                resp.raise_for_status()
            except Exception as exc:
                print(f"  !! {slug}: image {i} failed ({exc}); keeping remote url")
                continue
            slug_dir.mkdir(parents=True, exist_ok=True)
            local = slug_dir / (base + ext_from_response(resp, src))
            local.write_bytes(resp.content)
        size = local.stat().st_size
        total_bytes += size
        if size > 500_000:
            big_files.append((local, size))
        img["src"] = f"/assets/newsletter/{slug}/{local.name}"
        # srcset would point back at substackcdn; the layout styles plain imgs
        for attr in ("srcset", "sizes", "data-attrs", "width", "height"):
            if img.has_attr(attr):
                del img[attr]
    return count, total_bytes, big_files


def clean_body(soup: BeautifulSoup) -> BeautifulSoup:
    for sel in STRIP_SELECTORS:
        for node in soup.select(sel):
            node.decompose()

    # collapse captioned-image containers to plain <figure><img><figcaption>
    for container in soup.select(".captioned-image-container"):
        img = container.find("img")
        if img is None:
            container.decompose()
            continue
        figure = soup.new_tag("figure")
        figure.append(img.extract())
        caption = container.find("figcaption")
        if caption is not None:
            figure.append(caption.extract())
        container.replace_with(figure)

    # unwrap lightbox anchors and <picture> wrappers around images
    for picture in soup.find_all("picture"):
        img = picture.find("img")
        picture.replace_with(img.extract()) if img else picture.decompose()
    for a in soup.find_all("a", class_="image-link"):
        img = a.find("img")
        a.replace_with(img.extract()) if img else a.decompose()

    # JS-dependent embeds degrade to plain links
    for tw in soup.select(".tweet, .twitter-tweet"):
        link = tw.find("a", href=True)
        if link is not None:
            p = soup.new_tag("p")
            a = soup.new_tag("a", href=link["href"])
            a.string = link["href"]
            p.append(a)
            tw.replace_with(p)
        else:
            tw.decompose()
    for iframe in soup.find_all("iframe"):
        src = iframe.get("src") or ""
        if not src.startswith("http"):
            iframe.decompose()

    return soup


def convert_post(zf: zipfile.ZipFile, html_name: str, row: dict, dry_run: bool):
    slug = slug_from_filename(html_name)
    raw = zf.read(html_name).decode("utf-8", errors="replace")
    soup = BeautifulSoup(raw, "html.parser")
    soup = clean_body(soup)
    n_imgs, weight, big = download_images(soup, slug, dry_run)

    body = soup.decode().strip()
    if "substackcdn" in body or "substack-post-media" in body:
        leftover = len(re.findall(r"substackcdn|substack-post-media", body))
        print(f"  !! {slug}: {leftover} leftover substack cdn refs")

    date = (row.get("post_date") or "")[:10]
    title = row.get("title") or slug
    subtitle = (row.get("subtitle") or "").strip()
    if len(subtitle) > 160:
        subtitle = subtitle[:157].rstrip() + "..."

    front = ["---",
             f"title: {yaml_str(title)}"]
    if subtitle:
        front.append(f"description: {yaml_str(subtitle)}")
    front += [f"date: {date}",
              f"substack_url: {yaml_str(SUBSTACK_BASE + slug)}",
              "---",
              ""]
    doc = "\n".join(front) + "{% raw %}\n" + body + "\n{% endraw %}\n"

    if not dry_run:
        OUT_DIR.mkdir(exist_ok=True)
        (OUT_DIR / f"{slug}.html").write_text(doc, encoding="utf-8")
    return slug, date, n_imgs, weight, big


class DirSource:
    """Duck-types the bits of ZipFile this script uses, over an unzipped dir."""

    def __init__(self, root):
        self.root = Path(root)

    def namelist(self):
        return [p.relative_to(self.root).as_posix()
                for p in self.root.rglob("*") if p.is_file()]

    def read(self, name):
        return (self.root / name).read_bytes()

    def open(self, name):
        return (self.root / name).open("rb")

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry_run = "--dry-run" in sys.argv
    if not args:
        sys.exit("usage: migrate_substack.py path/to/export[.zip] [--dry-run]")
    zip_path = Path(args[0])
    source = DirSource(zip_path) if zip_path.is_dir() else zipfile.ZipFile(zip_path)

    with source as zf:
        csv_name = next(n for n in zf.namelist() if n.endswith("posts.csv"))
        rows = {}
        with zf.open(csv_name) as fh:
            reader = csv.DictReader(io.TextIOWrapper(fh, encoding="utf-8-sig"))
            for row in reader:
                rows[row["post_id"]] = row

        html_files = [n for n in zf.namelist()
                      if n.endswith(".html")
                      and (n.startswith("posts/") or "/posts/" in n)]

        results, skipped = [], []
        for name in sorted(html_files):
            post_id = Path(name).name.split(".", 1)[0]
            # csv post_id looks like "123456.day-9-foo"
            row = rows.get(Path(name).name[:-5]) or rows.get(post_id)
            if row is None:
                skipped.append((name, "no csv row"))
                continue
            if (row.get("is_published") or "").lower() != "true":
                skipped.append((name, "not published"))
                continue
            if row.get("type") not in ("newsletter", "post", "podcast", "", None):
                skipped.append((name, f"type={row.get('type')}"))
                continue
            results.append(convert_post(zf, name, row, dry_run))

    print(f"\n{'slug':<50} {'date':<12} {'imgs':>4} {'KB':>8}")
    total_w = 0
    all_big = []
    for slug, date, n, w, big in sorted(results, key=lambda r: r[1]):
        total_w += w
        all_big += big
        print(f"{slug:<50} {date:<12} {n:>4} {w // 1024:>8}")
    print(f"\nconverted: {len(results)}  skipped: {len(skipped)}  "
          f"images: {total_w / 1024 / 1024:.1f} MB")
    for name, why in skipped:
        print(f"  skipped {name}: {why}")
    for path, size in all_big:
        print(f"  LARGE (> 500 KB, consider compressing): {path} ({size // 1024} KB)")

    made = {slug for slug, *_ in results}
    print("\nnotable posts remap check:")
    for s in NOTABLE_SLUGS:
        mark = "OK " if s in made else "MISSING"
        print(f"  [{mark}] /newsletter/{s}/")


if __name__ == "__main__":
    main()
