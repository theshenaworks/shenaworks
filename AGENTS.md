# AGENTS.md — Shena Works Website Handover & Developer Brief

Read this file first before writing any code. Section 0 overrides everything else on anything visual or interactive.

---

## 0. Visual source of truth (overrides everything below on visuals)

`docs/reference/home/index.html` is the approved visual and interaction design for the site. Screenshots of it live beside it: `desktop.png` (1440 wide) and `mobile.png` (375 wide).

**Precedence**
- On any visual or interaction question (layout, spacing, type, colour, header, dropdowns, mobile menu, hero, footer, motion), the reference wins over `DESIGN.md`, the `SITE-PLAN.md` wireframes and the styling advice in `BUILD-GUIDE.md`.
- `DESIGN.md`, `SITE-PLAN.md` and `CONTENT.md` still govern copy, data fields, URLs, SEO, analytics and the publishing gate.
- Every page uses the same system: the same `site.css` classes, the same header and footer. Never restyle the chrome per page.
- Never "correct" the reference to match `DESIGN.md`. Where they differ, the reference is right.

**Porting protocol (this is a port, not a redesign)**
1. Copy the reference `<style>` verbatim into `src/styles/site.css`. Keep it unlayered. Import it only in `src/app/(site)/layout.tsx`, never in the Payload layout or the root. Do not convert it to Tailwind, CSS modules or styled-jsx. Do not rename, merge, reorder or tidy selectors.
2. Keep every element, class name, attribute, `aria-*` attribute and the DOM order identical to the reference. Components are thin wrappers that emit the same DOM. No Tailwind utility classes on ported elements.
3. Fonts: self-host the woff2 files in `public/fonts/` and use `@font-face` with family names exactly `"Roboto"` and `"Roboto Condensed"`, so the reference's `--head` and `--body` variables work unchanged. Do not use `next/font`.
4. Inline the logo `<symbol id="shena-logo">` sprite once in the `(site)` layout.
5. The reference's inline `<script>` blocks move to `src/behaviors/` and run from a single `'use client'` component (`<SiteBehaviors />`) inside `useEffect`, attached by the same selectors, with cleanup and re-init on route change. Do not rewrite them as React state. Do not set `className` on `<body>` from React (the scripts toggle `lock` and `mm` on it).
6. Images: Payload media inside the reference's `.ph` frames using `next/image` with `fill` and a correct `sizes` value. The hero image uses `priority`. Add `media.shenaworksltd.com` to `images.remotePatterns`.
7. Internal links may use `next/link`, but keep every class and attribute unchanged.
8. If a port cannot be exact, or the reference conflicts with the accessibility and progressive-enhancement rules in section 3, keep the reference's look, add the minimum markup or CSS needed to meet the rule, and list it in your report. Never deviate silently.
9. Do not add features, refactor, "improve" or modernise anything in the reference.

---

## 1. Document map and reading order

| Order | File | Purpose |
|---|---|---|
| **1** | [`docs/reference/home/index.html`](./docs/reference/home/index.html) | **Approved visual and interaction design** (section 0). |
| **2** | [`docs/DESIGN.md`](./docs/DESIGN.md) *(also at [`design.md`](./design.md))* | Design system: tokens, states, motion and behaviour spec, accessibility. Subordinate to section 0 on visuals; still the reference for pages and components the reference does not yet show. |
| **3** | [`docs/SITE-PLAN.md`](./docs/SITE-PLAN.md) | **Normative site plan.** Sitemap, URL table, block library, word-for-word copy, forms, conditional rendering rules, SEO metadata, GA4 analytics map. Its wireframes are subordinate to the reference. |
| **4** | [`docs/CONTENT.md`](./docs/CONTENT.md) | **CMS seed deck and facts register.** Services, projects, equipment, team, credentials, testimonials, locations, insights, legal text. |
| **5** | [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md) | **Engineering guide.** Next.js 16, Payload CMS 3, NeonDB, Cloudflare R2, Vercel, directory tree, publishing-gate hook, enquiry pipeline, JSON-LD, tests, milestones `M1`–`M6`. Its Tailwind and styling advice applies only to new UI that is not ported from the reference. |

