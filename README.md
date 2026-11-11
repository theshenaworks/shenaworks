# Shena Works Limited — Official Website (`shenaworksltd.com`)

Production website, enquiry pipeline, equipment hire catalogue, and Payload CMS 3 repository for **Shena Works Limited**, an engineering, earthworks, and general construction contractor based in Meru and Nairobi, Kenya.

---

## 1. Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript 5 | Server Components, dynamic SSR/SSG, Metadata API, Open Graph generator |
| **CMS** | Payload CMS 3 | Embedded at `/admin`, strongly typed schema in code, PostgreSQL adapter |
| **Database** | NeonDB (Serverless PostgreSQL) | Connection pooling (`DATABASE_URI`) + direct endpoint (`DIRECT_DATABASE_URI`), PITR backups |
| **Media & Storage** | Cloudflare R2 | S3-compatible object storage with custom CDN domain (`media.shenaworksltd.com`) |
| **Deployment** | Vercel | Fast edge delivery, instant preview environments per branch/PR |
| **Styling** | Tailwind CSS v4 + Design Tokens | Pure CSS variables, 0px radius, 2px borders, Murram (`#c14a12`) palette |
| **Forms & Anti-spam** | Zod + Cloudflare Turnstile + Rate Limiter | Shared client/server validation, honeypot, token verification |
| **Email & Alerts** | Resend API + Telegram Bot | Staff notification on quote requests and machinery hire enquiries within 1 minute |
| **Testing** | Vitest + Playwright + axe-core | Unit tests, 100% WCAG 2.2 AA accessibility audit, progressive enhancement verification |

---

## 2. Normative Documentation

The project was built strictly against four normative specifications:

1. **[`docs/DESIGN.md`](./docs/DESIGN.md)** — Design system: Murram (`#c14a12`) color tokens, Roboto / Roboto Condensed typography, `1rem = 10px` fluid spacing, 16-column grid, 0px radius, 2px line discipline, 25 UI primitives, and 15 DOM behavior specs.
2. **[`docs/SITE-PLAN.md`](./docs/SITE-PLAN.md)** — Site architecture: Complete sitemap, URL map, wireframes, copy for every page, WhatsApp pre-filled messages, and 28 reusable section blocks.
3. **[`docs/CONTENT.md`](./docs/CONTENT.md)** — Content register & seed data: All 7 service offerings, 5 project case studies, 4 equipment categories + machines, credentials, Newton Muthee's biography, locations, and KDPA 2019 legal notices.
4. **[`docs/BUILD-GUIDE.md`](./docs/BUILD-GUIDE.md)** — Engineering handbook: Next.js 16 + Payload 3 architecture, `enforcePublishingGate` hook, enquiries pipeline, SEO JSON-LD builders, backup scripts, and launch checklist.

---

## 3. Strict Publishing Gate Rules

To maintain absolute brand integrity and legal compliance in Kenya:
- **No Unconfirmed Tokens:** Any content containing `[CONFIRM` is blocked from publishing.
- **No Banned Superlatives:** Words such as *premier*, *leading*, *best*, *world-class*, *unrivalled*, *cutting-edge*, or *seamless* are rejected by the publishing gate (`enforcePublishingGate`).
- **Gated Services & Locations:** Professional services requiring verified board registrations (e.g. Architecture, Bills of Quantities) and draft branches (e.g. Nairobi branch) remain in `draft` mode and serve standard 404 responses until verified.
- **Zero Visual Invention:** All styles map 1:1 to `--accent-500`, `--ink-900`, `--surface-base`, and tokenized spacing.

---

## 4. Local Development

### Prerequisites
- Node.js `>= 22.0.0`
- pnpm `>= 9.0.0`

### Setup
```bash
# Clone the repository
git clone https://github.com/theshenaworks/shenaworks.git
cd shena-works

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the website, or [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload CMS admin panel.

---

## 5. Verification & Testing

```bash
# Typecheck TypeScript codebase
pnpm typecheck

# Run Vitest unit tests (publishing gate, phone normalisation)
pnpm test

# Build production bundle
pnpm build

# Run end-to-end Playwright tests & axe-core WCAG 2.2 AA audits
pnpm test:e2e
```

---

## 6. Project Structure

```text
shena-works/
├── .github/workflows/          # GitHub Actions CI & daily backup workflows
├── docs/                       # Normative design, site plan, content, and build specs
├── public/
│   ├── brand/                  # Vector logos and favicon
│   ├── fonts/                  # Self-hosted Roboto and Roboto Condensed WOFF2
│   └── media/                  # SVG diagrams, project drawings, and equipment illustrations
├── scripts/
│   ├── backup-db.sh            # Logical NeonDB backup to Cloudflare R2
│   └── restore-test.sh         # Restore verification script
├── src/
│   ├── app/
│   │   ├── (site)/             # Public pages (Home, About, Services, Projects, Equipment, etc.)
│   │   └── api/                # Enquiries endpoint, health check, dynamic OG image generator
│   ├── behaviors/              # Client-side DOM behaviors (progressive enhancement)
│   ├── collections/            # Payload CMS collection schemas
│   ├── components/
│   │   ├── blocks/             # 28 reusable section blocks
│   │   └── ui/                 # Accessible design system primitives
│   ├── hooks/                  # Payload hooks (enforcePublishingGate, cache revalidation)
│   ├── lib/                    # Validation, SEO JSON-LD builders, analytics, WhatsApp
│   ├── seed/                   # Idempotent seed data generator
│   └── styles/                 # Tailwind CSS v4 & custom design tokens
└── tests/
    ├── e2e/                    # Playwright end-to-end and axe-core accessibility tests
    └── unit/                   # Vitest unit tests
```

---

## 7. License

Copyright © 2026 Shena Works Limited. All rights reserved.
