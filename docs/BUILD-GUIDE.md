# BUILD-GUIDE.md — Shena Works Technical Architecture & Engineering Guide

End-to-end engineering specification for building, testing and deploying `shenaworksltd.com`. Pair this document with `DESIGN.md` (all visual tokens, components, states, motion and DOM behavior), `SITE-PLAN.md` (routes, wireframes, blocks and page copy) and `CONTENT.md` (CMS seed data and publishing gates).

**Contents**
1. Technology stack and versions
2. Repository structure
3. CSS, fonts and Tailwind configuration (`DESIGN.md` integration)
4. Frontend component and behavior architecture
5. Payload CMS 3 schema, access control and publishing-gate hooks
6. Media pipeline and Cloudflare R2 storage
7. Enquiries pipeline, spam protection, notifications and rate limiting
8. SEO, JSON-LD schemas, Open Graph for WhatsApp, redirects and consent-gated GA4
9. Security, testing, backups and deployment
10. Phased build milestones (`M1`–`M6`) for autonomous agent execution

---

## 1. Technology stack and versions

| Layer | Package / service | Version / config | Why |
|---|---|---|---|
| Runtime | Node.js LTS | `>= 22.x` (`pnpm 9.x`) | Required by Next.js 16 and Payload 3 |
| Framework | `next`, `react`, `react-dom` | `16.x` (App Router, React 19, TypeScript `5.x` strict) | Server components, ISR/tag caching, metadata API |
| CMS | `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-s3`, `@payloadcms/plugin-seo` | `3.x` | Runs inside the same Next.js app at `/admin`; strongly typed schema in code (`payload-types.ts`) |
| Database | **NeonDB** (Serverless PostgreSQL) | `PostgreSQL 16/17` via `@payloadcms/db-postgres` (pooled & direct connections) | Relational integrity for content and enquiries, built-in PgBouncer connection pooling, Point-in-Time Restore (PITR) and database branching for staging/preview deploys |
| Media | **Cloudflare R2** | S3-compatible bucket + custom public domain `media.shenaworksltd.com` | Zero egress fees, fast Cloudflare edge caching |
| Hosting & CI/CD | **Vercel** + **GitHub** (with Cloudflare DNS/CDN in front) | Managed Next.js 16 deployment + GitHub Actions | Zero-config App Router SSR/ISR, instant preview links per PR paired with NeonDB branches |
| Styling | Vanilla CSS custom properties (`DESIGN.md` 10) + Tailwind CSS | `4.x` (CSS-first `@theme` mapped 1:1 to `DESIGN.md` tokens) | Keeps every value faithful to `DESIGN.md` |
| Forms & validation | `zod` | `3.x` | Shared schema between client blur/submit validation and server endpoint |
| Email | `resend` (or `nodemailer` SMTP fallback) | latest | Delivers staff notifications in < 1 minute (spec F5) |
| Anti-spam | Cloudflare Turnstile + honeypot + IP rate limiter | server-verified via `siteverify` | Blocks bots without CAPTCHA puzzles (spec F6) |
| Testing | `vitest`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli` | latest | Unit, E2E, WCAG 2.2 AA and Lighthouse verification |

### 1.2 Required MCP servers and agent skills

Agents building, deploying and operating this project should have the following four MCP servers and their companion skills enabled:

| MCP Server | Documentation URL | Agent responsibilities in this project |
|---|---|---|
| **Cloudflare API MCP** | `https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/#cloudflare-api-mcp-server` | Create and configure R2 buckets (`shena-media-public`, `shena-enquiries-private`, backup bucket), attach custom domain `media.shenaworksltd.com`, set cache/CORS policies, and manage DNS & Turnstile keys. |
| **Neon MCP** | `https://neon.com/docs/ai/neon-mcp-server` | Provision the Neon project (`shena-works`), create `production` and `staging` branches, fetch pooled (`DATABASE_URI`) and direct (`DIRECT_DATABASE_URI`) credentials, run migrations/diagnostics, and verify branch restores. |
| **Vercel MCP** | `https://vercel.com/docs/agent-resources/vercel-mcp` | Provision the Vercel project, bind GitHub repo, manage environment variables across `production`/`preview`, inspect build & serverless function logs, and verify preview/production deployments. |
| **GitHub MCP** | `https://github.com/github/github-mcp-server` | Manage the Git repository, milestone branches (`M1`–`M6`), pull requests, issue tracking and GitHub Actions workflows (CI tests, Lighthouse CI, and daily Neon → R2 backup cron). |

### 1.3 Functional requirements (`F1`–`F20`) and Core Web Vitals targets

**Core Web Vitals & Performance Targets (Mobile & Desktop):**
- **LCP (Largest Contentful Paint):** `< 2.5 s`
- **INP (Interaction to Next Paint):** `< 200 ms`
- **CLS (Cumulative Layout Shift):** `< 0.1`
- **Lighthouse Scores (Mobile):** `>= 90` across Performance, Accessibility, Best Practices and SEO on Home, Service, Project and Equipment pages; total page weight `< 1.5 MB`.

| ID | Requirement | Priority | Implemented in |
|---|---|---|---|
| `F1` | Quote request form with project type, location, budget band, timeline and attachments | **Must** | `SITE-PLAN.md` 7, `BUILD-GUIDE.md` 7 |
| `F2` | Equipment hire form pre-filled from the machine page | **Must** | `SITE-PLAN.md` 6.11 & 7 |
| `F3` | WhatsApp click-to-chat with a pre-filled message per page | **Must** | `SITE-PLAN.md` 4.6 |
| `F4` | Click-to-call on mobile | **Must** | `SITE-PLAN.md` 4.3 |
| `F5` | Enquiries stored in the database and emailed to staff within 1 minute | **Must** | `BUILD-GUIDE.md` 7.2 |
| `F6` | Spam protection (honeypot plus Cloudflare Turnstile + IP rate limit) | **Must** | `BUILD-GUIDE.md` 7.2 |
| `F7` | CMS for projects, equipment, posts, testimonials and credentials, with `admin` and `editor` roles | **Must** | `BUILD-GUIDE.md` 5 |
| `F8` | Project filters by service, location and year (works with and without JS) | **Must** | `SITE-PLAN.md` 6.7 |
| `F9` | Per-page title, description, social image and canonical controls | **Must** | `SITE-PLAN.md` 9, `BUILD-GUIDE.md` 8 |
| `F10` | Automatic XML sitemap, `robots.txt` and JSON-LD structured data | **Must** | `BUILD-GUIDE.md` 8.1 & 8.3 |
| `F11` | Image optimisation, modern formats (AVIF/WebP) and lazy loading | **Must** | `BUILD-GUIDE.md` 6 |
| `F12` | Analytics (GA4) with conversion events | **Must** | `SITE-PLAN.md` 10, `BUILD-GUIDE.md` 8.5 |
| `F13` | Privacy notice and consent for non-essential cookies | **Must** | `SITE-PLAN.md` 4.8 & 6.17, `CONTENT.md` 11 |
| `F14` | Downloadable company profile PDF | **Should** | `SITE-PLAN.md` 3.2 & 5.23 |
| `F15` | WhatsApp or Telegram notification of new enquiries | **Should** | `BUILD-GUIDE.md` 7.2 |
| `F16` | Insights section with categories | **Should** | `SITE-PLAN.md` 6.12–6.13, `CONTENT.md` 10 |
| `F17` | Project map (`geo` coordinates stored now; map tab in Phase 5) | **Should** | `SITE-PLAN.md` 6.7.6 |
| `F18` | Swahili version | **Could** | Post-launch |
| `F19` | Careers and supplier registration forms | **Could** | Post-launch |
| `F20` | Client portal, online payments, live equipment booking | **Not at launch** | Out of scope at launch |

