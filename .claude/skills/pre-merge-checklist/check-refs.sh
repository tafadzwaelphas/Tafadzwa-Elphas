#!/usr/bin/env bash
# Reference-integrity checks for the portfolio site:
#  - local src/href targets actually exist, with exact-case filenames
#    (macOS is case-insensitive; GitHub Pages' Linux server is not)
#  - no root-absolute paths that would 404 under the /Tafadzwa-Elphas/ subpath
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

issues=0

extract_refs() {
  for html in *.html; do
    grep -oE '(src|href)="[^"]*"' "$html" | sed -E 's/^(src|href)="//; s/"$//' \
      | sed "s|^|$html\t|"
  done
}

while IFS=$'\t' read -r html ref; do
  case "$ref" in
    http://*|https://*|//*|mailto:*|tel:*|data:*|"#"*|"") continue ;;
  esac
  clean="${ref%%#*}"; clean="${clean%%\?*}"
  [ -z "$clean" ] && continue

  if [[ "$clean" == /* ]]; then
    echo "ABSOLUTE  $html -> \"$ref\"  (will 404 under the /Tafadzwa-Elphas/ subpath — make it relative)"
    issues=$((issues+1))
    continue
  fi

  dir=$(dirname "$clean"); base=$(basename "$clean")
  if [ ! -d "$dir" ]; then
    echo "MISSING   $html -> \"$ref\"  (directory \"$dir\" doesn't exist)"
    issues=$((issues+1))
    continue
  fi
  if [ -z "$(find "$dir" -maxdepth 1 -name "$base")" ]; then
    echo "MISSING   $html -> \"$ref\"  (no exact-case match in $dir/)"
    issues=$((issues+1))
  fi
done < <(extract_refs)

if [ "$issues" -eq 0 ]; then
  echo "OK — all local src/href references resolve, exact case, no absolute paths."
else
  echo ""
  echo "$issues issue(s) found."
fi
exit "$issues"
