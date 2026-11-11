# DESIGN.md — Shena Works

Design system specification for shenaworksltd.com: foundations, components, **states**, **motion**, behavior and accessibility.
Everything here is normative. Where a value is given, use it; where a state is listed, implement it.

> This file is the design system only. What each page contains and how sections are composed lives in `SITE-PLAN.md`; how to build it lives in `BUILD-GUIDE.md`. Nothing in those documents may introduce a color, radius, shadow, font, easing or duration that is not defined here.

**Contents**
1. Principles
2. Foundations: color, typography, spacing and layout, shape and elevation, iconography, imagery
3. Motion
4. State system
5. Components
6. Behavior specification
7. Accessibility
8. Responsive summary
9. Print and forced-colors
10. Tokens
11. Do and don't
12. Quick reference

**Conventions**
- `1rem = 10px` (root font-size 62.5%). Values are written as px with the rem equivalent where useful (24px = 2.4rem).
- Breakpoints are min-width: `xs` 414, `sm` 480, `md` 768, `lg` 1024, `xl` 1160, `2xl` 1500. "Below lg" means under 1024px.
- Contrast ratios are WCAG 2.x, computed. "Pass" means AA for the stated use.
- Light theme only. Dark areas are local **surfaces**, not a color mode.

---

## 1. Principles

1. **Signal, not decoration.** The single murram accent marks what is interactive, selected, or in progress. If it carries no meaning, it is not murram.
2. **Warm, flat, square.** Warm charcoal on white. Radius is 0. Lines are 2px. Depth comes from photography, gradients and one soft shadow.
3. **Type carries hierarchy.** Uppercase condensed headings and labels over a neutral humanist body. Never solve hierarchy with color or boxes first.
4. **Motion explains change.** Underlines draw, images wipe, panels slide. Everything decelerates. Nothing bounces.
5. **Hover and focus are siblings.** Every pointer affordance has a keyboard twin, and keyboard focus is always visible.
6. **Works before it moves.** Content is readable without JavaScript, usable by keyboard, and calm under reduced motion.

**Atmosphere.** Editorial and authoritative, never loud. Large condensed headlines over restrained photography, generous white space, murram used like a pen mark.

---

## 2. Foundations

### 2.1 Color

#### Accent rationale: Murram

The accent is **Murram** (`#c14a12`), the laterite orange of the murram roads and red-earth sites Shena grades, compacts and paves across Meru County. It also reads as the safety orange worn on site. It is used exactly as a pen mark: links, markers, focus, progress and the one primary button per view. It is deliberately not red (status `error` stays a separate crimson so an error is never mistaken for a brand signal) and not plant yellow (yellow cannot meet 4.5:1 as text on white).

> Phase 1 check: compare `accent-500` with the Shena Works logo files. If the logo uses a conflicting hue, change only the four accent tokens below and re-run the contrast table; every other value stays.

#### Palette

| Token | Hex | RGB | Role |
|---|---|---|---|
| `accent-500` | `#c14a12` | 193 74 18 | **The accent.** Link underlines, list markers, text selection, checked indicator, required marker, progress fills, timeline, focus ring on light surfaces, primary button surface. |
| `accent-600` | `#963a12` | 150 58 18 | Accent hover fill; hover/focus text on light. (Errors use the separate `error` token, see Status colors.) |
| `accent-700` | `#7a3214` | 122 50 20 | Accent pressed fill; hover/focus text on light; deep murram surface. |
| `accent-on-dark` | `#ff8f50` | 255 143 80 | The accent when it sits on ink surfaces (text, icons, markers, progress). 6.31:1 on `ink-900`. |
| `ink-975` | `#1a1713` | 26 23 19 | Pressed fill on `ink-900` surfaces. |
| `ink-950` | `#221f1b` | 34 31 27 | Hover fill on `ink-900` surfaces; deepest dark surface. |
| `ink-900` | `#2e2a25` | 46 42 37 | **Ink.** Headings, body text, dark panels, footer, header UI, checkbox border. |
| `ink-850` | `#312e2a` | 49 46 42 | Hover fill on `ink-800` surfaces. |
| `ink-800` | `#3e3935` | 62 57 53 | Secondary dark. Strong borders, focus borders, scrim base, dark buttons. |
| `ink-600` | `#65615d` | 101 97 93 | Secondary text, field borders, placeholder on grey-100. |
| `grey-600` | `#767676` | 118 118 118 | Placeholder on white; neutral icons. |
| `grey-500` | `#9ea1a2` | 158 161 162 | Overline on dark surfaces; disabled text; pressed fill on `grey-300` surfaces. |
| `grey-400` | `#bdbbbb` | 189 187 187 | Disabled borders; hover fill on `grey-300` surfaces; pressed fill on `grey-100` surfaces. |
| `grey-300` | `#d7d6d6` | 215 214 214 | Hairlines, rules, tracks, placeholders for media; hover fill on `grey-100` surfaces. |
| `grey-100` | `#ebebea` | 235 235 234 | Subtle surface, header secondary-nav border, skeleton base. |
| `white` | `#ffffff` | 255 255 255 | Base surface; text on dark and accent. |

Lightness order, dark to light: `ink-975 < ink-950 < ink-900 < ink-850 < ink-800 < ink-600 < grey-600 < grey-500 < grey-400 < grey-300 < grey-100 < white`. Pure black (`#000`) is not part of the system except in print.

#### Status colors

Status color is for **messages and validation only**. It is always paired with an icon and text, never color alone.

| Status | Text / icon / bar | Tint background | Contrast (text on white / on tint) |
|---|---|---|---|
| Error | `#9d1c30` (`error`) | `#fdf1f2` | 7.95 / 7.21 |
| Success | `#1d6b45` | `#eef7f1` | 6.48 / 5.93 |
| Warning | `#7a4f00` | `#fbf4e4` | 7.13 / 6.50 |
| Information | `ink-900` | `grey-100` | 14.25 / 11.94 |

#### Overlays and gradients

| Name | Value | Use |
|---|---|---|
| `shade` | `rgb(62 57 53)` | Single base for every scrim, gradient and shadow. |
| Scrim | `shade / .5` | Behind menus and dialogs. z 25. |
| Header overlay | `ink-900 / .95` | Dark header or menu surface. |
| Hero top | `180deg, shade/.5 -> shade/0`, multiply; 88px tall (153px at lg) | Legibility under a transparent header. |
| Hero bottom / text-on-photo | `180deg, shade/0 -> shade/.9`, multiply; covers the lower 66.67% | Headline legibility on photography. |
| Footer call-to-action band (lg) | The text-on-photo ramp, flipped, starting 28.125% down | Footer CTA over an image. |
| White fade | `180deg, transparent -> white`; 160px (340px for large location/career blends at lg) | Blends imagery into the page. |
| Edge fade | `90deg, transparent -> white` (`grey-100` on grey-100); 48px | Horizontal-scroll affordance. |

#### Surfaces and their contextual tokens

Set `data-surface` on any container to flip foreground, rules, links, and the focus ring together.

| `data-surface` | Background | Text | Muted text | Rule | Link underline | Accent for signals | Focus ring |
|---|---|---|---|---|---|---|---|
| *(default)* | `white` | `ink-900` | `ink-600` | `grey-300` | `accent-500` | `accent-500` | `accent-500` |
| `subtle` | `grey-100` | `ink-900` | `ink-600` | `grey-300` | `accent-500` | `accent-500` | `accent-500` |
| `dark` | `ink-900` | `white` | `grey-500` | `ink-600` | `white` | `accent-on-dark` | `white` |
| `deep` | `ink-950` | `white` | `grey-500` | `ink-600` | `white` | `accent-on-dark` | `white` |
| `accent` | `accent-500` | `white` | `white` | `white / .4` | `white` | `white` | `white` |
| `photo` (with gradient) | image + `shade` gradient | `white` | `white` | `white / .3` | `white` | `white` | `white` |

#### Selection

`::selection` is `accent-500` with white text. On `accent` surfaces it is `ink-800` with white text.

#### Contrast guarantees (verified)

| Pair | Ratio | Use allowed |
|---|---|---|
| `ink-900` on `white` | 14.25 | All text |
| `ink-800` on `white` | 11.40 | All text |
| `ink-600` on `white` / `grey-100` | 6.14 / 5.15 | All text |
| `grey-600` on `white` | 4.54 | Text on white only (placeholders, meta) |
| `grey-600` on `grey-100` | 3.81 | Not for text. Use `ink-600`. |
| `accent-500` on `white` | 4.93 | All text and signals |
| `accent-500` on `grey-100` | 4.14 | Large text (24px+) and non-text signals only |
| `accent-500` on `ink-900` | 2.89 | **Never.** Use `accent-on-dark`. |
| `accent-on-dark` on `ink-900` / `ink-950` | 6.31 / 7.26 | All text on dark |
| `white` on `accent-500` | 4.93 | Button labels |
| `white` on `accent-600` / `accent-700` | 7.21 / 9.15 |
| `error` on `white` / `error-tint` | 7.95 / 7.21 | Error text, borders, bars | Hover / pressed |
| `white` on `ink-975`...`ink-800` | 11.40-17.86 | All text |
| `white` on `ink-600` | 6.14 | All text |
| `grey-500` on `ink-900` | 5.48 | Overlines and meta on dark |
| `grey-500` on `ink-800` | 4.38 | Large text only on `ink-800` |
| `ink-900` on `grey-300` / `grey-400` / `grey-500` | 9.82 / 7.46 / 5.48 | Text on grey button states |
| `white` on `grey-400` | 1.91 | **Never.** Ink text on grey surfaces. |
| `grey-500` on `white` | 2.60 | Disabled only (exempt); never for information |
| `grey-300` on `white` | 1.45 | Decorative hairlines only; never as the sole boundary of a control |

### 2.2 Typography

#### Families

| Token | Stack | Weights | Role |
|---|---|---|---|
| `font-header` | `"Roboto Condensed", Helvetica, Arial, sans-serif` | 400, 700 | Headings, labels, buttons, tabs, blockquotes. Uppercase except blockquotes. |
| `font-body` | `Roboto, Helvetica, Arial, sans-serif` | 400, 400 italic, 700 | Reading text, captions, form text. |
| `font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | system | `code`, `kbd`, `pre`, `samp` only. |

- Self-host WOFF2 with WOFF fallback, `font-display: swap`, `local()` first. Preload the Roboto 400 and Roboto Condensed 700 files.
- Only these weights exist. No Condensed italic. `strong` and `b` render at 700.
- Headings are **weight 400**. Bold is reserved for labels, buttons, link lists, tabs and inline links in prose.
- Rendering: `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `font-kerning: normal`, `text-size-adjust: none`.
- Use `text-wrap: balance` on headings of up to four lines and `text-wrap: pretty` on prose.
- Line-height is specified in px per role (below). Body default `html { line-height: 1.5 }` is a fallback only.

#### Type ramp

| Token | Family / weight / case | Below lg (size/leading) | lg and up | Tracking | Color | Use |
|---|---|---|---|---|---|---|
| `display` | Condensed 400, UPPER | 56/60 | 88/92 | -0.007em | ink-900 | Hero headline, single largest statement |
| `h1` | Condensed 400, UPPER | 38/44 | 66/70 | -0.007em | ink-900 | Page title |
| `h2` | Condensed 400, UPPER | 30/34 | 48/52 | -0.007em | ink-900 | Section title |
| `h3` | Condensed 400, UPPER | 24/28 | 32/36 | -0.007em | ink-900 | Sub-section, card feature title |
| `h4` | Condensed 400, UPPER | 20/24 | 24/28 | 0 | ink-900 | Card title, list title |
| `lead` | Roboto 400 | 20/30 | 26/36 | 0 | ink-900 | Standfirst under a title |
| `body` | Roboto 400 | 16/24 | 18/26 | 0 | ink-900 | Reading text, lists |
| `body-sm` | Roboto 400 | 15/22 | 15/22 | 0 | ink-900 | Secondary text, footer links |
| `body-xs` | Roboto 400 | 14/21 | 14/21 | 0 | ink-600 | Meta, help text, secondary nav |
| `caption` | Roboto 400 | 12/17 | 14/21 | 0 | ink-600 | Image credits, legal |
| `figcaption` | Roboto 400 | 14/21 | 14/21 | 0 | ink-600 | Figure captions |
| `label` | Condensed 700, UPPER | 15/19 | 16/20 | +0.4px / +0.3px | inherits | Buttons, tabs, link lists, nav |
| `overline` | Condensed 700, UPPER | 14/18 | 14/18 | +0.4px | ink-600 (grey-500 on dark) | Category above a title |
| `blockquote` | Condensed 400, sentence case | 24/28 | 32/36 | 0 / -0.007em | ink-900 | Pull quotes |
| `field-label` | Roboto 700 | 14/21 | 14/21 | 0 | ink-900 | Label above a form control |
| `field-text` | Roboto 400 | 16/24 | 16/24 | 0 | ink-900 | Value typed in a control (16px prevents mobile zoom) |
| `field-help` | Roboto 400 | 14/21 | 14/21 | 0 | ink-600 | Help and validation text |

