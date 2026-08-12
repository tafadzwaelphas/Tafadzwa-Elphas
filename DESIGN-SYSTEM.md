# Design System

Living reference for the site's design tokens and component patterns, as implemented in `Stylez.css` / `Responsive.css`. For the chronological log of *how* these decisions were reached, see `DESIGN.md` instead — this file only describes the current state.

All tokens live as CSS custom properties in `Stylez.css`'s `:root` block.

## Color

| Token | Value | Usage |
|---|---|---|
| `--color-ink` | `#1a1a1a` | Primary text, dark surfaces (inverted footer) |
| `--color-page` | `#f6f5f2` | Page background, light surfaces |
| `--color-muted` | `rgb(112, 106, 98)` | Secondary/body text on the light background |
| `--color-muted-inverted` | `rgb(140, 136, 130)` | Secondary text on the dark (inverted footer) background |
| `--color-accent` | `rgb(0, 255, 213)` | Hover/active state — the mint accent, used sparingly |
| `--color-ink-55` | `rgba(26, 26, 26, .55)` | Muted label text over light/glass surfaces (nav links, slider counter/controls) |
| `--color-ink-25` | `rgba(26, 26, 26, .25)` | `.link-hud` bracket border at rest |
| `--color-ink-15` | `rgba(26, 26, 26, .15)` | Hairline dividers/borders |
| `--color-ink-12` | `rgba(26, 26, 26, .12)` | Hairline dividers (services list) — see audit note below |
| `--color-page-97` | `rgba(246, 245, 242, .97)` | Near-opaque light surface (mobile menu-open panel) |

## Type

Two families: **Boldonse** (`--font-display`, single weight 400, no italic) for headings/display moments, **Outfit** (`--font-body`, variable weight) for everything else. Both loaded via Google Fonts.

Sizes are named by role rather than a generic t-shirt scale, since the values in use don't cleanly quantize into one:

| Token | Value | Usage |
|---|---|---|
| `--text-display` | `clamp(60px, 14vw, 220px)` | Homepage scroll-scrubbed name reveal |
| `--text-h1` | `100px` | Page `<h1>` (desktop) |
| `--text-h1-mobile` | `48px` | Page `<h1>` (mobile, ≤767px) |
| `--text-h2` | `clamp(1.75rem, 4vw, 3rem)` | Section headings (e.g. "Recent Projects") |
| `--text-project-title` | `32px` | Portfolio project header title |
| `--text-cta` | `clamp(22px, 3vw, 36px)` | Footer closing statement |
| `--text-services` | `clamp(1.5rem, 4vw, 2.75rem)` | Services list items |
| `--text-body` | `20px` | Default paragraph text |
| `--text-body-lg` | `18px` | About-page overview list items |
| `--text-body-sm` | `16px` | Denser body copy (project descriptions, about bio) |
| `--text-label` | `14px` | Metadata labels (project year/tags, footer links, services index) |
| `--text-label-sm` | `13px` | Smaller uppercase labels (nav links, section-heading link, about overview headers) |
| `--text-caption` | `12px` | Slider counter, footer copyright line |
| `--text-caption-sm` | `11px` | Nav social links |

## Spacing

Unchanged from before this pass — already tokenized:

`--space-2xs` (.5rem) → `--space-xs` (1rem) → `--space-sm` (2rem) → `--space-md` (3rem) → `--space-lg` (5rem) → `--space-xl` (7rem), plus `--space-page` (6rem, the recurring horizontal page margin).

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-pill` | `999px` | Nav pill, slider counter |
| `--radius-circle` | `50%` | Slider prev/next buttons |
| `--radius-card` | `12px` | Mobile menu-open panel |

## Glass panel

The site's recurring "frosted glass" treatment — used by the scrolled nav pill, the project-slider counter, and the slider's prev/next buttons. Defined once as a grouped CSS rule (not a utility class) so the three consumers stay in sync without hand-copying:

```css
.site-menu.scrolled,
.project-slider-counter,
.project-slider-nav button {
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-glass);
}
```

| Token | Value |
|---|---|
| `--glass-bg` | `rgba(246, 245, 242, .55)` |
| `--glass-blur` | `blur(14px)` |
| `--shadow-glass` | `0 4px 24px rgba(0, 0, 0, .08)` |
| `--shadow-card` | `0 8px 30px rgba(0, 0, 0, .12)` — heavier variant for the near-opaque mobile menu panel |

To reuse the recipe on a new element, add its selector to that grouped rule rather than repeating the four declarations.

## Motion

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `.2s ease` | Quick hover feedback (buttons, clock hover, services hover) |
| `--transition-hud` | `.25s ease` | `.link-hud` hover (bracket widen + color) |
| `--transition-fade` | `.3s ease` | Slider counter/controls opacity fade-in on hover |
| `--transition-slow` | `.7s cubic-bezier(.4, 0, .2, 1)` | Footer color inversion when docked at page bottom |

## Component patterns

- **`.project-slider`** — the core reusable pattern for showing project images/video: full-bleed horizontal scroll-snap track (`.project-slider-track`), `object-fit: contain` against `--color-page` (not cropped), a slide counter and prev/next buttons that are hidden by default and fade in on hover using the glass-panel treatment above, auto-advance driven by `Slider.js`. Used per-project on `Portfolio.html` and for the homepage's Recent Projects section.
- **`.link-hud`** — reusable bracket-corner hover style (`[ LIKE THIS → ]`) that widens and picks up `--color-accent` on hover. Layer onto any link/button alongside its base class; currently used on the homepage "View all →" link only. Deliberately not applied to the slider's prev/next buttons, which already carry their own glass-panel hover treatment.
- **Menu (`.site-menu`)** — at rest: transparent, plain vertical stack of nav + social links, top-right. On scroll (`.scrolled`, toggled by `Menu.js`): becomes a horizontal glass pill on desktop; on mobile it further collapses into a single icon (`.site-menu-toggle`) that expands into a glass card (`--color-page-97` + `--shadow-card`) on tap.
- **Footer inversion** — `.site-footer.inverted`, toggled by an `IntersectionObserver` in `Menu.js` when the footer docks at the bottom of the viewport: background/text swap from light/`--color-ink` to dark/`--color-page`, on `--transition-slow` for a slow, deliberate feel (distinct from the fast UI-feedback transitions elsewhere).

## Known inconsistencies (not silently resolved)

A few near-duplicate values exist in the current CSS that look like unintentional drift rather than an intentional distinction. They were each preserved as their own token during this migration (so nothing's visual changed), but are worth an intentional look before adding more:

- **Hairline opacity**: `--color-ink-15` (.15) and `--color-ink-12` (.12) both function as "subtle divider" — used in different places (nav-socials border, local-time border vs. services-list border) but it's not obvious the distinction is deliberate.
- **Label sizing**: `--text-label` (14px) and `--text-label-sm` (13px) both read as "small metadata/label text" depending on context; may be worth consolidating to one.

## Out of scope / likely dead code

Two generic selectors in `Stylez.css` — a bare `ol { ... }` rule and `ul li a { ... }` — use colors (`rgb(74, 68, 62)`, `#242323`) and spacing (110px margins, 100px line-height) that don't match any token in this system and don't correspond to any current component class. They look like leftovers from before the redesign rather than active styling. Left untouched during this pass (not part of the active design system); worth confirming nothing on the live site still depends on them before deleting.
