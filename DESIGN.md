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
