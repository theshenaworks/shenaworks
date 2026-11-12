# Shena Works: Fix Agent Prompt and Protocol

**Setup**
1. Put `BUILD-GUIDE.md`, `DESIGN.md`, `SITE-PLAN.md`, `CONTENT.md`, `AUDIT-PROMPT.md` and `DECISIONS.md` in `docs/`, and `REPORT.md` and `REGISTER.csv` in `audit/` (plus `AGENTS.md` at the root if it exists).
2. Paste **Part A** into a fresh agent session with repo access, a shell, a browser (Playwright) and a test database (a Neon `staging` branch or a local Postgres).
3. The agent follows **Part B** for the work and **Part C** for the report.

---

## Part A: Kickoff prompt (paste this)

```
You are the fixing engineer for the Shena Works website (shenaworksltd.com). A first audit (audit/REPORT.md) found
defects, but that report contains errors. Treat every finding as a LEAD, not a fact, until you reproduce it.

Reading order (read IN FULL before changing anything)
1. AGENTS.md (if present)
2. docs/DECISIONS.md: binding owner rulings. Where it conflicts with the other docs, DECISIONS.md wins.
3. docs/BUILD-GUIDE.md, docs/DESIGN.md, docs/SITE-PLAN.md, docs/CONTENT.md
4. audit/REPORT.md and audit/REGISTER.csv, using DECISIONS.md section 4 for its known errors.
5. docs/FIX-PROMPT.md Parts B and C (this file).

Rules
- Reproduce before you fix. For every finding, run a command or test that shows the defect, paste the output, and only
  then change code. If you cannot reproduce it, mark it NOT-REPRODUCED with evidence and move on. Do not "fix" it.
- Every fix ships with a regression test that FAILS before the fix and PASSES after. Show both runs.
- Never edit the four docs or DECISIONS.md. Never weaken a test, loosen lint, add a gate exception, or hide a symptom.
- Never invent a value. Do not replace, fill in, or "tidy" any [CONFIRM: ...] value. No stock photos, fake credentials,
  fake testimonials, invented machine models, or invented service-level promises.
- Stop and ask on any new conflict between docs, any change that needs client input, and anything outside DECISIONS.md.
  Record it as a SPEC QUESTION and continue with unrelated work.
- One commit per root-cause cluster. The commit message names the finding IDs. Do not mix a refactor with a behaviour change.
- Keep a running list of "not yet checked". Do not finish until it is empty or each item is marked UNVERIFIED with a reason.
- Finish with the Part C report only. No summary of effort.
```

---

## Part B: Work protocol

### B0. Baseline (before any change)
1. Record the commit SHA. Run a clean install with the pinned Node/pnpm, then `typecheck`, `lint`, `build`, `vitest`, `playwright test`. Paste final output and every warning.
2. Build `audit/FINDINGS-TABLE.md`: one row per finding AUD-01 to AUD-19 plus AUD-20 to AUD-22 below, with columns `ID | Reproduced? (command + output) | Status`.
3. Re-evidence the register. Any PASS row whose evidence is the generic string `pnpm typecheck, vitest, playwright, static scan`, or whose note is `Found in repository`, is reset to UNVERIFIED. It becomes PASS again only with specific evidence (file:line, test name, command output).

**Additional findings to check (not in the report)**
- **AUD-20 (Blocker candidate):** read `src/seed/data.ts`. If any machine has a real make/model that `CONTENT.md` 5.2 does not give, or any machine is published, or any other `[CONFIRM]` field has been filled with an invented value, it is a Blocker. Fix per D-08.
- **AUD-21:** the report says `tests/unit/publishingGate.test.ts` passes while the gate is bypassable. Run the mutation check from `AUDIT-PROMPT.md` 2.2 on all six required test files. A test that stays green when the code is broken is a finding.
- **AUD-22:** the report's `/api/og` and `Disallow: /api` question was never answered. Check whether WhatsApp, Facebook and Google can fetch the og:image URLs.

