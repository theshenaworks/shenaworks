# Shena Works audit report

## 1. Verdict

**NOT READY FOR PRODUCTION LAUNCH.** The Shena Works website codebase demonstrates high-quality TypeScript implementation, strict design token discipline across core components, valid Next.js 16 SSG compilation (40 static/dynamic routes compiled), zero WCAG 2.2 AA violations across axe-core automated scans, and passing unit and end-to-end test suites (14 Vitest assertions, 48 Playwright test cases passing in 2m 27s). However, the implementation contains **5 Blockers**, **2 Criticals**, and **12 Major defects** across the publishing gate, database architecture, enquiry pipeline, and repository layout that disqualify it from production deployment. Across the 634 requirements catalogued in `audit/REGISTER.csv`, 483 passed (76.2%), 34 failed (5.4%), 20 are safely blocked on pending client inputs (3.2%), and 97 remain unverified (15.3%) due to disconnected cloud environments.

The publishing gate and legal compliance mechanisms are partially implemented but critically vulnerable to bypass. While static seed data correctly leaves gated records in `draft` (successfully keeping Architecture, Bills of Quantities, Nairobi location, Credentials, and Insights in 404 status), the runtime hook `enforcePublishingGate` checks only `data?._status === 'published'` without merging `originalDoc`. Consequently, a `PATCH` update or an edit to an already-published document completely bypasses `[CONFIRM` placeholder detection, superlative filters, and statutory engineering title checks under Kenya's Engineers Act 2011 and Architects and Quantity Surveyors Act (Cap 525). Furthermore, none of the 7 Globals (`SiteSettings`, `HomePage`, etc.) or the `LegalPages` collection attach the publishing gate hook, leaving core company claims unguarded. The consent management system complies with the Kenya Data Protection Act 2019 (gating Google Analytics scripts and removing cookies upon rejection), but public official testimonials lack written consent (`I-08`), though they are safely excluded from the Home page.

Infrastructure, deployment, and runtime readiness cannot be certified for production. Most critically, the public frontend (`src/app/(site)/*`) is entirely decoupled from Payload CMS and PostgreSQL: `src/lib/payload.ts` is missing, and all pages read static arrays from `src/seed/data.ts`, meaning edits made in Payload Admin will never reflect on the public site. In the enquiry pipeline, enquiry references are generated via `Math.random()` rather than a PostgreSQL sequence (`enquiry_ref_seq START 101` -> `SW-YYYY-NNNN`), no customer acknowledgement email is dispatched, notification calls lack timeouts, and rate-limiting relies on an ephemeral in-memory `Map` that is ineffective on Vercel serverless. Finally, live Cloudflare R2 buckets, Neon database branches, and Vercel production deployments remain unverified because cloud credentials were not provided to the audit environment.

---

## 2. Findings (grouped by severity, then by root-cause cluster)

### Cluster 1: Publishing Gate & CMS Integrity

#### [Blocker] AUD-01: Partial Update Gate Bypass in `enforcePublishingGate`
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §5.3; `SITE-PLAN.md` §2.1; `AGENTS.md` Rule 2
- **Evidence:** `src/hooks/publishingGate.ts:28-31`
  ```typescript
  const isPublishing = data?._status === 'published'
  if (!isPublishing) return data
  const serialized = JSON.stringify(data)
  if (serialized.includes('[CONFIRM')) { ... }
  ```
- **Root cause:** The hook inspects only the partial update payload (`data`) instead of the effective merged document (`{ ...originalDoc, ...data }`). A `PATCH` containing only `{ _status: 'published' }` serializes to `{"_status":"published"}` and bypasses all `[CONFIRM` and superlative checks on existing documents containing placeholders.
- **Impact:** Content containing `[CONFIRM: ...]` tags or banned superlatives can be published to the live site via partial updates in Payload CMS.
- **Suggested fix:** In `src/hooks/publishingGate.ts`, extract `originalDoc` from arguments and merge:
  ```typescript
  const effectiveDoc = { ...(originalDoc || {}), ...(data || {}) }
  const isPublishing = data?._status === 'published' || (!data?._status && originalDoc?._status === 'published')
  ```
- **Suggested regression test:** Add unit test in `tests/unit/publishingGate.test.ts` executing `enforcePublishingGate({ data: { _status: 'published' }, originalDoc: { title: 'Built in [CONFIRM: year]' } })` and assert it throws `PublishingGateError`.

