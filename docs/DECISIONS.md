# Shena Works: Owner Decisions and Doc Amendments

**Status:** binding. Put this file in `docs/DECISIONS.md`.
**Precedence:** where this file conflicts with `BUILD-GUIDE.md`, `DESIGN.md`, `SITE-PLAN.md` or `CONTENT.md`, this file wins.
**Agents must not edit the four docs.** The owner applies Section 3 by hand. Until then, agents follow this file.

---

## 1. Decisions

### D-01 Banned words
`SITE-PLAN.md` section 2 (nine words) is authoritative. `BUILD-GUIDE.md` 5.3 is only an implementation of it and was incomplete.

- Regex (case-insensitive, whole word):
  `/\b(premier|leading|best|world-class|exceptional|unrivall?ed|cutting-edge|seamless)\b/i`
- Applies to every text value of a record: plain fields, Lexical rich text, array items, alt text, captions, `meta.title`, `meta.description`.
- It does **not** apply to `slug`, `id`, `url`, `filename`, `mimeType`, `_status`, timestamps or block metadata. Scan string values, not `JSON.stringify` output.
- The error names the field path and the word found, for example: `Field "summary" contains "leading". Use a plain factual term.`
- False positives (for example "the road leading to the site") are accepted. The editor rewords. Do not add exemptions.

### D-02 SEO length rule
Relax the rule. Do not change approved copy.

- Titles: **at most 65 characters**. Descriptions: **at most 160**, no minimum. Aim for 120 or more on commercial pages.
- Every quoted string in `SITE-PLAN.md` section 9 is implemented **verbatim**. Never shorten, pad or reword it.
- The automated check enforces only `<= 65` and `<= 160`. Home (61 characters) and all short descriptions then pass. By measurement the shortest is Cookies at 65.
- For records without a hand-written override (`{title} | Shena Works`), the check applies to the rendered result and fails the build if over 65.

### D-03 Forms with JavaScript off
Turnstile stays mandatory. The enquiry form does **not** submit without JavaScript.

- Every enquiry form renders a `<noscript>` block above the form with `tel:`, WhatsApp and email links built from `site-settings` (never hard-coded).
- Proposed copy (owner-approved by adopting this file): `This form needs JavaScript to check you are not a robot. Please call {phoneDisplay}, WhatsApp us or email {email} instead.`
- Everything else must still work with JavaScript off: content visible, navigation, filters via GET, pagination, accordions readable.
- Do **not** add a server path that accepts a submission without a Turnstile token.

### D-04 Content-Security-Policy
Add a CSP to public routes. Start in report-only mode, then enforce.