Uppercase is applied with `text-transform: uppercase`, not typed capitals.

#### Prose rhythm

| Rule | Value |
|---|---|
| Paragraph gap | `1em` |
| `h2`, `h3` bottom margin | 24px (none when last child) |
| `hr`, or an `h3` after a paragraph, list, image or figure | top margin 56px |
| `hr` | `2px solid grey-300`; bottom margin 56px (none when last) |
| Lists | `ul` square markers, `ol` decimal; `padding-left` 28px; each item adds 6px left padding; item gap 12px; list bottom margin 40px |
| List markers | `accent-500`, bold |
| Blockquote | `mt` 46.7px (42.7px at lg) when first; **110px (106px at lg)** when after other content; `mb` 64px (none when last); quote glyph 28 x 22.7px in `accent-500` centered above on mobile, left-aligned at lg |
| Link list | `ul` gap 10px, `li` gap 8px, `label` style |
| Figures | `mb` 32px; caption `mt` 24px |
| Max line length | 75ch for `body`; headings are not constrained |

#### Inline links in prose

Bold (700), no `text-decoration`, with a **2px underline** drawn by background gradient. On default and subtle surfaces the underline is `accent-500` and the link text is `ink-900` (one step stronger than muted `ink-600` surrounding text); on `dark`, `deep`, `accent` and `photo` surfaces text and underline are white. Behavior in 5.1.

### 2.3 Spacing, layout and sizing

#### Root and fluid scaling

- Up to 1499px the root is 10px. **From 1500px the root is `0.666667vw`** (exactly 10px at 1500px), so every rem measure scales linearly: 1920px -> 12.8px root, 2560px -> 17.07px root. The layout is fluid above 1500, not capped.

#### Spacing scale

`space-N` = N x 4px.

| Token | px | rem | Token | px | rem |
|---|---|---|---|---|---|
| `space-1` | 4 | .4 | `space-14` | 56 | 5.6 |
| `space-2` | 8 | .8 | `space-16` | 64 | 6.4 |
| `space-3` | 12 | 1.2 | `space-20` | 80 | 8 |
| `space-4` | 16 | 1.6 | `space-30` | 120 | 12 |
| `space-6` | 24 | 2.4 | `space-40` | 160 | 16 |
| `space-8` | 32 | 3.2 | `space-50` | 200 | 20 |
| `space-10` | 40 | 4 | `space-70` | 280 | 28 |
| `space-12` | 48 | 4.8 | | | |

Optical adjustments of 1-2px are allowed inside a single component for baseline alignment (for example, the `7px / 6px` button padding). They never leak into layout spacing.

#### Section rhythm

| Section type | Vertical padding below lg | lg and up |
|---|---|---|
| Standard | 64 | 80 |
| Spacious (features, quotes, stats) | 80 | 120 |
| Hero content offset from top | header height + 40 | header height + 80 |
| Gap between components in a section | 32-48 | 48-64 |

#### Containers and gutters

| Breakpoint | Container max | Page gutter |
|---|---|---|
| below md | 100% | 24 |
| `md` | 768 | 24 |
| `lg` | 1024 | 24 |
| `xl` | 1160 | 56 |
| `2xl` | fluid (scales with root) | 56 |

#### Grid

- Below lg: single column. At `md`, two-up (`1fr 1fr`) is allowed with a 32px gap.
- **At lg: 16 columns**, `repeat(16, minmax(0, 1fr))`, 32px column gap.
- The **content frame is columns 2-15** (`grid-column: 2 / span 14`). Columns 1 and 16 are margin bands; full-bleed media uses 1-16.
- Placement notation `col-{start}-{span}`. Standard spans: 2-14 (full content), 2-10 + 12-4 (main + aside), 4-10 (narrow reading), 7-10 (offset), 9-7, 1-16 (full bleed).
- Sub-navigation lists use three columns with a 9.0909% gap. Stat rows use a 10.769% gap.

#### Breakpoints

| Name | Width | Layout change |
|---|---|---|
| `xs` | 414 | Shorts carousel: slide width `100vw - 48px`, bleeds right. |
| `sm` | 480 | Collection slide becomes 2-up: `50vw - 40px`. |
| `md` | 768 | Two-up grids; floated figures; feature-card motion; collection slide 3-up: `29.1667vw - 35.33px`. |
| `lg` | 1024 | **Desktop navigation, 16-column grid, hover menus, hide-on-scroll header**; collection slide `29.1667vw - 54px`. |
| `xl` | 1160 | 56px gutter; 48 x 167 logo. |
| `2xl` | 1500 | Fluid root scaling. |

#### Fixed dimensions

| Item | Value |
|---|---|
| Mobile header bar (collapsed) | 52px; open drawer height `100dvh - 52px` |
| Desktop header | secondary row 40px + primary row 88px = **128px** |
| Header logo | 40 x 139.2px; 48 x 167px from `xl` |
| Footer logo | 48 x 215px |
| Hero min-height | 560px; 720px at lg |
| Touch target | **44 x 44px** minimum hit area on coarse pointers (see 4.4) |
| Icon sizes | 16, 18, 24 (interface); 32, 40 (feature) |
| Lottie stat | height 136px, auto width |
| Shorts slide | 9:16, max width 366px |
| Field height | 48px |
| Arrow / icon button | 48 x 48px (40 x 40 for dense) |

#### Z-index layers

| Layer | z |
|---|---|
| Behind content | -1 |
| Base | 0 |
| Raised content, hero layers (local stacking context) | 10-16 |
| Sticky section nav, edge fades | 20 |
| **Scrim** | **25** |
| **Header** (dropdown panels sit beneath the bar inside it) | **30** |
| Mobile drawer / nav panels | 40 |
| Dialog | 50 |
| Skip link, toast | 60 |

### 2.4 Shape, borders, elevation

| Token | Value |
|---|---|
| Radius | `0` everywhere; `50%` only on radio controls |
| Hairline | 1px (table rows, section dividers) |
| Signature line | **2px** (rules, underlines, control borders, outlines, progress) |
| Border colors | `grey-300` decorative; `ink-600` control boundary; `ink-800`/`ink-900` strong and focus; `accent-500` signal; `error` (`#9d1c30`) error |

| Elevation | Value | Use |
|---|---|---|
| 0 | none | Default: flat |
| 1 | `filter: drop-shadow(0 2px 8px shade/.10)` (mobile `0 2px 4px`) | Scrolled-up header, open mega panel, hover cards |
| 2 | `filter: drop-shadow(0 8px 24px shade/.16)` | Dialogs |

Shadows use `filter: drop-shadow` so they follow the element's alpha silhouette. Photography sits flat. Photo blend: `mix-blend-mode: multiply` on gradients.

### 2.5 Iconography

- 24px grid, **2px stroke**, square caps and mitered joins, `currentColor`, no fills except `play`.
- Sizes: 16 (inline), 18 (controls), 24 (buttons, messages), 32/40 (feature).
- Required glyphs: chevron (up/down/left/right), arrow-right, close, plus, minus, check, search, menu (two bars: 2px, 8px apart), external-link, play, pause, alert (error), info, success.
- Icons never stand alone: they sit next to text or carry an `aria-label` (icon buttons) and are `aria-hidden` otherwise.
- Chevron rotates 180deg when its trigger is `aria-expanded="true"` (200ms, `ease-out-cubic`).
- Separator slash (breadcrumbs, fractions): a 2 x 17px bar of `currentColor`, skewed -27.5deg, 12px side margins.

### 2.6 Imagery and media

| Rule | Value |
|---|---|
| Aspect ratios | 16:9, 4:3, 8:5, 1:1, 9:16 (shorts) |
| Default | `display: block; width: 100%; max-width: 100%; height: auto`; always set `width`/`height` attributes to prevent layout shift |
| Loading placeholder | `grey-100` until decoded; lazy images fade in `opacity 0 -> 1` over 200ms |
| Art direction | Two `<picture>` sources: a portrait/square crop below lg and a landscape crop from lg |
| Text on photography | Always over the text-on-photo gradient (2.1); never over a raw image |
| Alt text | Required; decorative images use `alt=""` |
| Figure alignment (md and up) | `align-left` / `align-right` float with 32px inner margin; `align-center` centered |
| Vertical media | `min(100%, 366px)` wide; `is-vertical-small` is 30% |
| Captions | `figcaption` style, `mt` 24px; `caption-large` adds 30% right padding at lg |

---

## 3. Motion

### 3.1 Principles

1. **Decelerate.** Every movement eases out. No spring, no overshoot, no bounce.
2. **Two paces.** 200ms for feedback; 500ms-1s for atmosphere. Exits are faster than entrances.
3. **Cheap properties.** Motion uses `transform`, `opacity`, `clip-path` and `background-size`. Layout properties animate only where noted: `height` (accordion, grow-text), `width` (section nav), `padding` (feature card).
4. **Visibility is stepped.** Anything that fades out gets `visibility: hidden` *after* the fade, via a two-value delay (`0s, <duration>`), so it leaves the accessibility tree without cutting the fade short.
5. **Hover intent.** Menus wait 200ms before closing so a diagonal pointer path does not dismiss them.
6. **Direction means something.** Underlines enter from the left and leave to the right. Wipes travel the way the user is navigating.
7. **State changes never depend on motion.** Final states are fully defined without any transition (see 3.4).

### 3.2 Tokens

#### Easing

| Token | Curve | Use |
|---|---|---|
| `ease-out-cubic` | `cubic-bezier(.215, .61, .355, 1)` | **Default.** Scrim, header, color, opacity, wipes, cards, dialogs |
| `ease-out-expo` | `cubic-bezier(.19, 1, .22, 1)` | Large, confident moves: hero settle, section-nav toggle |
| `ease-in-out-cubic` | `cubic-bezier(.645, .045, .355, 1)` | Underline and swipe draws, link color |
| `ease-out-quad` | `cubic-bezier(.25, .46, .45, .94)` | Height transitions |
| `ease-out-quart` | `cubic-bezier(.25, 1, .5, 1)` | Programmatic carousel movement |
| `linear` | `linear` | Visibility steps, autoplay progress, spinner |

#### Duration

| Token | Value | Use |
|---|---|---|
| `dur-fast` | 200ms | Hover/focus feedback, accordion, mobile drawer, carousel scale, dialog exit, form fields |
| `dur-medium` | 400ms | Desktop header slide, dialog enter, hero crossfade, carousel scroll, hero-bottom gradient fade |
| `dur-slow` | 500ms | Scrim, image wipes, reveals |
| `dur-wipe` | 750ms | Large portrait wipes (headshots) |
| `dur-hero` | 1000ms | Hero settle, feature cards, section nav |
| `dur-autoplay` | 5000ms | Carousel autoplay progress (linear) |

#### Delay

| Token | Value | Use |
|---|---|---|
| `delay-intent` | 200ms | Menu close, scrim close |
| `delay-settle` | 200ms | Hero settle start |
| `delay-stagger` | 100ms | Per-sibling reveal stagger (cap at 5 siblings) |
| `delay-callout` | 250ms | Last image in a hero callout group |

### 3.3 Choreography catalog

#### A. Link and fill feedback

| Pattern | Trigger | Rest | Active | Timing |
|---|---|---|---|---|
| **Underline draw** | hover, focus-visible | 2px bar, `background-size: 0 2px`, anchored right (`100% 100%`) | `100% 2px`, anchored left (`0 100%`) | 200ms `ease-in-out-cubic`. Enters from the left, leaves to the right. |
| Underline **held** | `aria-current="page"` or `aria-expanded="true"` | Fully drawn | Hover/focus **retracts** it (current page) or turns text `ink-800` (expanded) | 200ms |
| Underline color | any change of surface | `--underline` | Color and bar animate together | 200ms, registered `<color>` custom property |
| **Prose link retract** | hover, focus-visible | 2px bar fully drawn in `currentColor` | Retracts to 0 toward the right | 200ms `ease-in-out-cubic` |
| **Swipe fill** | hover, focus-visible, not disabled | `background-size: 0 100%` | `100% 100%` | 200ms `ease-in-out-cubic`; grows from the left |
| **Pressed fill** | pointer down / `Space`/`Enter` down | Hover fill | Next-darker fill, **no transition** (instant) | 0ms |
| Icon rotation | `aria-expanded` change | 0deg | 180deg | 200ms `ease-out-cubic` |

