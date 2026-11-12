# Shena Works: Codebase Audit Prompt and Protocol

Use this to make a coding agent prove, with evidence, that the real codebase implements `DESIGN.md`, `SITE-PLAN.md`, `CONTENT.md` and `BUILD-GUIDE.md` to the highest standard, and that nothing was overlooked.

**How to use**
1. Put the four docs in `docs/` (and `AGENTS.md` at the repo root if it exists).
2. Paste **Part A** into a fresh agent session with repo access, a shell, and a browser (Playwright).
3. Point the agent at this file for **Parts B to D**.
4. For the critical areas in Part B (Phases 3, 4, 5), run a **second, fresh-context reviewer** that has only the docs and the code, not the first agent's report. Compare the two reports; every disagreement is a finding.

---

## Part A: Kickoff prompt (paste this)

```
You are the independent auditor for the Shena Works website (shenaworksltd.com). You are not the builder. Assume the
implementation is wrong until you have evidence that it is right.

Authority and reading order
1. Read AGENTS.md (if present), then docs/BUILD-GUIDE.md, docs/DESIGN.md, docs/SITE-PLAN.md and docs/CONTENT.md IN FULL.
   Do not skim. Do not start auditing until all four are read.
2. The four docs are normative. Quoted copy in SITE-PLAN.md and copy tables is FINAL and must match word for word
   (SITE-PLAN section 1). Where a doc says "must", "never", "only when", "required", it is a testable requirement.
3. Docs reference "spec" sections (e.g. "spec section 14 acceptance criterion 8"). The original spec is not in docs/.
   List every such reference you cannot verify and ask for the spec; do not guess what it says.

Rules of evidence
- No claim without evidence: file:line, command output, test result or screenshot path. "Looks fine" is not evidence.
- Read the code that actually runs. Do not trust comments, names, commit messages, README text or the builder's summary.
- Run things. A requirement is PASS only if you executed a check that would fail if the requirement were broken.
- If you cannot verify something, mark it UNVERIFIED with the reason. Never mark it PASS.
- Search for what is MISSING, not only what is wrong. Every file in BUILD-GUIDE section 2 must exist; every block in
  SITE-PLAN section 5 must exist and be used; every F1-F20 must map to code.

Hard limits
- Do NOT edit the four docs. Do NOT replace, invent or "tidy" any [CONFIRM: ...] value. Do NOT weaken or bypass the
  publishing gate, seed fake credentials/testimonials/photos, or add stock imagery to make a check pass.
- Do NOT silently resolve a conflict between docs. Record it as a SPEC QUESTION (Part D) and keep going.
- Fix defects only after the full audit report is written, in clusters, each with a regression test (Part D).

Process
- Follow docs/AUDIT-PROMPT.md Parts B, C and D exactly. Produce the requirement register first (Phase 0), then the phases
  in order, then the final report in the Part D template.
- Keep a running list of "things I did not check yet". Do not finish until it is empty or each item is marked UNVERIFIED.
- Finish with the report only. No summary of effort.
```

---

## Part B: The audit protocol

### Phase 0: Requirement register (do this before touching code)

Create `audit/REGISTER.csv` with one row per testable statement. Columns:

`ID, Source (doc + section), Requirement (verbatim or tight paraphrase), Verification method (grep / unit / e2e / visual / manual / DB / network), Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION), Evidence (path or command), Notes`

Seed it from at least these sources, in this order:

| Source | Extract |
|---|---|
| BUILD-GUIDE 1.3 | F1-F20 (each with its "Implemented in" target), LCP < 2.5 s, INP < 200 ms, CLS < 0.1, Lighthouse >= 90 x4, weight < 1.5 MB |
| BUILD-GUIDE 2 | Every file/folder in the repo tree (existence check) |
| BUILD-GUIDE 3-9 | Every field, access rule, hook, header, env var, script, test file |
| BUILD-GUIDE 10 | M1-M6 exit gates |
| BUILD-GUIDE 11 | The 10 launch acceptance criteria |
| DESIGN 1-12 | Every "must/never/don't", the state matrix (4.6), the do/don't lists (11), ship checklist (12), the token table (10.1) |
| SITE-PLAN 1-11 | Each block (5.x), each page spec (6.x) as a string-and-order checklist, forms (7), conditional rules (8), SEO table (9), analytics (10), page checklist (11) |
| CONTENT 1-11 | Every seed record, the gated flags, the facts register, `I-01` to `I-15`, legal text |

Expect roughly 600-1,000 rows. If the register has fewer than ~400, you are summarising instead of extracting. Go again.

### Phase 1: Static audit (read and grep the code)

**1.1 Structure and existence**
- Diff the actual tree against BUILD-GUIDE 2. Report every missing, extra, or misplaced file/route. Check all 29 `blocks/*`, 23 `ui/*`, 8 `behaviors/*`, 15 collections, 7 globals, both hooks, all `lib/*`, `scripts/backup-db.sh`, `scripts/restore-test.sh`, `.env.example`, `AGENTS.md`.
- Every block in SITE-PLAN 5 is imported by at least one page, or the doc says it is optional. Dead blocks and unrouted pages are findings.

**1.2 Design-token compliance (DESIGN 10, 11; BUILD-GUIDE 3.1)**

Run each grep over `src/`, report every hit with file:line, and justify or fail each one.

| Rule | Check |
|---|---|
| No radius (except radio) | `border-radius`, `rounded`, `--radius` (Tailwind `--radius-*: initial` must be set) |
| No off-palette colour | Extract every hex/rgb/hsl/oklch literal; each must equal a DESIGN 10.1 token. No Tailwind default palette classes (`bg-gray-*`, `text-blue-*`) |
| No pure black outside print | `#000`, `#000000`, `black`, `rgb(0,0,0)` |
| No focus-outline removal | `outline: none`, `outline-none`, `outline:0` without an adjacent `:focus-visible` replacement |
| Weights 400/700 only | `font-weight`, `font-medium`, `font-semibold`, `font-light`, `font-bold` (700 OK), numeric weights 100-300/500-600/800-900 |
| No Condensed italic | `font-style: italic` on `font-heading` / Condensed. Roboto italic is allowed (DESIGN 2.2) |
| No `transition: all` | and `transition-all` |
| Forbidden animated properties | `top`, `left`, `margin`, `box-shadow` in `transition`/`@keyframes`; `height`/`width`/`padding` only where DESIGN 3.1 names |
| Easing and durations are tokens | no raw `cubic-bezier(...)` or ms literals outside the token block |
| Shadows | only elevation 1 and 2 |
| No decorative gradients | `linear-gradient`, `radial-gradient` (scrims excepted only if DESIGN says so) |
| No inline show/hide from scripts | `style.display`, `style.visibility`, `.hidden =` used to open/close components (DESIGN 11, 6.15) |
| No `background-attachment: fixed` for essential effects | grep |
| Heading case | no hand-typed capitals in CMS seed headings; uppercase comes from CSS (SITE-PLAN 1) |
| Spacing | Tailwind `--spacing: 0.4rem` so `p-4` = 16px; no arbitrary `p-[13px]` |
| Token parity | Script: parse `globals.css` `@theme` and the `:root` block; assert every DESIGN 10.1 custom property exists with the identical value, and nothing extra exists |
| Fonts | Only the files in BUILD-GUIDE 2/3.2, self-hosted, `font-display` as specified, preloaded as specified, no Google Fonts request in production |

