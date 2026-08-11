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

## Design-identity decision (as of 2026-08-11)
User was asked: adopt the reference's visual identity (large serif display type, off-white
minimal palette) vs. keep the site's existing monospace identity and only borrow the
layout/motion *patterns*.

**Decision at the time: keep the current monospace identity.** Layout/motion patterns were
borrowed; typography and color palette were not changed.

**Status: this decision is being revisited** — user asked "can my portfolio match the whole
layout and the design of the reference site" in a later message, which may mean expanding
scope to also match the reference's visual identity. Needs explicit reconfirmation before
any typography/palette work starts, since it reverses the earlier explicit choice.

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

## Stack notes
- No framework, no build step — same as the rest of the site. GSAP + ScrollTrigger loaded via
  CDN `<script>` tags (`gsap.min.js`, `ScrollTrigger.min.js`), same complexity level as the
  pre-existing Font Awesome CDN link that was just removed.
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