**Fill ladder** (surface -> hover -> pressed): `accent-500` -> `accent-600` -> `accent-700`; `ink-800` -> `ink-850` -> `ink-900`; `ink-900` -> `ink-950` -> `ink-975`; `grey-300` -> `grey-400` -> `grey-500`; `grey-100` -> `grey-300` -> `grey-400`. The hover fill is always one step darker than its surface, the pressed fill two.

#### B. Page chrome

| Element | Closed / rest | Open / active | Timing |
|---|---|---|---|
| **Scrim** | `opacity 0; visibility hidden; pointer-events none` | `opacity 1; visibility visible; pointer-events auto` | Open: 0 delay, 500ms fade. Close: **200ms delay**, 500ms fade, visibility flips after 500ms (`linear`). |
| **Desktop header** | `transform: none` | Hidden: `translate3d(0,-100%,0)` while scrolling down | 400ms `ease-out-cubic` |
| Header appearance | Transparent (over hero) or white | Hover, focus-within, scrolling up, or any menu open: white bar, `ink-900` UI, `accent-500` underlines, secondary-nav border `grey-100`, elevation 1 | UI color and underline color 200ms |
| **Mobile drawer** | `translateY(calc(-100dvh + 5.2rem))` | `translateY(0)` | 200ms `ease-out-cubic`; none while dragging; nav content visibility delayed 200ms on close |
| Drawer toggle | at rest | While locked: `translate3d(-50%,-3.2rem,0)` | 200ms |
| **Multi-level menu** | level 0: `translateX(0)` | level 1: `-100%`; level 2: `-200%` | 200ms `ease-out-cubic`; hidden levels `visibility: hidden` after 200ms |
| **Desktop dropdown / mega panel** | `opacity 0; visibility hidden; pointer-events none` | `opacity 1; visibility visible; pointer-events auto` | Open: delays 0. Close: opacity 200ms after a **200ms delay**; visibility after 400ms. Trigger underline stays held while open. |
| **Section nav** (sticky index) | Hidden until the first scroll | Expanded: width -> measured pixel width; collapsed: width **89.6px** | Width 1s; toggle `transform` 1s `ease-out-expo`, `opacity`/`visibility` 1s linear (hiding delayed 1s), `color` 200ms |

#### C. Disclosure

| Element | Collapsed | Expanded | Timing |
|---|---|---|---|
| **Accordion panel** | `height: 0; visibility: hidden` | `height: auto` (animate between measured values) | 200ms `ease-out-quad`; visibility delayed 200ms on close |
| Tab underline | Not drawn | 2px `accent-500` drawn left to right | 200ms `ease-in-out-cubic` |
| Tab panel | Hidden | `opacity 0 -> 1` | 200ms `ease-out-cubic` |
| Grow-text (feature card) | `height: 0` | `height: auto` | 1s `ease-out-quad`; visibility delayed 1s on close |

#### D. Entrance

| Pattern | Hidden | Visible | Timing |
|---|---|---|---|
| **Reveal on scroll** | `opacity 0; transform: translateY(24px)` | `opacity 1; transform: none` | 500ms `ease-out-cubic`; siblings stagger 100ms (max 5); optional `delay-intent` |
| Reveal variants | `reveal-opacity` (fade only), `reveal-height`, `reveal-visibility`, `reveal-item` (children of an active slide or visible block) | final state of each property | same timing |
| **Hero settle** | `opacity 0; transform: scale(1.1)` | `opacity 1; scale(1)` | 1s `ease-out-expo`, 200ms delay |
| Hero callout stagger | last image waits | | +250ms |
| Lazy image | `opacity 0` | `opacity 1` | 200ms |
| Hint | `will-change: transform` is set at lg on large moving layers only while they are about to animate, then removed | | n/a |

#### E. Image wipes (`clip-path`)

| Component | Collapsed polygon | Full polygon | Duration | Behavior |
|---|---|---|---|---|
| Random-fade grid item | `(100% 0, 100% 0, 100% 100%, 100% 100%)` (right edge) | `(0 0, 100% 0, 100% 100%, 0 100%)` | 500ms `ease-out-cubic` | Active item **wipes in from the right** |
| Fade carousel, forward | left edge `(0 0, 0 0, 0 100%, 0 100%)` | full | 500ms | Outgoing slide wipes away to the left over the incoming slide |
| Fade carousel, backward | right edge | full | 500ms | Outgoing slide wipes away to the right |
| Fade carousel, incoming | n/a | full | **0ms** | Incoming slide appears instantly beneath (z 1 under z 2) |
| Headshot swap | top edge `(0 0, 100% 0, 100% 0, 0 0)` | full | **750ms** `ease-out-cubic` | Becoming active is instant; the outgoing image wipes **upward** |
| First paint | any | any | 0ms | No wipe while `data-init` is set |

Active images reset `transform: none` with no delay.

#### F. Carousels

| Variant | Behavior |
|---|---|
| **Full-width carousel** | Inactive slides' images `scale(.66)`; active `scale(1)`; 200ms `ease-out-cubic`. Origin `left center` for the next slide, `right center` for the previous. |
| **Feature-card carousel** (md and up) | Cards: `transform` 1s `ease-out-cubic`, origin flips left/right with direction. Active card: image `opacity 0`, card background gains 56px side padding, an `ink-900` panel slides from `translateY(100%)` to 0 (1s), overline turns `grey-500`, rule fades in (1s), grow-text opens (1s), bottom gradient fades out (400ms). Below md the gradient is hidden and the card is static. |
| **Hero selector** | Buttons choose a hero slide. Slide crossfade `opacity` 400ms `ease-out-cubic`; the active button has `aria-current="true"`. |
| **Programmatic scroll** | Arrow and bullet navigation: `scroll-behavior: smooth` equivalent of 400ms `ease-out-quart`. |
| **Progress bullets** | Track 2px `grey-300`; fill `accent-500` (`accent-on-dark` on dark), `scaleX(0 -> 1)`, origin left. Hover/focus on an inactive bullet recolors the track to `accent-500` in 200ms. With autoplay, the active bullet's fill runs **5s linear**; an inactive bullet snaps back to 0 with no transition. Number: `opacity 0 -> 1`, `transform: none` when active. |
| Autoplay | Pauses on hover, focus-within, and when the tab is hidden; off under reduced motion (see 6.8). |

#### G. Overlays, messages, loading

| Pattern | Closed | Open | Timing |
|---|---|---|---|
| **Dialog panel** | `opacity 0; translateY(24px)` | `opacity 1; translateY(0)` | Enter 400ms `ease-out-cubic`; exit **200ms** |
| Dialog scrim | as Scrim (B) | as Scrim (B) | as Scrim |
| Message banner | `opacity 0` | `opacity 1` | 200ms; no movement |
| Validation message | `opacity 0` | `opacity 1` | 200ms |
| **Spinner** | n/a | 2px ring, 25% arc in `currentColor`, 16px (inline) or 24px, `rotate(360deg)` | 800ms `linear` infinite |
| **Skeleton** | `grey-100` block | `opacity .5 <-> 1` | 1.2s `ease-in-out-cubic` infinite |
| Progress bar (determinate) | `width: 0` | `width: n%` | 200ms `ease-out-cubic` |
| Load-more append | new items `opacity 0` | `opacity 1` | 200ms, stagger 100ms (max 5) |

#### H. Forms

| Control | Property | Timing |
|---|---|---|
| Field border | `border-color` | 200ms `ease-out-cubic` |
| Checkbox/radio box | `border-color`, `background-color` | 200ms `ease-out-cubic` |
| Checked indicator | `opacity 0 -> 1` | 200ms `ease-out-cubic` |
| Clear/search icon | `opacity` | 200ms |

#### I. Timeline

The progress fill is **scroll-linked, not time-based**: the 2px rule fills `accent-500` from the top as the viewport center passes each entry. Use `animation-timeline: view()`/`scroll()` where supported, otherwise a rAF scroll handler; do not use `background-attachment: fixed`. No easing, no duration. Under reduced motion the rule is fully filled.

### 3.4 Reduced motion

`prefers-reduced-motion: reduce` is honored **in CSS and in script**.

| Category | Behavior under `reduce` |
|---|---|
| Transitions (all) | `transition-duration: 0s; transition-delay: 0s`; final state applied immediately |
| Keyframe animation | `animation-duration: .001ms`, one iteration, no delay |
| Reveals | Content is visible on load; no translate, no stagger |
| Hero settle, wipes, carousel scale, feature cards | Final state immediately |
| Scrolling | `scroll-behavior: auto`; programmatic scrolls use `behavior: "auto"` |
| Autoplay (carousels, background video) | **Does not start.** Poster/first slide shown with a visible play control |
| Scroll-linked effects (timeline) | Static, fully filled |
| Spinner | Replaced by an `opacity` pulse (non-spatial, 1.2s) with the text "Loading" |
| Skeleton | Static `grey-100` blocks, no pulse |
| Lottie | Final frame |
| Hover/focus fills | Still change color; no movement |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: scroll !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
}
```

### 3.5 Performance rules

- Prefer compositor properties. Never animate `top`, `left`, `margin`, or `box-shadow`.
- `contain: content` on independently animating blocks; `content-visibility: auto` with `contain-intrinsic-size` on long, off-screen sections.
- Slides get `transform: translateZ(0)`. Add `will-change` only just before an animation and remove it after.
- Reveal and scroll logic use `IntersectionObserver` and `requestAnimationFrame`, never scroll-event layout reads.
- Height animations read a measured value once, animate between pixel values, then restore `auto`.

---

## 4. State system

Every interactive element implements **all** applicable states from this section. Components in section 5 list only what is specific to them.

### 4.1 State definitions

| State | Trigger | Visual rule | Notes |
|---|---|---|---|
| **Default** | none | Component's resting look | |
| **Hover** | `:hover` on `(hover: hover)` devices | Draw underline / swipe fill / color shift (3.3 A) | Never sticks on touch: wrap hover rules in `@media (hover: hover)` |
| **Focus-visible** | `:focus-visible` | Same feedback as hover **plus** the focus ring (4.3) | The ring is additive and never removed by another state |
| **Pressed** | `:active`, or `Space`/`Enter` held on a button | Two steps down the fill ladder, instant | Links: underline stays in its hover state |
| **Selected / current** | `aria-selected="true"`, `aria-current="page\|true"`, `aria-pressed="true"` | Underline held, or fill/indicator shown | Selected is *not* hover: hover on a selected item may retract (current page) |
| **Expanded** | `aria-expanded="true"` | Chevron 180deg; trigger underline held; panel visible | |
| **Disabled** | `disabled` or `aria-disabled="true"` | Text `grey-500`, borders `grey-400`, surface `grey-100`; no hover, no pressed, no swipe; `cursor: not-allowed` | Exempt from contrast, so never carry information only in a disabled control. Prefer `aria-disabled` when the reason must be discoverable by keyboard. |
| **Read-only** | `readonly` | Surface `grey-100`, border `grey-400` (solid), text `ink-900`; remains focusable | |
| **Loading** | `aria-busy="true"` | Spinner 16px before the label; label stays; control keeps its exact width; input is ignored (not removed from tab order) | Announce completion in a live region |
| **Invalid** | `aria-invalid="true"` | Border `error`, helper message in `error` with alert icon | Color is never the only cue |
| **Success** | message only | Check icon + `#1d6b45` text under the field; the field itself does not change color | |
| **Empty** | no content / no value | See 5.20 (empty state) and placeholder rules in 5.9 | |
| **Visited** | `:visited` | **Identical to default.** | Brand links do not recolor |

### 4.2 Precedence

`disabled` > `pressed` > `invalid` > `selected/current` > `hover` > `default`. The **focus ring is orthogonal**: it appears in every non-disabled state. A disabled control can still be focusable only when it uses `aria-disabled`.

### 4.3 Focus system