- Applies to the same `source` as the other security headers (everything except `/admin`). `/admin` is not given this CSP.
- Controlled by env var `CSP_ENFORCE`. When not exactly `'true'`, send `Content-Security-Policy-Report-Only`. When `'true'`, send `Content-Security-Policy`. Add the var to `.env.example` (default empty).
- Inline scripts and styles are allowed (`'unsafe-inline'`). A nonce-based policy is **not** used because it forces dynamic rendering and breaks the static-page performance targets.
- Directives:

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://media.shenaworksltd.com https://*.google-analytics.com https://*.googletagmanager.com;
font-src 'self';
connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
frame-src https://challenges.cloudflare.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests
```

- If `ConsentEmbed` loads a map, add only the exact Google Maps embed origin to `frame-src`, and only for that route set.
- `'unsafe-eval'` is allowed in development only, never in production.
- Process: deploy to staging in report-only, exercise every page, the cookie banner accept/decline, a form submission and a consented GA session, collect violations, fix the allowlist, then set `CSP_ENFORCE=true`. Evidence required: zero violations over the exercised journeys.

### D-05 Docker
Remove `Dockerfile` and `docker-compose.yml`. Hosting is Vercel; development uses Neon branches. No container deployment path exists.

### D-06 File structure
- Split bundled collections and globals into one file each, exactly as `BUILD-GUIDE.md` section 2 lists. Do this as a **separate, behaviour-neutral commit after the gate fixes and their tests are green**.
- Create the four UI wrappers: `MegaPanel`, `Pagination`, `PhoneLink`, `WhatsAppLink`. `PhoneLink` and `WhatsAppLink` are the only places that build `tel:` and `wa.me` URLs and fire `call_click` and `whatsapp_click`.
- Behaviour modules (`menus.ts`, `drawer.ts`, `dialog.ts`, `carousel.ts`): first test whether the current inline implementation meets the progressive-enhancement contract (`BUILD-GUIDE.md` 4.1): menus and drawer usable with JS off, and a deliberately broken module does not stop the others. If it passes, **do not extract**, and report it as an accepted deviation for the owner to record. If it fails, extract.

### D-07 Publishing gate design (rulings)
1. The gate evaluates the **effective document**: `{ ...originalDoc, ...data }`.
2. Status is `data._status ?? originalDoc._status`. The gate runs when that status is `'published'`. If it is `undefined`, **treat as published** (fail closed). Draft saves and autosave (`_status: 'draft'`) are never blocked.
3. Editing an already-published record is gated on every save, not only the first publish.
4. One shared core function, with two thin hook wrappers: `CollectionBeforeChangeHook` and `GlobalBeforeChangeHook`.
5. Attach to **all** content collections, **LegalPages** (which also gets `versions: { drafts: true }`), and **all 7 globals**.
6. Bulk publish, "Restore and publish", schedule-publish, Local API and GraphQL must all pass through it. Prove each with a test.
7. The collection-specific rules in `BUILD-GUIDE.md` 5.3 stay, but read from the effective document, never from `data`.
8. Gate scope gaps are owner-decided as follows. Media `alt` and `caption` stay required at the field level. Equipment: `make`, `model`, `capacity` and at least one image are required to publish. Posts and Locations get the `[CONFIRM` and superlative checks only.

### D-08 Seed and fleet
- No value in the seed may be invented. `CONTENT.md` 5.2 seeds machines with `[CONFIRM: e.g. ...]` placeholders. Those stay as placeholders and the records stay **draft** until fleet input `I-10` arrives.
- If `src/seed/data.ts` contains real-looking make/model values not present in `CONTENT.md` (for example "CAT 120H" or "Bomag BW 211"), that is a **Blocker**: revert to the placeholders and unpublish.
- With zero published machines: equipment category pages 404 and the equipment index shows the `SITE-PLAN.md` 8 empty behaviour.

### D-09 Data layer
- The public site reads from Payload through `src/lib/payload.ts` (Local API, `unstable_cache`, tagged for `revalidateCache`).
- **No silent fallback to seed arrays in production.** If the database is unreachable, the page errors (500 page) and an alert fires. Tests run against a seeded test database.
- `src/lib/content.ts` and any in-page static content arrays are removed once the data layer is switched.

### D-10 Enquiry pipeline defaults (change if you disagree)
- **Reference:** keep `START 101` and no yearly reset. Format `SW-${year}-${padStart(4)}`. The example `SW-2026-0001` is illustrative only. The sequence is created by a **migration** (since `push: false`).
- **Rate limit store:** a small Postgres table (`rate_limits`: hashed IP, window start, count) created by migration. Not in-memory. Limit: 5 per 15 minutes per IP.
- **Client IP:** use `CF-Connecting-IP` only if DNS is proxied through Cloudflare (verify and record the evidence). Otherwise use Vercel's `x-vercel-forwarded-for` or `x-real-ip`. Never trust a client-supplied `x-forwarded-for`.
- **Acknowledgement email:** exactly the `SITE-PLAN.md` 7.4 template. `{responseTime or "as soon as we can"}` is taken from `site-settings.responseTimeStatement` and falls back to "as soon as we can". **Never hard-code an SLA** such as "within 24 hours". `I-13` is open.
- **Cookie:** `sw_last_enquiry`, `HttpOnly`, `SameSite=Lax`, 300 seconds, path `/`, JSON `{ ref, type, service, equipment, sourcePage }`. Because it is HttpOnly, `/thank-you` reads it **server-side** and passes the values to the analytics component as props. Tests must not read it from `document.cookie`.
- **Timeouts:** 5 seconds on Resend and Telegram. A failure never loses the enquiry and never shows the visitor an error.
- **Doc ambiguity fixed:** the endpoint steps are in `BUILD-GUIDE.md` **7.2**, not 7.1, 7.3 or 7.4.

---

## 2. Client input register (authoritative: `CONTENT.md` section 2)

The first audit report numbered most of these wrongly. Use this table.

| ID | Input needed | Feature held back until supplied |
|---|---|---|
| I-01 | Certificate of Incorporation (name, number, date, directors) + KRA PIN decision | Footer legal line, About, Credentials key facts, JSON-LD |
| I-02 | NCA certificates (category, class), practising licence, KRA Tax Compliance, insurance summary, safety policy PDF, AGPO certificate | Credentials page, `ProofBar` |
| I-03 | EBK / BORAQS registration numbers of any engineers, architects, quantity surveyors | Architecture and BoQ service pages, professional titles |
| I-04 | Confirmation of every service Shena delivers directly | Services index and navigation |
| I-05 | Meru and Nairobi addresses, coordinates, office hours, confirmed WhatsApp number, domain email choice | Header, footer, contact, locations |
| I-06 | Legal entity that owns and contracts machinery hire; indicative vs quote-only rates; fuel/operator/transport terms | Equipment pages, hire contract notice |
| I-07 | Project list: Shena's role, delivering company, client type, year, location, key figures, completion evidence | Projects index and case studies |
| I-08 | Original real project and equipment photographs | All visual blocks |
| I-09 | Written permission for the Charles Imunde testimonial and any others | `TestimonialBlock` |
| I-10 | Machine fleet list (category, make, model, year, capacity, photos, service area) | Equipment catalogue |
| I-11 | Newton's reconciled career dates, portrait, EBK/academic credentials, CIPIT certificate | Leadership page |
| I-12 | Vector logos (full-colour SVG, all-white SVG) | Header, footer, OG images, favicon |
| I-13 | Named enquiry handler (`primaryContact`) and committed response time | `ContactAside`, contact page, confirmation emails |
| I-14 | Approval of the 8 Insights articles and a named approver | Insights section |
| I-15 | ODPC registration check under the Data Protection Act, 2019 | `/privacy` notice |

The Kinoti (KURA) testimonial has no `I-xx` number. Its rules are in `CONTENT.md` 8.2 (public official: draft, never on Home, never first in a list). Report it that way.

---

## 3. Amendments the owner applies to the four docs

| # | File and location | Change |
|---|---|---|
| A1 | `SITE-PLAN.md` line 31 | Replace `(enforced in `BUILD-GUIDE.md` 9.4)` with `(enforced in `BUILD-GUIDE.md` 5.3)`. |
| A2 | `SITE-PLAN.md` line 1349 | Replace `Titles ≤ 60 characters, descriptions 140–160.` with `Titles ≤ 65 characters, descriptions ≤ 160 (no minimum; aim for 120 or more on commercial pages). The quoted strings in this table are final and are never edited to fit.` |
| A3 | `BUILD-GUIDE.md` 5.3 (regex at line 495 and the hook body) | Replace with D-01 and D-07. Reference implementation below. |
| A4 | `BUILD-GUIDE.md` 9.1 | Add the CSP from D-04 beside the other headers, switched by `CSP_ENFORCE`. Add `CSP_ENFORCE` to the 9.4 env table. |
| A5 | `BUILD-GUIDE.md` section 2 tree (lines 250-251) | Delete `Dockerfile` and `docker-compose.yml`. Add a note: hosting is Vercel, no container deployment. |
| A6 | `SITE-PLAN.md` 11.5 item 5 | Replace with: `Works with JavaScript off: content visible, nav links present, filters work via GET. Enquiry forms show a call/WhatsApp/email fallback instead (they need JavaScript for Turnstile).` Add the D-03 `<noscript>` copy to `SITE-PLAN.md` 7.2. |
| A7 | `BUILD-GUIDE.md` 7.2 steps 1 and 5 | Step 1: add the IP-header rule and Postgres store from D-10. Step 5: add "the sequence is created by a migration". |
| A8 | `BUILD-GUIDE.md` 7.2 step 8 | Add: the cookie is read server-side by `/thank-you`. |

### Reference implementation for A3

```ts
// src/hooks/publishingGate.ts
import { APIError, type CollectionBeforeChangeHook, type GlobalBeforeChangeHook } from 'payload'

export const FORBIDDEN_SUPERLATIVES =
  /\b(premier|leading|best|world-class|exceptional|unrivall?ed|cutting-edge|seamless)\b/i

const SKIP_FOR_VOICE = new Set([
  'id', 'slug', 'url', 'filename', 'mimeType', '_status',
  'createdAt', 'updatedAt', 'blockType', 'blockName',
])

function walk(value: unknown, path: string, skipVoice: boolean, out: { path: string; text: string }[]) {
  if (typeof value === 'string') out.push({ path, text: value })
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, skipVoice, out))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (skipVoice && SKIP_FOR_VOICE.has(k)) continue
      walk(v, path ? `${path}.${k}` : k, skipVoice, out)
    }
  }
}