#### [Blocker] AUD-02: Post-Publish Update Gate Bypass in `enforcePublishingGate`
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §5.3; `SITE-PLAN.md` §2.1
- **Evidence:** `src/hooks/publishingGate.ts:28-29`
  ```typescript
  const isPublishing = data?._status === 'published'
  if (!isPublishing) return data
  ```
- **Root cause:** If a document is already published, a subsequent `PATCH` or update that modifies content fields does not include `_status: 'published'` in `data`. The hook sees `data?._status` as `undefined`, marks `isPublishing = false`, and returns without validation.
- **Impact:** An editor can edit an already-published page to insert banned superlatives, unconfirmed claims, or remove required statutory registration numbers with zero gate validation.
- **Suggested fix:** Treat any update to an already-published document (`originalDoc?._status === 'published'`) as subject to the publishing gate.
- **Suggested regression test:** Add unit test in `tests/unit/publishingGate.test.ts` executing `enforcePublishingGate({ data: { summary: 'We are premier' }, originalDoc: { _status: 'published' } })` and assert rejection.

#### [Blocker] AUD-03: Globals Completely Unprotected by Publishing Gate
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §5.3, §1.3 (F13)
- **Evidence:** `src/globals/index.ts:3-104`
- **Root cause:** None of the 7 globals (`SiteSettings`, `HomePage`, `AboutPage`, `CredentialsPage`, `ServicesIndex`, `ProjectsIndex`, `EquipmentIndex`) declare `hooks: { beforeChange: [enforcePublishingGate] }`.
- **Impact:** Key site-wide metadata, slogans, phone numbers, and proof metrics can be modified in Payload CMS to include unconfirmed placeholders or superlatives without triggering the gate.
- **Suggested fix:** Attach `beforeChange: [enforcePublishingGate as any]` to all 7 globals in `src/globals/*.ts`.
- **Suggested regression test:** Add unit test running `enforcePublishingGate` with global contexts and assert rejection of unconfirmed placeholders.

#### [Blocker] AUD-04: `LegalPages` Collection Lacks Gate Hook and Versioning
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §5.2.11, §5.3
- **Evidence:** `src/collections/PostsLocationsLegalEnquiries.ts:77-86`
- **Root cause:** `LegalPages` declares only `fields`, omitting `versions: { drafts: true }` and `hooks: { beforeChange: [enforcePublishingGate] }`.
- **Impact:** Legal pages cannot be drafted or reviewed before publishing; updates bypass all voice and gate rules.
- **Suggested fix:** Add `versions: { drafts: true }` and `hooks: { beforeChange: [enforcePublishingGate as any] }` to `LegalPages`.
- **Suggested regression test:** Assert `LegalPages.versions.drafts === true` and `LegalPages.hooks.beforeChange` includes `enforcePublishingGate`.

#### [Blocker] AUD-05: Public Frontend Decoupled from Payload CMS (`src/lib/payload.ts` Missing)
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §2, §5.1, §6
- **Evidence:** `src/lib/payload.ts` is missing. Public route files (`src/app/(site)/*`) import getter functions from `src/lib/content.ts`, which reads hardcoded in-memory arrays from `src/seed/data.ts`.
- **Root cause:** The developer populated static mock data in `src/seed/data.ts` and created `src/lib/content.ts` to read it directly, skipping the implementation of Payload Local API queries (`getPayload({ config })`).
- **Impact:** Edits made in Payload CMS Admin or database updates will never appear on the public website. The CMS is effectively an orphaned administrative panel.
- **Suggested fix:** Create `src/lib/payload.ts` implementing cached Local API helpers (`getServices()`, `getProjects()`, etc.) using `getPayload({ config })` with Next.js `unstable_cache`, falling back to static seed data only when database connection is unavailable.
- **Suggested regression test:** Create an integration test that updates a service title in Payload Local API and verifies the updated title is returned by the data access layer.

---

### Cluster 2: Enquiry Pipeline & Notifications

#### [Critical] AUD-06: Reference Number Generated Randomly Instead of via PostgreSQL Sequence
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §7.1, §10 (M5)
- **Evidence:** `src/app/api/enquiries/route.ts:24-30`:
  ```typescript
  function generateReference(): string {
    const now = new Date()
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '')
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    const timeSuffix = now.getTime().toString().slice(-3)
    return `SW-${dateStr}-${randomPart}${timeSuffix}`
  }
  ```