| Context | Ring |
|---|---|
| Default / subtle surface | `outline: 2px solid accent-500; outline-offset: 2px` |
| `dark`, `deep`, `accent`, `photo` surfaces | `outline-color: white` |
| Inside a clipping container (carousel viewport, `overflow: hidden`) | `outline-offset: -2px` (inset) |
| Text fields | Border becomes `ink-800` **and** the ring is shown |
| Cards / stretched links | Ring around the whole card |
| Linked images | Ring around the image (2px `accent-500`, offset 2px) |
| Skip link | Hidden until focused; then fixed at top-left, z 60, `ink-900` surface, white `label` text, `px` 24, `py` 7 |
| Programmatic focus targets (`tabindex="-1"`) | Same ring; shown only for keyboard-initiated focus |

```css
:focus:not(:focus-visible) { outline: none; }   /* mouse focus draws nothing */
:focus-visible {
  outline: 2px solid var(--ring, #c14a12);
  outline-offset: 2px;
}
[data-surface="dark"], [data-surface="deep"],
[data-surface="accent"], [data-surface="photo"] { --ring: #fff; }
```

Rules: never write `outline: 0` without a `:focus-visible` replacement; the ring must have at least 3:1 contrast against both the element and its surroundings (accent on white 4.93, white on ink 11+).

### 4.4 Target size and pointer rules

- WCAG 2.2 minimum is 24 x 24px everywhere. The system standard on coarse pointers is **44 x 44px**.
- Reach 44px without changing the visual size by extending the hit area: `position: relative` plus `::before { content: ""; position: absolute; inset: -6px -0; }` (or equal padding on the clickable wrapper). Adjacent targets keep at least 8px between hit areas.
- Cursors: `pointer` on buttons, links and `[role="button"]`; `not-allowed` on disabled; `grab`/`grabbing` on drag-scrollable tracks; `text` on fields; `auto` on non-interactive labels that carry button styling.
- `-webkit-tap-highlight-color: transparent` on links and buttons (the swipe fill replaces it); `touch-action: manipulation` on controls to remove the 300ms delay.
- Disabled and loading controls do not receive hover or pressed styles.

### 4.5 State vocabulary

One vocabulary, so styles and scripts agree. Prefer ARIA; use `data-*` and `is-*` only for visual or layout state with no ARIA equivalent.

| Mechanism | Used for | Values |
|---|---|---|
| `aria-expanded` | Any disclosure trigger | `true`, `false` |
| `hidden` | Collapsed panels | boolean |
| `aria-selected` | Tabs, listbox items | |
| `aria-current` | Current page (`page`), current slide/step (`true`) | |
| `aria-pressed` | Toggle buttons | |
| `aria-disabled`, `disabled` | Unavailable controls | |
| `aria-invalid`, `aria-busy` | Validation, loading | |
| `html[data-js]` | JavaScript is running (hidden pre-states may apply only then) | boolean |
| `html[data-scrolled]` | Page scrolled past 8px | boolean |
| `html[data-scroll-dir]` | Last significant scroll direction | `up`, `down` |
| `html[data-header]` | Header theme | `transparent`, `white` |
| `html[data-lock]` | Scroll lock | `page` (overflow locked + scrim), `scrim` (scrim only; header turns white) |
| `html[data-lock-below="lg"]` | Restrict a lock to below 1024px | |
| `[data-surface]` | Surface context | `subtle`, `dark`, `deep`, `accent`, `photo` |
| `[data-menu-level]` | Multi-level drawer position | `0`, `1`, `2` |
| `[data-drawer]` | Drawer state | `closed`, `open`, `transitioning`, `dragging` |
| `[data-hover-open]` | Desktop dropdown opened by pointer | boolean |
| `[data-reveal]` | Reveal state | `hidden`, `visible` |
| `[data-slide]` | Carousel slide role | `active`, `next`, `prev` |
| `[data-direction]` | Carousel direction | `forward`, `backward` |
| `[data-autoplay]` | Autoplay running | `on`, `off` |
| `[data-init]` | First paint: suppress motion | boolean |
| `[data-consent]` | Embed consent | `blocked`, `allowed` |

### 4.6 State matrix

`-` = no change from default.

| Component | Hover | Focus-visible | Pressed | Selected / current / expanded | Disabled | Loading / empty / invalid |
|---|---|---|---|---|---|---|
| Prose link | Underline retracts | Same + ring | Same as hover | n/a | n/a | n/a |
| Nav / utility link | Underline draws in | Same + ring | Same as hover | Current: underline held, hover retracts | n/a | n/a |
| Button | Swipe to next-darker fill | Same + ring | Two steps darker, instant | `aria-pressed`: pressed fill held | `grey-100` surface, `grey-500` text | Spinner + `aria-busy` |
| Icon / arrow button | Fill `ink-900`, icon white | Same + ring | `ink-975` | n/a | `grey-400` border, `grey-500` icon | n/a |
| Header | White bar, ink UI | Same (focus-within) | n/a | Scrolled-up: white + elevation 1 | n/a | n/a |
| Dropdown trigger | Opens when the pointer enters (closes 200ms after it leaves) | Opens on `Enter`/`Space`/`ArrowDown` | n/a | Held underline while open | n/a | n/a |
| Tab | Underline draws | Same + ring | Same as hover | Selected: underline drawn, text `ink-900` | `grey-500` | n/a |
| Accordion trigger | Underline draws on title | Same + ring | Same as hover | Chevron 180deg; panel open | `grey-500` | n/a |
| Checkbox / radio | Box fill `grey-100` | Ring around box | Box fill `grey-300` | Check indicator `accent-500` | `grey-400` box, `grey-500` label | Invalid: border `error` |
| Text field | Border `ink-800` | Border `ink-800` + ring | n/a | n/a | `grey-100`, `grey-400` border | Invalid: `error` border + message |
| Select | Border `ink-800` | Border `ink-800` + ring | n/a | Open list per platform | `grey-100` | `is-empty`: placeholder color |
| Card (linked) | Title underline draws | Ring on card | Same as hover | n/a | n/a | Skeleton while loading |
| Carousel slide | - | Ring on focusable content | n/a | `data-slide="active"`: full scale/clip | n/a | `data-init`: no motion |
| Progress bullet | Track -> `accent-500` | Same + ring | Same as hover | Active: fill runs (5s with autoplay) | n/a | n/a |
| Embed | Fallback button underline retracts | Same + ring | Same as hover | `data-consent="allowed"` | n/a | Blocked: grey placeholder |
| Dialog | n/a | Focus trapped inside | n/a | Open | n/a | n/a |
| Message | n/a | Dismiss button ring | n/a | n/a | n/a | n/a |

---

## 5. Components

Each component gives anatomy, variants, a state table (only what is specific; shared rules are in section 4), motion (references 3.3), and keyboard/ARIA notes.

### 5.1 Link

**Types:** prose link, navigation/utility link, link list, linked image, stretched card link, footer link.

**Prose link**

- `font-weight: 700`, `text-decoration: none`, 2px underline drawn with a background gradient in `currentColor`.
- Underline color: `accent-500` on default and subtle surfaces; white on `dark`, `deep`, `accent` and `photo` surfaces.

| State | Appearance |
|---|---|
| Default | Bold, full 2px underline |
| Hover / focus-visible | Underline **retracts** to 0 toward the right (200ms `ease-in-out-cubic`); text color unchanged; ring on focus |
| Pressed | Same as hover |
| Visited | Same as default |

**Navigation / utility link**

- `label` style (Condensed 700 uppercase) in primary nav; `body-xs` in the secondary row. The 2px underline sits at the bottom of the box; nav links get 4px bottom padding so it clears descenders.

| State | Appearance |
|---|---|
| Default | No underline; color from context (`--ui-color`) |
| Hover / focus-visible | Underline draws in from the left in `--underline` (`accent-500`; white on transparent header), 200ms |
| Current page (`aria-current="page"`) | Underline **held**; hover/focus retracts it |
| Expanded (`aria-expanded="true"`) | Underline held; hover/focus text becomes `ink-800` |

**Linked image:** `display: block`; ring is the standard ring around the image; no underline.

**External links:** show the 16px `external-link` icon after the text. If the link opens a new tab, add `rel="noopener"` and visually hidden text "(opens in a new tab)".

### 5.2 Button

**Anatomy:** label (`label` style), optional 18px icon (8px gap, left or right), optional spinner (loading).

**Metrics:** padding `7px 12px 6px` below lg, `8px 16px` from lg (the extra pixel above the baseline optically centers uppercase text). Square corners. `white-space: nowrap`, `vertical-align: middle`. Natural height 32px (below lg) / 36px (lg); the hit area extends to 44px on coarse pointers (4.4). Content is never wrapped; long labels use the `button--wrap` modifier, which allows two lines and centers text.

| Variant | Surface / text | Hover (swipe) | Pressed | Use |
|---|---|---|---|---|
| `primary` | `accent-500` / white | `accent-600` | `accent-700` | The single main action in a view |
| `secondary` | `ink-900` / white | `ink-950` | `ink-975` | Standard action |
| `dark` | `ink-800` / white | `ink-850` | `ink-900` | Action on photo or accent surfaces |
| `light` | `grey-300` / `ink-900` | `grey-400` | `grey-500` | Action on white where primary is taken |
| `subtle` | `grey-100` / `ink-900` | `grey-300` | `grey-400` | Tertiary action, filters |
| `outline` | transparent, 2px `ink-900` border / `ink-900` | fill `ink-900`, text white | fill `ink-975`, text white | Alternative to `light` |
| `outline` on dark | transparent, 2px white border / white | fill white, text `ink-900` | fill `grey-100`, text `ink-900` | On `dark`, `deep`, `photo` |
| `link` | none / inherits | Underline draws | Same | Inline action; no padding, `label` style |

Outline buttons subtract the 2px border from their padding so all variants share one size.

| State | Appearance |
|---|---|
| Default | Per table |
| Hover | **Swipe fill** grows left to right over 200ms `ease-in-out-cubic` to the hover fill; outline text color changes in the same 200ms |
| Focus-visible | Same as hover + ring |
| Pressed | Pressed fill, instant |
| Disabled | `grey-100` surface, `grey-500` text, no border; no swipe; `cursor: not-allowed` |
| Loading | `aria-busy="true"`; 16px spinner (`currentColor`) before the label; label retained; width locked; swipe disabled |
| Toggle (`aria-pressed="true"`) | Pressed fill held |

**Keyboard/ARIA:** a `<button>` for actions, `<a>` for navigation (never a styled `<div>`). `Enter` and `Space` activate buttons; `Enter` activates links. Icon-only buttons use 5.3.

### 5.3 Icon button and arrows

- 48 x 48px (dense: 40 x 40), square, 2px `ink-900` border, 24px icon centered, `aria-label` required.
- Used for carousel arrows, autoplay toggle, dialog close, message dismiss, search clear, section-nav toggle.

| State | Appearance |
|---|---|
| Default | Transparent, `ink-900` border and icon |
| Hover / focus-visible | Swipe fill `ink-900`, icon white (200ms) + ring |
| Pressed | Fill `ink-975` |
| Disabled (for example first slide without loop) | Border `grey-400`, icon `grey-500`, no fill, `cursor: not-allowed` |
| On `dark`/`photo` | Border and icon white; hover fill white, icon `ink-900`; pressed fill `grey-100` |
| Arrows | Chevron left/right; the arrow pair sits 8px apart; `aria-controls` points at the carousel viewport |

### 5.4 Header and primary navigation

**Anatomy:** logo, primary navigation, secondary navigation row, utility links (language, search, contact), mobile toggle.

| Mode | Layout |
|---|---|
| Desktop (lg and up) | Pinned to the top and moved only by `transform`. Secondary row (40px, `body-xs`, bottom hairline) above the primary row (88px: logo left, `label` links with 32px gaps). Transparent over a hero (`data-header="transparent"`, UI color white) or white (`data-header="white"`, UI color `ink-900`). |
| Mobile (below lg) | 52px bar: logo left, toggle right. Opens into a full-height drawer (5.6). |

| State | Desktop | Mobile |
|---|---|---|
| Default | Per page theme | 52px bar |
| Hover or focus-within | White bar, `ink-900` UI, `accent-500` underlines, secondary hairline `grey-100`, elevation 1 | n/a |
| Page scrolled down | Slides off (`translate3d(0,-100%,0)`) | n/a |
| Scrolling up | Returns as a white bar with elevation 1 | n/a |
| Menu open | Scrim + `data-lock="scrim"`; header turns white | Drawer open, `data-lock="page"`, toggle becomes a close icon |
| Dragging drawer | n/a | Follows the pointer with no transition |

**Toggle icon:** two 2px `currentColor` bars, 8px apart. When open they rotate to +/-45deg and meet at the center (200ms `ease-out-cubic`); `aria-expanded` and an `aria-label` that switches between "Open menu" and "Close menu".