**1.3 Content integrity (SITE-PLAN 1, 2; CONTENT 1)**
- Grep the whole repo, seed, CMS fixtures, tests and built HTML for `[CONFIRM`. Each hit must be in a field that is **unpublished**; none in anything rendered.
- Grep for banned words (case-insensitive, whole word): `premier`, `leading`, `best`, `world-class`, `exceptional`, `unrivalled`, `unrivaled`, `cutting-edge`, `seamless`. Note: the BUILD-GUIDE 5.3 hook regex lists only six of the nine SITE-PLAN 2 words (it omits `best` and `exceptional`; "unrivaled" US spelling too). Report as a finding or a SPEC QUESTION.
- Grep for unproven numbers: `50+`, `100+`, `5+ years`, `years of experience`, "satisfied clients".
- Grep for `Eng\.` and `Civil Engineer` and verify each is behind an EBK check (CONTENT 7).
- Hard-coded contact data: `718 971 896`, `254718971896`, `shenaworksltd@gmail.com`, street addresses. These must come from `site-settings`/`locations` (SITE-PLAN 1). Known risk: the OG footer (BUILD-GUIDE 8.4) names the phone number; confirm it reads from settings.
- Stock/placeholder imagery: grep for `unsplash`, `pexels`, `placehold`, `picsum`, `lorem`, `TODO`, `FIXME`, `example.com`, `test@`. Inspect `public/` and the seed for any non-Shena photo. Every image needs real alt text and a caption (SITE-PLAN 2 photo rule; `media.alt` and `media.caption` required).
- Spelling: British/Kenyan English (organisation, programme, metres, kerb). Grep for `organization`, `program `, `meter `, `curb`, `color` in copy (not code).

**1.4 Security and secrets**
- No secret in the repo or git history: `git log -p` grep for `RESEND_API_KEY=`, `PAYLOAD_SECRET=`, `TURNSTILE_SECRET_KEY=`, `R2_SECRET`, `postgresql://` with a password. Run a secret scanner (gitleaks or trufflehog) if installable.
- `.env.example` matches BUILD-GUIDE 9.4 var for var; no real values; every `process.env.X` in `src/` appears in it; every var in it is used.
- No `NEXT_PUBLIC_` prefix on anything secret.
- No `dangerouslySetInnerHTML` except JSON-LD and sanitised rich text. Verify each.

### Phase 2: Build, test and runtime audit (execute everything)

**2.1 Pipeline:** clean install with the pinned Node/pnpm, then `typecheck` (strict, zero `any` suppressions without justification; list every `@ts-ignore`/`@ts-expect-error`/`as any`), `lint`, `build`, `vitest`, `playwright test`, `lhci`. Paste the final output of each. A build with warnings is reported with every warning.

**2.2 Required tests exist and are meaningful (BUILD-GUIDE 9.2)**

All six files must exist: `phone.test.ts`, `publishingGate.test.ts`, `ChromeAndA11y.spec.ts`, `EnquiryFlows.spec.ts`, `ProjectFilters.spec.ts`, `ReducedMotion.spec.ts`.

For each, run a **mutation check**: break the implementation on purpose (e.g. delete the `[CONFIRM` check, remove `inert` from the drawer) and confirm the test goes red. A test that stays green is a finding. Revert the mutation after.

**2.3 Responsive and visual (SITE-PLAN 11.2; DESIGN 8, 12.6)**
- Playwright screenshots of **every route** (and a sample record per template) at 320, 375, 414, 480, 768, 1024, 1160, 1500, 1920.
- At each: no horizontal page scroll (except carousels/tables), no overlapping or clipped text, content in columns 2-15 of the 16-col grid from `lg`, fluid above 1500 (`html` root font-size behaviour per DESIGN 2.3), header/mobile-bar swap at `lg`.
- Compare against the ASCII wireframes in SITE-PLAN 6.x for block order and presence. Report any reordered, missing or extra block.

**2.4 Interaction states (DESIGN 4, 5, 6)**
- For each `ui/*` primitive: hover, `:focus-visible`, pressed, disabled, loading, invalid, selected/expanded as listed in the state matrix 4.6. Script it: apply each state and assert computed style differs as specified (one step darker on hover, two on pressed; focus ring 2px and white on dark surfaces).
- Keyboard walkthrough of every page (DESIGN 6.14 key map): Tab order matches visual order; skip link first; Escape closes overlays and returns focus to the trigger; roving tabindex in tabs; Arrow keys; no keyboard traps; focus visible always.
- Header (DESIGN 6.3): hides on scroll-down, returns white with shadow on scroll-up; mega panel 200 ms hover intent; `Escape` and `ArrowDown` work (6.4).
- Drawer (6.5): focus trap, `inert` on background, counted scroll lock (6.2) with two overlapping locks released in either order, multi-level slide, `aria-expanded`.
- Dialog (6.7), Carousel (6.8, 6.12): scroll-snap, pause control present whenever anything auto-advances, no autoplay with sound, drag scroll doesn't break links.
- Reveal (6.9): one-shot, 3.5 s failsafe, nothing stays invisible if the observer never fires.
- Touch: hover styles don't stick (emulate `hover: none`), 44 px hit areas on coarse pointers without visual change (DESIGN 4.4).

**2.5 Progressive enhancement (DESIGN 6.15; SITE-PLAN 11.5)**

Re-run the key journeys with **JavaScript disabled**:
- All content visible (no hidden pre-states), nav links present, drawer has a no-JS path, accordions readable.
- `/projects` filters work via GET and are linkable; load more works via pagination.
- Both enquiry forms submit and land on `/thank-you`. **Expected conflict:** BUILD-GUIDE 7.1 makes `cf-turnstile-response` required and Turnstile needs JS. Test what actually happens. Record the outcome as a SPEC QUESTION (decide: server-side fallback when JS is off, or relax the page checklist).
- `html[data-js]` is set only by the orchestrator, and each behaviour module runs in its own try/catch (BUILD-GUIDE 2, `behaviors/index.ts`). Break one module and confirm the others still work.

