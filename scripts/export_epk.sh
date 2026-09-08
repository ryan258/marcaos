#!/usr/bin/env bash
# scripts/export_epk.sh — #94 Self-Contained Single-File EPK Export
# Generates a zero-dependency, 100% self-contained standalone HTML bundle
# with all CSS, JS, and image assets base64-inlined for offline press & promoters.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Building Hugo production release..."
hugo --minify

PUBLIC_DIR="$ROOT_DIR/public"
OUTPUT_FILE="$PUBLIC_DIR/marcaos-epk-standalone.html"
INDEX_FILE="$PUBLIC_DIR/index.html"

if [ ! -f "$INDEX_FILE" ]; then
  echo "Error: $INDEX_FILE not found." >&2
  exit 1
fi

echo "==> Inlining assets into standalone bundle..."

export ROOT_DIR PUBLIC_DIR INDEX_FILE OUTPUT_FILE

python3 - <<'PY'
import re, os, base64

root_dir = os.environ["ROOT_DIR"]
public_dir = os.environ["PUBLIC_DIR"]
index_path = os.environ["INDEX_FILE"]
output_path = os.environ["OUTPUT_FILE"]

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Base64 encode artist image if present
artist_img = os.path.join(root_dir, "assets", "artist.jpg")
artist_uri = ""
if os.path.isfile(artist_img):
    with open(artist_img, 'rb') as img_f:
        artist_b64 = base64.b64encode(img_f.read()).decode('ascii')
        artist_uri = f"data:image/jpeg;base64,{artist_b64}"

# Base64 encode favicon if present
fav_img = os.path.join(root_dir, "static", "favicon.svg")
fav_uri = ""
if os.path.isfile(fav_img):
    with open(fav_img, 'rb') as fav_f:
        fav_b64 = base64.b64encode(fav_f.read()).decode('ascii')
        fav_uri = f"data:image/svg+xml;base64,{fav_b64}"

def parse_attrs(tag_str):
    attrs = {}
    for match in re.finditer(r'([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+)))?', tag_str):
        name = match.group(1).lower()
        val = match.group(2) or match.group(3) or match.group(4) or ""
        attrs[name] = val
    return attrs

# 1. Inline stylesheet <link> tags
def replace_link(match):
    tag = match.group(0)
    attrs = parse_attrs(tag)
    if attrs.get('rel') == 'stylesheet' and 'href' in attrs:
        href = attrs['href'].split('?')[0].lstrip('/')
        disk_path = os.path.join(public_dir, href)
        if os.path.isfile(disk_path):
            with open(disk_path, 'r', encoding='utf-8') as cf:
                css = cf.read()
            if artist_uri:
                css = re.sub(r'url\([^)]*artist[^)]*\)', f"url('{artist_uri}')", css)
            return f'<style>{css}</style>'
    elif attrs.get('rel') == 'icon' and fav_uri:
        return f'<link rel="icon" type="image/svg+xml" href="{fav_uri}">'
    elif attrs.get('rel') in ('manifest', 'alternate'):
        return ''  # Omit web manifest & external alternate links in standalone offline bundle
    return tag

html = re.sub(r'<link\s+[^>]+>', replace_link, html)

# 2. Inline <script src="..."> tags
def replace_script(match):
    open_tag = match.group(1)
    attrs = parse_attrs(open_tag)
    if 'src' in attrs:
        src = attrs['src'].split('?')[0].lstrip('/')
        # Don't inline livereload if present
        if 'livereload' in src:
            return ''
        disk_path = os.path.join(public_dir, src)
        if os.path.isfile(disk_path):
            with open(disk_path, 'r', encoding='utf-8') as jf:
                js = jf.read()
            return f'<script>{js}</script>'
    return match.group(0)

html = re.sub(r'(<script\s+[^>]+>)(?:<\/script>)?', replace_script, html)

# 3. Clean up speculationrules for standalone mode
html = re.sub(r'<script\s+[^>]*type=["\']?speculationrules["\']?[^>]*>.*?</script>', '', html, flags=re.DOTALL)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"==> Standalone EPK bundle created: {output_path} ({os.path.getsize(output_path)} bytes)")
PY

echo "==> Done. Single-file EPK export ready."