**Landmarks:** `<header>` containing `<nav aria-label="Primary">` and a separate `<nav aria-label="Secondary">`. Skip link is the first focusable element.

### 5.5 Dropdown and mega panel (desktop)

- Trigger is a button (or link + button pair for items that are also pages) with `aria-expanded` and `aria-controls`.
- Panel: white surface, full container width, `space-10` vertical padding, top hairline `grey-300`, elevation 1, beneath the header bar. Content in the 16-column grid; link columns use three columns with a 9.0909% gap; links use `body` bold with the prose underline behavior.

| State | Appearance |
|---|---|
| Closed | `opacity 0; visibility hidden; pointer-events none` |
| Open | `opacity 1; visibility visible; pointer-events auto`; trigger underline held; `aria-expanded="true"` |
| Opening | By pointer entering the item, or `Enter`/`Space`/`ArrowDown` on the trigger |
| Closing | 200ms after the pointer leaves (cancel on re-enter); immediately on `Escape`, outside click, focus leaving the item |

Touch: the first tap opens the panel; a second tap on a link-trigger follows the link. Keyboard and behavior details in 6.4.

### 5.6 Mobile drawer and multi-level menu

- Surface `white`, text `ink-900`, height `100dvh - 52px`, scrolls internally with `overscroll-behavior: contain`.
- Levels slide horizontally (`data-menu-level` 0, 1, 2). Items with children show a 24px chevron-right; levels past the first start with a "Back" button (chevron-left + `label` text).
- Level links: `h4` style (Condensed uppercase 20/24) with 12px vertical padding and a 1px `grey-300` divider; secondary links `body` 16/24.
- A bottom utility area (128px) holds language/contact links; a 40px white fade above it indicates scroll.
- Motion: drawer 200ms `ease-out-cubic`; levels 200ms; hidden levels leave the tab order (`visibility: hidden` after 200ms, plus `inert`).

| State | Appearance |
|---|---|
| Closed | Off-screen except the 52px bar |
| Open | `data-drawer="open"`; page content `inert`; focus moves to the first link |
| Transitioning | `data-drawer="transitioning"`; transform transition active |
| Dragging | `data-drawer="dragging"`; no transition |
| Item pressed | Row fill `grey-100` |

### 5.7 Section navigation (sticky index)

A compact control that lists the sections of a long page. Appears after the first scroll.

| State | Appearance |
|---|---|
| Hidden | Page top: `visibility hidden` |
| Expanded | Width = measured content width (written as pixels so it can animate); menu visible |
| Collapsed (`aria-expanded="false"` on the toggle) | 89.6px wide; toggle shifted `-15.2px`; menu hidden after 1s |
| Current section | Item has `aria-current="true"` with the held underline |

Toggle is an icon button (5.3). Glyph swap between the open and close icons follows `aria-expanded` with no extra class.

### 5.8 Tabs

**Anatomy:** tab list (`role="tablist"`), tabs (`role="tab"`), panels (`role="tabpanel"`). List has a 2px `grey-300` bottom rule; tabs sit on it.

- Tab: `label` style, padding 12px 16px (hit area 44px high), color `ink-600`.
- Selected: text `ink-900`, 2px `accent-500` underline drawn over the rule.

| State | Appearance |
|---|---|
| Default | `ink-600` text, no underline |
| Hover | Text `ink-900`, underline draws (200ms) |
| Focus-visible | Hover look + ring (inset, `outline-offset: -2px`) |
| Pressed | Same as hover |
| Selected | `ink-900`, underline drawn, `aria-selected="true"` |
| Disabled | `grey-500`, no underline, `aria-disabled="true"` |

Panel switch: outgoing hides instantly, incoming fades 200ms. Panels with no focusable content get `tabindex="0"`. Keyboard in 6.6.

### 5.9 Form controls

#### Field wrapper

Stack: `field-label` (14/21 bold), optional `field-help`, control, validation message. Gap 8px between label and control, 8px between control and messages, 24px between fields. Labels are always visible (placeholders never replace labels).

- Required: the label gets a trailing `*` in `accent-500` plus visually hidden "(required)". A form that has required fields starts with "* required" in `body-xs`.
- Optional: "(optional)" in `ink-600` after the label.
- Layout: below lg, one field per row. From lg, a row can hold fields in a flex layout (`flex: 1` to `12` ratios) with 24px between them.

#### Text field, textarea, search

- Height 48px (textarea min-height 128px, `resize: vertical` only), padding 12px 16px, border **2px `ink-600`**, background `white`, `field-text` type, radius 0.
- Placeholder: `grey-600` on white (`ink-600` when the field sits on `grey-100`), `opacity: 1`. Placeholders are hints, never instructions.
- Search: leading 24px search icon (`ink-600`) inside the field (padding-left 48px); native clear and decoration buttons suppressed; a 40px icon button (clear) appears at the right when there is a value.

| State | Appearance |
|---|---|
| Default | 2px `ink-600` border |
| Hover | Border `ink-800` |
| Focus-visible | Border `ink-800` + ring |
| Filled | Unchanged |
| Disabled | Surface `grey-100`, border `grey-400`, text `grey-500` |
| Read-only | Surface `grey-100`, border `grey-400`, text `ink-900` |
| Invalid | Border `error`; message below: 16px alert icon + `field-help` in `error`; `aria-invalid="true"`, `aria-describedby` |
| Success | Unchanged field; check icon + `field-help` in `#1d6b45` under it |
| Loading (async validation) | 16px spinner at the right inside the field |

#### Select

Native `<select>` styled as a text field with a 18px chevron-down at the right (no native arrow). Long values truncate with an ellipsis.

| State | Appearance |
|---|---|
| Empty / placeholder | `grey-600` on white (`ink-600` on grey-100); first option is a disabled, selected prompt |
| Filled | `ink-900` |
| Hover / focus-visible / invalid / disabled | As text field |
| Options | `ink-900`; disabled options `ink-900 / .5` |

#### Checkbox and radio

- Native input visually hidden but still focusable (`opacity: 0`, 20 x 20, overlaid on the box) so the entire label is clickable.
- **Box:** 20 x 20, **2px `ink-900` border**, transparent fill; radius 0 (radio: `50%`).
- **Indicator:** 16 x 16 inset 2px, fill `accent-500` with a **2px white border** (`grey-100` on grey-100 surfaces), `opacity 0 -> 1`; round on radios.
- **Label:** `body`, `padding: 0 12px 0 32px`, minimum height 44px with the text vertically centered; the group gap is 12px.

| State | Appearance |
|---|---|
| Default | Dark box, no indicator |
| Hover | Box fill `grey-100` (border unchanged) |
| Focus-visible | Ring around the **box**, offset 2px |
| Pressed | Box fill `grey-300` |
| Checked | Indicator fades in (200ms) |
| Indeterminate (checkbox) | A 10 x 2px `ink-900` bar centered in the box |
| Disabled | Box border and label `grey-400` / `grey-500`; no hover |
| Invalid | Box border `error`; message under the group |

Group them in a `<fieldset>` with a `<legend>` styled as `field-label`.

#### Validation pattern

1. Validate on blur and on submit; never while the user is still typing in an untouched field.
2. On submit with errors, show an error **summary** banner (5.11) at the top of the form listing each error as a link to its field; move focus to the summary.
3. Each invalid field gets the invalid state and an inline message tied with `aria-describedby`.
4. When a field becomes valid, remove the error state and message (200ms fade).
5. Announce success of an async action in a polite live region.

### 5.10 Accordion

**Anatomy:** a heading containing a button (trigger), a panel. Trigger: `h4` or `label` style per context, full-width, 24px chevron at the right, 2px `grey-300` bottom rule per item.

| State | Appearance |
|---|---|
| Collapsed | Panel `hidden`; chevron 0deg |
| Expanded | Panel `height: auto`; chevron 180deg; `aria-expanded="true"` |
| Hover / focus-visible | Trigger title underline draws + ring (inset) |
| Pressed | Same as hover |
| Disabled | `grey-500` title, `aria-disabled="true"` |

- Motion: height 200ms `ease-out-quad`, visibility delayed 200ms on close, chevron 200ms.
- Variants: `accordion--mobile-only` (accordion below lg, always expanded from lg; the trigger becomes plain text), `accordion--single` (opening one closes the others).
- Keyboard: `Enter`/`Space` toggle; `Tab` moves through triggers; optional `ArrowUp/Down`, `Home`/`End` between triggers.

### 5.11 Messages (banners)

**Anatomy:** 24px icon, optional title (`body` bold), body (`body`), optional action link, optional dismiss icon button (40px). Background is the status tint, a **4px left bar** in the status color, no radius, padding 16px 24px (below lg 16px).

| Variant | Role | Icon | Bar / text / tint |
|---|---|---|---|
| Error | `role="alert"` | alert | `#9d1c30` / `#fdf1f2` |
| Success | `role="status"` | check | `#1d6b45` / `#eef7f1` |
| Warning | `role="status"` | alert | `#7a4f00` / `#fbf4e4` |
| Information | `role="status"` | info | `ink-900` / `grey-100` |

Enter: `opacity 0 -> 1`, 200ms, no movement. Persistent banners sit inline above the content they concern; transient confirmations use a status region and fade out after at least 6s **only if** they have a dismiss button and pause on hover and focus. Form-level fixed messages (bottom of viewport) use z 60 and a 10px top border in the status color.

### 5.12 Dialog

- Surface `white`, no radius, elevation 2, `aria-modal="true"`, `role="dialog"` with `aria-labelledby`.
- Size: below md, a full-height sheet (`100dvh`, padding 24px). From md, centered, `max-width: min(720px, 100vw - 48px)`, `max-height: calc(100dvh - 96px)`, padding 56px, content scrolls inside.
- Anatomy: title (`h3`), body, action row (primary on the right at md+, stacked full-width below md with primary first), close icon button (40px) at the top right with 8px inset.
- Scrim 5.25.

| State | Appearance |
|---|---|
| Closed | Not rendered, or `hidden` |
| Opening | Panel `opacity 0 -> 1`, `translateY(24px -> 0)` over 400ms `ease-out-cubic`; scrim fades in 500ms |
| Open | Page `inert`, `data-lock="page"`; focus moves to the first focusable (or the dialog if none) |
| Closing | 200ms; focus returns to the opener |

Dismiss: close button, `Escape`, scrim click (unless the dialog contains unsaved input, then confirm).

### 5.13 Carousel family

**Shared anatomy:** viewport (`overflow: hidden`, `scroll-snap-type: x mandatory` for scrolling variants), track, slides (`flex-shrink: 0`, `scroll-snap-align: start`), controls row (prev/next 5.3, progress bullets, optional autoplay toggle).

**Semantics:** container `role="region"` + `aria-roledescription="carousel"` + label; each slide `role="group"` + `aria-roledescription="slide"` + `aria-label="n of N"`; the live region is `aria-live="polite"` when autoplay is off and `off` when on.

**Variants**

| Variant | Spec |
|---|---|
| Scroller | Scroll-snap track; arrows and bullets call programmatic scroll (400ms `ease-out-quart`, step = one slide width + 16px gap); mouse drag at 1.5x (6.12) |
| Fade | Clip-path wipes (3.3 E); one slide visible |
| Full-width | Active slide full scale, neighbours `scale(.66)` (3.3 F) |
| Feature-card (md and up) | Cards expand to reveal a dark panel, overline, rule and body (3.3 F). Active card: panel `ink-900`, overline `grey-500`, rule `ink-600`. Below md: static stacked cards. |
| Shorts | 9:16, max 366px; below `xs` the viewport clips; from `xs` it bleeds to the right page edge (`margin-right: -24px`; -56px at xl) and shows the next slide's edge |
| Collection | 2-up at `sm`, 3-up at `md`; widths in 2.3 |
| Hero selector | List of buttons driving a hero; active button `aria-current="true"` |

**Progress bullets (pagination)**

- Each bullet is a button: a `label`-style number (14/18) above a 2px track; 16px between bullets; hit area 44px high. Inactive numbers are hidden (space reserved); the active number shows.
- Edge treatment: a white mask on the left edge hides slides sliding in from the left (z 20); a 48px right fade signals overflow on mobile.

| State | Appearance |
|---|---|
| Default | Track `grey-300`, fill 0 |
| Hover / focus-visible | Track `accent-500` (200ms) + ring |
| Active | Track `grey-300`, fill `accent-500` full (animates 5s with autoplay); number visible |
| Autoplay paused | Fill freezes at its current width |

