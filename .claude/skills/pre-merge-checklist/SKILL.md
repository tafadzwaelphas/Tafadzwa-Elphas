---
name: pre-merge-checklist
description: Run before merging Portfolio's dev branch into main. Checks broken/case-mismatched file references, root-absolute paths that 404 under the GitHub Pages subpath, leftover [Add ...] placeholders, and takes light/dark screenshots of every page for a visual check. Reports findings only — never merges, pushes, or edits files itself.
---

# Pre-merge checklist (Portfolio site)

Runs the checks that are tedious to do by hand before merging `dev` into `main`
on this repo. Read-only: it never merges, pushes, or edits files. It ends with
a report; the user decides whether to proceed with the merge.

## 1. Git state

```
git -C "<repo root>" status
git -C "<repo root>" branch --show-current
git -C "<repo root>" fetch origin
git -C "<repo root>" merge-base --is-ancestor main dev && echo "fast-forward OK"
```

- Expect current branch `dev`, clean working tree.
- If working tree isn't clean, or current branch isn't `dev`, stop and tell the
  user — don't guess what they want done with uncommitted work.
- If the fast-forward check fails (`main` has commits `dev` doesn't), flag it —
  this repo's workflow assumes `main` never diverges (see DESIGN.md /
  established git workflow). Don't attempt a merge yourself.

## 2. Reference integrity

Run the helper script:

```
"<repo root>/.claude/skills/pre-merge-checklist/check-refs.sh"
```

It checks every `src=`/`href=` in every `*.html` file against what's actually
on disk: exact-case filename match (macOS is case-insensitive; GitHub Pages'
Linux server is not — this is the single most common way a page works locally
and 404s in production), and no root-absolute paths (`/Images/...`) that would
break because the site is served from the `/Tafadzwa-Elphas/` subpath, not
site root. Non-zero exit means issues were found — list them in the report.

## 3. Placeholder / honesty audit

```
grep -no '\[Add [^]]*\]' *.html
```

This repo has a standing rule: never fabricate portfolio copy — real gaps get
left as `[Add ...]` placeholders instead (see DESIGN.md). This step doesn't
block a merge (placeholders are allowed to ship), it just surfaces what's
still outstanding so nothing gets missed silently. List file + line for each
hit.

## 4. Visual check (screenshots)

If Chrome browser tools aren't loaded yet, load them first:
`ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp")`

For every `*.html` file in the repo root (discover dynamically with `ls
*.html` — don't hardcode a page list, new project pages should get picked up
automatically):

1. Open `file://<repo root>/<page>.html` in a new tab.
2. Screenshot as-loaded (this is whatever theme `prefers-color-scheme` +
   localStorage currently resolve to).
3. Click the theme toggle (nav sun/moon icon, `Theme.js`) and screenshot again
   — this gives you the other theme.
4. Close the tab.

Save screenshots to the scratchpad directory under
`pre-merge-screenshots/<page>-<theme>.png` and reference the paths in the
report.

Known quirk (recorded in project memory): in this automation environment
`document.hidden` is true, which breaks scroll-driven animations, transitions,
and `getComputedStyle()` reads for dynamic classes — but painted pixels are
still correct. That's exactly why this step screenshots rather than
inspecting computed styles: trust the pixels.

## 5. Report

Summarize as a checklist:

```
Git state:        ✅ / ⚠️ <detail>
Reference check:   ✅ / ❌ <n> issue(s) — <summary or "none">
Placeholders:      ℹ️ <n> found — <summary or "none">
Screenshots:       <list of saved paths, or note if skipped>
```

End with: results only, no action taken — ask the user whether to proceed
with the merge (or fix issues first). Never run `git merge` or `git push` as
part of this skill, even if everything passes.