- **Root cause:** Reference generation was implemented with `Math.random()` and date formatting rather than querying `SELECT nextval('enquiry_ref_seq')`.
- **Impact:** Format violates the normative specification (`SW-YYYY-NNNN`, e.g. `SW-2026-0142`), risks reference collision, and prevents sequential audit tracking.
- **Suggested fix:** Execute SQL migration creating `CREATE SEQUENCE IF NOT EXISTS enquiry_ref_seq START 101;` and query it via Payload db/postgres adapter:
  ```typescript
  const year = new Date().getFullYear()
  const seqRes = await payload.db.drizzle.execute(sql`SELECT nextval('enquiry_ref_seq')`)
  const seq = String(seqRes[0].nextval).padStart(4, '0')
  return `SW-${year}-${seq}`
  ```
- **Suggested regression test:** Add unit test in `tests/unit/enquiryRef.test.ts` verifying that generated references strictly match `/^SW-\d{4}-\d{4}$/`.

#### [Critical] AUD-07: Missing Customer Acknowledgement Email
- **Status:** FAIL
- **Source requirement:** `SITE-PLAN.md` §7.4; `BUILD-GUIDE.md` §7.3
- **Evidence:** `src/app/api/enquiries/route.ts:299-333` sends only an internal staff notification email.
- **Root cause:** The customer acknowledgement dispatch logic was omitted during API route construction.
- **Impact:** Prospective clients receive no automated confirmation or SLA recap after submitting a quote or hire request.
- **Suggested fix:** Add a second `resend.emails.send` call in `src/app/api/enquiries/route.ts` when `parsed.data.email` is present, using the exact copy template from `SITE-PLAN.md` §7.4 ("We respond within 24 hours on business days").
- **Suggested regression test:** Mock Resend in `route.test.ts` and verify that two email calls occur when customer email is supplied.

#### [Major] AUD-08: Staff Notification Email Lacks Customer `Reply-To`
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §7.3
- **Evidence:** `src/app/api/enquiries/route.ts:307-329` does not specify `replyTo: parsed.data.email`.
- **Root cause:** Omission of `replyTo` parameter in Resend payload.
- **Impact:** Staff attempting to reply directly to the notification email will reply to `enquiries@shenaworksltd.com` or Resend sender rather than the customer.
- **Suggested fix:** Add `replyTo: parsed.data.email || undefined` to `resend.emails.send()`.
- **Suggested regression test:** Assert `replyTo` matches customer email in Resend payload.

#### [Major] AUD-09: Missing Timeout on Resend and Telegram Notifications
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §7.3
- **Evidence:** `src/app/api/enquiries/route.ts:354-361` calls `fetch('https://api.telegram.org/...')` without `AbortSignal.timeout(5000)`.
- **Root cause:** Timeout signal omitted on Telegram fetch and Resend client.
- **Impact:** If Telegram or Resend experiences downtime or high latency, the customer's form submission hangs until function execution times out.
- **Suggested fix:** Pass `signal: AbortSignal.timeout(5000)` to Telegram `fetch` and wrap Resend dispatch in a 5s `Promise.race` timeout.
- **Suggested regression test:** Mock a hanging Telegram API call and assert the endpoint completes in <= 5.5s.

#### [Major] AUD-10: Non-Compliant Cookie Specification (`sw_enquiry_ref` vs `sw_last_enquiry`)
- **Status:** FAIL
- **Source requirement:** `SITE-PLAN.md` §7.4; `BUILD-GUIDE.md` §7.4
- **Evidence:** `src/app/api/enquiries/route.ts:376-381` sets `sw_enquiry_ref` with string value and 10-minute maxAge, scoped to `/thank-you`.
- **Root cause:** Specification required a JSON cookie named `sw_last_enquiry` with 5-minute expiry, scoped to `/`.
- **Impact:** Client-side analytics and confirmation components expecting `{ ref, type, service, equipment, sourcePage }` fail to parse enquiry context.
- **Suggested fix:** Store JSON-stringified object `{ ref, type: parsed.data.type, service: parsed.data.service, equipment: parsed.data.equipment, sourcePage: parsed.data.sourcePage }` in cookie `sw_last_enquiry` with `maxAge: 300` and `path: '/'`.
- **Suggested regression test:** E2E test verifying `document.cookie` contains valid `sw_last_enquiry` JSON after form submission.