export function assertPublishable(
  slug: string,
  data: Record<string, any> | undefined,
  originalDoc: Record<string, any> | undefined,
) {
  const status = data?._status ?? originalDoc?._status
  if (status === 'draft') return // drafts and autosave are never blocked; undefined fails closed

  const doc = { ...(originalDoc ?? {}), ...(data ?? {}) }

  const all: { path: string; text: string }[] = []
  walk(doc, '', false, all)
  const confirm = all.find((s) => s.text.includes('[CONFIRM'))
  if (confirm) {
    throw new APIError(`Cannot publish: field "${confirm.path}" still contains a [CONFIRM: ...] placeholder.`, 400)
  }

  const voice: { path: string; text: string }[] = []
  walk(doc, '', true, voice)
  for (const s of voice) {
    const m = s.text.match(FORBIDDEN_SUPERLATIVES)
    if (m) throw new APIError(`Field "${s.path}" contains "${m[0]}". Use a plain factual term.`, 400)
  }

  collectionRules(slug, doc) // the existing per-collection switch, moved here, reading `doc` not `data`
}

export const enforcePublishingGate: CollectionBeforeChangeHook = ({ data, originalDoc, collection }) => {
  assertPublishable(collection.slug, data, originalDoc)
  return data
}

export const enforceGlobalPublishingGate: GlobalBeforeChangeHook = ({ data, originalDoc, global }) => {
  assertPublishable(global.slug, data, originalDoc)
  return data
}
```

`collectionRules` is the existing `switch (collection.slug)` block from `BUILD-GUIDE.md` 5.3, unchanged except that every `data.x` becomes `doc.x`. The agent implements it; do not paraphrase the error messages in it.

---

## 4. Corrections to the first audit report (`REPORT.md`)

Do not carry these forward as written.

| Report item | Correction |
|---|---|
| Verdict counts | Report lists 5 Blocker, 2 "Critical", 9 Major, 3 Minor (19 findings), not "12 Major". "Critical" is not a severity level: treat AUD-06 and AUD-07 as Major unless re-verified as data-loss. |
| Section 5 coverage table | Rows sum to 654 / 534 pass / 60 fail / 35 unverified, not the stated 634 / 483 / 34 / 97. Register has 0 SPEC-QUESTION rows, not 6. Regenerate from the CSV. |
| SQ-02 (heading weight) | **Not a conflict.** DESIGN: headings Condensed 400; buttons, tabs, link lists Condensed 700. Delete. |
| SQ-03 (cookie name) | **Not a conflict.** `sw_enquiry_ref` appears in no doc. The code deviates (AUD-10 stands). Delete the SQ. |
| SQ-04 (SEO length) | Misdiagnosed. Real overruns are in `SITE-PLAN.md` section 9 itself (see D-02). Closed by D-02. |
| SQ-05 (machines) | Replaced by D-08. Possible invented seed data is a Blocker candidate, not a "keep pages accessible" case. |
| SQ-06 (CSP) | Valid gap, justification invented. Closed by D-04. |
| Section 4 input IDs | About 11 of 15 mislabelled. Use Section 2 above. |
| AUD-07 suggested fix | Do not hard-code "within 24 hours". See D-10. |
| AUD-10 regression test | Do not read an HttpOnly cookie from `document.cookie`. See D-10. |
| AUD-13 | The claim "causes animation frame drops" is unsupported; ignore it. Use the duration values `DESIGN.md` section 3 actually defines; do not invent token names. |
| AUD-05 fix | The suggested seed fallback is rejected. See D-09. |
| All PASS rows | 366 share one generic evidence string and 117 say "Found in repository". They are treated as **UNVERIFIED** until re-evidenced. |
| Missing spec questions | Resolved here: JS-off vs Turnstile (D-03), Docker (D-05), banned lists (D-01), reference numbering (D-10). Still open for the re-audit to confirm against the code: `Disallow: /api` vs `/api/og` crawlers, backup schedule UTC conversion and encryption mechanism. |
