# Design

Design system: **Warm Professionalism**. The binding source spec is
`stitch_skillmap_design_system_redesign/warm_professionalism/DESIGN.md` (with the three reference
screens beside it); this file is the encoded working implementation. Tokens live in
`src/app/globals.css` under Tailwind v4 `@theme` — that file is the single source of truth in code.

## Theme

**Light only.** A single warm palette, no dark inversion, no toggle, no persisted preference.

Page grounds are **white**. The warm tint is deliberately restrained — a hint of warmth in banded
sections and tonal tiles, never a wash across the page. The surface ramp was desaturated once it
became clear the original values read as pink rather than warm-neutral. There is no second brand to
maintain, so the toggle, the `.dark` variant and the localStorage theme boot script were removed
rather than left dormant.

Physical scene that forces this: a learner skimming a marketplace of courses, deciding what the
market is paying for. The page should feel like a premium lifestyle brand that happens to carry
dense information — hospitable, not corporate.

## Color

Anchored by white **canvas** against deep **ink** text. The primary red is high-voltage and
action-only: buttons, active nav, links, the "high demand" signal. Warm surfaces do the work that
shadows would do in a heavier system.

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#ffffff` | Page and card background |
| `ink` | `#222222` | Headings, primary text |
| `body` | `#5c3f41` | Long-form body copy (warm neutral) |
| `muted` | `#6a6a6a` | Metadata, secondary text, placeholders |
| `hairline` | `#dddddd` | 1px card and section borders |
| `surface` | `#fdfbfa` | Warm banded sections and hero panels |
| `surface-low` / `surface-mid` / `surface-high` | `#faf6f5` / `#f6f0ef` / `#f1e9e9` | Tonal layer ramp |
| `surface-dim` | `#e9e1e0` | Media placeholders |
| `surface-variant` | `#f0e7e7` | Chip fill, progress track |
| `outline-variant` | `#e2d6d6` | Chip borders |
| `primary` | `#ba0036` | Buttons, active nav, links |
| `primary-hover` | `#920029` | Hover/active (≈10% darkening) |
| `primary-tint` | `#fae8e9` | Status pills, active list rows |
| `demand-high` | `#ff385c` | High demand signal |
| `demand-medium` | `#ffb400` | Medium demand signal |
| `demand-low` | `#929292` | Emerging / flat demand |
| `success` | `#006a45` | Completion, goal progress |
| `error` | `#ba1a1a` | Validation, destructive actions |
| `secondary` | `#7e5700` | Growth progress fill, gold accents |

Demand color is never decorative — a red dot means the market is hiring.

## Typography

**Inter exclusively**, four weights (400/500/600/700 plus 900 for the wordmark). JetBrains Mono is
gone; tabular numerals come from `tabular-nums`, not a second family. Hierarchy is carried by
weight and line height more than by size.

| Utility | Size | Weight | Line height |
| --- | --- | --- | --- |
| `t-display` | 32 → 40px | 600 | 1.2 |
| `t-page` | 28 → 32px | 600 | 1.3 |
| `t-section` | 24px | 600 | 1.4 |
| `t-card` | 18px | 500 | 1.4 |
| body (default) | 16px | 400 | 1.5 |
| small | 14px | 400 | 1.5 |
| `t-label` | 14px | 600 | 1.2 |
| `t-micro` | 11px | 600 uppercase, tracked | 1.1 |

## Layout & spacing

Fixed 1280px grid on desktop, fluid on mobile, on a strict 8px base. `content-max` encodes it:
`max-w-[1280px]` with 24px side margins on mobile and 80px on desktop. Major sections are
separated by `py-section` (64px) and divided by a hairline rather than a heavy rule. Card grids
run 1 → 2 → 3/4 columns. Nothing scrolls horizontally except deliberate `hide-scrollbar` chip rails.

## Elevation

Tonal layers and hairlines, not shadows. Cards sit flat on the canvas with a 1px `hairline`
border; the only shadow tier is `shadow-lift` (`0 4px 12px rgba(0,0,0,.08)`) and it appears **on
hover only** — plus on floating chrome (dropdowns, the map legend, hero pulse pills).

## Shape

| Radius | Value | Use |
| --- | --- | --- |
| `rounded-md` | 12px | Inputs, small tiles, list rows |
| `rounded-lg` | 16px | Cards, panels, containers |
| `rounded-xl` | 24px | Hero panel, full-width CTA block |
| `rounded-full` | — | Buttons, chips, search, avatars, progress |

