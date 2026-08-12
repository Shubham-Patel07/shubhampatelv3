#!/bin/bash
# Screenshot a route at several viewport widths, side by side.
#
#   ./scripts/responsive-shots.sh /projects out.png 390 768 1024
#
# Why the iframes: macOS clamps Chrome's minimum window width to ~500px, so
# `--window-size=390` silently lays out at 500 and merely CROPS the screenshot
# to 390. That fakes exactly the symptoms of a horizontal-overflow bug —
# clipped text, controls apparently missing — and sends you hunting for a bug
# that isn't there. Rendering the site inside a fixed-width iframe gives a
# genuine narrow layout viewport at any size.
#
# Needs `npm run dev` already running on :3000.
set -euo pipefail

PATH_="${1:-/}"
OUT="${2:-shots.png}"
shift 2 || true
WIDTHS=("$@")
[ ${#WIDTHS[@]} -eq 0 ] && WIDTHS=(390 768 1024)

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME"; exit 1; }

TMP="$(mktemp -d)"
H=900

{
  echo '<html><body style="margin:0;background:#222;font:11px monospace;color:#fff;display:flex;gap:10px;padding:10px">'
  for W in "${WIDTHS[@]}"; do
    echo "<div><div style=\"padding:3px\">${W}px</div><iframe src=\"http://localhost:3000${PATH_}\" style=\"width:${W}px;height:${H}px;border:1px solid #555;background:#000\"></iframe></div>"
  done
  echo '</body></html>'
} > "$TMP/harness.html"

TOTAL=0
for W in "${WIDTHS[@]}"; do TOTAL=$((TOTAL + W + 22)); done

# --headless=old ignores the macOS minimum-window clamp; the newer mode does not.
"$CHROME" --headless=old --no-sandbox --disable-gpu --hide-scrollbars \
  --virtual-time-budget=12000 --screenshot="$OUT" \
  --window-size=$((TOTAL + 30)),$((H + 60)) \
  --user-data-dir="$TMP/profile" "file://$TMP/harness.html" >/dev/null 2>&1 || true

rm -rf "$TMP"
echo "wrote $OUT"
