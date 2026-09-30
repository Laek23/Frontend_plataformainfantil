---
name: Playful Explorer
colors:
  surface: '#f7f9ff'
  surface-dim: '#ccdcf0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e3efff'
  surface-container-high: '#daeaff'
  surface-container-highest: '#d4e4f9'
  on-surface: '#0d1d2c'
  on-surface-variant: '#404752'
  inverse-surface: '#233241'
  inverse-on-surface: '#e9f1ff'
  outline: '#707783'
  outline-variant: '#c0c7d4'
  surface-tint: '#0060a8'
  primary: '#005ea4'
  on-primary: '#ffffff'
  primary-container: '#0077ce'
  on-primary-container: '#fdfcff'
  inverse-primary: '#a2c9ff'
  secondary: '#785900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc003'
  on-secondary-container: '#6c5000'
  tertiary: '#006b1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e862d'
  on-tertiary-container: '#f7fff1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#a2c9ff'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#004881'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#fabd00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#94f990'
  tertiary-fixed-dim: '#78dc77'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005313'
  background: '#f7f9ff'
  on-background: '#0d1d2c'
  surface-variant: '#d4e4f9'
typography:
  display-hero:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.5px
  display-hero-mobile:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.25px
  label-md:
    fontFamily: Quicksand
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: Quicksand
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.1px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  touch-min: 3.5rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  gap-xs: 0.25rem
  gap-sm: 0.5rem
  gap-md: 1rem
  gap-lg: 1.5rem
  gap-xl: 2rem
  gap-2xl: 3rem
---

## Brand & Style

This design system establishes an energetic, kid-centric, gamified educational ecosystem tailored for children aged 5 to 11. The visual tone is encouraging, celebratory, and endlessly curious, avoiding sterile software aesthetics in favor of a toy-box, tactile experience. 

### Design Movement: Tactile Neomorphic-Pop
The visual style fuses modern clean vector UI with physical, chunky toy-like interactions:
- **Chunky & Clickable:** Components possess structural physical depth using solid offset shadows (under-cuts) that simulate real-world mechanical buttons.
- **Organic Softness:** Heavy radii eliminate harsh edges, delivering a safe, friendly, and non-intimidating posture.
- **Subject Identity:** Mathematics, Spanish, and History maintain distinctive environmental colors that transform the screen into dedicated play zones without fracturing overall systemic harmony.
- **Feedback & Reward:** Interfaces feel responsive through bounce, state shifts, star cascades, and punchy progress gauges designed to celebrate mini-milestones instantly.

## Colors

The palette balances joyful saturation with accessible contrast ratios (minimum 4.5:1 for body copy against light tints). Color is not merely ornamental; it establishes spatial context and semantic subject orientation.

### Subject & Role Assignments
- **Primary Sky Blue (`#1E88E5`):** General navigational chrome, app framing, active states, and Mathematics interface modules. Base button depth under-cut: `#1565C0`.
- **Secondary Sunny Gold (`#FFC107`):** Reward states, XP counters, stars, achievement ribbons, and streak multipliers. Under-cut: `#FFA000`.
- **Tertiary Lush Green (`#4CAF50`):** Correct answers, validation triumphs, growth indicators, and Spanish language tracks. Under-cut: `#388E3C`.
- **Coral Orange (`#FF7043`):** Call-to-action prompts, urgent energy, daily challenges, and play-head markers. Under-cut: `#E64A19`.
- **Mystic Violet (`#8E24AA`):** History, discovery quests, time capsules, and storytelling modes. Under-cut: `#6A1B9A`.

### Neutrals & Surfaces
- **Canvas Default:** `#F0F7FF` (Crisp Sky Tint)
- **Surface Layer / Card Background:** `#FFFFFF` (Solid Clean White)
- **Muted Surface:** `#E8F1FA` (Inset Well Backgrounds)
- **Text Primary:** `#2B3A4A` (Deep Slate Navy; softer and more playful than pure black while maintaining WCAG AAA contrast)
- **Text Muted:** `#6A7B8C` (Supporting captions, instructional prompts)

## Typography

Typography prioritizes extreme legibility for early and intermediate readers. Quicksand provides friendly, curved headline geometry with round terminals that feel approachable, while Nunito Sans supplies balanced, open letterforms that keep body explanations effortless to parse.

- **Weight Floor:** The body copy standard starts at SemiBold (`600`) to increase stroke density on mobile screens, counteracting glare and variable viewing distances.
- **Reading Distance:** Headings favor loose line-heights to support finger tracking and voice-over highlighting.
- **Numbers & Counters:** All numerical readouts (XP, scores, timers) leverage Quicksand Bold (`700`) with tabular alignment to avoid jitter during real-time scoring updates.

## Layout & Spacing