**2.6 Reduced motion and other modes (DESIGN 3.4, 9)**
- `prefers-reduced-motion: reduce`: transitions 0 s, reveals instantly visible, carousels don't auto-start, scroll behaviour not smooth, **and** script-driven motion honours it (check JS reads the media query, not only CSS).
- `forced-colors: active` (DESIGN 9.2): borders and focus visible, no information lost, icons usable.
- Print (DESIGN 9.1): print stylesheet present, pure black allowed there only, nav/CTA chrome hidden, URLs expanded as specified.
- Zoom 200 % and 400 %, text-only resize, `prefers-contrast`, dark-mode OS setting (the site must not break).

**2.7 Accessibility (DESIGN 7; WCAG 2.2 AA)**
- axe-core on every route and every state that changes the DOM (menu open, dialog open, form with errors, cookie banner). Zero violations. Paste the counts.
- Manual: heading hierarchy (one `h1`, no skipped levels), landmarks, link purpose, image alt (not filenames), form labels (never placeholders as labels), error summary focus management, `aria-live` regions, language attribute `en-KE` or as specified, target size 24 px minimum (44 px coarse), colour is never the only status signal, `accent-500` text never on `ink-900` (2.89:1), no white text on `grey-400` (1.91:1).
- Screen-reader smoke test (NVDA or VoiceOver) on Home, a service, the contact form. Report what is announced.
- Run DESIGN 7.1 component conformance checklist row by row.

**2.8 Performance (BUILD-GUIDE 1.3, 6)**
- Lighthouse **mobile**, Home + a service + a project + a machine page, `>= 90` in all four categories. Three runs each, report median.
- LCP < 2.5 s, INP < 200 ms, CLS < 0.1 (lab and, if field data exists, CrUX). Total transfer < 1.5 MB per page.
- Images: AVIF/WebP served, `<picture>` art direction on `HomeHero`/`PageHero` exactly as BUILD-GUIDE 6, `fetchPriority="high"` on the LCP image only, width/height set (CLS), lazy-loading below the fold, `grey-100` placeholder and 200 ms fade.
- Fonts: preloaded subset, no FOIT/FOUT layout shift, no third-party font requests.
- No third-party requests before consent (see Phase 5).
- Bundle: report JS per route; flag any client component that could be a server component; `behaviors/*` should be the only global JS.

### Phase 3: CMS and publishing-gate audit (adversarial)

Treat the gate as a security control. Try to break it.

**3.1 Schema fidelity (BUILD-GUIDE 5.2):** For all 12 collection specs plus the 7 globals, diff the Payload config against the field list: names, types, `required`, `unique`, `min`/`max`, `maxLength`, select options (exact strings), `hasMany`, `defaultValue`. Export a table of mismatches. Check `versions: { drafts: true }` on every content collection; `push: false`; migrations committed; `payload-types.ts` regenerated and committed.

**3.2 Access control (5.1):** Create one admin and one editor. Using the REST API, GraphQL **and** the admin UI, as: anonymous, editor, admin, verify the matrix. Editors can publish Projects, Equipment, Posts, Testimonials, Services, Locations and update enquiry status/assignee, but cannot manage users, globals, credentials, site settings, or delete enquiries. Anonymous can read only published records and **cannot** create/read enquiries or read drafts, `enquiry-attachments`, `internalNotes`, or `verificationEvidenceNote` (admin-only note). Lockout: 5 failed attempts for 10 minutes. 2FA enforced for admin.

**3.3 Gate attack matrix.** For every cell, try it and record the HTTP result and DB state:

| Collection | Try to publish with... | Expected |
|---|---|---|
| any | `[CONFIRM: x]` in a text field, in a Lexical rich-text node, in an array item, in alt text, in `meta.description` | blocked |
| any | each banned superlative in different casings / punctuation / inside rich text | blocked |
| credentials | no certificate; no expiry and not perpetual; perpetual with a date | blocked / allowed as specified |
| testimonials | no permission file; no date/title/person/organisation | blocked |
| testimonials | `isPublicOfficial: true` published | allowed only per CONTENT 8; verify it never renders on Home or first in any list |
| projects | no role, no delivering company, no evidence note; 2 gallery images; images without caption/alt | blocked |
| services | `requiresRegistration` with no name/number (Architecture, BoQ) | blocked |
| team | name "Eng. X" or role "Civil Engineer" with no EBK number | blocked |
| equipment | missing make/model/capacity; zero images | blocked |
| locations / posts / globals | `[CONFIRM`, superlatives | blocked |

Then the **bypass tests** (this is where gates usually fail):
1. **Partial updates:** `PATCH` only `{ _status: 'published' }` on a record whose stored draft has a `[CONFIRM`. The hook sees only the submitted `data`, so a naive check passes. Gate must merge with `originalDoc`/stored draft.
2. **Autosave, schedule-publish, bulk publish** in the list view, the "Publish" button, and the versions "Restore and publish". Each must go through the gate.
3. **Local API** (`payload.update` in a script/seed) and **GraphQL** mutation, not only the admin UI.
4. **Globals** (`HomePage`, `SiteSettings`): the hook type differs (`GlobalBeforeChangeHook`). Confirm it is attached and works.
5. **Post-publish edit:** edit a published record to add `[CONFIRM`; must be blocked, not just the first publish.
6. **Unpublish side effects:** unpublishing a credential/testimonial/service removes it from pages, nav, sitemap, related lists, JSON-LD and OG, and `revalidateCache` fires (SITE-PLAN 8).
7. **Delete a referenced record** (a machine used by a project, a team member who is an author): no 500s on public pages.
8. **Gate scope check:** list which collections lack a collection-specific rule that the docs imply (Locations, Posts, Equipment facts, Media provenance). Anything the docs require that the hook doesn't enforce is a finding. A reviewer cannot rely on editors' memory for "no stock photos".

