# AGENTS.md — Shena Works Website Handover & Developer Brief

Read this file first before writing any code. Everything required to build `shenaworksltd.com` from empty repo to production launch is specified in the normative documents below.

---

## 1. Document map and reading order

| Order | File | Purpose |
|---|---|---|
| **1** | [`docs/DESIGN.md`](./docs/DESIGN.md) *(also at [`design.md`](./design.md))* | **Normative design system.** Principles, Murram (`#c14a12`) color palette & contrast guarantees, Roboto Condensed / Roboto typography, `1rem = 10px` fluid spacing, 16-column grid, 0px radius, 2px lines, motion choreography, state matrix, 25 UI components and 15 DOM behavior specs. |
| **2** | [`docs/SITE-PLAN.md`](./docs/SITE-PLAN.md) | **Normative site plan.** Full sitemap, URL table, desktop/mobile header, mobile action bar, footer, WhatsApp pre-filled messages, 27 reusable section blocks, ASCII wireframes and word-for-word copy for every page, form specification, conditional rendering rules, SEO metadata and GA4 analytics map. |
| **3** | [`docs/CONTENT.md`](./docs/CONTENT.md) | **CMS seed deck & facts register.** Reconciled company/founder facts, client input tracker (`I-01`–`I-15`), open decisions, all 7 Service records, 5 Project case studies, 4 Equipment categories + machines + hire FAQs, Newton Muthee's profile, Credentials, Testimonials, Meru & Nairobi Location records, 8 Insights briefs, and full Kenya Data Protection Act privacy/cookie notices. |
| **4** | [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md) | **Engineering & architecture guide.** Next.js 16 + Payload CMS 3 + NeonDB (PostgreSQL) + Cloudflare R2 + Vercel + Tailwind v4 setup, required MCP servers, functional requirements (`F1`–`F20`), Core Web Vitals targets, directory tree, publishing-gate hook (`enforcePublishingGate`), Zod enquiry schema & Kenyan phone normaliser, Turnstile & Resend pipeline, JSON-LD builders, WhatsApp OG image route, test suite, Milestones `M1`–`M6` and launch acceptance criteria. |
| **5** | [`docs/MIGRATION-REGISTER.md`](./docs/MIGRATION-REGISTER.md) | **Component migration & parity register.** Tracks every foundation item, global chrome element, and page block across styling architecture, visual diff ratio against baseline, accessibility compliance, and implementation status. |

Reference material (background & visual benchmarks):
- Visual Benchmark: [`docs/reference/home/index.html`](./docs/reference/home/index.html), `desktop.png`, `mobile.png`, and golden snapshots in `docs/screenshots/baseline/`.
- [`shena_works_company_profile.md`](./shena_works_company_profile.md)
- [`newton_muthee_profile.md`](./newton_muthee_profile.md)
- [`mccarthy-design.md`](./mccarthy-design.md) and [`references/`](./references/)

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

1. **Zero visual invention:** Never introduce a color, font, font weight, border-radius, box-shadow, easing curve or transition duration that is not in [`docs/DESIGN.md`](./docs/DESIGN.md) or the approved visual benchmark.
   - Accent is **Murram** (`--accent-500: #c14a12`, `--accent-600: #963a12`, `--accent-700: #7a3214`, `--accent-on-dark: #ff8f50`). Status error stays crimson (`--error: #9d1c30`).
   - Never place `accent-500` on `ink-900` (`2.89:1` fails AA); always use `accent-on-dark` (`6.31:1`) on dark surfaces.
   - Radius is `0` everywhere (`50%` on radio inputs and spinner rings only).