---

## 2. Repository structure

```text
shena-works/
├── AGENTS.md                         # Handover instructions for coding agents
├── docs/
│   ├── DESIGN.md                     # Normative design system
│   ├── SITE-PLAN.md                  # Page wireframes, blocks & copy
│   ├── CONTENT.md                    # Seed records, facts register & legal copy
│   └── BUILD-GUIDE.md                # This file
├── public/
│   ├── fonts/
│   │   ├── roboto-v32-latin-400.woff2
│   │   ├── roboto-v32-latin-400italic.woff2
│   │   ├── roboto-v32-latin-700.woff2
│   │   ├── roboto-condensed-v27-latin-400.woff2
│   │   └── roboto-condensed-v27-latin-700.woff2
│   └── brand/
│       ├── logo-color.svg            # Full-color logo for white header
│       ├── logo-white.svg            # All-white logo for transparent header & footer
│       └── favicon.svg
├── src/
│   ├── app/
│   │   ├── (site)/                   # Public website route group
│   │   │   ├── layout.tsx            # HTML shell, fonts, Header, MobileActionBar, Footer, CookieBanner
│   │   │   ├── page.tsx              # / (Home)
│   │   │   ├── about/
│   │   │   │   ├── page.tsx          # /about
│   │   │   │   ├── leadership/page.tsx
│   │   │   │   └── credentials-and-safety/page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx          # /services
│   │   │   │   ├── [slug]/page.tsx   # /services/[slug]
│   │   │   │   └── road-construction-and-earthworks/cabro-paving/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # /projects (SSR filterable)
│   │   │   │   └── [slug]/page.tsx   # /projects/[slug]
│   │   │   ├── equipment/
│   │   │   │   ├── page.tsx          # /equipment
│   │   │   │   └── [category]/
│   │   │   │       ├── page.tsx      # /equipment/[category]
│   │   │   │       └── [slug]/page.tsx # /equipment/[category]/[slug]
│   │   │   ├── insights/
│   │   │   │   ├── page.tsx          # /insights
│   │   │   │   ├── category/[slug]/page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── locations/[slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── thank-you/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── cookies/page.tsx
│   │   │   ├── downloads/company-profile/route.ts
│   │   │   ├── not-found.tsx
│   │   │   └── error.tsx
│   │   ├── (payload)/                # Payload CMS route group (/admin, /api/[...slug])
│   │   ├── api/
│   │   │   ├── enquiries/route.ts    # Quote & hire submission endpoint
│   │   │   ├── og/route.tsx          # Dynamic 1200x630 Open Graph image generator
│   │   │   └── health/route.ts       # Uptime healthcheck
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── collections/                  # Payload collection configs
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── EnquiryAttachments.ts
│   │   ├── Services.ts
│   │   ├── Projects.ts
│   │   ├── EquipmentCategories.ts
│   │   ├── Equipment.ts
│   │   ├── Credentials.ts
│   │   ├── Team.ts
│   │   ├── Testimonials.ts
│   │   ├── PostCategories.ts
│   │   ├── Posts.ts
│   │   ├── Locations.ts
│   │   ├── LegalPages.ts
│   │   └── Enquiries.ts
│   ├── globals/                      # Payload global configs
│   │   ├── SiteSettings.ts
│   │   ├── HomePage.ts
│   │   ├── AboutPage.ts
│   │   ├── CredentialsPage.ts
│   │   ├── ServicesIndex.ts
│   │   ├── ProjectsIndex.ts
│   │   └── EquipmentIndex.ts
│   ├── hooks/
│   │   ├── publishingGate.ts         # Blocks unverified claims & [CONFIRM strings
│   │   └── revalidateCache.ts        # Triggers Next.js revalidatePath/revalidateTag
│   ├── components/
│   │   ├── ui/                       # DESIGN.md section 5 primitives
│   │   │   ├── Link.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MegaPanel.tsx
│   │   │   ├── MobileDrawer.tsx
│   │   │   ├── MobileActionBar.tsx
│   │   │   ├── SectionNav.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Field.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── MessageBanner.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── ConsentEmbed.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Scrim.tsx
│   │   │   └── CookieBanner.tsx
│   │   └── blocks/                   # SITE-PLAN.md section 5 page blocks
│   │       ├── HomeHero.tsx
│   │       ├── PageHero.tsx
│   │       ├── PageHeader.tsx
│   │       ├── IntentSelector.tsx
│   │       ├── ProofBar.tsx
│   │       ├── SectionIntro.tsx
│   │       ├── ServiceGrid.tsx
│   │       ├── FeatureSplit.tsx
│   │       ├── StatementBlock.tsx
│   │       ├── ProjectGrid.tsx
│   │       ├── EquipmentTeaser.tsx
│   │       ├── WhyShena.tsx
│   │       ├── TestimonialBlock.tsx
│   │       ├── InsightsRow.tsx
│   │       ├── LocationsBand.tsx
│   │       ├── KeyFacts.tsx
│   │       ├── ScopeList.tsx
│   │       ├── ProcessSteps.tsx
│   │       ├── FaqAccordion.tsx
│   │       ├── Gallery.tsx
│   │       ├── ContactAside.tsx
│   │       ├── EnquiryForm.tsx
│   │       ├── CredentialTable.tsx
│   │       ├── DownloadCard.tsx
│   │       ├── Prose.tsx
│   │       ├── SubNavPanel.tsx
│   │       ├── MapBlock.tsx
│   │       ├── CtaBand.tsx
│   │       └── EmptyState.tsx
│   ├── behaviors/                    # DESIGN.md section 6 client behavior modules
│   │   ├── index.ts                  # Orchestrator: sets html[data-js], runs each module in try/catch
│   │   ├── scrollState.ts            # 6.1 data-scrolled, data-scroll-dir, 6.3 header
│   │   ├── scrollLock.ts             # 6.2 counted page/scrim locks
│   │   ├── menus.ts                  # 6.4 desktop hover/keyboard dropdowns (200ms intent delay)
│   │   ├── drawer.ts                 # 6.5 mobile drawer, inert, focus trap & multi-level slide
│   │   ├── disclosure.ts             # 6.6 tabs (roving tabindex) & accordion height animation
│   │   ├── dialog.ts                 # 6.7 modal dialog focus management
│   │   ├── carousel.ts               # 6.8 scroll-snap, clip-path wipes, progress bullets, 6.12 drag
│   │   └── reveal.ts                 # 6.9 IntersectionObserver one-shot + 3.5s failsafe
│   ├── lib/
│   │   ├── payload.ts                # Cached Local API queries
│   │   ├── validation/enquiry.ts     # Shared Zod schema + Kenyan phone normaliser
│   │   ├── seo/jsonld.ts             # Structured data builders
│   │   ├── seo/metadata.ts           # Next.js Metadata helper
│   │   ├── notifications/email.ts    # Resend staff & customer emails
│   │   ├── notifications/telegram.ts # Optional Telegram webhook (F15)
│   │   ├── analytics.ts              # Consent-aware GA4 event dispatcher
│   │   └── whatsapp.ts               # Pre-filled wa.me link builder (SITE-PLAN.md 4.6)
│   ├── seed/
│   │   └── index.ts                  # Idempotent seed script loading CONTENT.md records
│   └── styles/
│       └── globals.css               # DESIGN.md section 10 tokens, recipes, print & forced-colors
├── tests/
│   ├── unit/
│   └── e2e/
├── payload.config.ts
├── next.config.ts
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 3. CSS, fonts and Tailwind configuration (`DESIGN.md` integration)

### 3.1 Strict token compliance

`src/styles/globals.css` must copy the exact CSS custom properties and recipes from `DESIGN.md` sections 3.4, 4.3, 9.1, 9.2, 10.1 and 10.2.

- **Root scaling (`DESIGN.md` 2.3):** `html { font-size: 62.5%; }` (`1rem = 10px`), scaling fluidly from `1500px` with `@media (min-width: 1500px) { html { font-size: .666667vw; } }`.
- **Important:** Because Tailwind's default spacing utilities (`p-4 = 1rem`) assume a `16px` root, **do not use default Tailwind spacing scale unmapped**. Map Tailwind's `@theme` directly to `DESIGN.md` tokens:

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-accent-500: #c14a12;
  --color-accent-600: #963a12;
  --color-accent-700: #7a3214;
  --color-accent-on-dark: #ff8f50;
  --color-ink-975: #1a1713;
  --color-ink-950: #221f1b;
  --color-ink-900: #2e2a25;
  --color-ink-850: #312e2a;
  --color-ink-800: #3e3935;
  --color-ink-600: #65615d;
  --color-grey-600: #767676;
  --color-grey-500: #9ea1a2;
  --color-grey-400: #bdbbbb;
  --color-grey-300: #d7d6d6;
  --color-grey-100: #ebebea;
  --color-white: #ffffff;
  --color-error: #9d1c30;
  --color-error-tint: #fdf1f2;
  --color-success: #1d6b45;
  --color-success-tint: #eef7f1;
  --color-warning: #7a4f00;
  --color-warning-tint: #fbf4e4;

  --breakpoint-xs: 414px;
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1160px;
  --breakpoint-2xl: 1500px;

  --spacing: 0.4rem; /* space-N = N * 4px (0.4rem), so p-6 = 2.4rem (24px), p-14 = 5.6rem (56px) */
  --radius-*: initial; /* radius is 0 everywhere except radio 50% */
}
```

