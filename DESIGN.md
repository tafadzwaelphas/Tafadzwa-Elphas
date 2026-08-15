# Design Refresh Tracking

For the current design tokens (color/type/spacing/radius/motion) and documented component patterns, see **`DESIGN-SYSTEM.md`**. This file is the chronological log of how those decisions were reached — read `DESIGN-SYSTEM.md` first for "what is the system today," come here for "why is it this way."

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
- **Follow-up cleanup (commit pending on `dev`)**: user flagged (via screenshot) that the
  collapsed-icon state's glass pill background looked messy at small size, and the open dropdown
  inherited the base `.site-menu` pill shape (`border-radius: 999px`) stretched into a large,
  odd oval. Fixed: on mobile, `.site-menu.scrolled` (collapsed icon) now has no
  background/blur/shadow at all — just the plain icon, bumped from 32px to 56px so it reads
  clearly on its own. `.site-menu.scrolled.menu-open` (the open dropdown) gets its own explicit
  styling instead of inheriting the pill radius: `border-radius: 12px`, a solid
  near-opaque background (no blur), reading as a clean card rather than a blurry shape.

## Homepage "Recent Projects" + "Services" sections (commit pending on `dev`)
Final piece of the staged menu/slider/homepage request: a homepage section showcasing recent
work (reusing the `.project-slider` component built for the Portfolio page) and a Services
section.

- **Recent Projects**: reuses `.project-slider`/`Slider.js` unchanged, but with a different
  content shape — Portfolio.html's sliders show many images from *one* project (title stays
  fixed, only the counter changes), while this one shows *one representative image per project*
  across all 4 real projects (HandWing, EYEZWIDOPEN, Fakugesi, FRGHN), so the title needs to
  change per slide. Solved by nesting `.project-slide-title` *inside* each `.project-slide`
  instead of once outside the track — since it's `position: absolute` against the nearest
  positioned ancestor, this works with zero CSS or JS changes, just a different markup
  arrangement. Each slide is a full `<a>` (added `display:block` to the shared `.project-slide`
  rule to support this) linking to that project's section on the Portfolio page — added
  `id="handwing"`/`id="fakugesi"`/`id="eyezwidopen"`/`id="frghn"` anchors to the corresponding
  `.project-header` elements in `Portfolio.html` for this. A "View all →" link in the section
  heading points to `Portfolio.html`.
- **Services**: a plain bordered list, numbered, reusing the *actual* skills already listed on
  `Skills.html` (Multimedia Design, Motion Graphics, UX/UI, Digital Marketing) rather than
  inventing a services list like the reference site's — keeps the homepage honest and in sync
  with the real Skills page instead of introducing a second, different list of claims.
- New shared `.section-heading` pattern (h2 + optional right-aligned link) used by both new
  sections, reusable for future homepage sections.
- `index.html` now also loads `Slider.js` (previously Portfolio-page-only).

## Slider cover cleanup (commit pending on `dev`)
User compared our slider to the actual reference screenshot again (a project tile from
olivergareis.com) and pointed out two gaps: the reference image fits cleanly within its section
box, while ours looked oversized/cropped, and the reference tile has no big overlaid text at
all on the cover image.

- `.project-slide img` changed from `object-fit: cover` to `object-fit: contain` — previously,
  tall/square source images (product photos, square illustrations) got cropped and effectively
  zoomed-in to fill the fixed `78vh` slide height; `contain` shows the whole image, letterboxed
  against a new `background-color: #1a1a1a` on `.project-slide` instead of cropping.
- Removed `.project-slide-title` (the huge Boldonse overlay name) entirely — both its CSS rule
  and every instance of the markup, across the Portfolio page's two sliders and all 4 homepage
  Recent Projects slides. Counter and prev/next controls stay; the covers are now plain images,
  matching the reference tile's plain-image treatment.