**Autoplay**

- Never starts under reduced motion or when the user has paused it. A visible pause/play icon button (5.3) is required for any autoplay.
- Interval 5s. Pauses on pointer hover, focus within, and when the document is hidden; resumes 1s after leaving.
- Loops only when `data-loop` is set; otherwise arrows disable at the ends.

### 5.14 Card

**Anatomy:** media (4:3 or 16:9), overline, title (`h4`), summary (`body-sm`), optional meta (`body-xs`), link. The title contains the link and its hit area **stretches** over the whole card (`::after { position: absolute; inset: 0 }`).

| State | Appearance |
|---|---|
| Default | Flat, no border; image over text; 16px gap image to overline, 8px overline to title, 12px title to summary |
| Hover | Title underline draws (`accent-500`); image unchanged |
| Focus-visible | Ring around the whole card |
| Pressed | Same as hover |
| Loading | Skeleton (5.21) with the same media ratio and three text bars |

Cards in a row share the baseline of the media; text blocks align to the top. A `card--dark` variant sits on `dark` surface with white text and white underline.

### 5.15 Timeline

- Center rule 2px `grey-300`; scroll-linked fill `accent-500` (3.3 I). Entries carry a 12 x 12px square dot in `accent-500`.
- Layouts: `--centered` (dot 6px above the entry's top edge) and `--side-by-side` (dot 24px below the top, entries alternate sides at lg). Below lg a single column: rule on the left, dot 28px above the entry, with a 12 x 16px white mask hiding the rule behind the dot.
- States are scroll-position only; there is no interactive state. Entries reveal with the standard reveal.

### 5.16 Media

| Item | Spec |
|---|---|
| Image | 2.6. States: loading placeholder, loaded (200ms fade), error (`grey-100` block with `alt` text and an alert icon). |
| **Video (inline)** | Poster image, then controls on play. Play button: centered 64 x 64 square, `accent-500` surface, white 32px play icon; hover `accent-600`, pressed `accent-700`, ring on focus. Label "Play video: {title}". |
| Autoplay background video | Muted, `playsinline`, looped, no controls; has a visible pause/play control when longer than 5s; not started under reduced motion or data-saver; paused when off-screen |
| Full-screen video | `width: 100vw`; when the viewport is narrower than 16:9 the video scales to `177.78vh` height to cover; vertical sources are held to 16:9 |
| Shorts | 9:16, max 366px |
| **Consent embed** | 16:9 box, `grey-300` placeholder, content hidden until consent. Fallback centered text (`body-xs`, `ink-800`, max 36em, 16px padding) plus a `link` button ("Accept and load") with a held-then-retracting `accent-500` underline. `data-consent="blocked"` -> `"allowed"`: placeholder turns transparent and the embed loads. Variants: fill (absolute), script (height auto once allowed). |
| Lottie stat | 136px tall; plays when revealed; reduced motion shows the final frame |
| Maps | Container height 100% of its slot; keyboard-reachable controls; a text alternative (address) adjacent |

### 5.17 Prose (editorial block)

Type, rhythm, list, rule and quote rules are specified in 2.2. Additional rules:

- Figures: `align-left`/`align-right` float at md and up; below md they stack at full width.
- Tables inside prose follow 5.18 and scroll horizontally in their own container.
- Embedded code uses `font-mono` 14/21 on `grey-100`, padding 16px, horizontal scroll, no radius.
- Callout: `grey-100` surface, 4px `accent-500` left bar, padding 24px, `body` text.
- Anchors within headings are revealed on hover/focus as a 16px link icon.

### 5.18 Table

- `border-collapse: collapse`; full width of the prose column; text `body-sm`.
- Header cells: `overline` type, `ink-900`, bottom border 2px `ink-900`, left aligned (numbers right-aligned).
- Body cells: padding 12px 16px; bottom border 1px `grey-300`; no zebra, no vertical rules.
- Row hover (data tables only): `grey-100` background. Selected row: `aria-selected="true"`, 2px `accent-500` left bar.
- Overflow: below lg the table scrolls horizontally inside a container with `tabindex="0"` and a 48px right edge fade; the first column may be sticky with a `white` background.
- Always include `<caption>` (visually hidden if redundant) and `scope` on headers.

### 5.19 Hero

**Layer stack** (z within the hero's own stacking context): background picture 10, graphic overlay 1 (11), graphic overlay 2 (12), transparent raster (13), top gradient (15), bottom gradient (16), content above. Art-directed pictures swap at lg.

- Height: min 560px; 720px at lg. Text is white (`photo` surface) in `display`/`h1` + `lead`.
- Header is transparent over the hero (`data-header="transparent"`); the top gradient guarantees UI legibility.
- Entrance: `hero-settle` (opacity 0 -> 1, scale 1.1 -> 1, 1s `ease-out-expo`, 200ms delay). Without JavaScript the hero is visible at rest.
- Callout groups reveal in sequence; the last image trails by 250ms.

### 5.20 Empty state

For empty lists, no search results, or cleared filters.

- Centered in its container, max width 480px, `space-16` vertical padding.
- Order: optional 40px icon (`grey-600`), `h4` title ("No results"), `body` explanation (one sentence, say what happened and what to do), one `secondary` or `link` button (for example "Clear filters").
- Focus: after a search or filter returns nothing, move focus to the title (`tabindex="-1"`) and announce through a polite live region.

### 5.21 Loading

| Pattern | Spec |
|---|---|
| Spinner | 16px (inline/buttons) or 24px; 2px ring, 25% arc in `currentColor`; 800ms linear (3.3 G) |
| Skeleton | `grey-100` blocks matching the real layout; pulse `opacity .5 <-> 1` over 1.2s; `aria-hidden`, with a single polite "Loading" status for the region |
| Progress bar | 2px track `grey-300`, fill `accent-500` (`accent-on-dark` on dark); determinate width transition 200ms; `role="progressbar"` with value |
| Full-view loading | Scrim over content with a centered 24px spinner on a 48px `ink-900` square; `aria-busy="true"` on the region |
| Timing | Show nothing for the first 300ms; if still loading, show the indicator for at least 600ms to avoid flicker |

### 5.22 Load more and pagination

- **Load more:** a centered `secondary` button, 48px below the list, with the loading state in 4.1. After loading, focus stays on the button when items remain, otherwise it moves to the first new item; announce "N more results loaded".
- **Numbered pagination:** 44 x 44 square buttons in a `nav aria-label="Pagination"`, 8px apart. Default `ink-900` text on transparent; hover `grey-100`; pressed `grey-300`; current page `ink-900` surface with white text and `aria-current="page"`; disabled prev/next `grey-500`. Ellipsis is non-interactive.

### 5.23 Breadcrumb

`body-xs`, `ink-600`; separators are the slash glyph (2.5) in `grey-500`; links draw the underline on hover; the current page is plain `ink-900` text with `aria-current="page"`; wraps onto multiple lines.

### 5.24 Footer

- Surface `ink-900` (`dark`), padding 64px (80px at lg) vertical.
- Logo 48 x 215px, white. Link groups: heading `overline` (`grey-500`), links `body-sm` white with the white underline draw; legal row `caption` in `grey-500` with a 1px `ink-600` top rule.
- Optional call-to-action band above (lg): photo with the flipped gradient, `h3` white, `light` button.
- Layout: 16-column grid; link groups occupy 2-4 columns each; below lg, groups stack inside accordions (`accordion--mobile-only`).

### 5.25 Scrim

Fixed full-viewport layer, `shade / .5`, z 25 (above content, below the header and everything that opens over it). Click or tap dismisses the menu or dialog it belongs to. Fades per 3.3 B. While visible it carries `pointer-events: auto` so the page beneath cannot be clicked; `data-lock` controls whether the page can scroll.

---

## 6. Behavior specification

Behavior is part of the design. Implement each rule below; thresholds are values, not suggestions.

### 6.1 Root state and scroll

- On load set `html[data-js]`. Hidden pre-states (reveals, hero settle) may be applied **only** when `data-js` is present and reduced motion is not requested.
- One passive scroll listener, throttled with `requestAnimationFrame`, reads `window.scrollY` once per frame and writes attributes only when they change.
- `data-scrolled` is set when `scrollY > 8` and cleared at `<= 8` (iOS rubber-band values below 0 count as 0).
- `data-scroll-dir` flips to `down` or `up` only after **8px** of travel in that direction (hysteresis prevents jitter). It does not update while a lock is active.

### 6.2 Scroll lock

| Lock | Effect |
|---|---|
| `data-lock="page"` | `overflow: hidden` on the page; `padding-right` equal to the scrollbar width prevents layout shift; scroll position is preserved and restored |
| `data-lock="scrim"` | Scrim only; the page still scrolls; header turns white |
| `data-lock-below="lg"` | The lock applies only below 1024px and clears when crossing lg |

- Locks are counted: two openers (drawer + dialog) release only when both are closed.
- Scrollable overlays use `overscroll-behavior: contain`.
- Printing always restores `overflow: visible`.

### 6.3 Header behavior (lg and up)

| Condition | Result |
|---|---|
| `scrollY <= 8` | Initial theme (transparent over hero, or white) |
| Scrolling down, `data-scrolled`, no menu open, focus not inside the header | Header hidden (`translate3d(0,-100%,0)`, 400ms) |
| Scrolling up | Header visible as a white bar with elevation 1 |
| Pointer over the header, or `:focus-within` | Header visible and white (a hidden header reveals itself when keyboard focus enters it) |
| Any menu open | Visible, white, `data-lock="scrim"` |
| Hash jump that scrolls down | Header stays hidden; `scroll-padding-top` still clears it (6.11) |

Below lg the header bar is always visible and only the drawer moves.

### 6.4 Menus and dropdowns (desktop)

Active only when `(min-width: 1024px)` **and** `(hover: hover)`; otherwise the touch rule applies.

| Input | Behavior |
|---|---|
| Pointer enters an item with a panel | Open immediately; close any other open panel at once |
| Pointer leaves item and panel | Close after **200ms**; re-entering cancels the timer |
| `Enter` / `Space` on the trigger | Toggle |
| `ArrowDown` on the trigger | Open and move focus to the first link in the panel |
| `ArrowUp` / `ArrowDown` inside the panel | Previous / next link (wrapping); `Home` / `End` first / last |
| `Escape` | Close the open panel and return focus to its trigger |
| `Tab` / `Shift+Tab` out of the item | Close the panel |
| Click outside | Close; focus is not moved |
| Touch (coarse pointer) | First tap opens (and prevents navigation); second tap on a link-trigger follows the link; tapping elsewhere closes |

`aria-expanded` on the trigger always reflects state. Items that are pages **and** have panels use a link plus an adjacent toggle button so both are reachable.

### 6.5 Drawer and multi-level menu (below lg)

1. Toggle activates: `data-drawer="transitioning"` -> `"open"` after 200ms; `data-lock="page"` with `data-lock-below="lg"`; page content becomes `inert`; focus moves to the first link.
2. Focus is trapped inside the drawer and its toggle. `Escape` or a scrim click closes the drawer and returns focus to the toggle.
3. Activating an item with children advances `data-menu-level` by 1 and moves focus to the new level's Back button. Back decrements the level and returns focus to the item that opened it.
4. Drag (optional): vertical drag on the bar follows the pointer with `data-drawer="dragging"` (no transition). On release, snap open if dragged past 25% of the height or with velocity above 0.5px/ms, else snap closed.
5. Crossing lg closes the drawer, clears locks, resets `data-menu-level` to 0.

### 6.6 Tabs and accordion keyboard

**Tabs** (automatic activation)

| Key | Action |
|---|---|
| `ArrowRight` / `ArrowLeft` | Focus **and select** the next / previous tab (wrap) |
| `Home` / `End` | First / last tab |
| `Tab` | Moves into the active panel (only the selected tab is in the tab order: roving `tabindex`) |

**Accordion**

| Key | Action |
|---|---|
| `Enter` / `Space` | Toggle the panel |
| `Tab` | Next focusable (each trigger is a stop) |
| `ArrowUp` / `ArrowDown`, `Home` / `End` | Optional: move between triggers |

Panels toggle via `hidden` and `aria-expanded`; the height animation is presentational only.

### 6.7 Dialog focus management

1. Store the opener. Open: set background `inert`, lock scroll, move focus to the first focusable element (or the dialog itself).
2. `Tab` / `Shift+Tab` cycle inside the dialog.
3. `Escape`, the close button, or a scrim click dismisses (confirm first if the dialog holds unsaved input).
4. Close: unlock scroll, remove `inert`, return focus to the opener (or to a sensible neighbour if the opener no longer exists).

### 6.8 Carousels and autoplay

- **Step:** one slide width + 16px gap per arrow or bullet action; positions snap to slide starts.
- **Active slide:** the slide at least 60% visible (via `IntersectionObserver`); bullets, `aria-current`, `data-slide` and the live region follow it.
- **Ends:** arrows disable at the ends unless `data-loop` is set.
- **Keyboard:** arrows and bullets are buttons. When the viewport itself has focus (`tabindex="0"` with a label) `ArrowLeft` / `ArrowRight` move by one slide.
- **Autoplay:** 5s interval; never starts if reduced motion is requested, the user has paused, or the document is hidden. Pauses on pointer hover and focus-within; resumes 1s after both end. The pause/play button reflects state with `aria-pressed`.
- **Announcements:** `aria-live="polite"` when autoplay is off; `"off"` while autoplay is running.
- **Resize:** recompute widths and re-align to the active slide.
- **Reduced motion:** programmatic scrolls use `behavior: "auto"`; transforms and wipes jump to their final state.

### 6.9 Reveal on scroll

- Targets carry `data-reveal`. Elements already in or above the viewport at load reveal after fonts are ready; others wait.
- Observer: `rootMargin: "0px 0px -40px 0px"`, `threshold: 0.05`; **one-shot** (unobserve after revealing); never re-hide.
- Elements revealed in the same observer batch stagger by 100ms each, capped at five.
- Fallbacks: without `IntersectionObserver`, or without `data-js`, nothing is hidden. A **3.5s failsafe** reveals any element that should already be visible (top within the viewport + 200px).
- Reduced motion: no pre-state, no stagger.

### 6.10 Video and media

- Play button creates or enables the player with controls and starts playback; the button is removed from the tab order once playing.
- Starting one video pauses any other.
- Autoplay video is `muted`, `playsinline`, looped, paused when less than 25% visible, never started under reduced motion or data-saver, and has a pause control if it runs longer than 5s.
- Videos with speech require captions (`<track kind="captions">`).
- Consent embeds load their source only after `data-consent="allowed"`; the choice may be remembered per provider.

### 6.11 Anchors and in-page navigation

- Use native hash navigation with `html { scroll-behavior: smooth }` (disabled under reduced motion).
- `scroll-padding-top`: **68px below lg, 144px at lg** (header height + 16px), so targets are never hidden under the header.
- After an in-page jump, move focus to the target (give it `tabindex="-1"` if it is not focusable) with `preventScroll: true`.
- The URL hash updates with the jump; the browser Back button returns to the previous position.

### 6.12 Drag scrolling

- For tracks with `cursor: grab`; **mouse only** (`pointerType === "mouse"`). Touch and pen use native scrolling.
- Pointer down starts tracking; movement under 5px is a click. Beyond 5px: `cursor: grabbing`, text selection disabled, `scrollLeft = start - dx * 1.5`.
- On release the track snaps to the nearest slide; the click that follows a drag is suppressed.
- `pointercancel` and `pointerleave` end the drag.

### 6.13 Resize and orientation

- Use `matchMedia` for `lg`, `md`, `(hover: hover)` and `prefers-reduced-motion`, listening for changes.
- Crossing a breakpoint resets transient state: closes dropdowns and drawers, clears locks, restores `inert`, recalculates carousels and section-nav width.
- Debounce resize work by 100ms; orientation change triggers the same path.

### 6.14 Keyboard map

| Context | Keys |
|---|---|
| Everywhere | `Tab` / `Shift+Tab` in DOM order; `Enter` follows links and activates buttons; `Space` activates buttons |
| Skip link | First `Tab` stop; `Enter` jumps to `<main>` |
| Menus | See 6.4 |
| Drawer | See 6.5 |
| Tabs / Accordion | See 6.6 |
| Dialog | See 6.7 (`Escape` closes) |
| Carousel | See 6.8 |
| Select | Native: `ArrowUp/Down`, `Enter`, `Escape`, type-ahead |
| Checkbox | `Space` toggles |
| Radio group | Arrow keys move and select; `Tab` enters/leaves the group |
| Pagination | `Tab` between pages; `Enter` activates |

### 6.15 Progressive enhancement and robustness

| Feature | Without JavaScript |
|---|---|
| Navigation | Links render as a plain list in the header; no drawer |
| Accordion | All panels open |
| Tabs | Panels stack under their headings |
| Carousel | Horizontal scroll with scroll-snap |
| Reveals, hero settle | Content visible at rest |
| Consent embeds | A normal link to the content |

Script rules: each behavior module is **independent and isolated** (an error in one is caught, logged once with a module prefix, and never stops the others); feature-detect `IntersectionObserver`, `matchMedia`, `inert`; no layout reads inside scroll handlers; passive listeners; initialize on `DOMContentLoaded`; expose `init(root)` so content added later can be wired; expose a teardown that removes listeners and observers; never write inline `display` to open or close components. Use the state vocabulary in 4.5.

---

## 7. Accessibility

Target: **WCAG 2.2 AA**, plus the stricter guarantees below.

| Area | Requirement |
|---|---|
| Contrast | Text 4.5:1 (3:1 at 24px+ or 19px bold+); UI and focus 3:1. Use only the verified pairs in 2.1. |
| Focus | Always visible, never obscured by the sticky header (6.11), never the sole carrier of meaning. Ring spec in 4.3. |
| Target size | 24px minimum, 44px standard on coarse pointers (4.4). |
| Keyboard | Everything operable by keyboard with no traps; menus, tabs, dialogs follow 6.4-6.7. |
| Motion | Reduced motion honored in CSS and script (3.4); autoplay pausable; no flashing above 3 per second. |
| Color | Status is always icon + text + color; links are distinguishable by underline, not color alone. |
| Text | Resizable to 200% without loss; reflows at 320px width with no horizontal scroll (except tables, code, carousels); honors user text-spacing overrides. |
| Structure | One `<h1>`; heading levels never skip; landmarks `header`, `nav` (labelled), `main`, `footer`; skip link first. |
| Names and states | Every control has an accessible name; state exposed with ARIA (4.5); icon buttons have `aria-label`. |
| Live regions | `role="alert"` for errors, `role="status"`/`aria-live="polite"` for confirmations, loading completion and carousel changes. |
| Forms | Visible labels; required and error text programmatically tied; error summary with links; `autocomplete` tokens on personal-data fields. |
| Media | Alt text; captions for speech; transcripts for audio-only; no autoplay with sound. |
| Language | `lang` on `<html>` and on foreign-language passages. |
| Inert | Content behind modal UI is `inert`. |

### 7.1 Component conformance checklist

| Component | Must have |
|---|---|
| Button / link | Real element, name, visible focus, hover+pressed states, 44px hit area |
| Menu / dropdown | `aria-expanded`, `aria-controls`, Escape closes and returns focus, focus-out closes |
| Drawer | Focus trap, `inert` page, Escape, returns focus to toggle |
| Tabs | Roles, roving `tabindex`, arrow/Home/End, panel `aria-labelledby` |
| Accordion | Button trigger in a heading, `aria-expanded`, `aria-controls`, `hidden` when closed |
| Carousel | Region + roledescription, slide labels, pause control for autoplay, live region rule |
| Dialog | `role="dialog"`, `aria-modal`, label, trap, Escape, focus return |
| Form field | Label, help and error via `aria-describedby`, `aria-invalid`, required exposed |
| Message | Correct `role`, not color-only, dismiss is a labelled button |
| Table | Caption, `th scope`, keyboard-scrollable container |
| Embed / video | Consent state announced, captions, labelled play control |

---

## 8. Responsive summary

| Aspect | Below md | md | lg | xl / 2xl |
|---|---|---|---|---|
| Root | 10px | 10px | 10px | 10px; fluid from 1500 (`.666667vw`) |
| Container / gutter | 100% / 24 | 768 / 24 | 1024 / 24 | 1160 / 56 |
| Grid | 1 column | Two-up allowed | **16 columns**, content in 2-15 | same |
| Headings | h2 30/34, h3 24/28 | same | h2 48/52, h3 32/36 | same |
| Body | 16/24 | 16/24 | 18/26 | same |
| Header | 52px bar + drawer | same | 128px, hide-on-scroll, hover menus | 48 x 167 logo |
| Hero | 560 min | 560 | 720 | 720 |
| Carousels | Scroll-snap; feature cards static | Feature-card motion on; collection 3-up | Collection `29.1667vw - 54px` | same |
| Forms | One field per row | same | Flex rows with 24px gaps | same |
| Dialog | Full-height sheet | Centered, max 720 | same | same |
| Footer | Accordions | Accordions | 16-column groups | same |
| Hover menus | Touch rule | Touch rule | Pointer rule | Pointer rule |

---

## 9. Print and forced-colors

### 9.1 Print

- Remove all backgrounds and shadows; text `#000` on white; hide navigation, carousel controls, scrims, videos and embeds (show a link instead).
- Append each link's URL after its text in parentheses, except `#` and `javascript:` links; expand `abbr[title]`.
- Repeat table headers on each page (`thead { display: table-header-group }`); avoid breaks inside `blockquote`, `pre`, `img`, `tr`; keep headings with the following text; `orphans: 3; widows: 3`.
- Locked pages print at full length (`overflow: visible`).

### 9.2 Forced colors and high contrast

```css
@media (forced-colors: active) {
  a:not([class]) { text-decoration: underline; background-image: none; }
  .button, .icon-button { border: 2px solid ButtonText; background-image: none; }
  .button:hover, .button:focus-visible { border-color: Highlight; }
  :focus-visible { outline: 2px solid Highlight; }
  [role="tab"][aria-selected="true"] { border-bottom: 2px solid Highlight; }
}
@media (prefers-contrast: more) {
  :root { --field-border: #2e2a25; --rule: #65615d; --placeholder: #65615d; }
}
```

Background-drawn underlines and fills are replaced by real borders and text-decoration, because system colors override gradients.

---

## 10. Tokens

### 10.1 CSS custom properties

```css
/* Root scale: 1rem = 10px; fluid from 1500px */
html { font-size: 62.5%; }
@media (min-width: 1500px) { html { font-size: .666667vw; } }

@property --underline { syntax: "<color>"; inherits: true; initial-value: #c14a12; }

:root {
  /* Color primitives */
  --accent-500: #c14a12;  --accent-600: #963a12;  --accent-700: #7a3214;
  --accent-on-dark: #ff8f50;
  --ink-975: #1a1713; --ink-950: #221f1b; --ink-900: #2e2a25;
  --ink-850: #312e2a; --ink-800: #3e3935; --ink-600: #65615d;
  --grey-600: #767676; --grey-500: #9ea1a2; --grey-400: #bdbbbb;
  --grey-300: #d7d6d6; --grey-100: #ebebea; --white: #ffffff;
  --shade-rgb: 62 57 53;
  --scrim: rgb(var(--shade-rgb) / .5);

  /* Status */
  --error: #9d1c30;   --error-tint: #fdf1f2;
  --success: #1d6b45; --success-tint: #eef7f1;
  --warning: #7a4f00; --warning-tint: #fbf4e4;

  /* Contextual (default surface) */
  --bg: var(--white);
  --fg: var(--ink-900);
  --fg-muted: var(--ink-600);
  --rule: var(--grey-300);
  --underline: var(--accent-500);
  --signal: var(--accent-500);
  --ring: var(--accent-500);
  --ui-color: var(--ink-900);
  --field-border: var(--ink-600);
  --placeholder: var(--grey-600);

  /* Type */
  --font-header: "Roboto Condensed", Helvetica, Arial, sans-serif;
  --font-body: Roboto, Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --tracking-display: -0.007em;
  --tracking-label: .4px;                       /* .3px from lg */

  /* usage: font: 400 var(--h2) var(--font-header); */
  --display: 5.6rem/6rem;  --h1: 3.8rem/4.4rem;  --h2: 3rem/3.4rem;
  --h3: 2.4rem/2.8rem;     --h4: 2rem/2.4rem;     --lead: 2rem/3rem;
  --body: 1.6rem/2.4rem;   --body-sm: 1.5rem/2.2rem; --body-xs: 1.4rem/2.1rem;
  --caption: 1.2rem/1.7rem; --label: 1.5rem/1.9rem; --overline: 1.4rem/1.8rem;

  /* Spacing: space-N = N x 4px */
  --space-1: .4rem;  --space-2: .8rem;  --space-3: 1.2rem; --space-4: 1.6rem;
  --space-6: 2.4rem; --space-8: 3.2rem; --space-10: 4rem;  --space-12: 4.8rem;
  --space-14: 5.6rem; --space-16: 6.4rem; --space-20: 8rem; --space-30: 12rem;
  --space-40: 16rem; --space-50: 20rem; --space-70: 28rem;
  --gutter: 2.4rem;
  --section-y: 6.4rem;

  /* Shape */
  --line: 2px;
  --radius: 0;
  --shadow-1: drop-shadow(0 .2rem .4rem rgb(var(--shade-rgb) / .10));
  --shadow-2: drop-shadow(0 .8rem 2.4rem rgb(var(--shade-rgb) / .16));

  /* Motion */
  --ease-out-cubic: cubic-bezier(.215, .61, .355, 1);
  --ease-out-expo: cubic-bezier(.19, 1, .22, 1);
  --ease-in-out-cubic: cubic-bezier(.645, .045, .355, 1);
  --ease-out-quad: cubic-bezier(.25, .46, .45, .94);
  --ease-out-quart: cubic-bezier(.25, 1, .5, 1);
  --dur-fast: .2s;  --dur-medium: .4s;  --dur-slow: .5s;
  --dur-wipe: .75s; --dur-hero: 1s;     --dur-autoplay: 5s;
  --delay-intent: .2s; --delay-settle: .2s; --delay-stagger: .1s; --delay-callout: .25s;

  /* Chrome */
  --header-h-mobile: 5.2rem;
  --header-h: 12.8rem;
  --drawer-closed: calc(-100dvh + var(--header-h-mobile));
  --drawer-open: 0;
  --target-min: 4.4rem;

  /* Layers */
  --z-behind: -1; --z-base: 0; --z-raised: 10; --z-sticky: 20; --z-scrim: 25;
  --z-header: 30; --z-drawer: 40; --z-dialog: 50; --z-top: 60;
}

@media (min-width: 768px)  { :root { --section-y: 8rem; } }
@media (min-width: 1024px) {
  :root {
    --display: 8.8rem/9.2rem; --h1: 6.6rem/7rem;  --h2: 4.8rem/5.2rem;
    --h3: 3.2rem/3.6rem;      --h4: 2.4rem/2.8rem; --lead: 2.6rem/3.6rem;
    --body: 1.8rem/2.6rem;    --caption: 1.4rem/2.1rem; --label: 1.6rem/2rem;
    --tracking-label: .3px;
    --shadow-1: drop-shadow(0 .2rem .8rem rgb(var(--shade-rgb) / .10));
  }
}
@media (min-width: 1160px) { :root { --gutter: 5.6rem; } }

[data-surface="subtle"] { --bg: var(--grey-100); --placeholder: var(--ink-600); }
[data-surface="dark"], [data-surface="deep"] {
  --bg: var(--ink-900); --fg: var(--white); --fg-muted: var(--grey-500);
  --rule: var(--ink-600); --underline: var(--white); --signal: var(--accent-on-dark);
  --ring: var(--white); --ui-color: var(--white); --field-border: var(--grey-500);
  --placeholder: var(--grey-500);
}
[data-surface="deep"] { --bg: var(--ink-950); }
[data-surface="accent"] {
  --bg: var(--accent-500); --fg: var(--white); --fg-muted: var(--white);
  --rule: rgb(255 255 255 / .4); --underline: var(--white); --signal: var(--white);
  --ring: var(--white); --ui-color: var(--white);
}
[data-surface="photo"] {
  --fg: var(--white); --fg-muted: var(--white); --rule: rgb(255 255 255 / .3);
  --underline: var(--white); --signal: var(--white); --ring: var(--white); --ui-color: var(--white);
}

::selection { background: var(--accent-500); color: #fff; }
.bg-accent ::selection, [data-surface="accent"] ::selection { background: var(--ink-800); }
```

### 10.2 Recipes

```css
/* Underline draw: enters from the left, leaves to the right */
.u-draw {
  background: linear-gradient(var(--underline), var(--underline)) 100% 100% / 0 2px no-repeat;
  transition: background-size var(--dur-fast) var(--ease-in-out-cubic),
              color var(--dur-fast) var(--ease-in-out-cubic);
}
@media (hover: hover) { .u-draw:hover { background-position: 0 100%; background-size: 100% 2px; } }
.u-draw:focus-visible, .u-draw[aria-current="page"] { background-position: 0 100%; background-size: 100% 2px; }
.u-draw[aria-current="page"]:hover, .u-draw[aria-current="page"]:focus-visible { background-position: 100% 100%; background-size: 0 2px; }

/* Prose link: drawn at rest, retracts on hover/focus */
.prose a:not([class]) {
  font-weight: 700; text-decoration: none;
  background: linear-gradient(var(--underline), var(--underline)) 0 100% / 100% 2px no-repeat;
  transition: background-size var(--dur-fast) var(--ease-in-out-cubic);
}
@media (hover: hover) { .prose a:not([class]):hover { background-position: 100% 100%; background-size: 0 2px; } }
.prose a:not([class]):focus-visible { background-position: 100% 100%; background-size: 0 2px; }

/* Swipe fill: set --surface, --hover, --pressed per variant */
.swipe {
  background-color: var(--surface);
  background-image: linear-gradient(var(--hover), var(--hover));
  background-repeat: no-repeat; background-position: 100% 100%; background-size: 0 100%;
  transition: background-size var(--dur-fast) var(--ease-in-out-cubic),
              color var(--dur-fast) var(--ease-in-out-cubic);
}
@media (hover: hover) {
  .swipe:not(:disabled):not([aria-disabled="true"]):hover { background-position: 0 100%; background-size: 100% 100%; }
}
.swipe:not(:disabled):not([aria-disabled="true"]):focus-visible { background-position: 0 100%; background-size: 100% 100%; }
.swipe:not(:disabled):not([aria-disabled="true"]):active {
  background-image: none; background-color: var(--pressed); transition: none;
}
.button--primary   { --surface: #c14a12; --hover: #963a12; --pressed: #7a3214; color: #fff; }
.button--secondary { --surface: #2e2a25; --hover: #221f1b; --pressed: #1a1713; color: #fff; }
.button--dark      { --surface: #3e3935; --hover: #312e2a; --pressed: #2e2a25; color: #fff; }
.button--light     { --surface: #d7d6d6; --hover: #bdbbbb; --pressed: #9ea1a2; color: #2e2a25; }
.button--subtle    { --surface: #ebebea; --hover: #d7d6d6; --pressed: #bdbbbb; color: #2e2a25; }
.button:disabled, .button[aria-disabled="true"] {
  background: #ebebea; color: #9ea1a2; cursor: not-allowed;
}

/* Hide with fade, then drop out of the accessibility tree */
.fade-hide {
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-out-cubic) var(--delay-intent),
              visibility 0s linear calc(var(--dur-fast) + var(--delay-intent));
}
.fade-hide[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto; transition-delay: 0s, 0s;
}

/* Reveal on scroll (hidden pre-state only when JS is running) */
[data-reveal] {
  transition: opacity var(--dur-slow) var(--ease-out-cubic) var(--reveal-delay, 0s),
              transform var(--dur-slow) var(--ease-out-cubic) var(--reveal-delay, 0s);
}
html[data-js] [data-reveal="hidden"] { opacity: 0; transform: translateY(2.4rem); }
[data-reveal="visible"] { opacity: 1; transform: none; }

/* Image wipe (outgoing slide collapses toward the direction of travel) */
.wipe { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transition: clip-path var(--dur-slow) var(--ease-out-cubic); }
[data-direction="forward"]  .wipe:not([data-slide="active"]) { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
[data-direction="backward"] .wipe:not([data-slide="active"]) { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); }
.wipe[data-slide="active"], [data-init] .wipe { transition-duration: 0s; }

/* Hero settle */
html[data-js] .hero[data-reveal="hidden"] { opacity: 0; transform: scale(1.1); }
.hero { transition: opacity var(--dur-hero) var(--ease-out-expo) var(--delay-settle),
                    transform var(--dur-hero) var(--ease-out-expo) var(--delay-settle); }

/* Loading */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 50% { opacity: .5; } }
.spinner { width: 1.6rem; height: 1.6rem; border-radius: 50%;
  border: 2px solid color-mix(in srgb, currentColor 25%, transparent); border-top-color: currentColor;
  animation: spin .8s linear infinite; }
.skeleton { background: var(--grey-100); animation: pulse 1.2s var(--ease-in-out-cubic) infinite; }
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: pulse 1.2s ease-in-out infinite !important; border-top-color: currentColor; }
  .skeleton { animation: none !important; }
}
```

---

## 11. Do and don't

**Do**

- Use `accent-500` as a *signal*: underline, marker, progress, selection, checked state, focus ring.
- Set headings in Roboto Condensed, uppercase, **weight 400**, with `-0.007em` tracking from `h3`/lg up; set buttons, tabs and link lists in Condensed **700**.
- Keep geometry square; use 2px lines; allow one soft shadow (elevation 1) and a dialog shadow (elevation 2).
- Animate `transform`, `opacity`, `clip-path`, `background-size`; use 200ms for feedback and 500ms-1s for atmosphere.
- Draw underlines from the left and retract them to the right; make the current page the inverse.
- Make every hover fill **one** step darker than its surface and every pressed fill **two**.
- Show a visible focus ring on every interactive element; flip it to white on dark surfaces.
- Put ink text on grey surfaces; white text only on accent and ink surfaces.
- Pair `visibility: hidden` with a delayed transition so fades finish and content leaves the accessibility tree.
- Honor `prefers-reduced-motion` in CSS and in script; never auto-start motion for those users.
- Treat layout above 1500px as fluid.
- Provide a 44px hit area for coarse pointers without changing the visual size.

**Don't**

- Don't use pure black (outside print), blue-greys, gradients as decoration, or any radius (except radio).
- Don't set `accent-500` text on `ink-900` (2.89:1) or white text on `grey-400` (1.91:1).
- Don't use weights other than 400/700, or Condensed italic.
- Don't animate `top`, `left`, `margin`, or `box-shadow`; limit `height`, `width`, `padding` animation to the places named in 3.1.
- Don't remove outlines without a `:focus-visible` replacement.
- Don't use placeholders as labels, `grey-300` as the only boundary of a control, or color alone for status.
- Don't write inline `display` or `visibility` from scripts to open/close components.
- Don't rely on `background-attachment: fixed` for essential effects.
- Don't autoplay with sound, or autoplay anything without a visible pause control.
- Don't let hover styles stick on touch devices.

---

## 12. Quick reference

**One-paragraph brief.** Editorial, authoritative interface. White canvas, warm charcoal ink `#2e2a25`, one murram accent `#c14a12` used as a signal. Roboto Condensed uppercase headings (h2 30/34 -> 48/52), Roboto 16/24 -> 18/26 body, 10px rem root that goes fluid at 1500px. Square corners, 2px lines, 16-column desktop grid with content in columns 2-15. Links and buttons respond by drawing a 2px underline or a darker fill in 200ms (`ease-in-out-cubic`); overlays and heroes move over 0.5-1s on ease-out curves; images wipe by `clip-path`. The header hides on scroll-down and returns white with a soft shadow on scroll-up. Every control has hover, focus-visible, pressed and disabled states; everything honors reduced motion.

**Prompt scaffold.**

```
Build <component> using DESIGN.md. Use the tokens in section 10, the state table in 4.6,
the motion catalog in 3.3, and the behavior rules in section 6. Required states: default,
hover, focus-visible, pressed, disabled, plus any selected/expanded/loading/invalid state.
Include a prefers-reduced-motion path and keyboard behavior. Do not introduce colors, radii,
shadows, easing curves or durations that are not defined in the document.
```

**Ship checklist**

1. Colors come from the palette; text contrast >= 4.5:1; accent never on ink-900.
2. Headings Condensed / uppercase / 400; buttons and tabs Condensed / 700.
3. Hover **and** visible focus **and** pressed for every interactive element.
4. Disclosure uses `aria-expanded` / `hidden`; closed content leaves the accessibility tree after its fade.
5. Motion uses named easing and duration tokens; reduced motion handled; no autoplay for reduced-motion users.
6. Layout verified at 320, 414, 480, 768, 1024, 1160, 1500 and 1920px.
7. 44px hit areas on coarse pointers; keyboard works end to end; Escape closes overlays and returns focus.
8. Works with JavaScript off: content visible, navigation present, no hidden pre-states.