With `--spacing: 0.4rem`, `space-1` (`p-1`, `gap-1`) is `4px` (`0.4rem`), `p-6` is `24px` (`2.4rem`), `p-14` is `56px` (`5.6rem`), matching `DESIGN.md` 2.3 `space-N = N x 4px` one-for-one.

### 3.2 Self-hosted fonts (`DESIGN.md` 2.2)

Self-host the five WOFF2 files in `public/fonts/` and preload `roboto-v32-latin-400.woff2` and `roboto-condensed-v27-latin-700.woff2` in `src/app/(site)/layout.tsx`:

```css
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("Roboto"), local("Roboto-Regular"),
       url("/fonts/roboto-v32-latin-400.woff2") format("woff2");
}
@font-face {
  font-family: "Roboto";
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: local("Roboto Italic"), local("Roboto-Italic"),
       url("/fonts/roboto-v32-latin-400italic.woff2") format("woff2");
}
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local("Roboto Bold"), local("Roboto-Bold"),
       url("/fonts/roboto-v32-latin-700.woff2") format("woff2");
}
@font-face {
  font-family: "Roboto Condensed";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("Roboto Condensed"), local("RobotoCondensed-Regular"),
       url("/fonts/roboto-condensed-v27-latin-400.woff2") format("woff2");
}
@font-face {
  font-family: "Roboto Condensed";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local("Roboto Condensed Bold"), local("RobotoCondensed-Bold"),
       url("/fonts/roboto-condensed-v27-latin-700.woff2") format("woff2");
}
```

---

## 4. Frontend component and behavior architecture

### 4.1 Progressive enhancement contract (`DESIGN.md` 6.15)

1. Server-render all HTML so every page is readable and navigable with JavaScript disabled.
2. In `<head>`, place a tiny inline script: `document.documentElement.setAttribute("data-js", "");` so CSS pre-states (`html[data-js] [data-reveal="hidden"]`) apply without flash of unstyled content while remaining visible if scripts are blocked.
3. Mount a single `<BehaviorProvider />` client component in `src/app/(site)/layout.tsx` that calls `initBehaviors(document)` on mount and after route transitions, and calls its returned `teardown()` on cleanup.
4. Each module in `src/behaviors/` wraps its `init(root)` in `try { ... } catch (err) { console.error("[behavior:name]", err); }` so an error in one module never breaks another (`DESIGN.md` 6.15).