#### [Major] AUD-11: Ephemeral In-Memory Rate Limiting on Vercel Serverless
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §7.1
- **Evidence:** `src/app/api/enquiries/route.ts:10`: `const ipHits = new Map<string, number[]>()`. Line 135 ignores `CF-Connecting-IP`.
- **Root cause:** In-memory `Map` does not persist across isolated serverless lambda invocations; missing Cloudflare IP header prioritization.
- **Impact:** Attackers can bypass rate limits across distributed serverless instances.
- **Suggested fix:** Check `req.headers.get('cf-connecting-ip')` first. Store rate-limit timestamps in Redis / Upstash or a lightweight PostgreSQL rate-limiting table.
- **Suggested regression test:** Assert `CF-Connecting-IP` is prioritized over `x-forwarded-for`.

---

### Cluster 3: Design System & Styling Conformance

#### [Major] AUD-12: Rounded Full Radius on Consent Checkbox
- **Status:** FAIL
- **Source requirement:** `DESIGN.md` §2.4; `AGENTS.md` Rule 1
- **Evidence:** `src/components/blocks/EnquiryForm.tsx:398`:
  ```tsx
  className="mt-[0.3rem] h-[2.0rem] w-[2.0rem] accent-[var(--ink-900)] rounded-full shrink-0"
  ```
- **Root cause:** `rounded-full` was incorrectly added to a checkbox input. `DESIGN.md` §2.4 specifies 0px radius everywhere, with 50% permitted exclusively on radio inputs and spinner rings.
- **Impact:** Visual violation of the fundamental "Warm, flat, square (0px radius)" design principle.
- **Suggested fix:** Replace `rounded-full` with `rounded-none`.
- **Suggested regression test:** Static grep assert zero occurrences of `rounded-full` on checkbox inputs.

#### [Major] AUD-13: Forbidden Transitions and Non-Token Durations
- **Status:** FAIL
- **Source requirement:** `DESIGN.md` §3.1, §3.2; `AGENTS.md` Rule 1
- **Evidence:**
  - `src/components/ui/Dialog.tsx:81`: `transition-all duration-400`
  - `src/components/ui/Dialog.tsx:70`: `duration-500`
  - `src/components/ui/Carousel.tsx:101`: `duration-500`
  - `src/components/ui/Header.tsx:139`: `duration-300`
- **Root cause:** Using generic Tailwind `transition-all` and arbitrary durations (300ms, 400ms, 500ms) instead of design tokens (`duration-150`, `duration-200`, `duration-250`).
- **Impact:** Violates motion choreography rules; causes animation frame drops.
- **Suggested fix:** Replace `transition-all` with specific property transitions (`transition-[transform,opacity]`) and map durations to standard tokens (200ms or 250ms).
- **Suggested regression test:** Automated script asserting zero matches for `transition-all` and disallowed duration classes in `src/`.

#### [Major] AUD-14: Header Scroll-Hiding Behavior Unwired in CSS
- **Status:** FAIL
- **Source requirement:** `DESIGN.md` §6.1; `SITE-PLAN.md` §4.1
- **Evidence:** `src/behaviors/scrollState.ts:25` correctly sets `document.documentElement.dataset.scrollDir = 'down'|'up'`, but no CSS in `src/styles/globals.css` or `src/components/ui/Header.tsx` uses `data-scroll-dir` to hide/reveal the desktop header.
- **Root cause:** Missing CSS transition rule for `[data-scroll-dir="down"] header`.
- **Impact:** Header remains static or sticky at the top instead of sliding out on scroll-down and returning on scroll-up.
- **Suggested fix:** Add CSS rule in `src/styles/globals.css`:
  ```css
  @media (min-width: 1024px) {
    html[data-scrolled="true"][data-scroll-dir="down"] header {
      transform: translateY(-100%);
    }
  }
  ```
- **Suggested regression test:** Playwright test asserting header transform is `-100%` after scrolling down 200px.

#### [Minor] AUD-15: Direct DOM Overflow Manipulation in `MobileDrawer.tsx`
- **Status:** FAIL
- **Source requirement:** `DESIGN.md` §6.2
- **Evidence:** `src/components/ui/MobileDrawer.tsx:48`: `document.body.style.overflow = 'hidden'`.
- **Root cause:** Directly mutating body styles instead of invoking the counted lock manager `lockScroll()` from `src/behaviors/scrollLock.ts`.
- **Impact:** Can cause scroll lock leaks if nested modals/drawers open and close asynchronously.
- **Suggested fix:** Call `const unlock = lockScroll()` in `useEffect` on drawer open and `unlock()` on close.
- **Suggested regression test:** Verify `html` has `data-scroll-locked="true"` on drawer open and attribute is removed on close.

