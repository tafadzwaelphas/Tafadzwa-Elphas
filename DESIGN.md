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
- **Superseded again (commit `918ec19`)**: the dropdown above was itself replaced after a
  third reference screenshot showing the reference site's *plain, always-visible* nav list
  (no button, no box, no click). Current state: **there is no menu button anymore.** Nav links
  and socials render directly in the header at all times, top-left, muted grey with the
  active/current page in solid dark. `Menu.js` now only does active-page highlighting — the
  open/close/Escape logic is gone. Mobile has a near-invisible background chip on `.site-menu`
  (page-color at ~92% opacity) since the always-visible nav collides with the homepage's
  fixed-position home-hero-text/name-reveal scrolling underneath it at narrow widths; desktop
  has no such background, matching the reference screenshot exactly.

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

## Branch workflow (started 2026-08-11)
User asked for a review step before design changes reach `main`/the live site. Working
agreement: design work happens on a `dev` branch, reviewed **locally only** (no live preview
URL — GitHub Pages' Actions workflow only deploys on push to `main`, so `dev` alone has no
public URL without extra Pages/Actions setup, which wasn't wanted). Merge `dev` → `main` only
after the user has seen the local result and approved.

- **Menu: moved to top-right, scroll-responsive, glassmorphic (commit pending on `dev`)**:
  following a video of the reference site's fixed nav behavior, plus explicit answers to two
  clarifying questions (branch review = local-only; scroll behavior = "Stack → row on
  scroll"). `.site-menu` repositioned from `left` to `right: 1.5rem`, logo/nav/socials still
  render as a plain transparent vertical stack at the top of the page. `Menu.js` now also adds
  a scroll listener (threshold 24px) toggling a `.scrolled` class on `.site-menu`. When
  `.scrolled` is present, `Stylez.css` switches `.site-menu` and its inner `ul`s from
  `flex-direction: column` to `row`, and adds a glassmorphic pill: `backdrop-filter: blur(14px)`
  + `rgba(246,245,242,0.55)` background + soft shadow, all cross-faded via `transition`.
  Reverts automatically when scrolled back near the top. This also **replaced** the old
  mobile-only static background chip in `Responsive.css` (flat 92%-opacity color, no blur) —
  the new scroll-triggered glass effect covers the same legibility need (nav overlapping
  scrolled content) more elegantly on all screen sizes, so the static chip was removed and the
  mobile breakpoint now only adjusts position (`top`/`right` spacing).
  Files touched: `Stylez.css`, `Responsive.css`, `Menu.js`, cache-busting bumped `?v=1` → `?v=2`
  for all three across all 5 HTML pages.
- **Logo split out of the scroll-animated menu**: user noticed the logo was sliding around on
  scroll along with the nav — it used to live *inside* `.site-menu`, so it participated in the
  stack→row flex transform. Pulled it into its own standalone `.site-logo` element, fixed
  top-left, same `top` offset as `.site-menu` (top-right) so the two align as a header row.
  Logo no longer reacts to scroll at all. Markup changed identically across all 5 HTML pages
  (logo `<a>` moved from inside `.site-menu` to a sibling before it). Cache-busting bumped
  `Stylez.css`/`Responsive.css` `?v=2` → `?v=3`.

## Portfolio project slider (started 2026-08-11)
User wants the Portfolio page's multi-image projects restyled to match a reference-site detail
they inspected via DevTools: a full-bleed horizontal slider per case study, with the project
name in huge bold overlaid type, a slide counter ("01 / 09"), and prev/next controls. Requested
alongside a homepage "Recent projects" section (same treatment) and homepage "Services" section,
plus a mobile-friendly menu icon — being built in stages, this is stage 1.

- **New `.project-slider` component (commit pending on `dev`)**: replaces the old
  `.project-filmstrip` (plain horizontal-scroll thumbnail strip) for HandWing and EYEZWIDOPEN
  (the two multi-image projects — Fakugesi and FRGHN each have a single image and keep their
  existing `.poster-container` 2-column layout, since a slider doesn't apply to one image).
  Each slide is full-bleed (`height: 78vh`, `object-fit: cover`), with the project name overlaid
  bottom-left in Boldonse using the site's existing accent color (now tokenized as
  `--color-accent: rgb(0, 255, 213)`, previously only used inline for hover states), a
  glassmorphic slide counter top-left, and glassmorphic prev/next circular buttons bottom-right
  — reusing the blur/translucency language already established by the scroll-responsive nav.
  CSS scroll-snap (`scroll-snap-type: x mandatory`) drives the actual scrolling; a new
  `Slider.js` (`?v=1`) handles the counter text and prev/next button clicks via
  `track.scrollTo({ behavior: "smooth" })`.
  - **Debugging note**: while testing locally via browser automation, next/prev clicks appeared
    to silently do nothing. Traced it to the same root cause as the already-documented GSAP
    "stuck animation" non-issue below — `document.hidden = true` in the automated/backgrounded
    tab suppresses rAF-driven animations, and native smooth-scroll is apparently also
    rAF-driven, so `behavior: "smooth"` no-ops in that environment specifically. Confirmed the
    listener and target math are correct (`scrollTo` was called with the right arguments every
    time) and that `behavior: "instant"` works immediately in the same backgrounded tab — so
    this is an automation-only artifact, not a real bug. Works normally in a real, focused tab.
  - Removed the now-dead `.project-filmstrip`/`.project-filmstrip img` rules from `Stylez.css`
    and their `Responsive.css` breakpoint overrides, replaced with `.project-slide`/
    `.project-slide-title`/`.project-slider-counter`/`.project-slider-nav` responsive rules.
- Still to do: homepage "Recent projects" section (reusing `.project-slider`), homepage
  "Services" section, mobile-friendly menu icon (possibly reusing the homepage hero
  illustration). Single-image project sections (Fakugesi, FRGHN) left as-is for now.

## Hero spacing + mobile menu icon (commit pending on `dev`)
User reported (via screenshot at mobile width) that the "TAFADZWA / CHOGA" name-reveal text
overlapped the stacked nav list on narrow viewports, and asked for the menu to collapse into an
icon on scroll on mobile, reusing the homepage hero illustration (`Images/Number 7.png`, the
decorative staircase graphic — already hidden on mobile via the `sm` breakpoint, so reusing it
as a functional icon there doesn't compete with anything else).

- **Hero spacing fix**: `.name-reveal` gets `padding-top: 12rem` at the `sm` breakpoint
  (<576px), pushing the name text down clear of the (now taller, stacked) nav list.
- **Mobile menu icon**: added a `.site-menu-toggle` button (containing the hero illustration,
  `alt=""` since it's decorative-turned-functional with an `aria-label` on the button itself) as
  the first child of `.site-menu` on all 5 pages. Hidden by default (`display:none` in
  `Stylez.css`, unconditionally, so it never appears on desktop). At the `sm` breakpoint, once
  `.site-menu` has `.scrolled`, the nav/socials are hidden and the toggle icon shows instead —
  the existing glassmorphic pill background now just wraps a small icon instead of the full
  row-of-links transform (which doesn't fit a narrow screen anyway). Tapping the icon adds
  `.menu-open`, which re-shows the nav/socials as a right-aligned dropdown-style column below
  the icon. `Menu.js` now also resets `.menu-open` whenever the page scrolls back above the
  threshold, so it doesn't stay stuck open.
  - **Debugging note**: while testing locally, `window.scrollTo()` correctly updated
    `window.scrollY`, but the native `scroll` event never fired, so `.scrolled` never toggled
    automatically in that automated tab. Same root cause as the slider's smooth-scroll
    non-issue above — `document.hidden = true` in the backgrounded automation tab suppresses
    more than just rAF-driven animations, apparently including scroll event dispatch. Confirmed
    correct behavior by toggling the class manually and testing the icon/dropdown visually.
    Real, focused-tab users won't hit this.

## Stack notes
- No framework, no build step — same as the rest of the site. GSAP + ScrollTrigger and Google
  Fonts loaded via CDN `<script>`/`<link>` tags, same complexity level as the pre-existing
  Font Awesome CDN link that was removed this round.
- New files this round: `Menu.js`, `Reveal.js`, `DESIGN.md` (this file).
- **Cache-busting**: `Stylez.css`, `Responsive.css`, `Menu.js`, `Reveal.js`, and `Movement.js`
  are all referenced with a `?v=1` query string across all 5 pages. GitHub Pages doesn't send
  strong cache invalidation for static assets, so without this, browsers can keep serving a
  stale CSS/JS file after a deploy — this caused real confusion mid-session (a screenshot of
  a stale-cached nav looked like a live bug; a hard refresh proved the deployed code was
  already correct). **Bump the version number in all 5 HTML files whenever `Stylez.css`,
  `Responsive.css`, `Menu.js`, or `Reveal.js` changes** — a quick way is
  `perl -pi -e 's/\?v=1/\?v=2/g' *.html` (adjust the numbers each time).

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