### 4.2 Grid helper (`DESIGN.md` 2.3)

Use a single `.site-grid` class across all blocks:

```css
.site-grid {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  padding-inline: var(--gutter); /* 24px; 56px from xl */
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.2rem;
}
@media (min-width: 768px)  { .site-grid { max-width: 76.8rem; } }
@media (min-width: 1024px) {
  .site-grid {
    max-width: 102.4rem;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    column-gap: 3.2rem;
  }
  .col-content { grid-column: 2 / span 14; }
  .col-narrow  { grid-column: 4 / span 10; }
  .col-main    { grid-column: 2 / span 9; }
  .col-aside   { grid-column: 12 / span 4; }
  .col-bleed   { grid-column: 1 / span 16; margin-inline: calc(-1 * var(--gutter)); }
}
@media (min-width: 1160px) { .site-grid { max-width: 116rem; } }
@media (min-width: 1500px) { .site-grid { max-width: none; } } /* Fluid above 1500px */
```

---

## 5. Payload CMS 3 schema, NeonDB configuration, access control and publishing-gate hooks

### 5.0 NeonDB configuration (`payload.config.ts`)

We use **Neon (NeonDB)** as the managed PostgreSQL database:
- **Runtime queries (`DATABASE_URI`):** Use the **pooled** Neon connection string (`-pooler` hostname with `?sslmode=require`) for Next.js server components and API routes.
- **Schema migrations (`DIRECT_DATABASE_URI`):** Use the **direct (unpooled)** Neon connection string when running `payload migrate` so Drizzle advisory locks and DDL statements execute directly against Postgres.
- **Environments & branching:** Create a `production` main branch and a `staging` child branch in the Neon project (`eu-central-1` Frankfurt or nearest low-latency region to East Africa). Preview deployments can branch from `staging`.

```ts
// payload.config.ts (database adapter excerpt)
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.PAYLOAD_MIGRATING === 'true'
          ? process.env.DIRECT_DATABASE_URI || process.env.DATABASE_URI
          : process.env.DATABASE_URI,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    push: false, // Always use versioned migrations (`pnpm payload migrate`) in staging & production
  }),
  // ...
})
```

### 5.1 Roles and access control (spec F7, section 11)

- **`Users` collection:**
  - `role`: `'admin' | 'editor'` (required).
  - **Admin** can manage users, globals, credentials, site settings and delete enquiries.
  - **Editor** (Shena staff) can create, edit and publish Projects, Equipment, Posts, Testimonials, Services and Locations, and update Enquiry status/assignee.
  - Enable Payload auth lockouts (`maxLoginAttempts: 5`, `lockTime: 600000`) and TOTP two-factor authentication plugin (`payload-totp` or custom OTP verification) for admin accounts (spec section 11).

### 5.2 Collection field specifications

All content collections enable `versions: { drafts: true }` so staff can save drafts before passing the publishing gate.

#### 1. `Media` (`slug: 'media'`)
- Upload collection stored in Cloudflare R2 public bucket.
- Fields:
  - `alt` (`text`, **required** — blocks upload if empty, spec section 9)
  - `caption` (`text`, **required** — every site photo has a caption, spec section 9)
  - `credit` (`text`, optional)
- `imageSizes`:
  - `square`: `800 × 800` (`crop: 'focalPoint'`, format `webp`) — mobile hero & portraits
  - `card`: `960 × 720` (4:3, `webp`) — service, project & equipment cards
  - `wide`: `1600 × 900` (16:9, `webp`) — case studies, galleries & desktop heroes
  - `og`: `1200 × 630` (`jpeg`) — WhatsApp / social previews

#### 2. `EnquiryAttachments` (`slug: 'enquiry-attachments'`)
- Private upload collection stored under R2 prefix `private/enquiries/` (no public read access; only authenticated `admin`/`editor` users can download).
- `mimeTypes`: `['application/pdf', 'image/jpeg', 'image/png', 'image/webp']`, max file size `10485760` (10 MB).

#### 3. `Services` (`slug: 'services'`)
- Fields: `title` (text, req), `shortTitle` (text, req), `slug` (text, unique, req), `parent` (relationship → `services`, optional — used by `cabro-paving`), `group` (select: `'Roads and earthworks' | 'Buildings and interiors' | 'Planning and delivery'`, req), `order` (number), `requiresRegistration` (checkbox, true for Architecture and BoQ), `registeredProfessionalName` (text), `registrationBodyAndNumber` (text, e.g. `BORAQS A1234`), `heroImage` (upload → `media`, req), `heroHeadline` (text, req), `heroLead` (textarea, req), `summary` (textarea, maxLength 160, req), `keyFacts` (array of `{ term, value }`, min 3, max 6), `intro` (richText, req), `scope` (array of `{ title, description }`, min 4), `process` (array of `{ title, description }`, min 4, max 4), `faqs` (array of `{ question, answer }`, min 4, max 6), `equipment` (relationship → `equipment`, hasMany), `relatedProjects` (relationship → `projects`, hasMany), `formType` (select: `'project' | 'consultation'`, req), `ctaLabel` (text, req), `formHeading` (text, req), `formIntro` (textarea, req), `primaryKeyword` (text), plus SEO plugin fields (`meta.title`, `meta.description`, `meta.image`).