2. **Next.js 16 & React 19 Architecture Standards:**
   - **Font Loading:** Use `next/font/local` in `src/app/(site)/layout.tsx` for self-hosted Roboto and Roboto Condensed (`.woff2` in `public/fonts/`). Inject `--font-roboto` and `--font-roboto-condensed` CSS variables into `<html>` for zero Cumulative Layout Shift (CLS) and automatic preloading.
   - **Styling Architecture:** Layered Tailwind CSS v4 (`src/styles/globals.css` with `@theme` tokens) alongside `src/styles/site.css`. New UI components and refactored sections use Tailwind utility classes mapped to `DESIGN.md` tokens.
   - **Declarative Interactive State:** Interactive chrome (Header hide/solid scroll states, Mega-Panels, Mobile Drawer dialog, and Scrim) is controlled via declarative React state (`NavigationContext`, `HeaderClient`, `MobileDrawerClient`). Do not introduce brittle global DOM-querying scripts (`document.querySelector`, `classList.toggle` on body).
   - **Self-Contained Components:** Client interactions (e.g. `StatementBlock` scroll wipe, `ProjectGrid` category filtering) must be encapsulated in their respective components using React hooks (`useRef`, `useState`, `useEffect`).
   - **Strict Visual Parity Gate:** Any change to styling or layout must be verified against `docs/screenshots/baseline/` using the automated Playwright parity test (`tests/e2e/parity.spec.ts`) with `maxDiffPixelRatio <= 0.01` (1%).
3. **Enforce the publishing gate in code and content:**
   - Never publish a string containing `[CONFIRM`.
   - Never use banned superlatives (`premier`, `leading`, `best`, `world-class`, `unrivalled`, `cutting-edge`, `seamless`).
   - Keep `architecture-and-consultancy` and `bills-of-quantities-and-estimating` in `draft` until registered professionals (`I-03`) are recorded.
   - Never render a public-official endorsement (`isPublicOfficial: true`) on Home, on Leadership, first in a list, or in `Review` JSON-LD.
   - Never use stock or AI-generated photography in production.
   - Blocks that `SITE-PLAN.md` section 8 says to hide (ProofBar, Testimonial, Insights, unpublished locations) stay hidden until their data passes the gate.
4. **Progressive enhancement & accessibility (WCAG 2.2 AA):**
   - Every page must render its full content, navigation, forms and project filters with JavaScript disabled (`<form method="GET">` for filters).
   - Every interactive control must implement Default, Hover (`@media (hover: hover)`), Focus-visible (`2px` outline), Pressed and Disabled states, with a `44 × 44px` minimum hit area on coarse pointers.
   - Mobile navigation drawer must conform to WAI-ARIA Dialog patterns (`role="dialog"`, `aria-modal="true"`, focus trap, escape key dismissal).
   - Honor `prefers-reduced-motion: reduce` in CSS and in script.

---

## 4. Execution workflow

Follow Milestones `M1` through `M6` in [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md#10-phased-build-milestones-m1m6-for-autonomous-agent-execution) with Next.js 16 best practices:

1. **`M1` Foundation & Design System** — Next.js 16, Tailwind v4 `@theme`, `next/font/local` self-hosted Roboto / Roboto Condensed fonts, `src/components/ui/*`, accessible React primitives.
2. **`M2` Payload CMS 3 & Seed Data** — NeonDB setup (via Neon MCP), collections, globals, `enforcePublishingGate` hook, idempotent seed script from `docs/CONTENT.md`.
3. **`M3` Global Chrome & Core Pages** — Header (`HeaderClient`), MegaPanel, MobileDrawer (`MobileDrawerClient`), `NavigationContext`, MobileActionBar, Footer, CookieBanner, Home, About, Leadership, Credentials, Services, Legal.
4. **`M4` Projects, Equipment, Locations & Insights** — Filterable portfolio (`ProjectGrid`), case studies, equipment catalogue & hire pages, Meru/Nairobi pages, Insights.
5. **`M5` Enquiries Pipeline, SEO & Analytics** — `EnquiryForm`, `/api/enquiries`, Cloudflare R2 & Turnstile (via Cloudflare MCP), Resend, Telegram, JSON-LD, `/api/og`, `sitemap.ts`, `robots.ts`, consent-gated GA4.
6. **`M6` QA, Accessibility, Vercel Deployment & Handover** — Vitest, Playwright + axe-core, Visual Parity (`tests/e2e/parity.spec.ts` with `diffRatio <= 0.01`), Lighthouse CI (`>= 90` across all 4 categories on mobile, `< 1.5 MB` page weight), Vercel production/staging deployment (via Vercel & GitHub MCPs) and Neon/R2 backup restore check.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