## Slide letterbox color (commit pending on `dev`)
Follow-up to the slider cover cleanup above: `.project-slide` background changed from `#1a1a1a`
to `#f6f5f2` (the site's off-white, matching `body`) per direct request — the dark letterboxing
around contained images didn't read as intended.

## Client logos hidden (commit pending on `dev`)
User wants to provide updated client logos before this section goes live again — current ones
(HandWing, EYEZWIDOPEN, FRGHN, Design Lotus) are outdated/placeholder. Hidden via
`style="display: none;"` on the `.container` wrapper in `index.html` (not deleted) so it's a
one-line revert once new logos are ready — markup and `#client-logos` CSS untouched.

## Homepage section order swap (commit pending on `dev`)
Swapped the order of the `.banner` (HW Pattern decorative image) and `.about-home` (bio text)
sections in `index.html` — banner now comes first, bio text follows. No CSS/content changes.

## Bio section top padding fix (commit pending on `dev`)
User flagged excess whitespace above the bio text on the homepage, disproportionate to the side
padding. Cause: two stacking top offsets — `.about-home` had its own `padding-top: var(--space-lg)`
*and* its child `.about-home-text` had `padding-top: var(--space-page)`, plus a stray `<br>` right
after the text div opened, adding a third source of vertical gap. Removed `.about-home`'s
padding-top (the child's padding-top alone now matches the left/right/bottom padding exactly)
and removed the stray `<br>`.

## Mobile menu background glitch fix (commit pending on `dev`)
User flagged a background glitch on the mobile menu (screen recording). Root cause: `.site-menu`
carries a `transition: background-color, box-shadow, backdrop-filter` (0.4s each) meant for the
desktop scroll-to-row effect. On mobile, toggling `.scrolled`/`.menu-open` changes several other
properties that aren't animatable/transitioned (`padding`, `border-radius`, `flex-direction`) —
those snap instantly while background-color/box-shadow tried to fade over 0.4s, producing a
mismatched, glitchy-looking pop. Fixed by setting `transition: none` on `.site-menu` inside the
mobile breakpoint, so the icon/dropdown toggle snaps cleanly instead. Desktop's scroll transition
is untouched.

## Menu background glitch — desktop too (commit pending on `dev`)
The mobile-only fix above wasn't enough — user confirmed (screen recording) the same glitch on
desktop when scrolling fast: `flex-direction: column → row` snaps instantly (not animatable),
while `background-color`/`box-shadow`/`backdrop-filter` were fading over 0.4s, so a hard/fast
scroll made the mismatch visible. Removed the `transition` from the base `.site-menu` rule in
`Stylez.css` entirely, rather than special-casing it further — the whole scrolled-state change
(row layout + glass background) is now an instant snap on both desktop and mobile, no animation
to fall out of sync. Removed the now-redundant `transition: none` mobile override that was
layered on top of this in the previous fix.

## About page photo corners (commit pending on `dev`)
Removed `border-radius: 15px` from `.about-content .about-image` per direct request — square
corners on the About page profile photo instead of rounded.

## About page 4-column overview (commit pending on `dev`)
Replaced the dark "Adobe Illustrator / Photoshop / After Effects / Figma" tools bar on
`About.html` with a 4-column layout, following a screenshot of the reference site's
"Clients / Services / Work Experience / date-role timeline" section. New `.about-overview`
section, `About.html` only (Skills.html's own tools bar/`#skills` styling untouched — gave this
new section its own classes rather than reusing `#skills`/`.skills-container`).

- **Clients I've worked with**: HandWing, EYEZWIDOPEN, FRGHN Music, Design Lotus Boutique
  Studio, TMI Collective — drawn from the real bio text and the (currently hidden) client logos,
  not invented.
- **Services**: same real list as `Skills.html` (Multimedia Design, Motion Graphics, UX/UI,
  Digital Marketing).
- **Tools**: the exact same 4 tools that were in the bar being replaced (Adobe Illustrator,
  Photoshop, After Effects, Figma) — unchanged content, just restyled/relocated.
- **Experience**: two roles from the bio text (Creative Consultant & Business Partner at Design
  Lotus; Designer at TMI Collective, Cape Town) — the bio only gives relative timing ("recently",
  "one year ago"), not exact years, so dates are explicit `[Add dates]` placeholders rather than
  invented years. **User should fill these in.**
- Hit the same recurring `ul li { display: inline-block; line-height: 100px; }` legacy CSS trap
  documented earlier in this file (nav menu bug, twice) — third occurrence, same fix: explicit
  `display: block; line-height: normal;` on `.about-overview-col li`.

## Single-image projects moved to the slider treatment (commit pending on `dev`)
User compared a screenshot of the old Fakugesi 2-column `.poster-container` layout (image left,
caption text right, lots of empty space) against HandWing's slider layout and asked to match it.
Converted both single-image projects (Fakugesi, FRGHN) to the same `.project-slider` structure
used by HandWing/EYEZWIDOPEN: caption moved into a `.project-header-description` paragraph
(matching the other projects' pattern) above a single-slide `.project-slider`. No counter or
prev/next buttons on these — nothing to paginate with one image, and `Slider.js` already
no-ops gracefully when those elements aren't present (`querySelector` returns null, guarded by
`if (!counter) return` and `?.` on the buttons). Removed the now-fully-dead
`.poster-container`/`.fakugesi-poster` CSS (Stylez.css and its Responsive.css breakpoint
override) since no markup references them anymore. All 4 Portfolio projects now share one
consistent visual pattern.

## Project title font mismatch fix (commit pending on `dev`)
User noticed the Portfolio project heading fonts were inconsistent — HandWing/EYEZWIDOPEN
(Boldonse intended) actually rendered in Outfit, while Fakugesi/FRGHN rendered correctly. Root
cause: HandWing/EYEZWIDOPEN wrap their title text in an `<a>` (they link out to Instagram);
Fakugesi/FRGHN don't. The global `* { font-family: 'Outfit' }` rule matches every element
directly, including that nested `<a>` — and a direct match on an element always beats an
inherited value from a parent, regardless of the parent rule's specificity. So the `<a>` was
getting Outfit straight from the universal selector, overriding the Boldonse inherited from
`.project-header-title`. Fixed with `.project-header-title a { font-family: inherit; }`. Worth
remembering as a general gotcha in this codebase: any heading class wrapping a nested `<a>`
needs its own explicit `font-family: inherit` — inheritance doesn't reach through an element
the universal selector also matches.

## Clock moved from Portfolio to Contact (commit pending on `dev`)
User felt the analog clock at the bottom of the Portfolio page was orphaned — not tied to any
project, just interrupting the flow before the footer. Brainstormed a few directions; user
picked repurposing it as a "local time" indicator on the Contact page, next to the existing
address ("Cairo 1, Nile House, Madina, Accra Ghana" — already real content on that page, not
invented).

- Moved the `#clock` SVG markup from `Portfolio.html` to `Contact.html`, shrunk from the old
  full-`90vh` `.main`/`.clockbox` display down to a small 72×72px `.local-time-clock` widget
  next to a `.local-time-label` reading "Currently in Accra, Ghana". Removed the now-dead
  `.main`/`.clockbox, #clock { width: 100% }` CSS (the hand/face drawing rules like `.circle`,
  `.hour-arm` etc. are unchanged and reused as-is).
  - **`Movement.js` now shows Ghana time specifically, not the viewer's local time**: changed
    `getHours()`/`getMinutes()`/`getSeconds()` to their UTC equivalents, since Ghana is UTC+0
    year-round with no DST — otherwise a "Currently in Accra" label next to a clock showing the
    *visitor's* own local time would be misleading for anyone outside GMT+0.
  - `Movement.js` reference moved from `Portfolio.html`'s `<head>` to `Contact.html`'s;
    cache-busting bumped to `?v=2` since its logic changed.

## Skills page removed (commit pending on `dev`)
User flagged the standalone Skills page as redundant — its only content (Multimedia Design,
Motion Graphics, UX/UI, Digital Marketing) now also appears on the homepage's Services section
and the About page's 4-column overview, so the dedicated page was just repeating itself with a
lot of empty space around it. Deleted `Skills.html` and removed the "Skills" nav item from the
other 4 pages. Cleaned up now-fully-dead CSS: `#skills ul`/`#skills li`/`.skills-text`/
`.skills-container ul li:hover` in `Stylez.css`, and the matching `#skills li` /`.skills-text`
breakpoint overrides in `Responsive.css` (kept `.portfolio-text` where it was previously
grouped with `.skills-text` in a shared selector). No sitemap/robots.txt existed to update.
**Note**: if anything external links directly to `/Skills.html` (resume, LinkedIn, etc.), that
link will now 404 — worth checking.

## Hero image centering fix (commit pending on `dev`)
User flagged the homepage hero illustration (`Images/Number 7.png`) sitting right-of-center,
close to the nav, instead of centered. Cause: leftover 2-column grid (`.home-hero-text`) from
when the "Hey, I'm Tafadzwa" heading occupied column 1 (removed earlier this session, per the
"ad-hoc change" note further up this file) — the image was still explicitly pinned to
`grid-column: 2`, so with column 1 now empty it sat in the right half instead of centered on
the page. Removed the grid entirely (unnecessary now with only one child) and centered the
image directly with `margin-inline: auto` on the `img` itself, which works the same way
regardless of the parent's `display` mode — including the `md` breakpoint's `display: block`
override, no separate responsive fix needed.

## Code review pass before merge (commit pending on `dev`)
User asked for a review of the accumulated `dev` branch work before merging to `main`. Ran
`/code-review dev`; it surfaced 6 findings. Fixed the 3 real, currently-live bugs:

- **Mobile heading/nav overlap on About/Contact/Portfolio**: the `padding-top: 12rem` fix
  applied to `.name-reveal` earlier only covered the homepage — About.html, Contact.html, and
  Portfolio.html share the same fixed, background-less stacked nav (~228px tall unscrolled) but
  their headings only had `var(--space-md)` (48px) of clearance under 768px. Bumped
  `.about-content`/`.contact-content`/`.portfolio-text`'s existing md-breakpoint `padding-top`
  to the same `12rem`.
- **Slider counter/nav chip contrast**: after the slide background changed from dark to
  `#f6f5f2` (light), the counter/prev-next-button chips (`rgba(26,26,26,0.35)` bg + light text)
  went nearly illegible against letterboxed light backgrounds — increased opacity to `0.75` so
  the chip reads as solid-ish dark regardless of what's behind it.
- **`.about-overview` tablet width**: 4 columns collapsed to 1 under 768px but had no
  accommodation for 768–991.98px (a previously-empty breakpoint block) — added a 2-column
  override there.

Left 3 lower-priority code-quality nitpicks unaddressed (not real bugs, just DRY/robustness
suggestions): repeated frosted-glass panel declarations across 4 rules with no shared token,
`--color-accent` introduced without an equivalent token for the muted-gray color used
alongside it, and `Slider.js` not null-checking `.project-slider-track` before use. Can revisit
if it becomes annoying to maintain.

## Nav divider between links and socials (commit pending on `dev`)
Added a subtle vertical divider (`border-left: 1px solid rgba(26,26,26,0.15)` + small
padding-left) on `.site-menu.scrolled .site-nav-socials`, so the horizontal scrolled-state row
has a clear visual break between the page links (Home/About/Contact/Portfolio) and the social
links (LinkedIn/Behance/GitHub/Instagram) instead of relying on gap spacing alone. Scoped to the
scrolled row state only — doesn't apply to the default vertical stack, where a vertical divider
wouldn't make sense. Thickness bumped from 1px to 3px per direct follow-up request.

## Clock recolored to accent (commit pending on `dev`)
Changed the clock's face/marks/hands from plain black (`#000`) to `var(--color-accent)` (the
site's mint-teal accent) per direct request to use a color from the existing palette instead of
introducing a new one. Confirmed legible at the widget's actual small size (72×72px) on the
Contact page.

## Clock recolored again — dark fill, light details (commit pending on `dev`)
Follow-up to the accent-color clock change above: user asked for the face to be filled with the
darkest palette color (`#1a1a1a`) and the watch details (tick marks, hands, center dot) to match
the background color (`#f6f5f2`) instead — a photo-negative/inset look rather than an accent
outline. `.circle` now has both `fill` and `stroke` at `#1a1a1a` (reads as one solid disc, no
visible seam at the edge); `.mid-circle`/`.hour-marks`/`.hour-arm`/`.minute-arm`/`.second-arm`
all switched to `#f6f5f2`.

## Clock sized up 2x (commit pending on `dev`)
`.local-time-clock` doubled from 72×72px to 144×144px per direct request.

## More HandWing project images (commit pending on `dev`)
User provided 5 new real HandWing brand assets (dropped into `Images/` directly): a cover shot
(logotype over a flock of birds), a dark cover with the logo mark, a custom typeface specimen,
a brand color palette, and tote bag mockups. Two arrived at 8K resolution (26.7MB and 17.8MB) —
resized both down to 2400px on the long edge and converted to JPEG (quality 85) since they're
photographic, cutting them to ~650KB and ~265KB; a third (the font specimen, flat graphic
content) was resized the same way but kept as PNG to preserve crisp text edges, down from 2.9MB
to ~634KB. Originals deleted after resizing, not kept alongside.

Added all 5 to the HandWing `.project-slider` on `Portfolio.html`: the cover shot as the new
opening slide, the other 4 appended at the end. Slide count went from 9 to 14; counter text
updated from "01 / 09" to "01 / 14". No CSS/JS changes needed — `Slider.js` already computes
slide count from the DOM.

## Slider hover controls, glass restyle, auto-slide (commit pending on `dev`)
Three related changes to `.project-slider` per direct request:

- **Hover-only counter/nav**: `.project-slider-counter`/`.project-slider-nav` now default to
  `opacity: 0`, fading to `1` on `.project-slider:hover` — hidden by default instead of always
  showing, so the image reads clean until the visitor interacts.
- **Glass restyle matching the menu**: replaced the solid dark chip (from the earlier contrast
  fix) with the exact same glass treatment as `.site-menu.scrolled` — light translucent
  background (`rgba(246,245,242,0.55)`), `backdrop-filter: blur(14px)`, dark
  `rgba(26,26,26,0.55)` text/icon color, matching box-shadow. Since it's hover-only now (not
  always-on), the light-on-light contrast risk the earlier fix addressed applies less — a
  visitor hovering is already looking directly at that spot.
- **Auto-slide**: `Slider.js` now advances every 4s automatically (wrapping back to slide 0
  after the last one), pausing on `mouseenter` and resuming on `mouseleave` — pairs naturally
  with the hover-reveal above (hovering both shows the controls and stops the slide from moving
  underneath you). Skipped for single-image sliders (Fakugesi, FRGHN) via a `slides.length <= 1`
  guard, avoiding a pointless interval.

## New project: CoEdu (commit pending on `dev`)
User dropped 4 new brand-identity images into `Images/` for a new project, CoEdu — a cover
shot, a logo-variations sheet, a typeface-pairing specimen (Kumbh Sans + Montserrat), and a
color palette. All 4 arrived at 8K resolution (7680×4320); resized to 2400px on the long edge,
kept as PNG (flat graphic/text content, not photography).

Added as a new 5th project section on `Portfolio.html` (after FRGHN), following the same
`.project-header` + `.project-header-description` + `.project-slider` pattern as the other 4:
- **Title/tags**: "CoEdu", tagged Branding / Logo Design / Typography — grounded in what the
  asset sheets actually show (the logo sheet's tagline "Knowledge Distribution" confirms what
  the brand is; no separate written brief was provided).
- **Description**: "Brand identity for CoEdu, a knowledge distribution platform — logo design,
  color system, and typography" — describes only what's visible in the provided assets.
- **Year**: explicit `[Add year]` placeholder, same convention as the About page Experience
  entries — no date signal exists for this project (the image files were uploaded today, which
  isn't evidence of when the actual design work happened). **User should fill this in.**
- Added `id="coedu"` anchor (consistent with the other projects) and included CoEdu in the
  page's `<meta description>` list of projects.

**Follow-up**: year confirmed as 2024, updated on `Portfolio.html`. Also added CoEdu as a 5th
slide to the homepage `.recent-projects` slider (`index.html`), linking to `Portfolio.html#coedu`
using the cover image — counter bumped from "01 / 04" to "01 / 05".

## More HandWing assets, reordered (commit pending on `dev`)
User dropped 9 more real HandWing assets into `Images/`: app icon mockup, building sign
mockup, a logo-variations sheet (confirms real tagline "Culture In Motion" and "Founded In
2020"), a second tote photo, umbrella mockups, a white-tee photo, and 3 animated logotype GIFs
(a small grey loop, plus black/white versions of a larger wordmark animation).

- Resized/converted the static images (all 8K originals): opaque photographic mockups (App
  Mockup, Building Sign, Tote 3, White Tee) → JPEG; the logo sheet (flat graphic/text) → PNG;
  the umbrella mockup → PNG, since it's the one that actually has real transparency (verified
  via alpha-channel check, not just RGBA mode — the others were RGBA but fully opaque, no need
  to preserve a channel that wasn't doing anything). GIFs left untouched — already reasonably
  sized (810KB/1MB/84KB) and animated-GIF resizing risks breaking frame timing.
  - Checked GIF content by extracting frames with Pillow before deciding treatment: the "White
    Animated" version's wordmark renders in pure white (`254,254,254`), which is invisible
    against the slider's default light `#f6f5f2` slide background — confirms why a dark backdrop
    was requested.
- **Reordered the full 23-slide HandWing sequence** (14 existing + 9 new) into a clearer
  narrative rather than just appending: cover → core product shots (unchanged from before) →
  apparel/lifestyle photography (white tee, tote-worn photo, tote mockups, umbrella) → applied/
  digital (app icon, building sign) → brand system reference (dark logo cover, logo-variations
  sheet, type specimen, color palette) → motion as a closing flourish (small loop, then the two
  larger animated wordmarks). Counter bumped "01 / 14" → "01 / 23".
- **Dark background for the 2 larger animated GIFs**: new `.project-slide--dark` modifier
  (`background-color: rgba(26, 26, 26, 0.75)`, matching the exact "dark colour, 75% opacity"
  requested) applied to both the black and white animated wordmark slides — requested as a pair
  for visual consistency between them, even though technically only the white version strictly
  needs a dark backdrop to be visible.
- **Unrelated but necessary fix caught along the way**: `HW Icon 2.png` (used in the HandWing
  slider and the hidden homepage client-logos strip) had been deleted from disk and replaced
  with a new `HW ICON Profile.png` — a 12000×12000px (144MP) profile-style icon on a dark
  background. Both references would have 404'd. Resized to 1200×1200 and converted to JPEG
  (fully opaque, no real transparency to preserve) as `HW ICON Profile.jpg`, updated both
  references. Confirmed via a full image-load check afterward: 40 images on the Portfolio page,
  0 broken.

## CoEdu product mockups added (commit pending on `dev`)
User confirmed adding the 7 new CoEdu files noticed earlier. Added 6 of them: a landing-page
laptop mockup, two distinct desktop-workspace mockups (dashboard UI + marketing site — not
duplicates despite the similar "_2x" naming, confirmed by actually comparing them), mobile
homepage, mobile nav menu (phone in hand), and a t-shirt mockup. All resized from originals up
to 12000×8000 down to 2400px long edge; converted to JPEG except the t-shirt mockup (real
alpha transparency, kept PNG).

**Held back the 7th file** (`CoEdu Business Cards II_2x.png`) — it shows a real person's name,
personal cell number, and personal Gmail address (Courtney Letsa, apparently CoEdu's
co-founder/CEO), not just the logo. Flagged to the user rather than publishing a third party's
personal contact details on a public site without confirming first.

Since the new mockups reveal CoEdu is a real product (web + mobile app, not just a static
identity), updated the project tags from "Branding / Logo Design / Typography" to
"Branding / UI/UX Design / Web Design" and expanded the description to mention web/app UI.
Counter bumped "01 / 04" → "01 / 10".

## Videos folded into the slider, GIF dark background removed (commit pending on `dev`)
User flagged the separate `.handwing-video-grid` (3 raw, unstyled native `<video>` elements in
a plain 3-column grid, right after the polished slider) as visually out of place — nothing else
on the page uses unstyled native controls. Removed that section entirely and moved the 3
videos into the main HandWing `.project-slider` as regular slides (inserted after the original
image content, before the newer apparel photography additions), reusing the exact same
full-bleed/hover-controls treatment as every other slide. Added `.project-slide video` to the
existing `.project-slide img` sizing rule so both share identical `object-fit: contain`
behavior. Removed the now-fully-dead `.handwing-video-grid` CSS. Slide count 23 → 26.

Also removed the `.project-slide--dark` dark-background modifier from the two animated GIF
slides per follow-up request, reverting them to the same default `#f6f5f2` background as every
other slide, and deleted the now-unused CSS rule. **Note**: the White Animated GIF's wordmark
renders in pure white — without a dark backdrop it'll be effectively invisible against the
light slide background. Didn't restore it since removal was explicitly requested, but flagging
in case that wasn't intentional.

**Unrelated fix caught along the way**: `EWO LOGO BLCK.png` (EYEZWIDOPEN slider + hidden
client-logos strip) had also gone missing from disk, this time with no replacement file
anywhere — looked like an accidental deletion rather than a swap. Restored it from git history
(`git checkout HEAD --`) rather than editing around the gap. Confirmed via a full image-load
check: 46 images on the Portfolio page, 0 broken.

## Correction: EWO LOGO BLCK.png removal was intentional (commit pending on `dev`)
Last entry's "accidental deletion, restored from git history" call was wrong — user confirmed
they'd deliberately removed this file. Re-deleted it and this time removed the references
instead of the asset: dropped its slide from the EYEZWIDOPEN slider (9 → 8 slides, counter
updated) and its `<img>` from the hidden homepage client-logos strip. Confirmed via a full
image-load check: 45 images on the Portfolio page, 0 broken.

**Lesson for next time**: when a tracked file goes missing with no obvious replacement, ask
before restoring rather than assuming it's accidental — a deliberate removal and an accidental
one look identical from git's perspective alone.

## CoEdu added to About page clients list (commit pending on `dev`)
Added "CoEdu" to the `.about-overview` "Clients I've worked with" column on `About.html` — it
had been missing since that list was written before CoEdu existed as a project. Same treatment
as HandWing/EYEZWIDOPEN/FRGHN Music already in that list (own creative/project work, not
necessarily a paying-client relationship, listed the same way).

## Footer CTA de-emphasized (commit pending on `dev`)
"Let's build something together." was too visually loud relative to the rest of the site —
reduced `.site-footer-cta p` from `clamp(28px, 5vw, 56px)` pure-ink `#1a1a1a` down to
`clamp(22px, 3vw, 36px)` in the muted grey `rgb(112, 106, 98)` already used for secondary text
elsewhere. Kept the Boldonse font for brand consistency with other headings — dialed back size
and contrast instead of swapping fonts.

## Clock divider + hover effect (commit pending on `dev`)
Added a 2px top border to `.local-time` (`rgba(26,26,26,0.15)`, matching the tone used for the
nav divider and the About-page overview list dividers) to visually separate the address copy
from the clock widget. Added a hover effect matching the site's established accent-color hover
pattern (used on nav links, footer links, services list, slider buttons): the clock face
(`.circle`) transitions from `#1a1a1a` to `var(--color-accent)` on hover, with the light
`#f6f5f2` hands/marks staying as-is (still reads clearly against the mint background).

## Clock hover: dark details + border (commit pending on `dev`)
Follow-up to the clock hover effect above: hands (hour/minute/second), tick marks, and the
center dot now switch to `#1a1a1a` on hover too (were staying light `#f6f5f2`, which read as
low-contrast against the new mint face). Also gave the circle a visible dark border on hover
(`stroke: #1a1a1a`, `stroke-width` bumped from 9 to 12) instead of the accent-colored stroke
that blended into the accent fill. Net effect: default state is dark-fill/light-details, hover
state cleanly flips to mint-fill/dark-details with a defined edge.

## Line-width consistency + footer color inversion (commit pending on `dev`)
Three changes:

- **Clock hover border → true 2px**: previous `stroke-width: 12` was in SVG user units, not
  screen pixels — on the clock's 144px-displayed/600-viewBox SVG (scale 0.24), 12 user units
  rendered as ~2.88px, not 12px and not quite 2px either. Computed the correct value:
  `2px ÷ 0.24 scale = 8.33` user units, confirmed via `getBoundingClientRect`/`viewBox` math
  that this renders at exactly ~2px on screen.
- **Nav divider 3px → 2px**: brought back down from the earlier explicit "thicker" request to
  match the site's now-established 2px standard (local-time divider, clock hover border) for
  cross-site consistency.
- **Footer color inversion at the bottom of the page**: `.site-footer` now gets an `.inverted`
  class (dark `#1a1a1a` background, light text/links) via `IntersectionObserver` in `Menu.js`
  watching the footer element (threshold 0.3) — toggles on when docked at the bottom, off when
  scrolled away. All footer text/link colors got `transition: color 0.4s ease` (background
  already had a transition) so the swap fades rather than snaps.
  - **Debugging note**: same automation-tab quirk as before — `IntersectionObserver` callbacks
    also don't fire in the backgrounded test tab (`document.hidden = true`), even though the
    footer was ~97% visible in viewport. Confirmed correct behavior by toggling `.inverted`
    manually and verifying computed styles + a transition-disabled screenshot. Works normally
    for real, focused-tab users.

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

## Clock spacing + footer transition smoothing
- **Contact page clock**: `.local-time` (the row holding the clock + "Currently in Accra"
  label) had no bottom padding, so on shorter viewports it butted directly against the footer
  with no breathing room. Added `padding-bottom: var(--space-lg)`.
- **Footer dock/inversion feel**: the background-color and text-color transitions on
  `.site-footer` and its children were `0.4s ease` — flagged as feeling abrupt. Lengthened to
  `0.7s cubic-bezier(0.4, 0, 0.2, 1)` (ease-out-ish, no linear-feeling snap) across all of it.
  Also gave the `IntersectionObserver` in `Menu.js` a `rootMargin: "0px 0px -10% 0px"` and
  dropped the threshold to `0.1` so the `.inverted` toggle fires a bit before the footer is
  fully flush with the viewport bottom, giving the longer fade room to finish by the time it's
  fully docked instead of starting right at the boundary.
- Verified via a local `python3 -m http.server` preview (not `file://`, which the browser
  automation tool can't navigate to) — checked computed styles directly rather than relying on
  scroll-triggered `IntersectionObserver` firing, since that still doesn't fire in the
  backgrounded automation tab (see the known quirk below).

## Footer CTA color (reverted an earlier decision)
"Let's build something together." (`.site-footer-cta p`) previously had its own muted grey
(`rgb(112, 106, 98)` light-mode / `rgb(160, 156, 150)` inverted) distinct from the nav/email
links. Reverted per request: it now shares the exact link color rule
(`.site-footer-cta p, .site-footer-cta a, .site-footer-links a` all `#1a1a1a` light-mode /
`#f6f5f2` inverted) instead of its own separate color declaration. Copy itself was reviewed for
on-brand tone (options offered: craft-forward, motion/culture-forward echoing HandWing's own
"Culture In Motion" tagline) — user chose to keep the existing line as-is.
- Verified the same way as above: since CSS transitions stick mid-fade in the backgrounded
  automation tab, temporarily set `transition: none` on the footer + its text elements to
  bypass that and confirm the underlying `.inverted` color rule is correct, rather than trying
  to catch it via a real scroll/observer trigger.

## Mobile open-menu divider (was a leftover vertical line)
The divider between the nav links (Home/About/Contact/Portfolio) and social links
(LinkedIn/Behance/GitHub/Instagram) in the mobile dropdown card was a `border-left` inherited
unchanged from the desktop scrolled-pill layout, where nav and socials sit side by side
horizontally. In the mobile card the two lists stack vertically instead, and since each list
is its own right-aligned, shrink-to-fit flex box, the vertical line ended up floating near
the nav column's width rather than tracking the (narrower) socials text below it — it read as
misplaced, cutting across "Portfolio"/"Contact" instead of sitting next to "Instagram" etc.
Fixed in the `max-width: 575.98px` block in `Responsive.css`: `.site-menu.scrolled.menu-open
.site-nav-socials` now overrides the divider to a full-width `border-top` (`align-self:
stretch` so it spans the card) instead of the desktop `border-left`, matching the same
horizontal-divider-for-stacked-content pattern already used on the Contact page's clock.
- **Testing note**: manually toggling `.scrolled`/`.menu-open` via JS gets undone by Menu.js's
  own scroll listener (`setScrolledState` re-evaluates `scrollY` and strips the classes if
  below the 24px threshold) — real repro needs an actual `window.scrollTo` past the threshold
  first, then the menu-toggle click, done without any scroll afterward. Also hit a stale-bfcache
  issue where re-navigating to the same local-server URL kept serving the pre-edit page/CSS
  despite the bumped `?v=` — a real `location.reload()` was needed to pick up the change.

## Bottom-edge scroll glitch on project sliders: tried, then removed
Tried a chromatic-aberration/blur "glitch" on the project sliders as you scroll past them,
inspired by a reference the user shared (gionatannese.com/projects), scoped to only the bottom
edge of the viewport per their request. First pass (SVG filter isolating R/G/B channels,
`feBlend mode="screen"`) had real bugs on a real focused tab — it glitched the slide counter/nav
UI text along with the artwork, and produced hard neon color bars at the box edges instead of a
soft fringe. Fixed both (retargeted the filter to just the image track, redesigned the filter to
keep the sharp original as a base layer with a faint ghost on top) — but after seeing the fixed
version, the user decided they didn't want the effect on the site at all and asked for it to be
removed outright. Reverted completely: deleted `EdgeGlitch.js`, removed its `<script>` tag from
`index.html` and `Portfolio.html`. No trace of it remains in the shipped site.
- **Worth remembering**: this user is willing to greenlight an experimental/riskier visual
  effect (unlike the earlier content-honesty caution, this was purely a stylistic call), but
  also willing to cut it entirely once tried rather than settle for "fixed but not loved" —
  don't read the earlier "yes let's go with it" as durable buy-in for effects in this vein.

## Footer scroll-blur (new file: `ScrollBlur.js`)
Requested after the user shared two more screen recordings of gustaffurusten.se, pinned down on
the second one: while scrolling, the footer copy (heading, contact list, TIME/DATE readout,
copyright) gets a **directional** motion blur — vertical only, matching the scroll axis — that
sharpens back to crisp the instant scrolling stops. Much simpler than the earlier
chromatic-aberration attempt (no channel isolation, no color blending, just a blur), so lower
risk of the hard-edge-artifact class of bug that sank that one.
- `ScrollBlur.js` is a small reusable pattern, not footer-specific: it finds every element
  with a `data-scroll-blur` attribute and applies one **shared** SVG filter (`feGaussianBlur`
  with `stdDeviation="0 Y"` — 0 horizontal, Y vertical) to all of them via `filter:
  url(#scroll-blur)`. A single shared filter is safe here (unlike the per-slider case in
  `EdgeGlitch.js`) because intensity only ever depends on global scroll velocity, not each
  element's individual position — there's no scenario where two `data-scroll-blur` elements
  need different amounts at once. Currently applied to `.site-footer` (via the `data-scroll-blur`
  attribute directly on the `<footer>`) on all 4 pages, but the pattern is reusable for any
  future element by just adding the attribute — no per-instance JS needed.
- Velocity → blur mapping and the decay-to-zero curve reuse the same scheme as the removed
  glitch effect (0.85×/frame decay via `requestAnimationFrame`), but there's no `filter: ""`
  on/off toggle needed this time — `stdDeviation="0 0"` is a genuine no-op blur, so the element
  is provably identical to unfiltered at rest without needing the extra safeguard the color
  version required.
- Respects `prefers-reduced-motion: reduce`.
- **Testing note**: same `requestAnimationFrame`-throttled-in-`document.hidden` situation as
  before, but this time it wasn't fully suppressed — a manually-set `stdDeviation` value kept
  getting reset back to `"0 0"` a second or two after being set, which briefly looked like a
  bug. It wasn't: background-tab rAF is throttled to roughly once/second rather than fully
  blocked, so the live script's own `tick()` was genuinely still running (just slowly), saw the
  real internal `velocity` had already decayed near zero (since the manual DOM edit doesn't
  touch that closured variable), and correctly zeroed the blur back out — which is actually
  proof the "returns to sharp at rest" behavior works. To get a stable screenshot, patched
  `window.requestAnimationFrame = () => {}` first so the loop couldn't fire and overwrite the
  test value, then set `stdDeviation="0 6"` and screenshotted a footer heading — clean vertical
  streaking, no horizontal smear, matching the reference exactly.

## Footer scroll-blur: fixed a real velocity bug
The user reported the effect wasn't showing on their real machine. Root cause found on review:
`ScrollBlur.js` originally computed velocity from the delta between consecutive `scroll`
*events*, but that was only ever tested with a single artificial 800px `scrollTo()` jump — not
representative of real trackpad/mouse-wheel scrolling, which dispatches `scroll` events far more
frequently with much smaller per-event deltas. In real use the velocity number likely never
came close to the tuned threshold, leaving the blur firing at a near-invisible intensity rather
than literally never firing.
- **Fix**: switched from event-delta velocity to continuous per-frame position sampling — a
  `requestAnimationFrame` loop that runs for the page's lifetime, reads `window.scrollY` each
  frame, and diffs it against the previous frame's value. This is independent of how finely (or
  coarsely) the browser happens to dispatch `scroll` events, which is the more standard and
  robust way to drive a scroll-velocity effect. Also switched the decay formula to `currentBlur
  = max(targetBlur, currentBlur * DECAY)` so a fresh burst of movement can jump the blur back up
  immediately rather than fighting the previous frame's decay.
- **Honesty about test coverage**: this fix could not be validated against genuine trackpad/
  mouse-wheel scroll physics from the automation environment — there's no way to simulate real
  momentum-scroll event timing here, only single artificial jumps. Confirmed the filter wiring
  and at-rest no-op state still work post-rewrite, but the actual velocity-to-blur feel in real
  use needs the user's own eyes on their real machine.

## Footer scroll-blur: still not right — root cause was the scroll physics itself
User reported (again) it still wasn't the effect they were after, but this time opened Chrome
DevTools on the reference site (gustaffurusten.se) and inspected it directly rather than just
recording it. Found the real answer: the site is built in Framer, and its `<html>` tag carries
`class="lenis lenis-smooth"` — it uses **[Lenis](https://lenis.darkroom.engineering/)**, a
smooth-scroll library that replaces native scrolling with eased, inertial virtual scrolling and
exposes its own continuously-smoothed velocity value. That's the actual gap: every previous
attempt computed "velocity" from raw native `scrollY`/`scroll`-event data, which is fundamentally
jittery — no amount of constant-tuning was going to fix that, since the input signal itself was
noisy, not just mis-scaled.

**Decision**: confirmed with the user before proceeding, since this is a bigger change than a
CSS/JS tweak — added Lenis as a real dependency (previously the site had none beyond GSAP/
ScrollTrigger). This changes how scrolling *feels* site-wide (smooth/inertial instead of native),
not just the footer blur.
- Added via CDN (`https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js`, no `defer` —
  loads synchronously before the deferred local scripts, matching how GSAP/ScrollTrigger are
  already loaded) to all 4 pages.
- New file `Lenis.js`: initializes `new Lenis()`, and wires the official Lenis+GSAP sync recipe
  (`lenis.on("scroll", ScrollTrigger.update)`, drives `lenis.raf()` off `gsap.ticker` instead of
  a separate rAF loop, `gsap.ticker.lagSmoothing(0)`) so ScrollTrigger-based animations
  (`Reveal.js`'s `.reveal` fade-ins, the homepage name-reveal scrub) stay in sync with Lenis's
  virtual scroll position instead of drifting. Exposes the instance as `window.lenis` for other
  scripts to hook into. Script order: GSAP → ScrollTrigger → Lenis (CDN) → `Reveal.js` →
  `Lenis.js` → `Menu.js` → `ScrollBlur.js` → page-specific scripts.
- `ScrollBlur.js` rewritten again: instead of its own rAF polling loop, it now does
  `window.lenis.on("scroll", ({ velocity }) => ...)`, reading Lenis's real smoothed velocity
  directly rather than computing anything itself. Simpler code, and — assuming Lenis's own
  easing is doing its job — should no longer need the manual decay logic at all, since Lenis's
  velocity naturally eases toward 0 as the virtual scroll settles.
- **Real regression caught and fixed before it shipped**: Lenis does **not** dispatch native
  `window` `scroll` events (confirmed directly — attached a native listener, drove scroll via
  `lenis.scrollTo()`, listener never fired even though `window.scrollY` updated correctly).
  `Menu.js`'s nav-pill "scrolled" state was built entirely on a native `window.addEventListener
  ("scroll", ...)` listener, so without a fix it would have silently stopped responding to
  scroll site-wide the moment Lenis shipped — the pill would never leave its unscrolled resting
  state. Fixed by making `Menu.js` use `window.lenis.on("scroll", setScrolledState)` when Lenis
  is present (falling back to the native listener otherwise). Verified both directions
  (`scrollTo(300)` → `.scrolled` true, `scrollTo(0)` → false) after the fix.
- **Checked for other native-scroll dependents before considering this done**: `Slider.js`
  listens for `scroll` on `.project-slider-track` (each project slider's own horizontally-
  scrolling element), not `window` — Lenis only wraps window/document scroll by default, so this
  is unaffected and needed no change. The footer's `IntersectionObserver`-based color-inversion
  in `Menu.js` doesn't depend on scroll events at all (fires on real intersection regardless of
  how scroll happened), also unaffected.
- **Testing limits, stated plainly**: confirmed structurally that (1) Lenis initializes and
  actually controls real scroll position, (2) GSAP ScrollTrigger stays correctly synced to it
  (checked a trigger's live `.progress`/`.isActive` state directly rather than trusting visual
  opacity, since GSAP tween *rendering* is subject to the same document.hidden throttling as
  always — the trigger tracking itself was confirmed accurate), (3) the Menu.js fix works in
  both directions. Could **not** verify the blur's actual feel: manually calling
  `lenis.emit("scroll", {velocity: N})` to fake a value doesn't work — confirmed Lenis ignores
  the payload and always passes its live instance (real velocity, which sits at 0 when nothing
  is animating) to listeners, so there's no way to synthesize a fake velocity from outside
  Lenis's own animation loop, and that loop doesn't run in a backgrounded automation tab. This
  is now the third attempt at this specific effect — if it's still not right, the honest next
  move is a real conversation about whether to keep iterating or drop it, not a fourth blind
  guess.

## HUD hover style for links/buttons (new reusable class: `.link-hud`)
Follow-up to the earlier reference-video conversation about the "SHOW CASE" bracket-button
hover on gustaffurusten.se. Decided against copying that literally (a split/slide-apart reveal
animation) given how the two more elaborate scroll effects this session went — kept it simple
and reliable instead: bracket corners (`[` `]`, built from `::before`/`::after` with the site's
existing 2px-border convention) that widen outward and switch to the mint accent color on hover.
- Where it's used: only the homepage "View all →" link (`.section-heading-link`) so far — that
  was a plain color-change link before and the clearest candidate. Deliberately **not** applied
  to the `.project-slider-nav` prev/next buttons, since those already have their own well-
  integrated glassmorphic circular hover treatment matching the nav pill; layering a second,
  different hover idiom onto them would read as inconsistent rather than additive.
  - Add `.link-hud` alongside any element's existing classes to apply it — no per-instance
    markup or JS needed, pure CSS.
- Verified visually: brackets render correctly at rest (`[ VIEW ALL → ]`) and on hover widen by
  5px and shift to `var(--color-accent)`, text color following via the link's own existing
  `:hover` rule.

## Known non-issues found during testing
- GSAP animations appear "stuck" mid-fade when checked via browser automation — this is
  `document.hidden = true` background-tab throttling in the automation environment, not a
  real bug. Confirmed fine for actual focused-tab users.
- Screenshot tool occasionally appears to reset scroll position mid-session — a recurring
  tool quirk unrelated to the site itself; re-scrolling resolves it.
- **New during the compass tool's dev (2026-08-13)**: `document.hidden = true` in this
  automation environment doesn't just throttle rAF/transitions/scroll — `getComputedStyle()`
  itself returned a stale value for a dynamically-added class (`.compass-needle-north`'s fill
  after adding `.is-live`), even confirmed via manual CSS-cascade/specificity analysis and an
  injected `!important` override rule that still didn't move the reported computed value. A
  screenshot of the actual painted pixels showed the color WAS correct. So: for anything
  involving a class/state change (not just animation), trust a screenshot/pixel check over
  `getComputedStyle` in this environment if the two disagree — don't assume `getComputedStyle`
  is automatically the more reliable of the two here, as earlier notes implied.
- Similar caching quirk (2026-08-13, footer scroll-blur removal): after editing `index.html`
  to drop `data-scroll-blur` from the footer, a browser tab that had loaded the page earlier
  in the same session still reported the old attribute/filter present via `getComputedStyle`
  — a plain `location.reload(true)` cleared it. Confirmed via `curl` that the server was
  already serving the corrected file; this was purely a browser-side cache artifact in the
  automation tab, not a real bug or a sign the edit hadn't taken effect.

## Footer scroll-blur: removed (2026-08-13)
User asked to remove the directional scroll-blur effect on the footer entirely (see "Footer
scroll-blur" and "Footer scroll-blur: fixed a real velocity bug" and "Footer scroll-blur:
still not right" sections above for its full history — three attempts to get the feel right,
Lenis added specifically to support it). Removed cleanly: `ScrollBlur.js` deleted, its
`<script>` tag and the `data-scroll-blur` attribute removed from the footer on all 5 pages
(`index.html`, `About.html`, `Contact.html`, `Portfolio.html`, `HandWing.html`). Lenis itself
was **not** removed — it also drives GSAP ScrollTrigger sync (`Reveal.js`'s `.reveal`
fade-ins, the homepage name-reveal scrub) and site-wide smooth scroll, unrelated to the blur
effect specifically.

## Performance cleanup pass (2026-08-13)
Follow-up to the SEO/accessibility audit — three independent pieces of work:
- **Deferred CDN scripts**: GSAP, ScrollTrigger, and Lenis `<script>` tags (previously
  synchronous, blocking parse) now load with `defer` on all 5 pages, matching the local
  scripts. Verified safe: `defer` scripts execute in document order, so GSAP/ScrollTrigger/
  Lenis still finish before `Reveal.js` (`gsap.registerPlugin(...)`) and `Lenis.js`
  (`new Lenis()`) run.
- **Re-exported oversized media**: 3 videos re-encoded via macOS `avconvert -p
  PresetMediumQuality` (`HandWing 2023 PWN .mp4` 13.8MB→1.0MB, `Plenty Wish In The See.mp4`
  3.2MB→0.87MB, `Hello.mp4` 436KB→157KB), visually verified via QuickLook thumbnails before
  replacing the originals. 4 PNGs converted to JPEG q88 via `sips` (`GREY.png`,
  `N03-White-front.png`, `N03-White-back (1).png`, `N03-Black-front.png` — 6.17MB→2.02MB
  combined), HTML references updated on `HandWing.html`/`Portfolio.html`, old PNGs deleted.
  `ARTCVRMDBE2.png` deliberately left as PNG — its fine paper-grain texture made JPEG larger
  or barely smaller with visible artifacting at both q88 and q75.
- **CSS cleanup** (see `DESIGN-SYSTEM.md`'s "Resolved inconsistencies" / "Removed dead code"
  sections for full detail): hairline-opacity and label-size tokens consolidated; `ol {}`
  deleted as genuinely dead; `ul li a {}` investigated and found to be the sole source of
  `.site-nav a`/`.site-nav-socials a`'s horizontal padding — moved that one property onto the
  specific selector before deleting the generic rule, rather than deleting it outright as
  originally assumed dead.

All changes verified locally (local server + browser): no console errors, GSAP/ScrollTrigger/
Lenis confirmed loaded and active despite `defer`, nav padding unchanged (`0px 20px`) after
the CSS move, hairline color renders correctly in both themes, new media files all serve 200.

## Contact page live radio widget (2026-08-13)
Added a 5th `.tool-item` to `Contact.html`'s tool row (`Radio.js`, new CSS in `Stylez.css`):
a genuinely live internet radio stream, not a looped playlist. Streams SomaFM's "Groove
Salad" (ambient/downtempo) via direct Icecast MP3 URL, verified reachable and CORS-open by
curling it directly before wiring it in. Click/Enter/Space toggles play/pause; label cycles
Live ambient radio → Connecting… → Groove Salad · Ambient · SomaFM, with a "Stream
unavailable" fallback on error.

Initially built reusing the clock/compass/sundial dial styling (circle + tick marks), then
redesigned on request to read as an actual player: tick marks removed, play/pause glyph
enlarged to fill the space, and a CSS-only expanding "on-air" pulse ring added around the
button while playing (`@keyframes radio-on-air` — the site's first keyframe animation).

Known limitation hit while testing: in the browser-automation tab, the live stream's
`readyState` stayed at 0 (no data) indefinitely after `play()` — confirmed via direct `curl`
that the stream itself works fine, so this is the same backgrounded-tab
(`document.hidden`/`visibilityState: hidden`) suppression noted elsewhere in this doc, not a
site bug. Real, focused-tab visitors aren't affected.

## FRGHN Music case study + player (2026-08-13)
Second individual project page (after `HandWing.html`), following the same template:
`FRGHN-Music.html`. Prompted by a client-scope correction — the existing Portfolio.html
section was titled "FRGHN Music — Madube," implying Madube was the whole project, when
Madube is actually just one release's cover art among the work done for the client FRGHN/
Foreighn. Title changed to plain "FRGHN Music" everywhere (Portfolio.html + new page) so
future covers for this artist have one place to live, and the second, previously-unused
Madube cover concept (`ARTCVRMDBE2.png` — already in `Images/`, was never wired into any
page) was added alongside the original (`MADUBEFNLCVR.jpg`) in both sliders.

Artist facts (bio, label, genre, release date) sourced from the artist's real Audiomack
profile (audiomack.com/foreighn97) rather than invented — confirmed via `WebFetch` and a
direct `curl` of the track page: Foreighn, Zambian/Zimbabwean Afrosounds artist, Zed Arts
Records, "Madube" released 2021-07-09. Matched against existing `Images/` filenames to check
for other unidentified FRGHN cover art before writing copy — none of Foreighn's actual track
titles (Katarina, Chair, Summer Nights, Grow Up, etc.) matched any other image filename in
the repo, so no other cover art exists for this client yet; nothing invented.

Added a "Listen" section with a real embedded player for "Madube" — found the correct embed
URL the honest way (queried Audiomack's public oEmbed endpoint,
`creators.audiomack.com/oembed?url=...`, rather than guessing the iframe path) and confirmed
it via oEmbed's returned `html`: `https://audiomack.com/embed/song/foreighn97/madube`.
Verified functional by opening that URL directly in a browser tab (waveform, play button,
correct 2:42 duration) — separately, the iframe rendered blank when embedded inside
`FRGHN-Music.html` in the automation test tab, same backgrounded-tab cause as the Contact
radio widget above, not a real embedding problem.

`.case-study-workflow` gained an `.is-two-col` modifier (`grid-template-columns:
repeat(2, 1fr)`) for FRGHN's 2 real tags (Cover Art, Music) — HandWing's original 3-column
version is untouched and used for its own real 3 tags.

## Docked radio mini-player (2026-08-13)
Follow-up to the Contact page radio widget above: pressing play on Contact used to stop the
moment the visitor navigated to any other page, since this is a plain multi-page site (real
navigations, not client-side routing) and a page load always tears down the `<audio>` element.
Discussed two ways to fix this with the user — true client-side routing (gapless, but a
site-wide architecture change) vs. a lighter persistent-state approach — and went with the
latter on their choice.

`Radio.js` now drives up to two controls off one shared state machine: the existing full-size
`#radio-widget` on Contact, and a new small floating `#radio-dock` pill (`.radio-dock`,
bottom-left, reuses `.tool-radio`'s icon/pulse CSS at 48px rather than duplicating it) added to
every other page. Play state is written to `localStorage` (`radioPlaying`); on every page load
the script checks that flag and, if set, immediately shows the dock and attempts to reconnect
the stream. Two things follow directly from this being a reconnect-per-page-load rather than one
continuous stream, and both are handled explicitly rather than silently:
- A short (~1s) gap on every navigation while the new page's `<audio>` element buffers.
- The reconnect attempt isn't a user gesture, so the browser's autoplay policy can block it
  (more likely for a visitor's first navigation than later ones). On rejection the dock stays
  visible in a paused "Tap to resume · Groove Salad" state instead of disappearing or failing
  silently — clicking it is a real user gesture and reliably starts playback.
Pausing from either control (dock or widget) clears the flag and hides the dock again, so it
never appears for a visitor who never pressed play, per the user's explicit requirement.

Deliberately placed bottom-left rather than bottom-right: `.project-slider-nav`'s prev/next
buttons already live bottom-right (`position: absolute` inside each slider, not viewport-fixed,
so not a real collision, but close enough visually to avoid). Mobile (`<576px`) hides the dock's
text label and keeps just the icon, matching the same breakpoint `.project-slider-nav` already
uses for its own mobile sizing.

Verified locally: dock renders and hides correctly (light + dark theme), `localStorage`-driven
resume fires on page load, and the paused/"tap to resume" fallback state renders correctly on
`play()` rejection. Could **not** verify actual continuous audio across a real navigation — same
pre-existing automation-tab limitation noted for the original radio widget above (stream
`readyState` never leaves 0 in this sandboxed tab; confirmed via `curl` back then that the stream
itself is fine). The docking/state mechanism itself was verified directly by driving it with the
real `localStorage` flag and calling `showRadioDock`/`hideRadioDock` from the console, independent
of whether the stream can actually connect in this environment.

## External feedback tracking + slider video-pause fix (2026-08-14)

New convention: real feedback from other people (screenshots of chat/DMs, etc.) gets saved into
a `Feedback/` folder at the repo root — one markdown file per feedback session
(`Feedback/YYYY-MM-DD-name.md`), with the raw source screenshot alongside it and a status table
checking each point against the actual current site rather than assuming it's already handled.
First entry: `Feedback/2026-08-14-bruno-were.md`, feedback from Bruno Were on the site's identity,
missing portfolio pieces (Gadaha, Ingwe — not added, no assets exist yet), the FRGHN Music case
study lacking a design backstory (not added, needs real input), the Contact page still reading
"Nile House" (confirmed still present, needs the real current location from Tafadzwa), and the
HandWing slider auto-advancing over a playing video.

That last item was fixed directly: `Slider.js` previously only paused its 4s auto-advance timer
on `mouseenter`/resumed on `mouseleave`, so a visitor playing a video without keeping the mouse
over the slider (or on a device with no real hover) would still get swiped away mid-playback. Now
every `<video>` inside a `.project-slider` gets `play`/`pause`/`ended` listeners that stop/restart
the same timer, tracked as a separate `isVideoPlaying` flag alongside the existing `isHovering`
one so either condition alone can hold the timer off.

Verified locally by patching `track.scrollTo` to count invocations rather than reading
`scrollLeft` directly — this sandboxed tab has `document.hidden === true`, which (per the known
automation-tab quirk noted earlier in this doc) silently no-ops `scrollTo({behavior:'smooth'})`,
so `scrollLeft` alone would have given a false negative. Dispatching a synthetic `play` event held
scroll calls at 0 for a full 4.6s interval; dispatching `pause` produced exactly 1 call in the next
4.6s window; re-checking hover pause/resume the same way confirmed no regression there.

## Radio channel shuffle (2026-08-14)

Feedback (see the new `Feedback/` convention above) asked whether visitors could switch what's
playing rather than being locked to Groove Salad. `Radio.js` now holds a small curated list of
four SomaFM channels — Groove Salad, Drone Zone, Secret Agent, Indie Pop Rocks! — matching the
grouping SomaFM's own site uses for these four, verified against the real `https://ice1.somafm.com/
{id}-128-mp3` stream URLs (checked each with a HEAD request; same direct-stream pattern the
existing Groove Salad URL already relied on) and channel names/genres from SomaFM's public
`channels.json`. The chosen channel is remembered in `localStorage` (`radioChannel`) alongside the
existing play-state flag, so it persists across page loads the same way play/pause does.

A "Shuffle channel" button (`#radio-shuffle`, `.section-heading-link.link-hud` — the same reusable
HUD-bracket hover treatment as other text links, not a new visual idiom) was added only to the
full-size Contact page widget, not the small docked mini-player on other pages — the dock already
hides its text label under 576px and exists just to keep the visitor's chosen stream connected
while they browse, not to be a full control surface. Clicking it picks a random channel other than
the current one; if something is already playing, the old stream is torn down and the new one
starts immediately in its place, if idle it just updates the remembered choice for next play.
Labels (`playingLabel`/`idleLabel`/`resumeLabel`) and both triggers' `aria-label`s are now
generated from whichever channel is current instead of being hardcoded to Groove Salad.

Verified locally: real audio playback couldn't be exercised end-to-end (same pre-existing
automation-tab limitation as the original radio widget and mini-player — `audio.play()` on a real
Icecast stream hangs rather than resolving/rejecting in this sandboxed, backgrounded tab). Instead
verified the actual logic directly: 10 consecutive shuffles never repeated the same channel
back-to-back and covered all 4 channels, and each call correctly updated the visible label, both
triggers' `aria-label`, and the `localStorage` value together.

## Slider videos: native controls removed, hover-to-play (2026-08-14)

The three real videos in the HandWing slider (`Portfolio.html` + `HandWing.html`, same three
files in both) lost their `controls` attribute and gained `muted loop playsinline` instead —
now `.hover-preview-video`, matching the muted/loop/playsinline convention the FRGHN Music
`3AM Animation.mp4` hero video already used, just gated by hover instead of always-on.

`Slider.js` now plays each video on `mouseenter`, pauses and rewinds to 0 on `mouseleave` (so
every hover starts the clip fresh, the usual product-preview pattern), and also toggles
play/pause on `click` as a tap-to-play fallback for touch devices, which don't fire hover events
at all — without it, removing `controls` would have made these videos completely unplayable on
mobile. The existing play/pause-driven auto-slide-pause logic from the previous slider fix
needed no changes: it listens to the video's native `play`/`pause` events regardless of what
triggered them, so hover-triggered playback already pauses the slider's auto-advance the same
way clicking play used to.

One real tradeoff worth flagging: muting is required for hover-triggered autoplay to be reliable
across browsers (unmuted `play()` calls not tied to a click/keydown are frequently blocked), and
there's no control bar to unmute from anymore. These three clips are now silent previews only —
say if a mute/unmute affordance is wanted back for any of them.

Verified locally: confirmed via a real navigation (not the earlier sandboxed/backgrounded tab)
that a dispatched `mouseenter` actually plays the video with `currentTime` advancing in real
wall-clock time (readyState 4, no decode/network errors), `mouseleave` pauses and resets to 0,
the slider's auto-advance stays fully paused for a complete 4.6s interval while "hovering", and
two `click` events toggle paused → playing → paused as expected.

## Hero name: title case + "Choga" accent-on-scroll (2026-08-14)

The homepage hero name (`index.html`, `.name-reveal`) was hardcoded as literal all-caps text
content ("TAFADZWA"/"CHOGA" — no `text-transform` involved, so there was no CSS-only fix); changed
to real title case ("Tafadzwa"/"Choga") directly in the markup.

The second line ("Choga") got a new `.name-reveal-surname` class wired to a `ScrollTrigger.create`
in `Reveal.js` (`trigger: ".name-reveal", start: "bottom center"`): `onEnter` adds
`.is-scrolled-past` (color flips to `var(--color-accent)`, the same mint used everywhere else),
`onLeaveBack` removes it (reverts to inheriting `var(--color-ink)`, so it's automatically the
correct color in both themes rather than a hardcoded dark value). This reuses the ScrollTrigger
setup already in this file rather than adding a second raw-`scrollY` listener alongside the one
`Menu.js` already runs for the nav-pill scrolled state — same effect, one mechanism. Because Lenis
is already wired to call `ScrollTrigger.update()` on every scroll tick (`Lenis.js`), this reacts to
the site's actual smooth-scroll correctly with no extra glue.

Verified locally by driving `window.lenis.scrollTo()` directly (real Lenis scroll, not raw
`window.scrollTo`, which fights the smooth-scroll library) in a single uninterrupted script: at
rest the surname reads `#1a1a1a` (light theme ink), scrolling down past the hero flips it to the
accent mint immediately (`.is-scrolled-past` added, transitioning via `--transition-fast`), and
scrolling back up reverts cleanly to `#1a1a1a`. Also spot-checked with the OS theme forced dark:
same toggle, just against dark theme's flipped (light-colored) ink token instead, confirming the
color is genuinely token-driven rather than hardcoded.

## Radio: 8 more SomaFM channels (2026-08-14)

Shuffle pool grew from 4 to 12: added Heavyweight Reggae, Fluid, Bossa Beyond, Sonic Universe,
Lush, Digitalis, Suburbs of Goa, and Underground 80s to `RADIO_CHANNELS` in `Radio.js`. Same
pattern as the original four — no HTML/CSS changes needed, since the shuffle button, labels, and
`aria-label`s all already read from whichever channel is current. Each `id` (SomaFM's real slug,
not guessed) and its direct `https://ice1.somafm.com/{id}-128-mp3` stream were verified against
SomaFM's public `channels.json` and a live HEAD request before adding.

Verified locally: 60 consecutive shuffles hit all 12 channels at least once, and the visible
label/`localStorage` stayed in sync with whichever one was current.

## Gadaha case study added (2026-08-14)

Added `Gadaha.html` (full case study, matching the `HandWing.html` template) plus a
`#gadaha` entry on `Portfolio.html`, closing item #2 from the 2026-08-14 friend feedback
(`Feedback/2026-08-14-friend-feedback.md`) — Gadaha had no assets or copy in the repo before this.

Gadaha is a fitness and wellness app concept for women in the Gulf region (Saudi Arabia, Kuwait,
Qatar), built with a founding team; Tafadzwa's confirmed role was Marketing/Design Lead (per the
team's own pitch deck), and the app was never launched. Nine images were sourced and added to
`Images/`: the brand cover and one app screen per major flow (splash, sign up, workouts, meals,
community, account) exported directly from the team's Figma file, plus two pitch-deck slides
(Problem Statement, Value Proposition) exported from the team's Canva deck — chosen because they
carry sourced, factual content (an obesity/CVD stat cited to the National Library of Medicine) and
show product-strategy thinking, not just UI. A third pitch-deck slide ("Meet WYCO," the team page)
was deliberately **not** used since it has teammates' photos, and publishing those isn't Tafadzwa's
call to make.

Per the content-honesty rule (see `feedback_tafadzwa_content_honesty` memory), the page's `Goals`
section only states facts already sourced from the deck — no invented design-process narrative,
since none was documented. Two fields were left as bracketed placeholders for Tafadzwa to fill in
directly, same convention as the pre-existing `[Add project goals]` placeholder on `FRGHN-Music.html`,
and were both resolved same-day once he supplied them:
- **Year**: Tafadzwa confirmed **2023**; set on both `Gadaha.html` and the `Portfolio.html` entry.
- **Process note**: Tafadzwa asked for a short note drafted from what the assistant had already
  seen in the source files, not invented from scratch. Added to the end of the Goals paragraph,
  grounded in two concrete artifacts: the Figma file's moodboard page (competitor screens, gym
  photography, color/iconography direction) and the Canva deck's Go-to-Market Strategy slide
  (influencer collabs on Instagram, TikTok, Snapchat). Tafadzwa should still re-read this line —
  it describes the process at the level the assistant could actually observe, not from his own
  first-hand account.

Also added a `.gadaha-project-grid` rule to `Stylez.css` (identical to `.handwing-project-grid`,
same one-class-per-project convention already in use) and appended "and Gadaha" to `Portfolio.html`'s
meta/OG/Twitter description strings so the new project shows up in the existing project list there.

**Cover swapped (2026-08-14)**: Tafadzwa supplied a higher-resolution version of the deck's actual
title slide (`Gadaha Cover Image.png` from Downloads) to replace the plain logo-on-purple cover
originally exported from Figma. `Images/Gadaha Cover.jpg` → `Images/Gadaha Cover.png`; every
reference updated across `Gadaha.html` (og:image, twitter:image, first slider slide) and
`Portfolio.html` (spotlight slider), alt text rewritten to match the new image (model in a hijab
and jacket beside the logo/wordmark, not just the logo).

**Account screen fixed (2026-08-14)**: the account screen originally exported was the wrong
variant — a dark-mode frame under the moodboard's "Account Screen 1.0" wrapper, with the name
"Arwa Yousif," inconsistent with the "Khadija Yousif" persona used everywhere else in the app
(Workouts, Meals, Communities). Tafadzwa flagged it with a screenshot of the correct one. Replaced
`Images/Gadaha Account Screen.png` with the actual frame named "Account Screen 1.0" inside the
Figma file's separate "Profile/Account" section — light purple, "Khadija Yousif" — matching every
other screen in the case study. Same filename, so no HTML reference changes needed; alt text
("Gadaha app account screen with health details and settings") didn't name anyone, so it already
held up.

## Repo / deploy
- Remote: `origin` → `https://github.com/tafadzwaelphas/Tafadzwa-Elphas.git`, branch `main`
- GitHub Pages: enabled, source = GitHub Actions, workflow `.github/workflows/static.yml`
- Live URL: https://tafadzwaelphas.github.io/Tafadzwa-Elphas/
- Local git identity for this repo: `Tafadzwa Elphas <tafadzwchoga@gmail.com>` (matches the
  tafadzwaelphas GitHub account, set locally not globally)

## About page portrait swapped (2026-08-14)

Tafadzwa supplied a new portrait (`~/Desktop/Tafadzwa Choga - Image.png`, 1772×1771, 3MB PNG) to
replace the About page's existing photo. Converted to JPG at quality 82 (`Images/Tafadzwa Choga
Portrait.jpg`, 563KB) to stay in line with the rest of the site's image sizes rather than shipping
a 3MB PNG — same lesson as the original pre-redesign "oversized unoptimized images" bug. Updated
all three references in `About.html` (`<img src>`, `og:image`, `twitter:image`); alt text
("Portrait of Tafadzwa Choga") didn't need to change.

Deliberately left `Images/1W7A7296.JPG` (the old photo) in place and untouched — `Contact.html`
still uses it for its own `og:image`/`twitter:image`, and the user's request was scoped to the
About page picture specifically, not a site-wide portrait swap.

## Moon + weather widgets added to the Contact tools grid (2026-08-15)

Extended the existing `.contact-tools` widget suite (clock, compass, sundial, local-time readout,
radio) with two more: a moonrise/moonset dial and a live weather readout, both on `Contact.html`.

**Moon widget (`Moon.js`)** follows the exact same philosophy as `Sundial.js` — a self-contained,
offline astronomical calculation, no API, pinned to Accra's coordinates (5.6037, -0.187). Uses the
low-precision lunar position formula from Montenbruck & Pfleger (accurate to roughly a degree,
same tolerance the sundial's solar formulas already accept), converts ecliptic to equatorial to
horizontal coordinates, and scans a 48-hour window in 10-minute steps to find horizon crossings —
unlike the sun, the moon can rise or set at any hour and drifts ~50 minutes later each day, so a
same-day-only search (like the sundial's) isn't reliable. Also derives a moon-phase name (New,
Waxing Crescent, etc.) from the sun-moon ecliptic elongation, shown in the widget's label text
rather than as a separate graphic, to keep scope matched to what was asked for.

Reused the sundial's arc/horizon SVG geometry directly (`.tool-moondial` mirrors `.tool-sundial`'s
markup) so the two read as a matched pair.

**Weather widget (`Weather.js`)** is a different category of widget: actual weather isn't
computable, only sun/moon geometry is, so this is the site's first live network JSON call (every
other widget, including the moon one, is offline/deterministic — see `Radio.js` for the only prior
network use, an audio stream rather than a data fetch). Confirmed with the user before adding it.
Uses Open-Meteo's free, keyless, CORS-friendly `/v1/forecast` endpoint for Accra's coordinates —
appropriate for a static GitHub Pages site with no backend to hide an API key behind. Maps Open-
Meteo's WMO weather codes to one of seven hand-drawn flat SVG icon states (clear, partly cloudy,
cloudy, fog, rain, snow, storm) using the same toggle-a-class-then-CSS-display technique already
used for `.tool-radio`'s play/pause icons. Refreshes every 15 minutes; falls back to a "Weather
unavailable" label on fetch failure rather than throwing.

Verified locally (Python http.server): both widgets render correct live Accra data (moonset time +
phase, current temp/condition/high-low) in light and dark theme, no console errors, after fixing a
same-file-scope global function name collision (`Moon.js` and `Sundial.js` both plain `<script>`
tags sharing one global scope — both had defined `formatAccraHour`, so loading Moon.js after
Sundial.js silently overwrote the sundial's version with one that expected a `Date` instead of a
decimal-hours number; renamed Moon.js's to `formatMoonHour`).

## Portfolio.html reordered by year; ongoing projects marked; two case studies resolved (2026-08-15)

Tafadzwa asked for the `Portfolio.html` project list to be ordered by year, for HandWing and
EYEZWIDOPEN to be marked as ongoing, and for the two lingering `[Add project goals]` placeholders
(HandWing, FRGHN Music) to be dealt with — pointing out that FRGHN Music (the Madube cover art)
doesn't really have a "case study" worth of process to document, unlike HandWing which already had
a full 26-slide asset library sitting behind an empty placeholder. Checked with him before touching
anything, since this is a content-honesty site (see `feedback_tafadzwa_content_honesty` memory) and
several of these were judgment calls, not mechanical edits:

- **Sort order**: newest-first, confirmed.
- **HandWing's year was inconsistent** in the repo: About.html and the Portfolio spotlight text
  both already said "founded in 2020," but the project-header-year field said "2021–2023."
  Tafadzwa confirmed 2020 is correct. Now reads **2020–Present** everywhere (Portfolio.html *and*
  HandWing.html — previously out of sync with each other too).
- **EYEZWIDOPEN**: end year changed from 2022 to **Present** (start year 2021 left as-is, no
  conflicting source elsewhere to reconcile).
- **HandWing's Goals section**: Tafadzwa asked for a draft grounded only in what's already
  documented on the site (About.html, the spotlight copy, and the asset alt text/filenames — extruded
  wordmark, creature mark, "Culture In Motion" tagline, black-and-mint palette, apparel/totes/
  signage/motion), same approach as Gadaha's assistant-drafted process note. Written deliberately as
  a description of the system's actual scope rather than an invented brief/motivation, since no
  written goals document exists for what is Tafadzwa's own brand. **He should still re-read this
  paragraph** before it's treated as final, same caveat as Gadaha's.
- **FRGHN Music's Goals section**: Tafadzwa agreed this project doesn't fit the case-study pattern
  (a single cover-art commission, two concepts, one client) — replaced the placeholder with a short
  honest note saying so, rather than fabricating a design process that didn't happen or leaving a
  stale placeholder live on the site.

New `Portfolio.html` order (id anchors unchanged, so no external links break): HandWing (ongoing) →
EYEZWIDOPEN (ongoing) → CoEdu (2024) → Fakugesi Poster Competition (2023) → Gadaha (2023) → FRGHN
Music (2021). Fakugesi/Gadaha (both 2023) kept their original relative order as a stable-sort
tie-break, since neither has a documented month. CoEdu's "ongoing" status wasn't touched — Tafadzwa
only named HandWing and EYEZWIDOPEN, and CoEdu's Portfolio.html entry has no Goals section or
placeholder to begin with.

Confirmed `Slider.js` operates per-`.project-slider` independent of DOM order, so reordering the
project blocks wholesale doesn't affect slider/counter/autoplay behavior. Verified in browser
(local http.server, hard-reloaded to bust cache): all six sections render in the new order with
correct year labels, and both edited Goals sections display the new copy correctly in dark theme.
Placeholder audit (`grep -no '\[Add [^]]*\]' *.html`) now returns nothing — zero outstanding

## CoEdu case study added (2026-08-15)

Tafadzwa shared CoEdu's real 2024 funding pitch deck (Figma Slides, "CoEdu Funding Pitch Deck
2024," 53 slides) as source material and asked for a `CoEdu.html` case study, following the
HandWing/Gadaha pattern — previously CoEdu only had a brief anchor section on `Portfolio.html`
with no dedicated page. Read through the deck (skipping the legal/regulatory and competitive-
analysis appendix slides, which aren't case-study material) and pulled only facts actually stated
in it, per this site's content-honesty rule:

- **Problem/value prop**, quoted close to CoEdu's own wording: tech-limited learners struggle to
  navigate educational platforms, so CoEdu meets them on WhatsApp/Telegram instead, with automated
  handling of common student inquiries.
- **Tafadzwa's role**: the deck's own team slide lists him as **Product Lead** (5+ years as a
  Multimedia Designer) on a five-person founding team — this is the first confirmed, sourced job
  title for a Tafadzwa project beyond "designer," so it's used verbatim in the new page's intro.
- **The ask**: $100,000 for a 24-month runway (15% marketing / 55% product development / 30%
  operations), and early traction (introduced to 11 institutions, 7 early adopters) at pitch time.
- **Deliberately left out**: the team-photo slide (other named people's photos, same exclusion
  rule as Gadaha's team slide), the pitch's named third-party testimonial quote (another person's
  words/name, not confirmed for public reuse), and the entire legal/regulatory appendix (out of
  scope for a design case study).

Exported two clean, photo-free deck slides as new images — `CoEdu Value Proposition.jpg` ("Our
Promise") and `CoEdu Funding Ask.jpg` ("Our Ask") — via a zoomed browser screenshot of the Figma
canvas (Figma's own "Copy as PNG" only puts the image on the clipboard, with no direct save-to-
file path available through browser automation), converted PNG→JPG with `sips`. `CoEdu Value
Proposition.jpg` was added to both `CoEdu.html`'s slider and `Portfolio.html`'s existing CoEdu
slider (now 11 slides, was 10). `Portfolio.html`'s CoEdu section gained a "View full case study →"
link to `CoEdu.html`, matching Gadaha/FRGHN Music/HandWing.

Tafadzwa asked for the "Our Ask" ($100,000 funding ask) slide image removed from `CoEdu.html`
shortly after — confirmed he meant just the slide, keeping the Goals-text sentence that states the
same figure in prose. Removed the slide from `CoEdu.html`'s slider (12 → 11 slides, counter
updated), and since `Portfolio.html` never referenced that file, deleted the now-unused `CoEdu
Funding Ask.jpg` from `Images/` rather than leaving a dead asset in the repo.

Added `.coedu-project-grid` alongside `.handwing-project-grid`/`.gadaha-project-grid` in
`Stylez.css` (identical padding rule, just a new selector) and bumped `Stylez.css?v=48` →
`?v=49` across all seven HTML files for cache-busting, per the established convention.

## FRGHN Music copy fix — meta-commentary removed (2026-08-15)

Tafadzwa flagged two sentences on `FRGHN-Music.html` that "read wrong": the header description's
"everything done for this client lives under this one case study" and the Goals paragraph's "so
there's no design process to document beyond what's shown here." Both were leftover from the
2026-08-13 client-scope correction (see above) — written to explain the page's own scope/structure
to the reader rather than to describe the actual work, which reads as an editing note that never
got cleaned into real copy. Fixed by dropping both trailing clauses:

- Description now ends at: `...Two cover concepts were explored for his 2021 single "Madube."`
- Goals now reads: `A single-deliverable cover art commission — two concept directions explored
  for one single, rather than a multi-stage brand project.`

Grepped the file afterward for similar phrasing (`case study`, `lives now under`, `beyond what's
shown`) — no other instances found. Noted for future copy passes: don't write sentences that
explain to the reader what's absent or how the page is organized — describe the work itself.

## FRGHN Music slider mislabeled its own image count, plus two misattributed images (2026-08-15)

Follow-up to the copy fix above. Tafadzwa flagged that the slider showed 4 images while the copy
said "two concepts" — the real bug: the 2026-08-13 "Add new slides to FRGHN Music" commit
(`25bef9a`) added `3AM Animation.mp4` and `FRGHNFNL@2x.png` as slides 3–4 without ever updating
the surrounding copy, so all four images read as if they were Madube concepts.

Investigating further with Tafadzwa surfaced two more misattributions, neither guessed — both
confirmed directly:
- `3AM Animation.mp4` is cover art for a real 2023 Foreighn single, "3AM" (not publicly listed on
  his Audiomack profile yet — confirmed by Tafadzwa directly, not sourced externally).
- `FRGHNFNL@2x.png` (the space-portrait illustration) is actually for a separate **untitled 2023**
  Foreighn project, not "3AM" — my first pass had wrongly grouped it with the 3AM video.
- `ARTCVRMDBE2.png` (the purple/orange illustration) was never a Madube concept at all — it's the
  same file already correctly used on `Portfolio.html` line 163 as EYEZWIDOPEN cover art. It had
  been living a double life: mislabeled as an "alternate Madube concept" on both `FRGHN-Music.html`
  and `Portfolio.html`'s FRGHN mini-slider, while also correctly labeled EYEZWIDOPEN elsewhere in
  the same file. Removed it from both FRGHN sliders; its one legitimate use under EYEZWIDOPEN was
  untouched.

**Real breakdown is now**: Madube (2021, 1 image) → 3AM (2023, 1 video) → Untitled (2023, 1
image), three separate pieces for the same client, not one two-concept commission.

**New scalable grouping mechanism**, since Tafadzwa confirmed the page is meant to keep collecting
cover art for this artist over time and asked for a way to do that without spawning a separate
slider per release: added a `data-group="<Release> (<Year>)"` attribute to each `.project-slide`,
plus a `<span class="local-time-label project-slider-group-label" data-slider-group-label>` sitting
just above the `.project-slider` (same block-label convention as `.case-study-goals
.local-time-label`, always visible rather than hover-gated like the counter — this label changes
what the images mean, unlike the counter, so it shouldn't be hidden until hover). `Slider.js`'s
existing `updateCounter` now also looks for a `[data-slider-group-label]` immediately preceding the
`.project-slider` (`slider.previousElementSibling`) and, if present, sets its text to the current
slide's `data-group` on every scroll/nav/auto-advance. Adding a 4th release later is just another
slide with a new `data-group` value — no new component. Verified the sync logic directly (stepping
through all 3 indices) since the real `nextBtn`/scroll-triggered path is suppressed in the
backgrounded automation tab, the same known limitation noted elsewhere in this doc.

Also corrected while in this copy (per Tafadzwa's direct corrections, not sourced externally):
Foreighn's bio now reads "an independent Zimbabwean and Zambian-based Afrosounds artist released
via Zed Arts Records" (was "a Zambian/Zimbabwean Afrosounds artist on Zed Arts Records" — wrong
nationality framing, and missing that he's independent) — updated on both `FRGHN-Music.html` and
`Portfolio.html`.

`Portfolio.html`'s FRGHN mini-slider now drops to a single Madube slide (its only other slide was
the misattributed EYEZWIDOPEN image) — removed its now-pointless counter/nav elements, matching the
existing single-image-slider convention already used for Fakugesi. Both pages' project-header-year
bumped from `2021` to `2021–2023` to reflect the full client relationship now documented.

**Resolved same day**: Tafadzwa confirmed he wanted FRGHN Music moved. Placed it directly after
CoEdu (2024) and before Fakugesi/Gadaha (both 2023) — new `Portfolio.html` order: HandWing
(ongoing) → EYEZWIDOPEN (ongoing) → CoEdu (2024) → **FRGHN Music (2021–2023)** → Fakugesi (2023) →
Gadaha (2023). Moved the whole section (header/description/link/slider) as one block via `id="frghn"`,
no anchor links elsewhere in the repo needed updating since the id was preserved. Verified in
browser: section order and rendering both correct after the move.

Left untouched: the homepage's `index.html` "Recent Projects" carousel, which lists projects in a
different, hand-picked order (HandWing, EYEZWIDOPEN, Fakugesi, FRGHN, CoEdu — and omits Gadaha
entirely) rather than mirroring Portfolio.html's chronological sort. Treated as a separate curated
highlight reel, not something this reorder should touch.

## CoEdu slider: swapped Value Proposition slide, added MVP slide (2026-08-15)

Tafadzwa supplied two new pitch-deck exports — `CoEdu Our Promise.png` and `CoEdu MVP.png` — and
asked to replace the existing "Our Promise" slide with the higher-quality version and add the new
MVP slide after it. Applied to both sliders that carry this content, `CoEdu.html` and
`Portfolio.html`'s CoEdu spotlight (kept in sync per existing convention):

- Swapped `CoEdu Value Proposition.jpg` → `CoEdu Our Promise.png` (same "Our Promise" slide
  content — WhatsApp/Telegram access, automated inquiries — just the sharper export Tafadzwa
  provided this time, replacing the original zoomed-browser-screenshot version).
- Added `CoEdu MVP.png` immediately after it — the pitch deck's "CoEdu is a learning management
  platform..." slide with the dashboard-on-laptop mockup.
- Slider count: 11 → 12 slides on both pages; counters updated to match.
- Deleted the now-dead `CoEdu Value Proposition.jpg` from `Images/` — verified no remaining
  references first (only this doc's historical log entry, left as-is).

Verified in browser: slide order is Cover → Our Promise → MVP → Logos → ... , new "Our Promise"
image renders at full quality with no layout issues.

## FRGHN Music Goals line reworded (2026-08-15)

Tafadzwa flagged the Goals sentence on `FRGHN-Music.html` as awkward: "Single-deliverable cover art
commissions — not a multi-stage brand project, but standalone artwork revisited each time this
client has new work to release." Redundant ("single-deliverable" and "standalone" say the same
thing twice) and "revisited" could misread as the artwork itself being revised rather than the
commissioning relationship recurring. Reworded to: `One-off cover art commissions, not a
multi-stage brand project — new artwork each time this client has something new to release.`