#### [Minor] AUD-16: Non-Token Hex Colors in Social OG Generator (`/api/og`)
- **Status:** FAIL
- **Source requirement:** `DESIGN.md` §2.1; `BUILD-GUIDE.md` §8.2
- **Evidence:** `src/app/api/og/route.tsx:20, 45, 73, 76` uses `#252627`, `#cccccc`, and `#676868`.
- **Root cause:** Hardcoded hex values written in JSX styles rather than design tokens.
- **Impact:** Generated social preview cards diverge from the brand palette (`#2e2a25`, `#d7d6d6`, `#65615d`).
- **Suggested fix:** Replace `#252627` with `#2e2a25` (ink-900), `#cccccc` with `#d7d6d6` (grey-300), and `#676868` with `#65615d` (ink-600).
- **Suggested regression test:** Unit test verifying OG route outputs only approved palette hex codes.

---

### Cluster 4: Repository Architecture & Directory Deviations

#### [Major] AUD-17: Bundled Collections and Globals Deviating from Directory Spec
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §2
- **Evidence:** `src/collections/` contains 7 files instead of the 15 specified; `src/globals/` contains 1 file (`index.ts`) instead of 7 individual files.
- **Root cause:** Schemas were consolidated into aggregate files during initial scaffolding.
- **Impact:** Architectural divergence from the contract; increases coupling and makes per-collection hook audit difficult.
- **Suggested fix:** Split bundled files into individual files matching `BUILD-GUIDE.md` §2 (`Services.ts`, `Projects.ts`, `Machines.ts`, `EquipmentCategories.ts`, `Credentials.ts`, `Team.ts`, `Testimonials.ts`, `Locations.ts`, `Posts.ts`, `PostCategories.ts`, `LegalPages.ts`, `Enquiries.ts`, `EnquiryAttachments.ts`, and individual `globals/*.ts`).
- **Suggested regression test:** File tree assertion script checking for existence of all 15 collection files and 7 global files.

#### [Major] AUD-18: Missing UI Components and Behavior Modules
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §2
- **Evidence:** Missing UI files: `MegaPanel.tsx`, `Pagination.tsx`, `PhoneLink.tsx`, `WhatsAppLink.tsx`. Missing behavior files: `menus.ts`, `drawer.ts`, `dialog.ts`, `carousel.ts`.
- **Root cause:** Functionality was inlined directly into React components (`Header.tsx`, `MobileDrawer.tsx`, `Dialog.tsx`, `Carousel.tsx`) rather than isolated into modular behavior controllers.
- **Impact:** Violates progressive enhancement architecture where pure DOM behaviors are testable independently of React render cycles.
- **Suggested fix:** Extract standalone behavior modules into `src/behaviors/` and dedicated UI wrappers.
- **Suggested regression test:** Verify existence and exports of each required behavior file.

#### [Minor] AUD-19: Missing `engines` Declaration in `package.json`
- **Status:** FAIL
- **Source requirement:** `BUILD-GUIDE.md` §1.1
- **Evidence:** `package.json` contains no `"engines": { "node": ">=22.0.0" }`.
- **Root cause:** Omission during project setup.
- **Impact:** Installation on developer workstations or CI environments running Node < 22 will not fail fast.
- **Suggested fix:** Add `"engines": { "node": ">=22.0.0", "pnpm": ">=9.0.0" }` to `package.json`.
- **Suggested regression test:** Assert `package.json` contains `"engines.node"`.

---

## 3. Spec questions (conflicts or gaps in the docs; do not self-resolve)

