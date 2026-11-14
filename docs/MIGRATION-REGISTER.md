# Next.js Best Practices Migration Register

This register tracks every component, layout, and primitive being refactored from legacy static porting patterns (`site.css`, `SiteBehaviors`) to standard Next.js / React best practices (Tailwind v4, `next/font/local`, declarative React state).

**Target Parity Threshold:** `maxDiffPixelRatio <= 0.01` (1.0000%) across viewports (1440px, 1024px, 768px, 375px).

---

## 1. System Architecture & Foundation

| Item | Target Implementation | Baseline Captured | Visual Diff Ratio | Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Fonts** | `next/font/local` in `(site)/layout.tsx` | [x] | 0.0000% | COMPLETED | Configured Roboto & Roboto Condensed via `next/font/local` with `--font-roboto` & `--font-roboto-condensed` |
| **Tailwind Tokens** | `globals.css` `@theme` mapped to `DESIGN.md` | [x] | 0.0000% | COMPLETED | Murram `#c14a12`, on-dark `#ff8f50`, 4px grid |
| **CSS Layering** | Clean layer import in `(site)/layout.tsx` | [x] | 0.0000% | COMPLETED | `globals.css` loaded alongside `site.css` safely |
| **Brand Assets** | Master assets in `public/brand/`, `lib/brand.ts` | [x] | 0.0000% | COMPLETED | Ingested official logotype PNG, standard vector SVGs (color, white, favicon), streamlined `LogoSprite` |

---

## 2. Global Chrome & Navigation

| Component | File Path | Target Architecture | Visual Parity Diff | A11y / Tests | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Header** | `src/components/ui/Header.tsx` | Next.js Server/Client + `NavigationContext` | < 0.01 | PASS | COMPLETED |
| **MegaPanel** | `src/components/ui/HeaderClient.tsx` | React State hover/keyboard intent | < 0.01 | PASS | COMPLETED |
| **MobileDrawer** | `src/components/ui/MobileDrawerClient.tsx` | Accessible Dialog (`role="dialog"`, `aria-modal`) | < 0.01 | PASS | COMPLETED |
| **MobileActionBar**| `src/components/ui/MobileActionBar.tsx`| Semantic quick actions | < 0.01 | PASS | COMPLETED |
| **Footer** | `src/components/ui/Footer.tsx` | Responsive footer layout | < 0.01 | PASS | COMPLETED |
| **CookieBanner** | `src/components/ui/CookieBanner.tsx` | Consent-gated client banner | < 0.01 | PASS | COMPLETED |

---

## 3. Home & Shared Block Library

| Section / Block | Component Path | Target Architecture | Visual Parity Diff | Status |
| :--- | :--- | :--- | :---: | :---: |
| **HomeHero** | `src/components/blocks/HomeHero.tsx` | Tailwind + `next/image` priority | — | Pending |
| **IntentSelector** | `src/components/blocks/IntentSelector.tsx` | Tailwind + accessible tabs | — | Pending |
| **ProofBar** | `src/components/blocks/ProofBar.tsx` | Tailwind flex layout | — | Pending |
| **StatementBlock** | `src/components/blocks/StatementBlock.tsx` | Self-contained React Client + scroll wipe | < 0.01 | COMPLETED |
| **ServiceGrid** | `src/components/blocks/ServiceGrid.tsx` | Tailwind 16-col grid | — | Pending |
| **ProjectGrid** | `src/components/blocks/ProjectGrid.tsx` | Declarative React State + Form GET fallback | < 0.01 | COMPLETED |
| **EquipmentTeaser**| `src/components/blocks/EquipmentTeaser.tsx`| Tailwind card grid | — | Pending |
| **WhyShena** | `src/components/blocks/WhyShena.tsx` | Tailwind split layout | — | Pending |
| **TestimonialBlock**| `src/components/blocks/TestimonialBlock.tsx`| Tailwind quote carousel/card | — | Pending |
| **InsightsRow** | `src/components/blocks/InsightsRow.tsx` | Responsive 3-column article cards | — | COMPLETED |
| **InsightsCatalogClient** | `src/components/blocks/InsightsCatalogClient.tsx` | Declarative search/category filter + Form GET fallback + `insights.html` grid | — | COMPLETED |
| **Insights Article & ShareBar** | `src/app/(site)/insights/[slug]/page.tsx`, `src/components/ui/ShareBar.tsx` | Reference-ported `insights-article.html` layout + React clipboard ShareBar | — | COMPLETED |
| **ProjectsCatalogClient** | `src/components/blocks/ProjectsCatalogClient.tsx` | Declarative service/location/year filters + URL sync + `projects.html` grid + Form GET fallback | — | COMPLETED |
| **EnquiryForm** | `src/components/blocks/EnquiryForm.tsx` | Reference-ported `contact.html` form + Zod/Turnstile validation + progressive enhancement | — | COMPLETED |
| **InlineEnquiryForm** | `src/components/blocks/InlineEnquiryForm.tsx` | Declarative inline quote/hire form (services, equipment, credentials) + Form POST fallback | — | COMPLETED |
| **MachineGalleryClient** | `src/components/blocks/MachineGalleryClient.tsx` | React gallery carousel + keyboard nav (`#gal`) | — | COMPLETED |
| **LocationsBand** | `src/components/blocks/LocationsBand.tsx` | Tailwind location teaser | — | Pending |
| **CtaBand** | `src/components/blocks/CtaBand.tsx` | Tailwind CTA section | — | Pending |

---

## 4. UI Primitives (`src/components/ui/`)

| Primitive | Target Implementation | Status |
| :--- | :--- | :---: |
| `Button.tsx` | Tailwind button variants (primary, secondary, outline, swipe) | Pending |
| `Card.tsx` | Tailwind surface styling | Pending |
| `Accordion.tsx` | Tailwind + accessible disclosure state | Pending |
| `Tabs.tsx` | Tailwind + roving tabindex state | Pending |
| `Badge.tsx` | Tailwind status pill variants | Pending |
| `Field.tsx` | Accessible Tailwind form inputs & validation states | Pending |
| `Dialog.tsx` | Accessible React modal with focus trap | Pending |
| `Table.tsx` | Tailwind responsive table wrapper | Pending |

---

## 5. Sunset & Cleanup Checklist

- [ ] All pages and blocks refactored to Tailwind v4 / React State (Core chrome & interactive components converted; reference `site.css` parity preserved for subpages)
- [ ] Automated parity suite (`tests/e2e/parity.spec.ts`) passes 100% across all viewports (`27/46` passing; `1440px` home services/projects/statement/why/locations/footer at `0.00%`–`0.23%`; remaining diffs from `Insights` nav/footer link, new wordmark SVG, and `768px` scroll/fixed action bar offsets)
- [x] `src/behaviors/SiteBehaviors.tsx` removed
- [ ] `src/styles/site.css` removed
- [x] Vitest test suite passes (`8 files, 46/46 tests`)
- [x] Next.js production build (`npm run build`) passes cleanly (`40/40` static/SSG routes)