Reference material (background only; where it conflicts with the documents above, the documents above win):
- [`shena_works_company_profile.md`](./shena_works_company_profile.md)
- [`newton_muthee_profile.md`](./newton_muthee_profile.md)
- [`mccarthy-design.md`](./mccarthy-design.md) and [`references/`](./references/): historical inspiration only. Do not use them for styling; the reference in section 0 already captures the look.

---

## 2. Required MCP servers and agent skills

Before starting infrastructure or deployment tasks, verify that the following four MCP servers (and their associated agent skills) are connected in your environment. Prefer calling these MCP tools over manual dashboard steps or ad-hoc shell scripts:

| Service | Official MCP Server / Resource | What the agent uses it for |
|---|---|---|
| **Cloudflare (API & R2)** | [Cloudflare API MCP Server](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/#cloudflare-api-mcp-server) | Provision and configure R2 buckets (`shena-media-public`, `shena-enquiries-private`, backup bucket), bind custom domain `media.shenaworksltd.com`, configure CORS/cache rules, manage DNS records and Cloudflare Turnstile widgets. |
| **Neon DB** | [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server) | Create/manage the Neon Postgres project, create `production` and `staging` database branches, retrieve pooled (`-pooler`) and direct connection strings, inspect schema/migrations, and test branch/point-in-time restores. |
| **Vercel** | [Vercel MCP Server](https://vercel.com/docs/agent-resources/vercel-mcp) | Create and link the Vercel project, set `production` / `preview` environment variables, inspect build and runtime logs, verify preview deployment URLs per PR, and manage domain cut-over (`shenaworksltd.com`). |
| **GitHub** | [GitHub MCP Server](https://github.com/github/github-mcp-server) | Manage repository branches (`main`, `staging`, milestone feature branches `m1`–`m6`), open/review PRs, inspect GitHub Actions CI/Lighthouse runs and scheduled database backup workflows. |

---

## 3. Non-negotiable rules for agents

1. **No new visual values.** Never introduce a colour, font, weight, radius, shadow, easing curve or duration that appears in neither `docs/reference/home/index.html` nor `docs/DESIGN.md`. Where the two differ, the reference wins.
   - Accent is **Murram** (`#c14a12`, hover `#963a12`, pressed `#7a3214`, on dark `#ff8f50`). Status error stays crimson (`#9d1c30`).
   - Never place the `#c14a12` accent on `ink-900` (`2.89:1` fails AA); always use the on-dark accent (`6.31:1`) on dark surfaces.
   - Radius is `0` everywhere (`50%` on radio inputs and spinner rings only).
2. **Enforce the publishing gate in code and content:**
   - Never publish a string containing `[CONFIRM`.
   - Never use banned superlatives (`premier`, `leading`, `best`, `world-class`, `unrivalled`, `cutting-edge`, `seamless`).
   - Keep `architecture-and-consultancy` and `bills-of-quantities-and-estimating` in `draft` until registered professionals (`I-03`) are recorded.
   - Never render a public-official endorsement (`isPublicOfficial: true`) on Home, on Leadership, first in a list, or in `Review` JSON-LD.
   - Never use stock or AI-generated photography in production. (The reference uses temporary stock images; production images come from Payload media.)
   - Blocks that `SITE-PLAN.md` section 8 says to hide (ProofBar, Testimonial, Insights, unpublished locations) stay hidden until their data passes the gate, even if the reference shows them.
3. **Progressive enhancement and accessibility (WCAG 2.2 AA):**
   - Every page must render its full content, navigation, forms and project filters with JavaScript disabled.
   - Every interactive control must have Default, Hover (`@media (hover: hover)`), Focus-visible, Pressed and Disabled states, with a `44 × 44px` minimum hit area on coarse pointers.
   - Honour `prefers-reduced-motion: reduce` in CSS and in script.
   - Where the reference falls short of these rules, apply section 0 rule 8.

---

## 4. Execution workflow

Follow Milestones `M1` through `M6` in [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md#10-phased-build-milestones-m1m6-for-autonomous-agent-execution), with these adjustments:

1. **`M1` Foundation & Design System** — Next.js 16, self-hosted Roboto / Roboto Condensed fonts, `src/styles/site.css` ported per section 0, `src/behaviors/*`. Tailwind v4 `@theme` is for new, non-ported UI only; ported elements use `site.css`.
2. **`M2` Payload CMS 3 & Seed Data** — NeonDB setup (via Neon MCP), collections, globals, `enforcePublishingGate` hook, idempotent seed script from `docs/CONTENT.md`.
3. **`M3` Global Chrome & Core Pages** — Header, MegaPanel, MobileDrawer, MobileActionBar, Footer (ported from the reference, not rebuilt from `DESIGN.md`), CookieBanner, Home, About, Leadership, Credentials, Services, Legal.
4. **`M4` Projects, Equipment, Locations & Insights** — Filterable portfolio, case studies, equipment catalogue & hire pages, Meru/Nairobi pages, Insights.
5. **`M5` Enquiries Pipeline, SEO & Analytics** — `EnquiryForm`, `/api/enquiries`, Cloudflare R2 & Turnstile (via Cloudflare MCP), Resend, Telegram, JSON-LD, `/api/og`, `sitemap.ts`, `robots.ts`, consent-gated GA4.
6. **`M6` QA, Accessibility, Vercel Deployment & Handover** — Vitest, Playwright + axe-core, Lighthouse CI (`>= 90` across all 4 categories on mobile, `< 1.5 MB` page weight), Vercel production/staging deployment (via Vercel & GitHub MCPs) and Neon/R2 backup restore check.

---

## 5. Home page port: phases

The Home page is being re-ported from the reference because the earlier build does not match it. Work **one phase at a time. Stop at the end of each phase, report, and wait for approval.** Work on branch `fix/home-port`.

If the existing implementation conflicts with the reference, the reference wins. Replace the existing implementation rather than patching it.

### Phase A: shell
Fonts, `site.css`, `(site)` layout, logo sprite, Header with the three mega panels (Services, Equipment, About), the light mobile Drawer, Footer, MobileActionBar, `<SiteBehaviors />` with the header, dropdown and drawer behaviour.
- Nav and footer data come from `SiteSettings` and the services and equipment collections, with the reference's values as fallback.
- Dropdown content (from the reference): Services (grouped Roads and earthworks / Buildings and interiors / Planning and delivery, gated services hidden), Equipment (the four categories, All equipment, How hire works), About (Company, Leadership; Credentials and company profile only when published).
- **Done when:** Playwright screenshots of `/` at 1440, 1024, 768 and 375 match the reference for the header at rest, header scrolled, each dropdown open, the drawer open (with an expanded section) and the footer.

### Phase B: sections
One component per numbered section comment in the reference, in the same order, using static fixture data identical to the reference's content.
- **Done when:** full-page screenshots at 1440 and 375 match `desktop.png` and `mobile.png`, ignoring image pixels.

### Phase C: behaviour
Project filter chips, the pinned statement scroll effect, and any remaining reference scripts, ported per section 0 rule 5.
- **Done when:** each behaves as in the reference at desktop and mobile widths, with and without `prefers-reduced-motion`, and the filters still work with JavaScript disabled.

### Phase D: data
Replace fixture data with Payload data (Local API, cached, revalidated by tag). The DOM output must be identical when the data matches the reference. Apply the conditional rendering rules in `SITE-PLAN.md` section 8. Images come from Payload media (R2) per section 0 rule 6.

### Phase E: parity test
Add `tests/e2e/parity.spec.ts`. It screenshots each section, found by selector, of `file://docs/reference/home/index.html` and of `http://localhost:3000/` at 1440, 1024, 768 and 375, with animations disabled, `prefers-reduced-motion: reduce`, and images masked. Seed Payload with the reference's content first. Fail above `maxDiffPixelRatio: 0.01`.

### Report format at the end of every phase
1. Files created or changed.
2. What matches the reference, with screenshot paths.
3. Any deviation from the reference, and why (section 0 rule 8).
4. Anything you could not do exactly.

---

## 6. Other pages

Do not build or restyle any other page until Home is approved. After that, each page needs an approved static prototype at `docs/reference/<page>/index.html` and is ported with the same protocol as section 0. If a page has no prototype, ask for one rather than designing it from the docs.