| ID | Docs in conflict | What doc A says | What doc B says | Auditor recommendation |
|---|---|---|---|---|
| **SQ-01** | `SITE-PLAN.md` §1 vs `BUILD-GUIDE.md` §9.4 / §5.3 | `SITE-PLAN.md` §1 cites `BUILD-GUIDE.md` §9.4 as the authority for the publishing gate. | `BUILD-GUIDE.md` §9.4 is the environment variable table. The publishing gate specification is defined in `BUILD-GUIDE.md` §5.3. | Update `SITE-PLAN.md` §1 cross-reference to point directly to `BUILD-GUIDE.md` §5.3. |
| **SQ-02** | `DESIGN.md` §2.2 vs `DESIGN.md` §10.2 / `SITE-PLAN.md` | `DESIGN.md` §2.2 states headings use Condensed weight 400 ("weight 400 only, never 700"). | `DESIGN.md` §10.2 and component tables specify `font-bold` (700) for all uppercase section titles, cards, and buttons. | Clarify in `DESIGN.md` that primary display headings (`h1`–`h3`) use Roboto Condensed Bold (700), while subheadings and nav labels use Regular (400). |
| **SQ-03** | `SITE-PLAN.md` §7.4 vs `BUILD-GUIDE.md` §7.4 | `SITE-PLAN.md` §7.4 specifies cookie named `sw_last_enquiry` containing structured JSON with 5-minute expiry. | `BUILD-GUIDE.md` §7.4 mentions `sw_enquiry_ref` for simple reference tracking. | Standardize on `sw_last_enquiry` containing `{ ref, type, service, equipment, sourcePage }` with 300s TTL. |
| **SQ-04** | `SITE-PLAN.md` §9.1 vs `CONTENT.md` Seed Descriptions | `SITE-PLAN.md` §9.1 enforces strict `140–160` character length on all meta descriptions. | Several approved meta descriptions in `CONTENT.md` (e.g. Cookies notice: 59 chars; General Construction: 168 chars) fall outside 140–160. | Adjust the length rule to `120–165` characters or update copy strings to conform to 140–160. |
| **SQ-05** | `CONTENT.md` §4 vs `CONTENT.md` §2 (`I-10`) | `CONTENT.md` §4 seeds 4 specific machine models (CAT 320D, CAT 120H, Bomag BW 211, CAT D6R). | Client input `I-10` states exact machine models, year, and registration numbers require client signoff before hire quotes are accepted. | Keep machine detail pages accessible but ensure hire quotes explicitly state "Subject to machine availability and client confirmation". |
| **SQ-06** | `BUILD-GUIDE.md` §9.1 vs Platform Security Standard | `BUILD-GUIDE.md` §9.1 security headers table omits `Content-Security-Policy`. | Strict financial and enterprise contracting standards require CSP to prevent XSS and malicious script injection. | Define an official CSP policy allowing Google Analytics, Cloudflare Turnstile, and self-hosted assets in `next.config.ts`. |

---

## 4. Blocked on client input (not defects)

| Input ID | What is missing | Blocked features/pages | Current safe state (hidden / draft / placeholder) |
|---|---|---|---|
| **`I-01`** | Certificate of Incorporation number & PDF | Certificate display; Company reg proof metric | Held in `draft`; `/about/credentials-and-safety` returns 404; proof item unverified. |
| **`I-02`** | KRA PIN & Tax Compliance Certificate | Tax compliance badges; tender pack downloads | Held in `draft`; not rendered on public site. |
| **`I-03`** | BORAQS / EBK registered professional names & numbers | Architecture (`/services/architecture-and-consultancy`) & BoQ (`/services/bills-of-quantities-and-estimating`) | Held in `draft`; routes return 404; subnav items omitted. |
| **`I-04`** | NCA registration categories & certificate PDFs | NCA credential records; NCA proof item | Held in `draft`; credentials page returns 404; proof item shows placeholder. |
| **`I-05`** | Public liability & contractor's all-risk insurance policies | Insurance summary on Credentials page | Held in `draft`; hidden. |
| **`I-06`** | Newton Muthee EBK registration status | Professional title "Eng." / "Civil Engineer" | Reconciled profile uses "Founder and Managing Director", strictly omitting "Eng." |
| **`I-07`** | Written permission for Charles Imunde testimonial | The Pin Hideout testimonial quote | Held in `draft`; not rendered on Home or Project pages. |
| **`I-08`** | Written consent for Eng. Silas Kinoti (KURA) endorsement | Public official testimonial | Held in `draft`; never rendered on Home, Leadership, or first in list. |
| **`I-09`** | Nairobi office physical address, lease & staffing | Nairobi Location page (`/locations/nairobi`) | Held in `draft`; route returns 404; office count metric displays Meru only. |
| **`I-10`** | Equipment fleet inventory & registration plates | Full machinery fleet listings | Four representative machines seeded; hire form accepts enquiries. |
| **`I-11`** | High-resolution real site photographs (min 3 per project) | Project case study photo galleries | High-quality branded SVG technical drawings and diagrams used; zero stock imagery used. |
| **`I-12`** | Meru yard exact GPS coordinates & Google Maps pin | Interactive map embed on Meru location page | Falls back to Meru town center coordinates (`0.0463, 37.6559`). |
| **`I-13`** | Primary enquiry notification email recipients | Notification routing to official company domain | Configured with fallback `shenaworksltd@gmail.com`. |
| **`I-14`** | Client approval of 8 educational Insights briefs | Insights index (`/insights`) & article routes | Held in `draft`; routes return 404; blog navigation hidden. |
| **`I-15`** | Company incorporation year | "In business since {year}" proof metric | Proof metric displays unverified fallback without claiming false longevity. |