## Components

Composed utilities in `src/app/globals.css` — reach for these before writing raw classes:

- **`btn-primary` / `btn-secondary`** — 48px pill (`btn-sm` → 40px). Primary is `primary` fill on
  white text; secondary is white with a 1px ink border.
- **`surface-card`** — 16px radius, hairline border, white fill. Pair with **`card-hover`** for lift.
- **`chip`** — pill, `surface-variant` fill, `outline-variant` border. The demand-pulse chip is the
  signature component: fill by demand tier, with the score in an inset white pill.
- **`input`** / **`field`** — 48px field, 12px radius, `primary` focus ring at 20% opacity.
- **`t-*`** — the type scale above.
- **Pill search** — the marketplace search is one 56px `rounded-full` container with internal
  hairline dividers separating segments and a circular `primary` submit button.
- **Progress** — 8px `rounded-full` track on `surface-variant`; fill `primary` for course progress,
  `secondary` for growth, `success` for goals.
- **Course card** — `aspect-[1.5/1]` header carrying the course's stock hero image (`CoursePlate`,
  falling back to a warm tint plate with the course monogram when a course has no image), a category
  chip over it, then title, headline, and a hairline-topped metadata row. **No price** — courses are
  not priced in this product.

## Icons

Inline SVG only, `stroke="currentColor"`, `strokeWidth="1.75"`, sized `size-4`/`size-5`. No icon
font, no CDN — the reference mockups pull Material Symbols from a CDN and the implementation
deliberately does not.

## Accessibility

WCAG AA contrast on every text/color pair. Focus is always visible:
`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`. Demand tier
is never communicated by color alone — every colored signal carries a text label or score.


## The skill map

The map is the product's hero artifact, so it gets its own rules.

- **Paper**: white, with a 1px `hairline` dot grid at 32px (`map-paper`).
- **Territory rings**: large circles, 1px `hairline` border, a barely-there `surface/45` fill, with
  the territory name set inside the ring at the top in 25px `muted/70`. Rings carry **generous
  internal whitespace** — nodes occupy roughly 15–30% of the ring's area. That airiness is the
  point: packing every skill in tightly turns the map into a bubble chart.
- **Skill nodes**: circles sized by demand score (28–56px radius), filled with their demand colour
  at ~9% over the canvas plus a diagonal gradient sheen, ringed in the solid demand colour (2px for
  high demand, 1.5px otherwise). The name sits inside the circle, and its font size is computed
  from both the demand score *and* the longest word in the name, so labels never overflow.
- **Density**: each territory draws only its top few skills as nodes; the rest are reachable through
  a `+N more` pill that opens the territory in the side panel. Every skill stays reachable; the
  default view stays legible.
- **One frame, one size**: `SkillMapStage` renders the map beside a 320px panel and is used by both
  map surfaces, so the canvas never resizes as you move between them. The stage also owns the
  `+N more` panel state, so that affordance works on every page rather than only where a page
  remembered to wire up a handler.
- **Every node is a link** to `/skill/[slug]`. There is no in-place selection state anywhere in the
  map — choosing a skill is always a real navigation, which is why the panel can never go stale.
- **Active skill**: the node for the page's own skill scales up and gains a demand-tinted ring plus
  a soft outer glow.
  High-demand nodes carry a slow pulse, suppressed under `prefers-reduced-motion`.
- **Layout is computed, never hand-placed** (`buildMapLayout` in `src/lib/territories.ts`): clusters
  are packed, measured, then arranged so nothing overlaps and the map stays correct as skills are
  added. It fits its container in **pure CSS** — an aspect-locked, container-query-sized layer with
  percentage positions and `cqw` type — so the map renders correctly before any JavaScript runs.
  Zoom and pan then ride on top as a single composited transform.
- **Chrome**: zoom controls top-left, demand legend bottom-left, both on `bg-canvas/90` with a
  hairline border and `shadow-lift`.

## Demand tiers

`demandTier` cuts at 84% / 62% / 34% of the observed score range. The cuts sit high on purpose: the
catalogue skews toward in-demand skills, and a lower bar labelled almost everything "high demand",
which told the reader nothing and painted the whole map red.