#### 4. `Projects` (`slug: 'projects'`)
- Fields: `title` (text, req), `slug` (text, unique, req), `featured` (checkbox), `services` (relationship → `services`, hasMany, req), `location` (group: `town` text req, `county` text req, `lat` number, `lng` number), `clientType` (select: `'Commercial & Hospitality' | 'Hospitality' | 'Hospitality & Residential' | 'Residential' | 'Public / Roads' | 'Commercial'`, req), `year` (text, req), `status` (select: `'Completed' | 'In progress'`, req), `role` (text, **required** — Shena's exact role), `deliveringCompany` (text, **required** — e.g. `Shena Works Limited` or `Dukes Limited`), `verificationEvidenceNote` (textarea, admin-only note recording completion certificate or client confirmation on file, **required to publish**), `heroImage` (upload → `media`, req), `brief` (richText, req), `work` (richText, req), `result` (richText, req), `keyFigures` (array of `{ value, label }`), `showValueBand` (checkbox), `valueBand` (text), `gallery` (array of `{ image: upload → media }`, min 3 to publish, 6–12 target), `equipmentUsed` (relationship → `equipment`, hasMany), `testimonial` (relationship → `testimonials`), `contactPerson` (relationship → `team`), plus SEO fields.

#### 5. `EquipmentCategories` (`slug: 'equipment-categories'`)
- Fields: `name` (text, req), `singular` (text, req), `article` (select: `'a' | 'an'`, req), `slug` (text, unique, req), `order` (number), `heroImage` (upload → `media`, req), `heroHeadline` (text, req), `heroLead` (textarea, req), `summary` (textarea, req), `intro` (richText, req), `uses` (array of `{ title, description }`, min 3), `faqs` (array of `{ question, answer }`), `primaryKeyword` (text), plus SEO fields.

#### 6. `Equipment` (`slug: 'equipment'`)
- Fields: `name` (text, req), `slug` (text, unique, req), `category` (relationship → `equipment-categories`, req), `featured` (checkbox), `make` (text, req), `model` (text, req), `year` (number), `capacity` (text, req, e.g. `20-tonne, 1.0 m³ bucket`), `specs` (array of `{ label, value }`), `owningEntity` (text, default `Shena Works Limited`), `uses` (array of `{ title, description }`, min 3), `hireTerms` (group: `operator`, `fuel`, `transport`, `minimumHire`, `serviceArea`, `indicativeRate`), `availability` (select: `'available' | 'on_hire'`, default `'available'`, req), `images` (array of `{ image: upload → media }`, min 1, req), plus SEO fields.

#### 7. `Credentials` (`slug: 'credentials'`)
- Fields: `name` (text, req), `issuer` (text, req), `number` (text, req), `category` (text, req), `validUntil` (date, nullable only when `isPerpetual = true`), `isPerpetual` (checkbox), `certificateFile` (upload → `media`, **required to publish**), `holder` (relationship → `team`, optional — null means company credential), `order` (number).

#### 8. `Team` (`slug: 'team'`)
- Fields: `name` (text, req), `slug` (text, unique, req), `role` (text, req), `summary` (textarea, req), `portrait` (upload → `media`, req), `bio` (richText, req), `experience` (array of `{ period, role, organisation, location, summary }`), `areasOfWork` (array of `{ term, value }`), `phone` (text), `email` (email), `linkedinUrl` (text), `ebkRegNumber` (text, optional — must be set if `name` or `role` uses `Eng.` or `Engineer`).

#### 9. `Testimonials` (`slug: 'testimonials'`)
- Fields: `quote` (textarea, req), `person` (text, req), `title` (text, req), `organisation` (text, req), `date` (date, **required to publish**), `project` (relationship → `projects`), `services` (relationship → `services`, hasMany), `isPublicOfficial` (checkbox, default `false`), `permissionFile` (upload → `media`, **required to publish** — image/PDF of written client permission).

#### 10. `PostCategories` & `Posts` (`slug: 'posts'`)
- `Posts` fields: `title` (text, req), `slug` (text, unique, req), `excerpt` (textarea, maxLength 160, req), `category` (relationship → `post-categories`, req), `author` (relationship → `team`, req), `publishedDate` (date, req), `readingTimeMinutes` (number, auto-calculated in `beforeChange`), `coverImage` (upload → `media`, req), `body` (richText, req), `relatedService` (relationship → `services`), plus SEO fields.

#### 11. `Locations` (`slug: 'locations'`)
- Fields: `town` (text, req), `county` (text, req), `slug` (text, unique, req), `heroImage` (upload → `media`, req), `heroHeadline` (text, req), `heroLead` (textarea, req), `address` (textarea, req), `phone` (text, req), `email` (email, req), `hours` (text, req), `directionsUrl` (text, req), `mapEmbedUrl` (text), `geo` (group: `lat` number, `lng` number), `intro` (richText, req), `faqs` (array of `{ question, answer }`), plus SEO fields.

#### 12. `Enquiries` (`slug: 'enquiries'`)
- Read/update for `admin`/`editor`; create via Local API only (`access.create: () => false` over public REST/GraphQL so all creations go through `/api/enquiries` with Turnstile and rate limiting).
- Fields: `reference` (text, unique, indexed, e.g. `SW-2026-0001`), `type` (select: `'project' | 'hire' | 'consultation' | 'other'`, req), `name` (text, req), `phone` (text, req), `email` (email), `organisation` (text), `service` (text), `equipment` (text), `hireStart` (date), `hireDuration` (text), `location` (text), `budgetBand` (text), `timeline` (text), `message` (textarea), `attachments` (relationship → `enquiry-attachments`, hasMany), `consentAcceptedAt` (date, req), `sourcePage` (text), `utm` (group: `source`, `medium`, `campaign`, `term`, `content`, `gclid`), `status` (select: `'new' | 'contacted' | 'quoted' | 'won' | 'closed_lost' | 'spam'`, default `'new'`), `assignedTo` (relationship → `users`), `internalNotes` (textarea).

### 5.3 Publishing-gate hook (`src/hooks/publishingGate.ts`)

Attach `enforcePublishingGate` to `beforeChange` on every draft-enabled collection and global:

```ts
// src/hooks/publishingGate.ts
import { APIError, type CollectionBeforeChangeHook } from 'payload'

const FORBIDDEN_SUPERLATIVES = /\b(premier|leading|world-class|unrivalled|cutting-edge|seamless)\b/i

export const enforcePublishingGate: CollectionBeforeChangeHook = async ({
  data,
  collection,
  operation,
}) => {
  const isPublishing = data?._status === 'published'
  if (!isPublishing) return data

  const serialized = JSON.stringify(data)

  // 1. Never publish unconfirmed placeholders
  if (serialized.includes('[CONFIRM')) {
    throw new APIError(
      'Cannot publish while a field still contains a [CONFIRM: ...] placeholder.',
      400,
    )
  }

  // 2. Enforce voice rule: no banned superlatives
  if (FORBIDDEN_SUPERLATIVES.test(serialized)) {
    throw new APIError(
      'Copy contains a disallowed superlative (premier, leading, world-class, etc.). Use plain factual terms.',
      400,
    )
  }

  // 3. Collection-specific gates (SITE-PLAN.md section 2)
  switch (collection.slug) {
    case 'credentials':
      if (!data.certificateFile || (!data.validUntil && !data.isPerpetual)) {
        throw new APIError(
          'Credentials require an uploaded certificate PDF and an expiry date before publishing.',
          400,
        )
      }
      break

    case 'testimonials':
      if (!data.permissionFile || !data.date || !data.person || !data.title) {
        throw new APIError(
          'Testimonials require written permission on file, person name, title and date before publishing.',
          400,
        )
      }
      break

    case 'projects':
      if (!data.role || !data.deliveringCompany || !data.verificationEvidenceNote) {
        throw new APIError(
          'Projects require Shena’s role, the delivering company, and completion/client evidence before publishing.',
          400,
        )
      }
      if (!Array.isArray(data.gallery) || data.gallery.length < 3) {
        throw new APIError('Projects require at least 3 captioned real photographs.', 400)
      }
      break

    case 'services':
      if (data.requiresRegistration && (!data.registeredProfessionalName || !data.registrationBodyAndNumber)) {
        throw new APIError(
          'This service requires a confirmed registered professional (EBK/BORAQS name and registration number) before publishing.',
          400,
        )
      }
      break

    case 'team':
      if ((/\bEng\.?\b/i.test(data.name) || /\bCivil Engineer\b/i.test(data.role)) && !data.ebkRegNumber) {
        throw new APIError(
          'Use of the title "Eng." or "Civil Engineer" requires an EBK registration number on file.',
          400,
        )
      }
      break
  }

  return data
}
```

---

## 6. Media pipeline and Cloudflare R2 storage

- Configure `@payloadcms/storage-s3` in `payload.config.ts` with two buckets (or two prefixes with bucket policies):
  - `R2_PUBLIC_BUCKET` mapped to `https://media.shenaworksltd.com` with `Cache-Control: public, max-age=31536000, immutable` for `media`.
  - `R2_PRIVATE_BUCKET` (no public access) for `enquiry-attachments`.
- In `next.config.ts`, set `images.remotePatterns` to allow `media.shenaworksltd.com` and enable `formats: ['image/avif', 'image/webp']`.
- Art-directed heroes (`HomeHero`, `PageHero`) render `<picture>` (`DESIGN.md` 2.6):
  - `<source media="(min-width: 1024px)" srcSet={wideWebp} width={1600} height={900} />`
  - `<img src={squareWebp} width={800} height={800} alt={alt} fetchPriority="high" decoding="async" />`
- Lazy images below the fold use `loading="lazy"` on a `grey-100` background and fade `opacity: 0 -> 1` in `200ms` once `img.complete` / `onLoad` fires (`DESIGN.md` 2.6).

---

## 7. Enquiries pipeline, spam protection, notifications and rate limiting

### 7.1 Shared Zod validation (`src/lib/validation/enquiry.ts`)

```ts
import { z } from 'zod'

export function normalizeKenyanPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-()]/g, '')
  if (/^\+254[17]\d{8}$/.test(cleaned)) return cleaned
  if (/^254[17]\d{8}$/.test(cleaned)) return `+${cleaned}`
  if (/^0[17]\d{8}$/.test(cleaned)) return `+254${cleaned.slice(1)}`
  if (/^\+[1-9]\d{7,14}$/.test(cleaned)) return cleaned // valid international E.164
  return null
}

export const enquirySchema = z
  .object({
    type: z.enum(['project', 'hire', 'consultation', 'other']),
    name: z.string().trim().min(2, 'Enter your name').max(80),
    phone: z
      .string()
      .transform((val) => normalizeKenyanPhone(val) ?? '')
      .refine((val) => val.length > 0, 'Enter a phone number like 0712 345 678 or +254 712 345 678'),
    email: z.string().trim().email('Enter an email address like name@example.com').optional().or(z.literal('')),
    organisation: z.string().trim().max(120).optional(),
    service: z.string().optional(),
    equipment: z.string().optional(),
    hireStart: z.string().optional(),
    hireDuration: z.string().optional(),
    location: z.string().trim().max(120).optional(),
    budgetBand: z.string().optional(),
    timeline: z.string().optional(),
    message: z.string().trim().max(3000).optional(),
    consent: z.literal('on', {
      errorMap: () => ({ message: 'Tick the box to agree to how we use your details' }),
    }),
    company_website: z.string().max(0).optional(), // Honeypot
    'cf-turnstile-response': z.string().min(1),
    sourcePage: z.string().optional(),
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    gclid: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if ((val.type === 'project' || val.type === 'consultation') && !val.service) {
      ctx.addIssue({ code: 'custom', path: ['service'], message: 'Choose a service' })
    }
    if (val.type === 'hire') {
      if (!val.equipment) ctx.addIssue({ code: 'custom', path: ['equipment'], message: 'Choose a machine' })
      if (!val.hireStart) ctx.addIssue({ code: 'custom', path: ['hireStart'], message: 'Choose a start date' })
      if (!val.hireDuration) ctx.addIssue({ code: 'custom', path: ['hireDuration'], message: 'Choose how long you need it' })
    }
    if ((val.type === 'project' || val.type === 'hire') && (!val.location || val.location.length < 2)) {
      ctx.addIssue({ code: 'custom', path: ['location'], message: 'Enter the site location' })
    }
    if (val.type !== 'hire' && (!val.message || val.message.length < 10)) {
      ctx.addIssue({ code: 'custom', path: ['message'], message: 'Tell us a little about the project' })
    }
  })
```

### 7.2 Server endpoint (`src/app/api/enquiries/route.ts`)

1. **Rate limit:** Check sliding-window counter per client IP (`CF-Connecting-IP` or `x-forwarded-for`): max **5 submissions per 15 minutes**. Return HTTP `429` with the message from `SITE-PLAN.md` 7.2 if exceeded.
2. **Honeypot:** If `company_website` is non-empty, return a fake `200` redirect to `/thank-you` without storing or emailing anything.
3. **Turnstile verification:** POST `secret` (`TURNSTILE_SECRET_KEY`), `response` (`cf-turnstile-response`) and `remoteip` to `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Reject if `success !== true`.
4. **File validation:** Inspect magic bytes (`%PDF`, `FF D8 FF`, `89 50 4E 47`, `RIFF....WEBP`) of up to 3 uploaded files (`<= 10 MB` each), upload to `enquiry-attachments` via Payload Local API.
5. **Sequential reference:** Generate `SW-${year}-${String(seq).padStart(4, '0')}` using a Postgres sequence `CREATE SEQUENCE IF NOT EXISTS enquiry_ref_seq START 101;`.
6. **Database insert:** Store the record in `enquiries` via `payload.create({ collection: 'enquiries', data: ... })`.
7. **Notifications (parallel, non-blocking to DB commit, awaited before response with 5s timeout):**
   - Send staff email via Resend (`SITE-PLAN.md` 7.3) with `Reply-To` set to the visitor's email (if provided).
   - If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set, send an instant Telegram notification message (spec F15).
   - If the visitor provided an email address, send the customer acknowledgement email (`SITE-PLAN.md` 7.4).
8. **Response:** Set an `HttpOnly`, `SameSite=Lax`, 5-minute cookie `sw_last_enquiry` containing `{ ref, type, service, equipment, sourcePage }` and redirect (`303 See Other`) to `/thank-you?type=${type}` (or return JSON `{ redirectUrl, ref }` when called via `fetch`).

---

## 8. SEO, JSON-LD schemas, Open Graph for WhatsApp, redirects and consent-gated GA4

### 8.1 Canonical URLs, `sitemap.ts` and `robots.ts`

- Base URL: `process.env.NEXT_PUBLIC_SITE_URL` (`https://www.shenaworksltd.com`).
- `src/app/sitemap.ts` queries all `_status: 'published'` records across Services, Projects, EquipmentCategories, Equipment, Posts and Locations, and omits `/about/credentials-and-safety` if 0 credentials are published and `/insights` if 0 posts are published (`SITE-PLAN.md` 8).
- `src/app/robots.ts` allows `/` and disallows `/admin`, `/api`, `/thank-you`.

### 8.2 Legacy URL redirects (`next.config.ts`)

Before DNS cut-over (Phase 0/4), crawl the existing `shenaworksltd.com` URLs and add `308` permanent redirects in `next.config.ts` (`spec` 10 & 14):

```ts
// Baseline redirect map — extend with any additional URLs from Search Console in Phase 0
redirects: async () => [
  { source: '/about-us', destination: '/about', permanent: true },
  { source: '/our-services', destination: '/services', permanent: true },
  { source: '/portfolio', destination: '/projects', permanent: true },
  { source: '/our-projects', destination: '/projects', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },
  { source: '/machinery-hire', destination: '/equipment', permanent: true },
  { source: '/plant-hire', destination: '/equipment', permanent: true },
  { source: '/blog', destination: '/insights', permanent: true },
]
```

### 8.3 Structured data builders (`src/lib/seo/jsonld.ts`)

Render JSON-LD via `<script type="application/ld+json">` in each page's server component:

```ts
// Organization + GeneralContractor root entity (referenced via @id across the site)
export function buildOrganizationJsonLd(settings: SiteSettings, locations: Location[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const sameAs = [settings.social?.linkedinUrl, settings.social?.facebookUrl].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    '@id': `${siteUrl}/#organization`,
    name: 'Shena Works Limited',
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-color.svg`,
    telephone: settings.contact.phoneE164,
    email: settings.contact.email,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Meru County' },
      { '@type': 'AdministrativeArea', name: 'Nairobi County' },
      { '@type': 'Country', name: 'Kenya' },
    ],
    address: locations.map((loc) => ({
      '@type': 'PostalAddress',
      addressLocality: loc.town,
      addressRegion: loc.county,
      streetAddress: loc.address,
      addressCountry: 'KE',
    })),
    ...(sameAs.length ? { sameAs } : {}),
  }
}
```

- **Review markup rule (`spec` 10):** Only output `Review` JSON-LD for testimonials where `permissionFile` is present AND `isPublicOfficial === false`.

### 8.4 Dynamic Open Graph images for WhatsApp (`/api/og/route.tsx`)

WhatsApp link previews in Kenya are a primary referral channel (`spec` 10). Every page without a dedicated 1200 × 630 photo uses `/api/og?title=...&overline=...` (`next/og` `ImageResponse`), rendering:
- `ink-900` (`#2e2a25`) background, 8px left bar in Murram (`#c14a12`), white Shena Works logo top-left, `overline` in `#ff8f50`, `title` in Roboto Condensed 700 uppercase white (`64px`), and footer bar `shenaworksltd.com · Meru & Nairobi · +254 718 971 896`.

### 8.5 Consent-gated GA4 (`src/lib/analytics.ts`)

- Do **not** load `https://www.googletagmanager.com/gtag/js` until the visitor clicks "Accept analytics" (`sw_consent=analytics` cookie).
- Expose `trackEvent(name, params)` which is a safe no-op when `sw_consent !== 'analytics'`.
- Wire the 10 events defined in `SITE-PLAN.md` section 10 (`quote_submit`, `hire_submit`, `whatsapp_click`, `call_click`, `email_click`, `file_download`, `cta_click`, `form_start`, `form_error`, `filter_use`).

---

## 9. Security, testing, backups and deployment

### 9.1 Security headers (`next.config.ts`)

```ts
headers: async () => [
  {
    source: '/((?!admin).*)',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
]
```

### 9.2 Automated test suite (required before launch)

| Suite | File | Verifies |
|---|---|---|
| Unit (Vitest) | `tests/unit/phone.test.ts` | Kenyan `07xx`, `01xx`, `+254`, `254` and international numbers normalise to E.164; invalid strings fail |
| Unit (Vitest) | `tests/unit/publishingGate.test.ts` | Publishing fails if `[CONFIRM` is present, if superlatives are used, or if required gate files/fields are missing |
| E2E (Playwright) | `tests/e2e/ChromeAndA11y.spec.ts` | Skip link, desktop mega panel (200ms hover intent + keyboard `ArrowDown`/`Escape`), mobile drawer focus trap + `inert`, zero axe-core WCAG 2.2 AA violations on Home, Service, Project, Equipment and Contact |
| E2E (Playwright) | `tests/e2e/EnquiryFlows.spec.ts` | Submitting a road quote (`F1`) and pre-filled excavator hire (`F2`) validates on blur/submit, stores in DB, and redirects to `/thank-you` |
| E2E (Playwright) | `tests/e2e/ProjectFilters.spec.ts` | Filtering `/projects` by service, location and year (`F8`) works both with JS and with JS disabled |
| E2E (Playwright) | `tests/e2e/ReducedMotion.spec.ts` | With `reducedMotion: 'reduce'`, transitions are `0s`, reveals are immediately visible, and carousels do not auto-start |

### 9.3 Daily backups, Neon PITR and tested restore (spec section 11 & 14)

1. **Neon Point-in-Time Restore (PITR):** Enable Neon history retention (`7–30 days`) on the `production` branch for instant point-in-time branch restores.
2. **Off-provider daily backup to Cloudflare R2 (`30 days`):** Include `scripts/backup-db.sh` (cron or GitHub Action at `02:00 EAT` daily):
   - Runs `pg_dump --format=custom "$DIRECT_DATABASE_URI"` against Neon's direct endpoint → uploads encrypted dump to `s3://$R2_BACKUP_BUCKET/postgres/shena-$(date +%F).dump` with a 30-day R2 lifecycle policy.
3. **Tested restore verification (`scripts/restore-test.sh`):** Creates a temporary Neon branch (or ephemeral test DB), runs `pg_restore` from the latest R2 dump, verifies collection row counts, and deletes the temporary branch. Run and log this before launch to satisfy spec section 14 acceptance criterion 8.

### 9.4 Environment variables (`.env.example`)

```bash
# App
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.shenaworksltd.com
PAYLOAD_SECRET=replace-with-32-byte-hex-secret
ENQUIRY_TOKEN_SECRET=replace-with-32-byte-hex-secret

# Database (NeonDB — Serverless PostgreSQL)
# Pooled connection string (-pooler) for runtime queries:
DATABASE_URI=postgresql://neondb_owner:password@ep-example-pooler.eu-central-1.aws.neon.tech/shena_works?sslmode=require
# Direct (unpooled) connection string for `pnpm payload migrate` and `pg_dump`:
DIRECT_DATABASE_URI=postgresql://neondb_owner:password@ep-example.eu-central-1.aws.neon.tech/shena_works?sslmode=require

# Cloudflare R2 (S3 compatible)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BUCKET=shena-media-public
R2_PRIVATE_BUCKET=shena-enquiries-private
NEXT_PUBLIC_MEDIA_URL=https://media.shenaworksltd.com

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Email (Resend) & optional Telegram (F15)
RESEND_API_KEY=
EMAIL_FROM="Shena Works Website <enquiries@shenaworksltd.com>"
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Analytics (GA4)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 10. Phased build milestones (`M1`–`M6`) for autonomous agent execution

An agent developing this codebase should execute these milestones sequentially, verifying each exit gate before moving to the next:

| Milestone | Scope | Exit gate |
|---|---|---|
| **`M1` Foundation & Design System** | Scaffold Next.js 16 + TypeScript + Tailwind v4; add self-hosted Roboto & Roboto Condensed fonts; implement `src/styles/globals.css` (`DESIGN.md` 10); build all `src/components/ui/*` primitives (`DESIGN.md` 5) and `src/behaviors/*` modules (`DESIGN.md` 6). | All UI primitives render with hover, focus-visible, pressed, disabled, loading and invalid states; `prefers-reduced-motion` rules verified. |
| **`M2` Payload CMS 3 & Seed Data** | Configure Payload 3 collections (`src/collections/*`), globals (`src/globals/*`), `enforcePublishingGate` hook (`5.3`), and `src/seed/index.ts` populated with every record from `CONTENT.md`. | `pnpm payload migrate` and `pnpm seed` succeed; `/admin` opens; unit tests for `enforcePublishingGate` pass. |
| **`M3` Global Chrome & Core Pages** | Build Header, MegaPanel, MobileDrawer, MobileActionBar, Footer, CookieBanner, and all blocks (`src/components/blocks/*`); wire Home (`/`), About (`/about`, `/about/leadership`, `/about/credentials-and-safety`), Services (`/services`, `/services/[slug]`, `/cabro-paving`) and Legal (`/privacy`, `/cookies`). | Pages match `SITE-PLAN.md` wireframes and copy at `320px`–`1920px`; conditional rules (`SITE-PLAN.md` 8) hide unverified blocks and 404 gated services. |
| **`M4` Projects, Equipment, Locations & Insights** | Wire `/projects` (with GET/JS filters & load more), `/projects/[slug]`, `/equipment`, `/equipment/[category]`, `/equipment/[category]/[slug]`, `/locations/[slug]`, `/insights` and `/insights/[slug]`. | Filterable portfolio (`F8`), equipment catalogue and pre-filled WhatsApp links (`F3`) work with JS on and JS off. |
| **`M5` Enquiries Pipeline, SEO & Analytics** | Build `EnquiryForm`, `POST /api/enquiries` (Zod, Turnstile, honeypot, rate limit, R2 attachments, Resend email, Telegram), `/thank-you`, JSON-LD (`8.3`), `/api/og` (`8.4`), `sitemap.ts`, `robots.ts` and consent-gated GA4 (`8.5`). | `F1`–`F6` and `F9`–`F15` pass end-to-end; JSON-LD validates with zero errors. |
| **`M6` QA, Accessibility, Vercel Deployment & Handover** | Run Vitest + Playwright E2E + axe-core WCAG 2.2 AA + Lighthouse CI on mobile (`Home`, `Service`, `Project`, `Equipment`). Deploy to Vercel (`staging` and `production`) via Vercel & GitHub MCPs, verify backups (`9.3`) via Neon & Cloudflare MCPs, and verify redirects (`8.2`). | Mobile Lighthouse >= 90 across Performance, Accessibility, Best Practices and SEO; page weight < 1.5 MB; all tests green; staging & production live. |

---

## 11. Project launch acceptance criteria

The build is complete when every item below passes verification on `staging` and `production`:

1. Every **Must** requirement (`F1`–`F13`) in Section 1.3 passes automated and manual testing on staging and production.
2. Performance targets in Section 1.3 (`LCP < 2.5 s`, `INP < 200 ms`, `CLS < 0.1`, Mobile Lighthouse `>= 90` in all 4 categories, page weight `< 1.5 MB`) are met on Home, a Service page, a Project case study and an Equipment machine page.
3. Quote and hire forms store the enquiry in NeonDB, email staff within one minute, and reject honeypot/Turnstile spam.
4. Structured data (`Organization`, `GeneralContractor`, `Person`, `Service`, `Product`/`Offer`, `FAQPage`, `Article`, `BreadcrumbList`) validates with zero errors and `/sitemap.xml` is submitted to Google Search Console.
5. Every legacy URL redirects (`308`) to a live page.
6. Consent-gated GA4 events fire for every conversion action (`quote_submit`, `hire_submit`, `whatsapp_click`, `call_click`, `file_download`) after consent and never fire without consent.
7. The Privacy Notice (`/privacy`), Cookie Notice (`/cookies`) and Cookie Banner are live.
8. A NeonDB + Cloudflare R2 backup has been restored and verified in a test (`scripts/restore-test.sh`).
9. A Shena Works staff member (`editor` role) can publish a Project and an Equipment machine in `/admin` unaided.
10. Every published claim, credential, project and testimonial passes `enforcePublishingGate` (Section 5.3) with zero `[CONFIRM` strings or banned superlatives.