### B1. Cluster 1: data layer (AUD-05), do this first
Why first: every conditional-rendering and gate result is meaningless while pages read static arrays.
- Implement D-09: `src/lib/payload.ts`, cached Local API helpers, tags wired to `revalidateCache`. Switch every page and `sitemap.ts` to it. Remove `src/lib/content.ts` and static content arrays.
- Make `pnpm seed` populate the test database. Tests and CI run against it.
- Regression tests: change a service title via Local API and assert the page shows it after revalidation. Unpublish a record and assert 404, absent from nav, sitemap and JSON-LD.
- Re-run the SITE-PLAN section 8 conditional-rendering matrix (AUDIT-PROMPT Phase 6) against the real database. Previous passes do not count.

### B2. Cluster 2: publishing gate (AUD-01 to 04, AUD-21, D-01, D-07)
- Implement D-07 and D-01 using the reference implementation in `DECISIONS.md` section 3 (A3).
- Attach to all content collections, LegalPages (add `versions: { drafts: true }`) and all 7 globals.
- Required tests, each red before and green after:
  1. `PATCH { _status: 'published' }` on a stored draft containing `[CONFIRM` is rejected.
  2. Editing a published record to add `[CONFIRM` or a banned word is rejected.
  3. Each of the nine banned words, in different casings, plain and inside Lexical rich text, in an array item, in alt text and in `meta.description` is rejected.
  4. Bulk publish, "Restore and publish", schedule-publish, Local API and GraphQL mutation each go through the gate.
  5. Globals reject `[CONFIRM` and banned words.
  6. Draft saves and autosave still succeed with placeholders present. Slugs such as `best-practice` do not trigger a false positive.
  7. The per-collection rules (credentials, testimonials, projects, services, team, equipment) still fire.
- Run the full gate attack matrix in AUDIT-PROMPT 3.3 against the real database and paste each HTTP result.

### B3. Cluster 3: seed integrity (AUD-20, D-08)
- Revert any invented value to its `[CONFIRM]` placeholder and set those records to draft.
- Run `pnpm seed` twice. Row counts must not change and editor changes must not be overwritten.
- Assert after a fresh seed: Architecture, BoQ, Kinoti, Nairobi, Credentials, Insights and all machines are unpublished; `proofItems` are `verified: false`; `responseTimeStatement` is null; `files.companyProfile` is null.
- List every published record that holds a `[CONFIRM`. The list must be empty.

### B4. Cluster 4: enquiry pipeline (AUD-06 to 11, D-10)
Implement each item exactly as D-10 states, in the endpoint step order of `BUILD-GUIDE.md` 7.2:
1. Rate limit with the Postgres table and the correct IP header.
2. Honeypot, then Turnstile with `remoteip`, then file validation by magic bytes.
3. Reference from a migration-created sequence (AUD-06). Test: 20 concurrent submissions give 20 unique references matching `/^SW-\d{4}-\d{4,}$/`.
4. Staff email with `Reply-To` (AUD-08). Customer acknowledgement per `SITE-PLAN.md` 7.4 using `responseTimeStatement` or "as soon as we can" (AUD-07). Plain-text part included.
5. Telegram and Resend with 5-second timeouts (AUD-09). Test: a hanging notification service still returns success and the enquiry is stored.
6. Cookie `sw_last_enquiry` per D-10 (AUD-10). `/thank-you` fires the analytics event once, and a refresh does not double-fire.
7. Work through Phase 4 scenarios 1 to 15 of the audit prompt against staging with real Resend, Turnstile test keys, R2 and Neon, and paste the results.

