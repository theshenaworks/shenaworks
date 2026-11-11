# AGENTS.md — Shena Works Website Handover & Developer Brief

Read this file first before writing any code. Everything required to build `shenaworksltd.com` from empty repo to production launch is specified in the four normative documents below.

---

## 1. Document map and reading order

| Order | File | Purpose |
|---|---|---|
| **1** | [`docs/DESIGN.md`](./docs/DESIGN.md) *(also at [`design.md`](./design.md))* | **Normative design system.** Principles, Murram (`#c14a12`) color palette & contrast guarantees, Roboto Condensed / Roboto typography, `1rem = 10px` fluid spacing, 16-column grid, 0px radius, 2px lines, motion choreography, state matrix, 25 UI components and 15 DOM behavior specs. |
| **2** | [`docs/SITE-PLAN.md`](./docs/SITE-PLAN.md) | **Normative site plan.** Full sitemap, URL table, desktop/mobile header, mobile action bar, footer, WhatsApp pre-filled messages, 27 reusable section blocks, ASCII wireframes and word-for-word copy for every page, form specification, conditional rendering rules, SEO metadata and GA4 analytics map. |
| **3** | [`docs/CONTENT.md`](./docs/CONTENT.md) | **CMS seed deck & facts register.** Reconciled company/founder facts, client input tracker (`I-01`–`I-15`), open decisions, all 7 Service records, 5 Project case studies, 4 Equipment categories + machines + hire FAQs, Newton Muthee's profile, Credentials, Testimonials, Meru & Nairobi Location records, 8 Insights briefs, and full Kenya Data Protection Act privacy/cookie notices. |
| **4** | [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md) | **Engineering & architecture guide.** Next.js 16 + Payload CMS 3 + NeonDB (PostgreSQL) + Cloudflare R2 + Vercel + Tailwind v4 setup, required MCP servers, functional requirements (`F1`–`F20`), Core Web Vitals targets, directory tree, publishing-gate hook (`enforcePublishingGate`), Zod enquiry schema & Kenyan phone normaliser, Turnstile & Resend pipeline, JSON-LD builders, WhatsApp OG image route, test suite, Milestones `M1`–`M6` and launch acceptance criteria. |

Reference material (background only — where it conflicts with the documents above, the documents above win):
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

1. **Zero visual invention:** Never introduce a color, font, font weight, border-radius, box-shadow, easing curve or transition duration that is not in [`docs/DESIGN.md`](./docs/DESIGN.md).
   - Accent is **Murram** (`--accent-500: #c14a12`, `--accent-600: #963a12`, `--accent-700: #7a3214`, `--accent-on-dark: #ff8f50`). Status error stays crimson (`--error: #9d1c30`).
   - Never place `accent-500` on `ink-900` (`2.89:1` fails AA); always use `accent-on-dark` (`6.31:1`) on dark surfaces.
   - Radius is `0` everywhere (`50%` on radio inputs and spinner rings only).
2. **Enforce the publishing gate in code and content:**
   - Never publish a string containing `[CONFIRM`.
   - Never use banned superlatives (`premier`, `leading`, `best`, `world-class`, `unrivalled`, `cutting-edge`, `seamless`).
   - Keep `architecture-and-consultancy` and `bills-of-quantities-and-estimating` in `draft` until registered professionals (`I-03`) are recorded.
   - Never render a public-official endorsement (`isPublicOfficial: true`) on Home, on Leadership, first in a list, or in `Review` JSON-LD.
   - Never use stock or AI-generated photography.
3. **Progressive enhancement & accessibility (WCAG 2.2 AA):**
   - Every page must render its full content, navigation, forms and project filters with JavaScript disabled.
   - Every interactive control must implement Default, Hover (`@media (hover: hover)`), Focus-visible (`2px` outline), Pressed and Disabled states, with a `44 × 44px` minimum hit area on coarse pointers.
   - Honor `prefers-reduced-motion: reduce` in CSS and in script.

---

## 4. Execution workflow

Follow Milestones `M1` through `M6` in [`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md#10-phased-build-milestones-m1m6-for-autonomous-agent-execution):

1. **`M1` Foundation & Design System** — Next.js 16, Tailwind v4 `@theme`, self-hosted Roboto / Roboto Condensed fonts, `src/components/ui/*`, `src/behaviors/*`.
2. **`M2` Payload CMS 3 & Seed Data** — NeonDB setup (via Neon MCP), collections, globals, `enforcePublishingGate` hook, idempotent seed script from `docs/CONTENT.md`.
3. **`M3` Global Chrome & Core Pages** — Header, MegaPanel, MobileDrawer, MobileActionBar, Footer, CookieBanner, Home, About, Leadership, Credentials, Services, Legal.
4. **`M4` Projects, Equipment, Locations & Insights** — Filterable portfolio, case studies, equipment catalogue & hire pages, Meru/Nairobi pages, Insights.
5. **`M5` Enquiries Pipeline, SEO & Analytics** — `EnquiryForm`, `/api/enquiries`, Cloudflare R2 & Turnstile (via Cloudflare MCP), Resend, Telegram, JSON-LD, `/api/og`, `sitemap.ts`, `robots.ts`, consent-gated GA4.
6. **`M6` QA, Accessibility, Vercel Deployment & Handover** — Vitest, Playwright + axe-core, Lighthouse CI (`>= 90` across all 4 categories on mobile, `< 1.5 MB` page weight), Vercel production/staging deployment (via Vercel & GitHub MCPs) and Neon/R2 backup restore check.