**3.4 Seed (CONTENT 1-11; BUILD-GUIDE `src/seed`):**
- `pnpm seed` is idempotent: run twice, diff row counts, no duplicates, no overwritten editor changes.
- Every CONTENT record exists with exact slugs, titles, copy, and relationships: 7 services (incl. cabro-paving child, 2 gated), 5 projects, categories, machines per CONTENT 5, Newton's team record, credentials, 2 testimonials, 2 locations, 8 article seeds, 2 legal pages.
- **Gated records are NOT published:** Architecture, BoQ, KURA/Kinoti testimonial (`isPublicOfficial: true`, draft), Dukes Cottages `deliveringCompany: "Dukes Limited"`, `proofItems` all `verified: false`, `responseTimeStatement: null`, `files.companyProfile: null`.
- A fresh install with seed only produces a site that **passes its own gate** and **hides** everything SITE-PLAN 8 says to hide. List every record that is published while holding a `[CONFIRM`.

### Phase 4: Enquiry pipeline audit (BUILD-GUIDE 7; SITE-PLAN 7)

Run against staging with real Resend, Turnstile test keys, R2 and Neon. Record request, response, DB row, email headers, Telegram message.

| # | Scenario | Expected |
|---|---|---|
| 1 | Valid road quote (F1) | 303 to `/thank-you?type=project` (or JSON `{redirectUrl, ref}` via fetch); DB row; staff email < 1 minute with `Reply-To` visitor; ack email only if email supplied; Telegram only if env set |
| 2 | Valid hire from a machine page (F2) | Machine/equipment pre-filled from the page (query/prefill); `hire_submit` token |
| 3 | Each Zod rule | Every message string equals SITE-PLAN 7.2 verbatim; blur + submit validation; error summary and focus; `aria-invalid`; server errors match client |
| 4 | Phones | `07xx`, `01xx`, `+254`, `254`, spaces/dashes/parens, international E.164, `0812...` (invalid), 9/11 digits, letters |
| 5 | Honeypot `company_website` filled | Fake success, **nothing stored or emailed**, no hint to the bot; confirm the visitor path (JS and no-JS) cannot fill it (hidden properly: not `display:none` only if DESIGN says otherwise; no autofill trigger; `aria-hidden`, `tabindex=-1`) |
| 6 | Turnstile missing / invalid / expired / replayed | Rejected with the specified message; server verifies with `remoteip` |
| 7 | Rate limit 5 per 15 min per IP | 6th gets `429` with SITE-PLAN 7.2 message. **Check the store:** an in-memory counter on Vercel serverless doesn't hold across instances. Find where the count lives. Check which header is trusted: `x-forwarded-for` is spoofable unless Cloudflare is in front and `CF-Connecting-IP` is used |
| 8 | Attachments | Max 3 files, <= 10 MB, `.pdf/.jpg/.png/.webp` by **magic bytes** (rename `.exe` to `.pdf`; polyglot; zero-byte; 10 MB + 1; SVG; HTML), stored in the **private** bucket, not publicly readable, only admin/editor can download, filenames sanitised, no path traversal |
| 9 | Reference `SW-YYYY-NNNN` | Sequence starts at 101 (BUILD-GUIDE 7.2) vs example `SW-2026-0001`: flag; created by a **migration** (since `push:false`) not at runtime; concurrent 20 submissions yield unique references; behaviour at year rollover (the sequence doesn't reset) |
| 10 | Notification failure | Resend down / Telegram down: enquiry **still stored**, visitor still sees success, failure logged, 5 s timeout honoured, no unhandled rejection |
| 11 | `/thank-you` | Reads the `sw_last_enquiry` cookie (HttpOnly, SameSite=Lax, 5 min), fires the analytics event **once**, refresh does not double-fire, direct visit without the cookie shows the safe state; `noindex`; excluded from sitemap |
| 12 | Injection | XSS in name/message rendered in the admin and in emails (escaped); header injection in `name`/`email` fields; very long inputs; unicode; SQL metacharacters |
| 13 | CSRF/origin | Cross-origin POST rejected or neutralised by Turnstile; no wildcard CORS |
| 14 | Public API | `POST /api/[...slug]/enquiries` (Payload REST) and GraphQL cannot create enquiries (`access.create: () => false`) |
| 15 | Privacy | Consent checkbox required and `consentAcceptedAt` stored; UTM and `gclid` captured; no PII in logs or analytics events; retention matches CONTENT 11 |

### Phase 5: SEO, structured data and analytics audit

**5.1 Metadata (SITE-PLAN 9; BUILD-GUIDE 8):** For **every** route in SITE-PLAN 3.2 and one record per template, dump `<title>`, meta description, canonical, `robots`, OG and Twitter tags, `og:image` (1200 x 630, reachable, correct content type), `hreflang` (none needed pre-F18), `lang`. Verify:
- Titles <= 60 characters, descriptions 140-160, pattern `{title} | Shena Works`, exact strings per the SITE-PLAN 9 table, canonical absolute with no query string except `/insights?page=n`.
- **Spec conflict:** the SITE-PLAN 9 table itself breaks its own length rule. By measurement: the Home title is 61 characters; the descriptions for Credentials (139), Services (138), Projects (139), Equipment (139), Machine template (135 before substitution), Insights (128), Contact (128), Privacy (106) and Cookies (65) are under 140. **Do not shorten, pad or reword the final copy yourself.** Implement the table verbatim, then raise a SPEC QUESTION with options (relax the rule for legal pages and the 1-2 character overruns, or approve amended copy).
- Per-record override via the SEO plugin works and falls back to the pattern.

**5.2 Sitemap, robots, redirects**
- `/sitemap.xml` lists only published, gate-passing records with `lastmod`, absolute URLs on the canonical host; omits `/thank-you`, `/admin`, `/api`; omits `/about/credentials-and-safety` with 0 credentials and `/insights` with 0 posts; omits gated services; Nairobi absent when unpublished.
- `/robots.txt`: allows `/`, disallows `/admin`, `/api`, `/thank-you`; references the sitemap; production (not prototype) block; **no site-wide noindex** or `X-Robots-Tag` anywhere on production. Check the staging environment **is** noindexed and production is not.
- Raise: `Disallow: /api` also covers `/api/og`. Verify that WhatsApp/Facebook/Google can still fetch the `og:image` URLs. If they cannot, that is a Major finding against the WhatsApp preview goal (BUILD-GUIDE 8.4).
- Redirects: every BUILD-GUIDE 8.2 rule returns `308`, single hop, preserves query where sensible. Also test apex to `www` (canonical host), `http` to `https`, trailing slashes, uppercase, `/index.html`, and that no redirect chain or loop exists. The baseline list must be **extended** with real legacy URLs from the old site / Search Console (8.2 says Phase 0); report whether that was done. Crawl the old site if reachable.

**5.3 JSON-LD:** Extract every `application/ld+json` block per page type and validate with the Schema.org validator and Google Rich Results Test (or a local validator if offline). Required by SITE-PLAN 6.x and BUILD-GUIDE 11.4: `Organization`+`GeneralContractor` (with `@id` referenced site-wide), `Person` (leadership), `Service`, `Product`/`Offer` + `OfferCatalog` (equipment; no price unless approved; `availability`, `businessFunction: LeaseOut`, `seller` = org `@id`), `FAQPage` (only where visible FAQs exist and match text exactly), `Article`, `BreadcrumbList` (matches the visible breadcrumb), `Review` only if `permissionFile` and `isPublicOfficial === false`. Check:
- JSON-LD never describes content that is hidden, unpublished, or absent from the page (gated services, unverified proof, KURA quote).
- No fabricated `aggregateRating`, `foundingDate`, `numberOfEmployees`, `priceRange`.
- Dates are ISO 8601; URLs absolute; image URLs reachable.
- **Doc gap:** BUILD-GUIDE 8.3 shows only the Organization builder while SITE-PLAN 6.x requires many more. Verify the rest exist in `jsonld.ts`.

**5.4 Consent and analytics (BUILD-GUIDE 8.5; SITE-PLAN 4.8, 10)**
- Cold visit with an empty profile: **zero** requests to `googletagmanager.com`, `google-analytics.com`, `doubleclick`, Turnstile aside (if loaded only on form pages, say so), and no analytics cookies. Capture a HAR.
- "Accept analytics": `sw_consent=analytics` set; gtag loads; events fire. "Decline" / dismiss: nothing loads, choice remembered, footer link lets the visitor change the choice. Withdrawing consent stops events and clears `_ga*`.
- All 10 events in SITE-PLAN 10, with exact names and snake_case parameters (`quote_submit`, `hire_submit`, `whatsapp_click`, `call_click`, `email_click`, `file_download`, `cta_click`, `form_start`, `form_error`, `filter_use`), correct `location` values, one event per action (no double fires), nothing fires without consent. Mark the four key events in GA4 (manual, ask for evidence).
- Embeds (`ConsentEmbed`, map): no third-party request before consent.
- Cookie banner: no layout shift, keyboard operable, doesn't trap focus, doesn't cover the mobile action bar, wording per SITE-PLAN 4.8 and `/cookies`.

### Phase 6: Conditional rendering matrix (SITE-PLAN 8)

Build **fixtures** (toggle records via the Local API on a test DB) and assert the rendered HTML, the nav, the sitemap and the JSON-LD for every row of the SITE-PLAN 8 table, **both** states. This needs a Playwright test per row. Minimum cases:

| Row | Test |
|---|---|
| Unpublished or gate-failing record | 404; absent from nav, sitemap, related lists, JSON-LD |
| 0 / 1 credentials | Credentials page and nav links 404/hidden vs shown |
| 0 posts / 1-2 posts / 3 posts | Insights nav+index hidden / shown / `InsightsRow` hidden until >= 3 |
| Nairobi unpublished | Nairobi page 404; header secondary row reads "Meru, Kenya"; footer and JSON-LD have no Nairobi |
| ProofBar | 0, 1 (hidden), 2+ verified (shown) |
| WhyShena | unverified points hidden; block hidden at 0 |
| TestimonialBlock | no permission file hidden; public-official never on Home, never first |
| Company profile | link hidden until the file is uploaded; `/downloads/company-profile` 404 when no file; `file_download` fires when present |
| Response-time statement | hidden until set |
| Machine availability line | always renders for `available` and `on_hire` |
| Case-study stat row | hidden with 0 key figures |
| Gallery | 1-2 images as figures; >= 3 as gallery |
| Equipment category | 404 with 0 published machines |
| Related lists | hidden at 0 |
| `[CONFIRM` in any published field | impossible to publish (Phase 3) **and** if forced into the DB directly, the page still must not render it (defence in depth) |

### Phase 7: Copy fidelity (SITE-PLAN 6, CONTENT 3-11)

- For each page in SITE-PLAN 6.1 to 6.18: extract the quoted copy and compare to rendered text, **word for word**, including punctuation, sentence case, and CSS-only uppercasing. Script it: parse the quoted strings from the markdown, search the rendered DOM text, list non-matches. Manual review of the non-matches.
- Blocks appear in the specified order with the specified `id` anchors (`how-we-work`, etc.) and heading levels.
- Seed vs docs: diff the DB records against CONTENT (titles, `summary` <= 160, `keyFacts` 3-6, `scope` >= 4, `process` exactly 4, `faqs` 4-6, FAQ answers identical to the visible text used in `FAQPage`).
- Facts register (CONTENT 1.2): each discrepancy row is implemented as the "Resolution in seed data" column says. Specifically: no "5+ years", "50+", "100+"; Dukes Cottages attributed to Dukes Limited; no `Eng.`; Architecture/BoQ unpublished; machinery owner unresolved is shown as **configurable**, not hard-coded.
- Legal pages: `/privacy` and `/cookies` match CONTENT 11 in full; cookie names in `/cookies` equal the cookies the site really sets (inspect them); ODPC registration status not asserted unless `I-15` is closed.
- Voice rules (SITE-PLAN 2): each page ends with a fitting next step; CTA wording varies; alt text and error messages obey the same voice rules.

### Phase 8: Security, infrastructure and operations (BUILD-GUIDE 9; 1.2)

- **Headers** (9.1): check on every public route and on a 404 and a 500. HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy present. `/admin` is excluded by the regex: confirm it has its own sane headers. **Gap:** the guide specifies no CSP. Report whether one exists. If not, raise as a SPEC QUESTION/Major recommendation (allowlist Turnstile, GA, R2 media, `next/og`, fonts) and test that a proposed CSP does not break Turnstile, GA after consent, or the admin.
- **TLS and DNS:** HTTPS only, HSTS preload eligibility, canonical host, `media.shenaworksltd.com` custom domain with `Cache-Control: public, max-age=31536000, immutable`, correct CORS, private bucket truly private (anonymous GET on a known key must fail).
- **Neon:** pooled `DATABASE_URI` at runtime, direct `DIRECT_DATABASE_URI` for migrations via `PAYLOAD_MIGRATING`, `push:false`, `production` and `staging` branches, PITR retention 7-30 days enabled (evidence: Neon console/MCP output), region `eu-central-1` or justified.
- **Backups (9.3):** `scripts/backup-db.sh` runs `pg_dump --format=custom` against the direct endpoint, writes to the R2 backup bucket with a **30-day lifecycle rule**, scheduled at 02:00 EAT (GitHub Actions cron is UTC: 23:00 UTC the previous day. Check the conversion). Dump is encrypted (the doc says so: find the mechanism). **Run `scripts/restore-test.sh` and attach the log** with row counts, branch cleanup confirmed. Acceptance criterion 8 cannot pass without this log.
- **CI/CD:** GitHub Actions run typecheck, lint, unit, e2e, axe, LHCI on every PR; Vercel previews branch from Neon `staging`; secrets are in Vercel/GitHub, not in the repo; `main` is protected; production deploy needs green CI.
- **Hosting conflict:** BUILD-GUIDE 1 and 10 say Vercel; BUILD-GUIDE 2 lists `Dockerfile` and `docker-compose.yml`. Determine what they're for (local dev? self-host fallback?). If unused and unmaintained, report as dead weight or a misleading deployment path. SPEC QUESTION.
- **Health route:** `/api/health` returns 200, checks DB reachability without leaking details, is not cached; uptime monitor configured (evidence).
- **Error pages** (SITE-PLAN 6.18): `not-found.tsx` and `error.tsx` styled per DESIGN, offer next steps, correct 404/500 status, `noindex`. Test: a gated record URL returns a real 404 status (not a soft 404 with 200).
- **Caching:** `revalidateCache` triggers on create/update/publish/unpublish/delete for every collection and global, and also revalidates **related** pages (a machine change revalidates its category, the equipment index, the home teaser, sitemap). Publish a change in `/admin` and time how long until the live page updates.
- **Observability:** errors reach a log/alert someone will see; enquiry failures alert staff (a lost lead is the worst bug on this site).
- **Dependencies:** `pnpm audit`, pinned versions per BUILD-GUIDE 1 (Node >= 22, pnpm 9, Next 16, React 19, TS 5 strict, Payload 3, Tailwind 4, Zod 3), no abandoned or unnecessary packages, lockfile committed, licence check.

### Phase 9: The overlooked-items sweep (do this last; assume something was missed)

Answer each with evidence. A "no" or "unsure" is a finding.

1. Does every route in SITE-PLAN 3.2 exist, with the exact URL, and does every internal link resolve (crawl the built site, report 404s, redirects, `href="#"`, empty links, `javascript:` links)?
2. Every `tel:`, `wa.me` and `mailto:` link: correct number format, correct **pre-filled message per page** (SITE-PLAN 4.6, URL-encoded, includes the page/machine/service where specified), `location` event param right?
3. Mobile action bar (SITE-PLAN 4.3): below `lg` only, doesn't cover content or the cookie banner, respects safe-area insets, `Call` and `WhatsApp` both work, body has bottom padding so the footer isn't hidden.
4. Header (4.1, 4.2): every nav item and mega-panel link matches 3.2; the secondary row; transparent-header variant over photo heroes uses `logo-white.svg` and switches to `logo-color.svg` on scroll.
5. Footer (4.5): NAP identical character-for-character to the locations and to JSON-LD (CONTENT 2.3); legal line uses the incorporation facts only if confirmed; links to privacy, cookies, "Cookie settings".
6. Breadcrumbs (4.7) on every deep page with matching JSON-LD.
7. `CtaBand` (4.4) on every page that SITE-PLAN says, with varying wording.
8. Favicon set, `manifest`/theme-color, brand SVGs (`logo-color.svg`, `logo-white.svg`, `favicon.svg`): real files from `I-12`, not placeholders; `apple-touch-icon`.
9. `/api/og`: renders for long titles (wraps/truncates cleanly), for Unicode/emoji, rejects or sanitises HTML, caches, uses Roboto Condensed 700, correct colours, 1200 x 630; fallback for missing params.
10. Locale and format: `en-KE`/`en-GB` date formats, Kenyan shilling and unit formatting (m, m^2, m^3, tonne), phone display `+254 718 971 896`.
11. Hire pages: every machine shows availability, hire terms, "Quoted per job" vs indicative rate per the open decision; the pre-filled hire form (F2) uses the machine's name and category.
12. Projects: filters by **service, location and year** (F8) combined, with JS and without; empty-state block (`EmptyState`, SITE-PLAN 5.27) when no result; pagination/load-more; each card states Shena's **role** and the **delivering company** (SITE-PLAN 6.8/CONTENT 4).
13. `F17`: `geo` coordinates stored for projects (map tab is Phase 5, so confirm it is **absent**, not half-built).
14. `F18`-`F20` are **not** half-implemented (no stray Swahili routes, portal, payments).
15. `F14`: company profile PDF route (`/downloads/company-profile`) behaves per Phase 6 and logs `file_download`.
16. `F16`: Insights categories, `/insights/category/[slug]`, article reading time (auto-calculated in `beforeChange`), author card, related service, `Article` JSON-LD.
17. Leadership page (SITE-PLAN 6.3): career timeline matches the reconciled CONTENT 6 record (no unresolved LinkedIn vs résumé conflict published), no `Eng.`, portrait with alt text and caption.
18. Anything the docs say to do "later", "Phase N", "post-launch" or "if approved": confirm it is correctly **absent or hidden**, not stubbed with fake content.
19. TODO/FIXME/HACK, commented-out code, `console.log`, skipped or `.only` tests, `test.fixme`, disabled lint rules: list them all.
20. Documentation: `README` and `AGENTS.md` describe setup, env, migrations, seeding, tests, deployment, backup/restore, and how an editor publishes a Project and a machine. An `editor` must be able to do it **unaided** (criterion 9): perform it yourself from `/admin` as an editor with no developer help, and time it.

---

## Part C: Interrogation questions, per document

Answer each with `PASS / FAIL / UNVERIFIED / SPEC-QUESTION` plus evidence. These are the questions to ask after the protocol. They catch what a checklist doesn't.

### BUILD-GUIDE.md
- **§1** Is every package at the stated major version? Is Node `>= 22` enforced in `engines` and in CI? Are the four MCP servers (Cloudflare, Neon, Vercel, GitHub) the ones actually used to provision, and is there evidence (resource IDs) that the buckets `shena-media-public`, `shena-enquiries-private`, the backup bucket and the Neon project `shena-works` exist?
- **§1.3** For each of F1-F20, can you point to the code, the test and the page? Which Must/Should items have no test? What is the evidence that F20 is absent?
- **§2** Which files in the tree are missing? Which files exist that aren't in the tree, and are they justified?
- **§3** Do the Tailwind `@theme` tokens equal DESIGN 10.1 exactly (script it)? Are `--spacing: 0.4rem` and `--radius-*: initial` both set? Are fonts self-hosted with the exact `@font-face` blocks and `local()` fallbacks as written?
- **§4** Does the progressive-enhancement contract (4.1) hold with JS off? Does the grid helper (4.2) place content in columns 2-15 from `lg` and go fluid above 1500?
- **§5** Does the schema match field-for-field? Is `push:false` real? Are the lockout and 2FA configured, not just installed? Does the gate survive partial updates, bulk publish, GraphQL and globals (Phase 3)? Is `FORBIDDEN_SUPERLATIVES` complete against SITE-PLAN 2? Is the `[CONFIRM` rule really enforced where SITE-PLAN 1 claims it is? **(That cross-reference points to BUILD-GUIDE 9.4, which is the env-var section. The rule lives in 5.3. Record as a docs error.)**
- **§6** Two buckets or two prefixes: which, and is the private one really private? Are the four `imageSizes` generated? Do `alt` and `caption` block the upload?
- **§7** Does the endpoint run steps 1-8 **in that order** (rate limit before Turnstile before file handling)? Where is the rate-limit state stored and is it shared across serverless instances? What happens at 1,000 concurrent enquiries? Is the `303` vs JSON branch both tested?
- **§8** Do all 8 legacy redirects resolve in one hop at `308`? Does the real legacy-URL crawl exist? Does `/api/og` render? Is there evidence the GA script loads only after consent?
- **§9** Do all six named test files exist and fail when the code is broken? Was `restore-test.sh` actually run, with a log? Is the backup encrypted and is the lifecycle rule in place? Is the CSP question settled?
- **§10** Did each milestone M1-M6 meet its exit gate, with evidence for each? Were M-gates skipped or reordered?
- **§11** Walk the 10 acceptance criteria one at a time. For each: staging **and** production evidence, not one or the other.

### DESIGN.md
- **§1-2** Does every colour, size, weight, line-height and space come from a token? Is contrast >= 4.5:1 for all text pairings (compute, don't eyeball)? Is `accent-500` text ever on `ink-900`? Are headings Condensed, uppercase via CSS, weight 400, with `-0.007em` tracking from `h3`/lg up? Are buttons, tabs and link lists Condensed 700? Does the 62.5% root go fluid at 1500?
- **§2.5-2.6** Icons: one family, correct sizes, `aria-hidden` when decorative. Images: art direction, `clip-path` wipe reveal, grey-100 placeholder, 200 ms fade, captions.
- **§3** Do all animations use named duration/easing tokens, and only the allowed properties? 200 ms feedback vs 500 ms-1 s atmosphere? Is there a motion budget per page (3.5)?
- **§4** Does the state matrix (4.6) hold for every control? Does hover step darker by one and pressed by two? Do focus rings flip to white on dark surfaces? Do hit areas reach 44 px on coarse pointers?
- **§5** For each of the 25 components: does an implementation exist, with the spec'd props, states, ARIA and keyboard? Which components are specified but never rendered anywhere?
- **§6** Is each behaviour in 6.1-6.15 implemented as written, including the 200 ms hover intent, counted scroll locks, drag threshold, resize/orientation handling (6.13), and the full keyboard map (6.14)?
- **§7** Does every row of the 7.1 conformance checklist pass for every component?
- **§8-9** Do the responsive summary, print and forced-colors rules hold at every breakpoint and mode?
- **§10** Are all tokens, recipes and the 10.2 recipes in the code unchanged?
- **§11-12** Did you actually grep each Do/Don't? Did every item on the ship checklist get run? **Does `font-body` ship exactly the faces DESIGN 2.2 lists (Roboto 400, 400 italic, 700)? Is the italic file really used, or is it dead weight?**

### SITE-PLAN.md
- **§1-2** Is all quoted copy verbatim? Are phone/WhatsApp/email/addresses read from `site-settings`? Are voice rules 1-6 obeyed in every string, including alt text and error messages? Does each gate-table row have enforcement code and a test?
- **§3** Does every URL in the sitemap table exist, and is every route in the repo in the table? Are slugs identical to CONTENT?
- **§4** Header (lg), header/drawer (<lg), action bar, `CtaBand`, footer, WhatsApp messages, breadcrumbs and cookie banner: each matches the wireframe and copy; every state exists.
- **§5** For each of the 27+ blocks: exists, takes the specified data, respects its conditional rule, is used where the pages say. Which blocks are specified but unused?
- **§6** For each page 6.1-6.18: every block present, in order, with exact copy; correct JSON-LD; correct breadcrumb; correct CTA; correct `[CONFIRM]`-hold behaviour (page held back, not published with a placeholder).
- **§7** Fields, messages, staff email (7.3) and customer acknowledgement (7.4) templates: verbatim? Rendered in real email clients (Gmail web/mobile, Outlook)? Plain-text part present? Is the `Reply-To` correct?
- **§8** Does every row behave in both states (Phase 6)?
- **§9** Does every page match the SEO table? Which rows conflict with the documented length rule (Phase 5.1)?
- **§10** Do all 10 events fire with the exact names and parameters, only after consent?
- **§11** Walk all 10 page-checklist items for **every** page template. Which pages fail item 5 (JS off) or item 10 (Lighthouse)?

### CONTENT.md
- **§1** Does `site-settings` equal the seed JSON? Which `[CONFIRM]` values are still unresolved and which pages depend on each (use the `I-xx` register)? Is each discrepancy row implemented per the "Resolution" column?
- **§2** Is every `I-01` to `I-15` mapped to the feature it blocks, and **is each blocked feature hidden or held back rather than faked**? Report these under "BLOCKED ON CLIENT INPUT", not as defects.
- **§3-5** Are all 7 services, 5 projects, categories, machines and FAQs seeded exactly? Do gated items (Architecture, BoQ, Dukes attribution) behave as gated? Do the machine records stay unpublished until the `I-10` fleet list arrives?
- **§6-8** Is Newton's record the reconciled one? No `Eng.` without EBK. Do both testimonials follow the public-official rules (Kinoti: draft, never Home, never first)?
- **§9-10** Locations and the 8 article seeds: exist, drafted, unpublished until `I-14` approval, correct categories/authors?
- **§11** Are the legal texts identical to the pages? Are the cookies named in `/cookies` the ones actually set? Is the data-retention text matched by real behaviour (e.g. deletion of enquiries after N months, if stated: is there a job)?

---

## Part D: Reporting, severity and fixing

### D.1 Severity scale

| Level | Meaning | Examples |
|---|---|---|
| **Blocker** | Fails a BUILD-GUIDE 11 acceptance criterion or the publishing gate; legal, trust or data-loss risk; launch must not proceed | Gate bypassable; `[CONFIRM` renders; analytics fires without consent; enquiry lost silently; private attachments public; secrets in repo; Lighthouse < 90 on a required page; backup never restored |
| **Major** | Breaks a Must requirement or WCAG 2.2 AA on a key journey, or makes a feature unusable for a group (JS off, keyboard, mobile) | axe violation; broken filter without JS; WhatsApp preview image blocked; wrong redirect; token drift on a shared component |
| **Minor** | Deviates from the docs without breaking use | Copy off by a word; wrong easing token; missing hover state on a rarely seen element |
| **Nit** | Cosmetic or consistency only | Naming, comment, formatting |

Every finding cites the requirement ID (register row), doc section, evidence, impact, and the smallest fix.

### D.2 Report template (`audit/REPORT.md`)

```
# Shena Works audit report
Commit audited: <sha>   Date: <date>   Environment: staging <url> / production <url>

## 1. Verdict
Launch-ready: YES / NO. Counts: Blocker n, Major n, Minor n, Nit n, Unverified n, Spec questions n, Blocked-on-input n.
Which BUILD-GUIDE 11 criteria (1-10) pass / fail / unverified, one line each with evidence.

## 2. Findings (grouped by severity, then by root-cause cluster)
### [Blocker] <ID> <short title>
- Requirement: <register ID, doc §, quote>
- Evidence: <file:line | command + output | screenshot path>
- Impact: <who is harmed, how>
- Reproduce: <steps>
- Fix: <smallest change> | Regression test: <file::name>

## 3. Spec questions (conflicts or gaps in the docs; do not self-resolve)
| # | Docs involved | Conflict or gap | Options | Recommended | Blocks |

## 4. Blocked on client input (not defects)
| Input ID (I-01..I-15) | Feature held back | Evidence it is hidden/gated correctly | What is needed |

## 5. Coverage
Register totals by status. Pages x breakpoints screenshotted. Tests run, passed, mutated. Everything marked UNVERIFIED and why.
Attach: audit/REGISTER.csv, audit/screens/, audit/har/, lighthouse reports, axe output, JSON-LD validation output, restore-test log.
```

### D.3 Spec questions the auditor should expect to raise

These were found while reading the docs. Confirm each against the actual text, then record (do not resolve):

1. **`[CONFIRM` cross-reference:** SITE-PLAN 1 says the rule is enforced in "BUILD-GUIDE 9.4" (the env section); it is in 5.3. Docs fix, not code.
2. **Turnstile vs JS-off forms:** BUILD-GUIDE 7.1 requires `cf-turnstile-response`; SITE-PLAN 11.5 and DESIGN 6.15 require forms to submit without JavaScript.
3. **Docker files vs Vercel hosting** (BUILD-GUIDE 1 and 2 vs 10).
4. **SEO table violates its own length rule** (SITE-PLAN 9; see Phase 5.1).
5. **Banned-word lists differ:** SITE-PLAN 2 lists nine words; the 5.3 regex six.
6. **Gate scope:** the hook only covers credentials, testimonials, projects, services and team; "no stock photo / alt and caption" (SITE-PLAN 2) and equipment facts have no CMS enforcement. Hook type is `CollectionBeforeChangeHook` though globals are also named; partial-update handling unspecified.
7. **Rate-limit store and trusted-IP header** unspecified for serverless.
8. **Reference numbering:** sequence `START 101` and no yearly reset vs the example `SW-2026-0001`; no migration step specified.
9. **No CSP** in the 9.1 headers.
10. **`Disallow: /api`** vs the need for crawlers to fetch `/api/og`.
11. **BUILD-GUIDE contents list stops at section 10**, though section 11 (acceptance criteria) exists. References to "spec section 11/14/16.3" point to a document outside `docs/`.
12. **Backup timing** is stated in EAT; GitHub Actions cron is UTC. **Encryption mechanism** for the dump is stated but not defined.
13. **Tailwind v4 `@theme` vs DESIGN 10.1:** parity is claimed ("1:1") but unspecified how it is checked. Ask for a test.
14. **`AGENTS.md`** is referenced by SITE-PLAN and BUILD-GUIDE 2. Check it exists and says the same thing as these docs.

### D.4 Fixing, after the report

- Fix by **root-cause cluster**, not by symptom. One commit per cluster; message names the finding IDs.
- Each fix ships with a regression test that fails before and passes after (show both runs).
- Re-run the affected phases and the full suite. Update the register status with new evidence.
- Never fix a finding by editing the docs, loosening a test, adding an exception to the gate or lint, or hiding the symptom.
- Stop and ask on any SPEC QUESTION and any change that needs client input. Do not guess the answer.
- Finish with a delta report: findings opened, closed, still open (with reason), and the final launch verdict.

---

## Appendix: Quick command checklist

```
# structure
tree -a -I 'node_modules|.next|.git' -L 4

# tokens and forbidden patterns (run each; triage every hit)
rg -n 'border-radius|rounded|--radius' src
rg -n --pcre2 '#(?!(?:[0-9a-f]{3}|[0-9a-f]{6})\b)' src   # review hex literals against DESIGN 10.1
rg -n '#000\b|#000000|\bblack\b|rgb\(0, ?0, ?0\)' src
rg -n 'outline: ?none|outline-none|outline: ?0' src
rg -n 'font-weight|font-(thin|extralight|light|medium|semibold|extrabold|black)' src
rg -n 'transition: ?all|transition-all' src
rg -n 'style\.(display|visibility)|\.hidden ?=' src
rg -n '\[CONFIRM' . --glob '!docs/**'
rg -n -i '\b(premier|leading|best|world-class|exceptional|unrivall?ed|cutting-edge|seamless)\b' src
rg -n -i '50\+|100\+|5\+ years|satisfied clients' src
rg -n -i 'unsplash|pexels|placehold|picsum|lorem|TODO|FIXME' . --glob '!node_modules/**'
rg -n '718 971 896|254718971896|shenaworksltd@gmail\.com' src

# pipeline
pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm build
pnpm vitest run && pnpm playwright test && pnpm lhci autorun
pnpm audit --prod

# redirects, headers, seo
for p in about-us our-services portfolio our-projects contact-us machinery-hire plant-hire blog; do
  curl -sI "https://www.shenaworksltd.com/$p" | head -n 3; done
curl -sI https://www.shenaworksltd.com/ | rg -i 'strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security'
curl -s https://www.shenaworksltd.com/robots.txt; curl -s https://www.shenaworksltd.com/sitemap.xml | head -n 50
```
