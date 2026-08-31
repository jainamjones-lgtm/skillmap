---
name: Warm Professionalism
colors:
  surface: '#fff8f7'
  surface-dim: '#f2d3d3'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f0'
  surface-container: '#ffe9e9'
  surface-container-high: '#ffe1e2'
  surface-container-highest: '#fbdbdc'
  on-surface: '#281718'
  on-surface-variant: '#5c3f41'
  inverse-surface: '#3f2b2c'
  inverse-on-surface: '#ffedec'
  outline: '#906f70'
  outline-variant: '#e5bdbe'
  surface-tint: '#be0038'
  primary: '#ba0036'
  on-primary: '#ffffff'
  primary-container: '#e21e4a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2b6'
  secondary: '#7e5700'
  on-secondary: '#ffffff'
  secondary-container: '#feb300'
  on-secondary-container: '#6a4800'
  tertiary: '#006a45'
  on-tertiary: '#ffffff'
  tertiary-container: '#008558'
  on-tertiary-container: '#f6fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb2b6'
  on-primary-fixed: '#40000d'
  on-primary-fixed-variant: '#920029'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#ffba35'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#80f9bd'
  tertiary-fixed-dim: '#62dca3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005234'
  background: '#fff8f7'
  on-background: '#281718'
  surface-variant: '#fbdbdc'
  ink: '#222222'
  muted: '#6a6a6a'
  hairline: '#dddddd'
  canvas: '#ffffff'
  demand-high: '#ff385c'
  demand-medium: '#ffb400'
  demand-low: '#929292'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  page-heading:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  section-heading:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  card-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.1'
  micro:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter-md: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 64px
---

## Brand & Style

The design system for the product evokes a sense of **trust, warmth, and market vitality**. It is built for a demand-driven learning marketplace, blending the expansive, hospitable feel of a premium lifestyle brand with the structured information density required for educational growth.

The visual style is **Corporate / Modern** with a strong leaning toward **Minimalism**. It prioritizes a generous white "canvas" to let course imagery and demand signals breathe, while utilizing soft geometry and human-centric typography to remain approachable. The interface is intentionally "un-corporate," avoiding stiff grids in favor of a fluid, photography-led experience that makes the pursuit of knowledge feel like an aspirational journey rather than a chore.

## Colors

The palette is anchored by a high-contrast relationship between a pure white **Canvas** and deep **Ink** text. This ensures maximum legibility and a premium feel. 

The **Primary** color is a high-voltage, Rausch-inspired red used for action-oriented elements and the "High Demand" signal. **Secondary** (an orange-tinted gold) is reserved for "Medium Demand" and highlighting progress. A neutral, muted palette of greys handles secondary information and "Low Demand" signals without cluttering the visual field. Interactive states should utilize a subtle 10% darkening of the primary color for hover/active feedback.

## Typography

This design system uses **Inter** exclusively to maintain a clean, humanist, and systematic aesthetic. The typographic hierarchy relies on weight and line height rather than excessive size differences to manage information density.

- **Headlines:** Use Semi-Bold (600) for strong visual anchoring.
- **Body Text:** Use Regular (400) for comfortable reading in course descriptions.
- **Metadata:** Labels and badges use Medium (500) or Bold (700) at smaller sizes to ensure "at-a-glance" readability for ratings, durations, and levels.
- **Line Heights:** Generous line heights (1.4 - 1.5) are applied to body text to prevent the UI from feeling cramped during long-form learning sessions.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (max-width: 1280px) and a fluid model on mobile. A strict **8px base grid** governs all padding and margins to maintain rhythmic consistency.

- **Margins:** Desktop pages use an 80px side margin to create the "generous canvas" feel. Mobile scales this down to 24px.
- **Grid:** A 12-column grid is used for course marketplaces, allowing for 3 or 4-up card layouts.
- **Vertical Spacing:** Major sections are separated by 64px, while internal card components use 8px (base) or 16px increments.
- **Responsiveness:** On tablet, the grid reflows to 2 columns. On mobile, the grid becomes a single column with cards spanning the full width minus margins.

## Elevation & Depth

This design system utilizes **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. The goal is to keep the interface feeling light and "flat-first."

- **Surfaces:** All primary content sits on the #FFFFFF canvas.
- **Borders:** A 1px solid #DDDDDD border (Hairline) is used to define cards and sections without adding visual weight.
- **Hover States:** Elements like course cards use a single, highly diffused shadow tier on hover: `0 4px 12px rgba(0,0,0,0.08)`. This provides a tactile "lift" without breaking the minimalist aesthetic.
- **Modals:** Use a 50% opacity black scrim and no border, relying on the diffused shadow for separation from the canvas.

## Shapes

The shape language is **Rounded**, favoring soft geometry that feels approachable and premium.

- **Base Radius:** 8px (0.5rem) for standard components like input fields and small cards.
- **Large Radius:** 16px (1rem) for marketplace course cards and container-level elements.
- **Pill Shape:** Buttons, search bars, and "Demand Pulse" badges use a full radius (9999px) to create distinct interactive focal points.
- **Separators:** Vertical and horizontal dividers use a 1px hairline thickness to remain as unobtrusive as possible.

## Components

### Demand Pulse Chip
A signature pill-shaped component (`rounded-full`). The background color corresponds to the demand level (Primary for High, Secondary for Medium, Muted-Grey for Low). Text is white or Ink depending on contrast.

### Marketplace Cards
Cards use a 16px radius and a 1px hairline border. Image headers should have a 1.5:1 aspect ratio. Metadata (rating, duration, level) is displayed in `body-sm` below the title, using subtle icons and the `muted` text color.

### Pill-Shaped Search
The global search bar is a large pill (`rounded-full`) with a height of 64px. It features internal dividers (`#DDDDDD`) to separate "Skill," "Timeline," and "Budget" segments, mimicking the Airbnb search experience.

### Buttons
- **Primary:** Pill-shaped, #FF385C background, white text, 48px height.
- **Secondary:** Pill-shaped, #FFFFFF background, 1px Ink border, Ink text.

### Progress Trackers
Horizontal bars with a 4px height and 8px radius. The "fill" uses the Secondary color to represent active growth.