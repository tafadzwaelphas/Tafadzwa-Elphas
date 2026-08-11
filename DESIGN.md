# Design Refresh Tracking

Reference site: https://www.olivergareis.com/ (design inspiration only — no code, copy, or images copied from it)

## Reference site — what was liked
- Scroll animations on the homepage
- Overall layout
- How projects are displayed (per-project metadata + horizontal filmstrip of images)
- Slideshow-style animation on the landing/homepage (turned out to be a scroll-scrubbed big
  name-reveal typographic moment, not a traditional image carousel)
- The menu concept (fixed pill trigger + full-screen overlay) — but positioned **top-left**
  on both desktop and mobile, not bottom-center like the reference
- Footer design (reference footer was never actually seen — the site is ~17,000px tall with
  8 project case studies and heavy scroll-linked reveal animation, so it couldn't be reached
  via automated scrolling in a reasonable amount of time; the current footer is an original
  design, not a copy)

## Design-identity decision (resolved 2026-08-11)
User was asked twice: adopt the reference's visual identity (large serif display type,
off-white minimal palette) vs. keep the site's existing monospace identity and only borrow
the layout/motion *patterns*.

- First answer: keep monospace, patterns only.
- User then asked to "match the whole layout and the design" of the reference site, which
  reopened the question — re-asked explicitly, and the decision became: switch to the
  reference's visual identity. Implemented in commit `d67f4f5`: Playfair Display (serif)
  for headlines/big-statement text, Inter (sans-serif) for body/UI/nav, background lightened
  to `#f6f5f2`, text softened from pure black to `#1a1a1a`.
- **Superseded again in commit `9fb9805`** (Step 1 of the redesign-process plan below): user
  gave explicit font direction — primary heading font is now **Boldonse** (single weight 400,
  no italic face; https://fonts.google.com/specimen/Boldonse), body font is **Outfit**
  (variable weight 100–900; https://fonts.google.com/specimen/Outfit). Playfair Display/Inter
  are gone. Monospace is fully removed either way.

## Redesign process (started 2026-08-11, after feedback that changes were happening "too much
all at once")
Full plan lives at `/Users/linnet/.claude/plans/woolly-munching-squirrel.md` (5 steps: spacing/
type foundation → homepage intro sequence → Portfolio project section refinement → menu/footer
polish → cross-page consistency + final deploy). Working agreement: one step per commit,
tested and shown before moving to the next — do not chain multiple steps together.

- **Step 1 — done (commit `9fb9805`)**: added a shared spacing token scale (`--space-2xs`
  through `--space-xl`, plus `--space-page` for the recurring `6rem` horizontal margin) to
  `Stylez.css`, replacing scattered one-off `rem` values across `Stylez.css` and
  `Responsive.css`. Switched fonts to Boldonse/Outfit as described above, including removing
  the font-weight/italic overrides that were tuned for Playfair Display's multiple weights and
  real italic face — Boldonse has neither, so those became dead/wrong CSS if left in place.
- Steps 2–5: not started. See the plan file for scope of each.
- **Ad-hoc change outside the step sequence (commit `16b1ab7`)**: user gave a direct request
  with two reference screenshots — remove the "Hey, I'm Tafadzwa" homepage heading (redundant
  with the big scroll-reveal name below it), move the menu trigger left of the logo, reduce
  its corner radius from a full pill to 6px, and replace the full-screen dark menu overlay
  with a compact anchored dropdown (fixed ~230px width, opens downward, stacked rows with
  thin dividers) matching a screenshot of the reference site's own stacked nav-list styling.
  This touches the same files Step 4 (menu/footer polish) would have — when Step 4 comes up,
  check this is still what's there before assuming the old full-screen overlay design.

## Completed (commit 0d4f7af, pushed to origin/main)
1. **Menu component** — fixed top-left "Menu" pill, full-screen overlay (nav links + socials),
   active-page highlighting, Escape-to-close. Files: `Menu.js`, `.site-menu`/`.menu-overlay`
   rules in `Stylez.css`.
2. **Homepage scroll-scrubbed name reveal** — "TAFADZWA" / "CHOGA" fades in tied directly to
   scroll position via GSAP ScrollTrigger (`scrub: true`). File: `Reveal.js`,
   `.name-reveal-line` in `Stylez.css`, markup in `index.html`.
3. **Broad scroll-reveal** — fade+rise-on-scroll applied to major content blocks across all
   5 pages via a generic `.reveal` class (same `Reveal.js`).
4. **Portfolio.html restructure** — each project (HandWing, EYEZWIDOPEN, Fakugesi, FRGHN
   Music) now has a Year / Tags / Description metadata header (`.project-header`), and the
   image grids became horizontally scrollable filmstrips (`.project-filmstrip`) replacing the
   old CSS grid (`.image-grid`, now deleted as dead code).
   - Year/tags/descriptions were **drafted placeholders**, not client-provided facts — years
     were derived from actual file modification dates (a reasonable proxy, not fabricated),
     tags/descriptions are honest, minimal, non-promotional. Should be reviewed/edited by the
     user at some point.
5. **Footer redesign** — large closing statement ("Let's build something together."), email,
   plain-text social links, copyright. Font Awesome CDN dependency removed site-wide since
   nothing uses `.fa` icon classes anymore (nav and footer both switched to plain text links).

## Completed (commit d67f4f5, pushed to origin/main)
6. **Full visual identity switch** — see decision note above. Playfair Display serif for
   `h1`, `.name-reveal-line`, `.project-header-title`, `.site-footer-cta p`; Inter sans-serif
   for everything else (loaded via Google Fonts CDN, both files updated: `ital,wght` axis
   included for Playfair so real italics render, not synthetic-oblique). Background `#f6f5f2`,
   primary text `#1a1a1a`, muted greys warmed slightly (e.g. `rgb(112,106,98)`) to sit better
   against the warmer background. Also fixed a real pre-existing bug found while touching
   this: the background-color rule targeted `#body`, an id that doesn't exist anywhere in the
   HTML, so the intended background color had never actually been applying.

## Stack notes
- No framework, no build step — same as the rest of the site. GSAP + ScrollTrigger and Google
  Fonts loaded via CDN `<script>`/`<link>` tags, same complexity level as the pre-existing
  Font Awesome CDN link that was removed this round.
- New files this round: `Menu.js`, `Reveal.js`, `DESIGN.md` (this file).

## Known non-issues found during testing
- GSAP animations appear "stuck" mid-fade when checked via browser automation — this is
  `document.hidden = true` background-tab throttling in the automation environment, not a
  real bug. Confirmed fine for actual focused-tab users.
- Screenshot tool occasionally appears to reset scroll position mid-session — a recurring
  tool quirk unrelated to the site itself; re-scrolling resolves it.

## Repo / deploy
- Remote: `origin` → `https://github.com/tafadzwaelphas/Tafadzwa-Elphas.git`, branch `main`
- GitHub Pages: enabled, source = GitHub Actions, workflow `.github/workflows/static.yml`
- Live URL: https://tafadzwaelphas.github.io/Tafadzwa-Elphas/
- Local git identity for this repo: `Tafadzwa Elphas <tafadzwchoga@gmail.com>` (matches the
  tafadzwaelphas GitHub account, set locally not globally)