Layouts adhere to an 8px spatial grid, scaling to 4px for tight internal component paddings. Given the target age group's motor skill range, generous touch targets are mandated throughout.

### Touch Target Minimums
- **Primary Interactive Targets:** Minimum height and width of `56px` (`3.5rem`).
- **Secondary Icon Anchors:** Minimum clickable boundary of `48px`.

### Responsive Adaptation
- **Mobile (portrait, up to 599px):** Single-column vertical stacking. Side margins fixed at `16px` (`1rem`). Critical game controls anchor along the bottom `120px` safe zone for thumbs.
- **Tablet (600px - 1023px):** 2-column or dual-pane layout (e.g., Question/Prompt on the left, tactile Answer Palette on the right). Margins expand to `24px` (`1.5rem`).
- **Desktop/Large Tablet Landscape (1024px+):** Centered active container locked at a maximum width of `960px` to preserve focused game scope and minimize broad eye scans.

## Elevation & Depth

This design system avoids blurry, complex ambient shadows in favor of crisp, physical **"toy-press"** depth. Elements interact as layered plastic or wooden tiles resting in structural trays.

### Physical Lift (The Button Drop)
- **Base State:** Surfaces showcase a solid color stroke or bottom offset block (`0px 4px 0px [Under-Cut Color]`).
- **Hover/Float State:** Translates `-2px` on the Y-axis with a bottom offset expanding to `6px`.
- **Pressed/Active State:** Translates `+4px` on the Y-axis; bottom offset collapses to `0px`. The interface produces an instant visual snap down into the surface.

### Surface Trays
- Inactive card areas, answer receptacles, and empty slot meters utilize inset styling (`box-shadow: inset 0px 3px 0px rgba(43, 58, 74, 0.08)`), signaling to the child that an object can be placed or snapped into that space.
- Floating modal dialogs use an ultra-crisp border contour (`3px solid #2B3A4A`) accompanied by an opaque bottom-right drop block (`0px 8px 0px rgba(43, 58, 74, 0.15)`).

## Shapes

The design system embraces ultra-soft, friendly contours across all touchpoints, eliminating sharp 90-degree apexes entirely. 

- **Small Components (Chips, Tags, Badges):** Fully pill-shaped (`border-radius: 9999px`) to invite touch.
- **Medium Components (Buttons, Input Fields, Receptors):** Styled with a `16px` to `20px` radius, maintaining smooth corner curves without collapsing into complete circles.
- **Large Containers (Cards, Sheet Modals, Dialogs):** Styled with a heavy `24px` to `28px` corner radius, creating a comfortable frame that feels soft and handheld.

## Components

### Buttons
- **Structure:** Chunky capsules with a structural bottom offset (e.g., `#1E88E5` face with a `#1565C0` 4px base). Text is styled using `label-lg` in pure white with subtle text-shadow for punch.
- **Variants:** 
  - *Primary (Coral / Blue):* Main action, full-width or oversized.
  - *Success (Green):* Confirming answers, advancing tasks.
  - *Secondary (White):* White surface, `#2B3A4A` text, light gray bottom offset (`#D0DBE5`).

### Choice Cards & Answer Chips
- **Resting:** Flat white card surface with a 2px outline of `#E0E8F0` and a 3px bottom lift. Contains icon/illustration and `headline-sm` label.
- **Selected:** Border shifts to 3px solid Primary Sky Blue with an ice-blue fill tint (`#E1F0FF`).
- **Evaluated (Correct):** Snaps to Lush Green background with a bouncy scale-up animation (`transform: scale(1.03)`).
- **Evaluated (Incorrect):** Muted terracotta border with a gentle horizontal wobble; bottom lift drops flat.

### Reward Badges & Star Counters
- **Counter Capsule:** Pill shape with `#FFFFFF` background, a 2px sunny yellow border, and secondary color glow.
- **Star Icons:** Sits slightly overlapping the left boundary of the pill, rendered in Sunny Gold with a thick outer white stroke to pop off backgrounds.
- **XP Progression Meter:** Rounded trough (`height: 18px`, background: `#E8F1FA`) containing a bubbly Lush Green fill layer capped by a high-gloss reflection highlight stripe running across the top edge.

### Checkboxes & Selection Nodes
- Replaced by chunky, stamp-style radio bubbles.
- Empty state: Thick circular ring (`3px solid #CFDAE6`) with an indented center.
- Checked state: Snappy pop animation filling the circle with `#4CAF50` and an extra-bold white checkmark icon.

### Form & Number Inputs
- Large, pill-rounded input fields with deep internal padding (`16px 20px`).
- Inset shadow mimics an indented tray ready for numeric or word blocks.
- Focus state activates an animated pulsing 3px border in Primary Sky Blue.