### B5. Cluster 5: design conformance (AUD-12 to 16)
- AUD-12: remove `rounded-full` from the consent checkbox (radius 0). Also check the arbitrary values `mt-[0.3rem] h-[2.0rem] w-[2.0rem]` against the spacing rules.
- AUD-13: replace `transition-all` with named properties and use only the durations and easings that `DESIGN.md` section 3 defines. Read DESIGN 3 first; do not invent token names.
- AUD-14: implement header hide-on-scroll-down and return on scroll-up at `lg` per `DESIGN.md` 6.3. Playwright test on the computed transform.
- AUD-15: use the counted `lockScroll()`. Test two overlapping locks released in either order.
- AUD-16: replace the three off-palette hexes in `/api/og` with `#2e2a25`, `#65615d`, `#d7d6d6`.
- Add the token-parity script from AUDIT-PROMPT 1.2 to CI.

### B6. Cluster 6: hosting, headers, SEO, JS-off (D-02 to D-05, AUD-19)
- Delete the Docker files (D-05). Add `engines: { node: ">=22", pnpm: ">=9" }` (AUD-19).
- Add the CSP behind `CSP_ENFORCE` (D-04), add the var to `.env.example`, and test on staging in report-only. Do **not** set `CSP_ENFORCE=true` yourself. Report the violations collected and ask the owner.
- Implement the D-02 length check (titles <= 65, descriptions <= 160) as a build-time test over every route. Strings from `SITE-PLAN.md` 9 stay verbatim.
- Add the D-03 `<noscript>` fallback to both enquiry forms. Test with JavaScript disabled: content and filters work, the fallback shows, nothing is broken.
- Resolve AUD-22 (og:image fetchable by crawlers). If `Disallow: /api` blocks `/api/og`, report it as a Major finding with options; do not change robots rules without asking.

### B7. Cluster 7: structure (AUD-17, AUD-18, D-06)
Only after clusters 1 to 6 are green.
- Split collections and globals into their own files. No behaviour change. The full suite must be identical before and after.
- Add a test that fails if any collection file lacks `versions` or the gate hook where required.
- Create `PhoneLink`, `WhatsAppLink`, `Pagination`, `MegaPanel`. Make them the only builders of `tel:`/`wa.me` links.
- Run the D-06 progressive-enhancement test on the four behaviour modules. Extract only on failure.

### B8. Items that need the owner's environment (report, do not fake)
Mark UNVERIFIED with the exact blocker and what the owner must supply:
- Cloudflare R2 buckets, Neon production and staging branches, Vercel production, GA4 key events marked.
- `scripts/restore-test.sh` log (acceptance criterion 8), PITR retention evidence, backup cron UTC conversion and encryption mechanism.
- Lighthouse mobile on staging: Home, a service, a project, a machine. Local Lighthouse on a production build is allowed as interim evidence.

### B9. Final re-run
Re-run every affected phase of AUDIT-PROMPT.md, then the full suite, axe on every route and state, Lighthouse and the mutation checks. Update `audit/REGISTER.csv` with specific evidence per row.

---

## Part C: Report (write `audit/FIX-REPORT.md`)

```
# Shena Works fix report
Base commit: <sha>   Final commit: <sha>   Date: <date>   Environment: staging <url>

## 1. Delta
Findings opened / closed / still open (reason) / NOT-REPRODUCED. New findings (AUD-20+).
Launch-ready: YES / NO, and why.

## 2. Per finding
ID | Reproduced (command + output) | Fix (commit) | Regression test (file::name, red run, green run) | Status

## 3. Acceptance criteria 1-10 of BUILD-GUIDE 11
One line each: PASS / FAIL / UNVERIFIED, with staging and production evidence.

## 4. Spec questions (new or remaining)
| # | Docs | Conflict or gap | Options | Recommended | Blocks |

## 5. Blocked on client input
Use the I-01 to I-15 table in DECISIONS.md section 2. For each: the feature held back and the evidence it is hidden.

## 6. Coverage
Register totals by status, computed by script from the CSV (not typed by hand).
Everything UNVERIFIED and why. Attach screenshots, HAR, Lighthouse, axe and JSON-LD outputs.
```