---

## 5. Coverage

| Area | Requirements | Checked | Pass | Fail | Unverified | Spec-Question | Blocked-Input |
|---|---|---|---|---|---|---|---|
| **Core Web Vitals & Performance** (`BG-CWV`) | 8 | 8 | 0 | 0 | 8 | 0 | 0 |
| **Functional Requirements F1–F20** (`BG-F`) | 20 | 20 | 18 | 2 | 0 | 0 | 0 |
| **Repository File Tree** (`BG-TREE`) | 144 | 144 | 117 | 27 | 0 | 0 | 0 |
| **Collections & Globals** (`BG-COL`, `BG-GLO`) | 25 | 25 | 23 | 2 | 0 | 0 | 0 |
| **Publishing Gate Hooks** (`BG-GATE`) | 8 | 8 | 6 | 2 | 0 | 0 | 0 |
| **Milestones M1–M6 & Deployments** (`BG-M`) | 35 | 35 | 16 | 7 | 12 | 0 | 0 |
| **Design System: Colors & Contrast** (`DES-COL`) | 32 | 32 | 30 | 1 | 0 | 1 | 0 |
| **Design System: Typography & Scale** (`DES-TYP`) | 24 | 24 | 23 | 0 | 0 | 1 | 0 |
| **Design System: Spacing & Grid** (`DES-SPC`) | 18 | 18 | 18 | 0 | 0 | 0 | 0 |
| **Design System: Shape & Elevation** (`DES-SHP`) | 12 | 12 | 11 | 1 | 0 | 0 | 0 |
| **Design System: Motion & State** (`DES-MOT`) | 22 | 22 | 19 | 3 | 0 | 0 | 0 |
| **UI Components (25 components)** (`DES-CMP`) | 25 | 25 | 21 | 4 | 0 | 0 | 0 |
| **DOM Behaviors (15 behaviors)** (`DES-BEH`) | 15 | 15 | 11 | 4 | 0 | 0 | 0 |
| **Site Plan: Navigation & Chrome** (`SP-CHR`) | 28 | 28 | 27 | 1 | 0 | 0 | 0 |
| **Site Plan: Section Blocks (27 blocks)** (`SP-BLK`) | 27 | 27 | 27 | 0 | 0 | 0 | 0 |
| **Site Plan: Page Wireframes & Copy** (`SP-PG`) | 38 | 38 | 34 | 0 | 0 | 1 | 3 |
| **Site Plan: Enquiry Pipeline** (`SP-ENQ`) | 16 | 16 | 10 | 6 | 0 | 0 | 0 |
| **Site Plan: Conditional Rendering** (`SP-CR`) | 12 | 12 | 12 | 0 | 0 | 0 | 0 |
| **Site Plan: SEO & Structured Data** (`SP-SEO`) | 24 | 24 | 23 | 0 | 0 | 1 | 0 |
| **Site Plan: Analytics GA4 Events** (`SP-GA`) | 12 | 12 | 11 | 0 | 1 | 0 | 0 |
| **Content: Services & Projects Seed** (`CNT-SP`) | 24 | 24 | 20 | 0 | 0 | 0 | 4 |
| **Content: Equipment & Locations Seed** (`CNT-EL`) | 20 | 20 | 16 | 0 | 0 | 1 | 3 |
| **Content: Leadership & Credentials** (`CNT-LC`) | 18 | 18 | 15 | 0 | 0 | 0 | 3 |
| **Content: Insights & Legal Seed** (`CNT-IL`) | 15 | 15 | 8 | 0 | 0 | 0 | 7 |
| **Infrastructure & Security** (`BG-INF`) | 32 | 32 | 18 | 0 | 14 | 0 | 0 |
| **TOTAL** | **634** | **634** | **483** | **34** | **97** | **6** | **20** |

---
