#!/usr/bin/env python3
import csv
import sys

def build_register():
    rows = []
    
    def add(req_id, source, req, method, status="UNVERIFIED", evidence="", notes=""):
        rows.append({
            "ID": req_id,
            "Source (doc + section)": source,
            "Requirement (verbatim or tight paraphrase)": req,
            "Verification method (grep / unit / e2e / visual / manual / DB / network)": method,
            "Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)": status,
            "Evidence (path or command)": evidence,
            "Notes": notes
        })

    # =========================================================================
    # 1. BUILD-GUIDE 1.3: CWV Targets & F1-F20
    # =========================================================================
    add("BG-CWV-01", "BUILD-GUIDE 1.3", "Largest Contentful Paint (LCP) < 2.5 s on mobile & desktop", "e2e")
    add("BG-CWV-02", "BUILD-GUIDE 1.3", "Interaction to Next Paint (INP) < 200 ms on mobile & desktop", "e2e")
    add("BG-CWV-03", "BUILD-GUIDE 1.3", "Cumulative Layout Shift (CLS) < 0.1 on mobile & desktop", "e2e")
    add("BG-CWV-04", "BUILD-GUIDE 1.3", "Lighthouse Scores (Mobile) >= 90 across Performance, Accessibility, Best Practices and SEO on Home", "e2e")
    add("BG-CWV-05", "BUILD-GUIDE 1.3", "Lighthouse Scores (Mobile) >= 90 across Performance, Accessibility, Best Practices and SEO on Service page", "e2e")
    add("BG-CWV-06", "BUILD-GUIDE 1.3", "Lighthouse Scores (Mobile) >= 90 across Performance, Accessibility, Best Practices and SEO on Project case study", "e2e")
    add("BG-CWV-07", "BUILD-GUIDE 1.3", "Lighthouse Scores (Mobile) >= 90 across Performance, Accessibility, Best Practices and SEO on Equipment machine page", "e2e")
    add("BG-CWV-08", "BUILD-GUIDE 1.3", "Total page weight < 1.5 MB on mobile", "network")

    add("BG-F01", "BUILD-GUIDE 1.3 / F1", "Quote request form with project type, location, budget band, timeline and attachments (Must)", "e2e")
    add("BG-F02", "BUILD-GUIDE 1.3 / F2", "Equipment hire form pre-filled from the machine page (Must)", "e2e")
    add("BG-F03", "BUILD-GUIDE 1.3 / F3", "WhatsApp click-to-chat with a pre-filled message per page (Must)", "e2e")
    add("BG-F04", "BUILD-GUIDE 1.3 / F4", "Click-to-call on mobile (Must)", "e2e")
    add("BG-F05", "BUILD-GUIDE 1.3 / F5", "Enquiries stored in the database and emailed to staff within 1 minute (Must)", "unit")
    add("BG-F06", "BUILD-GUIDE 1.3 / F6", "Spam protection (honeypot plus Cloudflare Turnstile + IP rate limit) (Must)", "unit")
    add("BG-F07", "BUILD-GUIDE 1.3 / F7", "CMS for projects, equipment, posts, testimonials and credentials, with admin and editor roles (Must)", "manual")
    add("BG-F08", "BUILD-GUIDE 1.3 / F8", "Project filters by service, location and year (works with and without JS) (Must)", "e2e")
    add("BG-F09", "BUILD-GUIDE 1.3 / F9", "Per-page title, description, social image and canonical controls (Must)", "unit")
    add("BG-F10", "BUILD-GUIDE 1.3 / F10", "Automatic XML sitemap, robots.txt and JSON-LD structured data (Must)", "unit")
    add("BG-F11", "BUILD-GUIDE 1.3 / F11", "Image optimisation, modern formats (AVIF/WebP) and lazy loading (Must)", "e2e")
    add("BG-F12", "BUILD-GUIDE 1.3 / F12", "Analytics (GA4) with conversion events (Must)", "e2e")
    add("BG-F13", "BUILD-GUIDE 1.3 / F13", "Privacy notice and consent for non-essential cookies (Must)", "e2e")
    add("BG-F14", "BUILD-GUIDE 1.3 / F14", "Downloadable company profile PDF (/downloads/company-profile) (Should)", "e2e")
    add("BG-F15", "BUILD-GUIDE 1.3 / F15", "WhatsApp or Telegram notification of new enquiries (Should)", "unit")
    add("BG-F16", "BUILD-GUIDE 1.3 / F16", "Insights section with categories (Should)", "e2e")
    add("BG-F17", "BUILD-GUIDE 1.3 / F17", "Project map (geo coordinates stored now; map tab in Phase 5) (Should)", "grep")
    add("BG-F18", "BUILD-GUIDE 1.3 / F18", "Swahili version (Could / Post-launch - must NOT be half-implemented at launch)", "grep")
    add("BG-F19", "BUILD-GUIDE 1.3 / F19", "Careers and supplier registration forms (Could / Post-launch - must NOT be half-implemented)", "grep")
    add("BG-F20", "BUILD-GUIDE 1.3 / F20", "Client portal, online payments, live equipment booking (Not at launch - absent)", "grep")

    # =========================================================================
    # 2. BUILD-GUIDE 2: Repository Structure (Existence checks)
    # =========================================================================
    repo_files = [
        "AGENTS.md", "docs/DESIGN.md", "docs/SITE-PLAN.md", "docs/CONTENT.md", "docs/BUILD-GUIDE.md",
        "public/fonts/roboto-v32-latin-400.woff2", "public/fonts/roboto-v32-latin-400italic.woff2",
        "public/fonts/roboto-v32-latin-700.woff2", "public/fonts/roboto-condensed-v27-latin-400.woff2",
        "public/fonts/roboto-condensed-v27-latin-700.woff2",
        "public/brand/logo-color.svg", "public/brand/logo-white.svg", "public/brand/favicon.svg",
        "src/app/(site)/layout.tsx", "src/app/(site)/page.tsx",
        "src/app/(site)/about/page.tsx", "src/app/(site)/about/leadership/page.tsx",
        "src/app/(site)/about/credentials-and-safety/page.tsx",
        "src/app/(site)/services/page.tsx", "src/app/(site)/services/[slug]/page.tsx",
        "src/app/(site)/services/road-construction-and-earthworks/cabro-paving/page.tsx",
        "src/app/(site)/projects/page.tsx", "src/app/(site)/projects/[slug]/page.tsx",
        "src/app/(site)/equipment/page.tsx", "src/app/(site)/equipment/[category]/page.tsx",
        "src/app/(site)/equipment/[category]/[slug]/page.tsx",
        "src/app/(site)/insights/page.tsx", "src/app/(site)/insights/category/[slug]/page.tsx",
        "src/app/(site)/insights/[slug]/page.tsx",
        "src/app/(site)/locations/[slug]/page.tsx", "src/app/(site)/contact/page.tsx",
        "src/app/(site)/thank-you/page.tsx", "src/app/(site)/privacy/page.tsx",
        "src/app/(site)/cookies/page.tsx", "src/app/(site)/downloads/company-profile/route.ts",
        "src/app/(site)/not-found.tsx", "src/app/(site)/error.tsx",
        "src/app/api/enquiries/route.ts", "src/app/api/og/route.tsx", "src/app/api/health/route.ts",
        "src/app/sitemap.ts", "src/app/robots.ts",
        "src/collections/Users.ts", "src/collections/Media.ts", "src/collections/EnquiryAttachments.ts",
        "src/collections/Services.ts", "src/collections/Projects.ts", "src/collections/EquipmentCategories.ts",
        "src/collections/Equipment.ts", "src/collections/Credentials.ts", "src/collections/Team.ts",
        "src/collections/Testimonials.ts", "src/collections/PostCategories.ts", "src/collections/Posts.ts",
        "src/collections/Locations.ts", "src/collections/LegalPages.ts", "src/collections/Enquiries.ts",
        "src/globals/SiteSettings.ts", "src/globals/HomePage.ts", "src/globals/AboutPage.ts",
        "src/globals/CredentialsPage.ts", "src/globals/ServicesIndex.ts", "src/globals/ProjectsIndex.ts",
        "src/globals/EquipmentIndex.ts",
        "src/hooks/publishingGate.ts", "src/hooks/revalidateCache.ts",
        "src/components/ui/Link.tsx", "src/components/ui/Button.tsx", "src/components/ui/IconButton.tsx",
        "src/components/ui/Icon.tsx", "src/components/ui/Header.tsx", "src/components/ui/MegaPanel.tsx",
        "src/components/ui/MobileDrawer.tsx", "src/components/ui/MobileActionBar.tsx",
        "src/components/ui/SectionNav.tsx", "src/components/ui/Tabs.tsx", "src/components/ui/Field.tsx",
        "src/components/ui/Accordion.tsx", "src/components/ui/MessageBanner.tsx", "src/components/ui/Dialog.tsx",
        "src/components/ui/Carousel.tsx", "src/components/ui/Card.tsx", "src/components/ui/Timeline.tsx",
        "src/components/ui/ConsentEmbed.tsx", "src/components/ui/Table.tsx", "src/components/ui/Breadcrumb.tsx",
        "src/components/ui/Footer.tsx", "src/components/ui/Scrim.tsx", "src/components/ui/CookieBanner.tsx",
        "src/components/blocks/HomeHero.tsx", "src/components/blocks/PageHero.tsx",
        "src/components/blocks/PageHeader.tsx", "src/components/blocks/IntentSelector.tsx",
        "src/components/blocks/ProofBar.tsx", "src/components/blocks/SectionIntro.tsx",
        "src/components/blocks/ServiceGrid.tsx", "src/components/blocks/FeatureSplit.tsx",
        "src/components/blocks/StatementBlock.tsx", "src/components/blocks/ProjectGrid.tsx",
        "src/components/blocks/EquipmentTeaser.tsx", "src/components/blocks/WhyShena.tsx",
        "src/components/blocks/TestimonialBlock.tsx", "src/components/blocks/InsightsRow.tsx",
        "src/components/blocks/LocationsBand.tsx", "src/components/blocks/KeyFacts.tsx",
        "src/components/blocks/ScopeList.tsx", "src/components/blocks/ProcessSteps.tsx",
        "src/components/blocks/FaqAccordion.tsx", "src/components/blocks/Gallery.tsx",
        "src/components/blocks/ContactAside.tsx", "src/components/blocks/EnquiryForm.tsx",
        "src/components/blocks/CredentialTable.tsx", "src/components/blocks/DownloadCard.tsx",
        "src/components/blocks/Prose.tsx", "src/components/blocks/SubNavPanel.tsx",
        "src/components/blocks/MapBlock.tsx", "src/components/blocks/CtaBand.tsx",
        "src/components/blocks/EmptyState.tsx",
        "src/behaviors/index.ts", "src/behaviors/scrollState.ts", "src/behaviors/scrollLock.ts",
        "src/behaviors/menus.ts", "src/behaviors/drawer.ts", "src/behaviors/disclosure.ts",
        "src/behaviors/dialog.ts", "src/behaviors/carousel.ts", "src/behaviors/reveal.ts",
        "src/lib/payload.ts", "src/lib/validation/enquiry.ts", "src/lib/seo/jsonld.ts",
        "src/lib/seo/metadata.ts", "src/lib/notifications/email.ts", "src/lib/notifications/telegram.ts",
        "src/lib/analytics.ts", "src/lib/whatsapp.ts",
        "src/seed/index.ts", "src/styles/globals.css",
        "payload.config.ts", "next.config.ts", "Dockerfile", "docker-compose.yml", ".env.example",
        "scripts/backup-db.sh", "scripts/restore-test.sh"
    ]
    for idx, path in enumerate(repo_files, 1):
        add(f"BG-TREE-{idx:03d}", "BUILD-GUIDE 2", f"File exists in repository: {path}", "grep")

    # =========================================================================
    # 3. BUILD-GUIDE 3-9: Architecture, Schema, Gate, Pipelines, SEO, Security
    # =========================================================================
    add("BG-CSS-01", "BUILD-GUIDE 3.1", "globals.css maps @theme tokens 1:1 to DESIGN 10.1 tokens", "grep")
    add("BG-CSS-02", "BUILD-GUIDE 3.1", "Root scaling font-size: 62.5% up to 1499px, fluid font-size: .666667vw from 1500px", "grep")
    add("BG-CSS-03", "BUILD-GUIDE 3.1", "--spacing: 0.4rem set so space-N = N * 4px", "grep")
    add("BG-CSS-04", "BUILD-GUIDE 3.1", "--radius-*: initial set so border-radius is 0 everywhere except radio 50%", "grep")
    add("BG-FONT-01", "BUILD-GUIDE 3.2", "Self-hosted fonts: 5 WOFF2 files in public/fonts/ (roboto 400, 400i, 700; roboto-condensed 400, 700)", "grep")
    add("BG-FONT-02", "BUILD-GUIDE 3.2", "@font-face rules specify local() first and font-display: swap", "grep")
    add("BG-FONT-03", "BUILD-GUIDE 3.2", "Preload roboto-v32-latin-400.woff2 and roboto-condensed-v27-latin-700.woff2 in layout.tsx", "grep")
    add("BG-ARCH-01", "BUILD-GUIDE 4.1", "Server-render all HTML; readable and navigable with JavaScript disabled", "e2e")
    add("BG-ARCH-02", "BUILD-GUIDE 4.1", "Inline script in head sets document.documentElement.setAttribute('data-js', '')", "grep")
    add("BG-ARCH-03", "BUILD-GUIDE 4.1", "<BehaviorProvider /> mounted in layout.tsx calling initBehaviors and teardown", "grep")
    add("BG-ARCH-04", "BUILD-GUIDE 4.1", "Each behavior module in src/behaviors/ wraps init in try/catch block", "grep")
    add("BG-ARCH-05", "BUILD-GUIDE 4.2", ".site-grid defined with 16 columns from lg, col-content 2-15, max-width none above 1500px", "grep")
    add("BG-DB-01", "BUILD-GUIDE 5.0", "NeonDB runtime queries use pooled connection string (DATABASE_URI with -pooler)", "grep")
    add("BG-DB-02", "BUILD-GUIDE 5.0", "NeonDB schema migrations use direct unpooled connection string (DIRECT_DATABASE_URI) when PAYLOAD_MIGRATING=true", "grep")
    add("BG-DB-03", "BUILD-GUIDE 5.0", "postgresAdapter config sets push: false (always versioned migrations)", "grep")
    add("BG-AUTH-01", "BUILD-GUIDE 5.1", "Users collection specifies role: 'admin' | 'editor'", "grep")
    add("BG-AUTH-02", "BUILD-GUIDE 5.1", "Admin can manage users, globals, credentials, site settings and delete enquiries", "manual")
    add("BG-AUTH-03", "BUILD-GUIDE 5.1", "Editor can create, edit, publish Projects, Equipment, Posts, Testimonials, Services, Locations, update Enquiry status", "manual")
    add("BG-AUTH-04", "BUILD-GUIDE 5.1", "Payload auth lockout configured: maxLoginAttempts: 5, lockTime: 600000", "grep")
    add("BG-AUTH-05", "BUILD-GUIDE 5.1", "TOTP two-factor authentication plugin configured for admin accounts", "grep")
    add("BG-CMS-01", "BUILD-GUIDE 5.2", "All content collections enable versions: { drafts: true }", "grep")

    # Collection field specs
    add("BG-COL-MEDIA", "BUILD-GUIDE 5.2.1", "Media collection: alt (req), caption (req), credit (opt), imageSizes: square (800x800 webp), card (960x720 webp), wide (1600x900 webp), og (1200x630 jpeg)", "grep")
    add("BG-COL-ENQATT", "BUILD-GUIDE 5.2.2", "EnquiryAttachments: stored in private/enquiries/, mimeTypes pdf, jpeg, png, webp, max 10MB, authenticated admin/editor only", "grep")
    add("BG-COL-SERV", "BUILD-GUIDE 5.2.3", "Services collection: fields title, shortTitle, slug (req, unique), parent, group (select 3), order, requiresRegistration, registeredProfessionalName, registrationBodyAndNumber, heroImage, heroHeadline, heroLead, summary (max 160), keyFacts (min 3, max 6), intro, scope (min 4), process (4), faqs (4-6), equipment, relatedProjects, formType, ctaLabel, formHeading, formIntro, primaryKeyword, SEO fields", "grep")
    add("BG-COL-PROJ", "BUILD-GUIDE 5.2.4", "Projects collection: title, slug (req, unique), featured, services, location (town, county, lat, lng), clientType (select 6), year, status (Completed/In progress), role (req), deliveringCompany (req), verificationEvidenceNote (req to publish), heroImage, brief, work, result, keyFigures, showValueBand, valueBand, gallery (min 3 upload->media), equipmentUsed, testimonial, contactPerson, SEO fields", "grep")
    add("BG-COL-EQCAT", "BUILD-GUIDE 5.2.5", "EquipmentCategories: name, singular, article ('a'|'an'), slug (unique), order, heroImage, heroHeadline, heroLead, summary, intro, uses (min 3), faqs, primaryKeyword, SEO fields", "grep")
    add("BG-COL-EQ", "BUILD-GUIDE 5.2.6", "Equipment: name, slug (unique), category, featured, make, model, year, capacity, specs, owningEntity (default Shena Works Limited), uses (min 3), hireTerms group, availability ('available'|'on_hire'), images (min 1 upload->media), SEO fields", "grep")
    add("BG-COL-CRED", "BUILD-GUIDE 5.2.7", "Credentials: name, issuer, number, category, validUntil (nullable if isPerpetual=true), isPerpetual, certificateFile (req to publish), holder, order", "grep")
    add("BG-COL-TEAM", "BUILD-GUIDE 5.2.8", "Team: name, slug (unique), role, summary, portrait, bio, experience, areasOfWork, phone, email, linkedinUrl, ebkRegNumber (req if Eng. or Engineer)", "grep")
    add("BG-COL-TEST", "BUILD-GUIDE 5.2.9", "Testimonials: quote, person, title, organisation, date (req to publish), project, services, isPublicOfficial (default false), permissionFile (req to publish)", "grep")
    add("BG-COL-POST", "BUILD-GUIDE 5.2.10", "PostCategories & Posts: title, slug (unique), excerpt (max 160), category, author, publishedDate, readingTimeMinutes (auto calculated), coverImage, body, relatedService, SEO fields", "grep")
    add("BG-COL-LOC", "BUILD-GUIDE 5.2.11", "Locations: town, county, slug (unique), heroImage, heroHeadline, heroLead, address, phone, email, hours, directionsUrl, mapEmbedUrl, geo (lat, lng), intro, faqs, SEO fields", "grep")
    add("BG-COL-ENQ", "BUILD-GUIDE 5.2.12", "Enquiries: access.create false over REST/GraphQL, reference (unique, indexed, SW-YYYY-NNNN), type, name, phone, email, organisation, service, equipment, hireStart, hireDuration, location, budgetBand, timeline, message, attachments, consentAcceptedAt, sourcePage, utm, status, assignedTo, internalNotes", "grep")

    # Globals
    add("BG-GLO-01", "BUILD-GUIDE 5.2", "Globals defined: SiteSettings, HomePage, AboutPage, CredentialsPage, ServicesIndex, ProjectsIndex, EquipmentIndex", "grep")

    # Publishing gate hook
    add("BG-GATE-01", "BUILD-GUIDE 5.3", "enforcePublishingGate attached to beforeChange on every draft-enabled collection and global", "grep")
    add("BG-GATE-02", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks publish if serialized data contains [CONFIRM", "unit")
    add("BG-GATE-03", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks publish if serialized data contains forbidden superlatives", "unit")
    add("BG-GATE-04", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks credentials without certificateFile or (validUntil and !isPerpetual)", "unit")
    add("BG-GATE-05", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks testimonials without permissionFile, date, person, or title", "unit")
    add("BG-GATE-06", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks projects without role, deliveringCompany, verificationEvidenceNote, or gallery < 3", "unit")
    add("BG-GATE-07", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks services with requiresRegistration without registeredProfessionalName & registrationBodyAndNumber", "unit")
    add("BG-GATE-08", "BUILD-GUIDE 5.3", "enforcePublishingGate blocks team member with Eng. or Civil Engineer without ebkRegNumber", "unit")

    # Media & R2
    add("BG-MED-01", "BUILD-GUIDE 6", "Payload storage-s3 configured with R2_PUBLIC_BUCKET mapped to https://media.shenaworksltd.com with Cache-Control: public, max-age=31536000, immutable", "grep")
    add("BG-MED-02", "BUILD-GUIDE 6", "Payload storage-s3 configured with R2_PRIVATE_BUCKET (no public read) for enquiry-attachments", "grep")
    add("BG-MED-03", "BUILD-GUIDE 6", "next.config.ts images.remotePatterns allows media.shenaworksltd.com and enables formats: ['image/avif', 'image/webp']", "grep")
    add("BG-MED-04", "BUILD-GUIDE 6", "Art-directed heroes (HomeHero, PageHero) render <picture> with wideWebp 1600x900 and squareWebp 800x800 fetchPriority='high'", "grep")
    add("BG-MED-05", "BUILD-GUIDE 6", "Lazy images below fold use loading='lazy' on grey-100 placeholder and fade opacity 0->1 in 200ms", "grep")

    # Enquiries pipeline
    add("BG-ENQ-01", "BUILD-GUIDE 7.1", "normalizeKenyanPhone normalises 07xx, 01xx, +254, 254 to E.164 (+2547..., +2541...); international E.164 valid; invalid returns null", "unit")
    add("BG-ENQ-02", "BUILD-GUIDE 7.1", "enquirySchema Zod schema enforces exact field types, limits and validation error messages", "unit")
    add("BG-ENQ-03", "BUILD-GUIDE 7.1", "enquirySchema superRefine requires service for project/consultation, machine/dates for hire, location for project/hire, message >= 10 for non-hire", "unit")
    add("BG-ENQ-04", "BUILD-GUIDE 7.2", "Rate limiter enforces max 5 submissions per 15 minutes per IP returning HTTP 429", "unit")
    add("BG-ENQ-05", "BUILD-GUIDE 7.2", "Honeypot company_website returns fake 200 redirect to /thank-you without storing or emailing", "unit")
    add("BG-ENQ-06", "BUILD-GUIDE 7.2", "Cloudflare Turnstile verified server-side with TURNSTILE_SECRET_KEY, response and remoteip", "unit")
    add("BG-ENQ-07", "BUILD-GUIDE 7.2", "File validation inspects magic bytes for PDF, JPEG, PNG, WEBP; max 3 files <= 10MB each uploaded to enquiry-attachments via Local API", "unit")
    add("BG-ENQ-08", "BUILD-GUIDE 7.2", "Sequential reference SW-YYYY-NNNN generated using Postgres sequence enquiry_ref_seq START 101", "unit")
    add("BG-ENQ-09", "BUILD-GUIDE 7.2", "Enquiry record created in database via payload.create Local API", "unit")
    add("BG-ENQ-10", "BUILD-GUIDE 7.2", "Staff email sent via Resend with Reply-To set to visitor's email; 5s timeout", "unit")
    add("BG-ENQ-11", "BUILD-GUIDE 7.2", "Optional Telegram notification sent if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID set", "unit")
    add("BG-ENQ-12", "BUILD-GUIDE 7.2", "Customer acknowledgement email sent via Resend if email provided", "unit")
    add("BG-ENQ-13", "BUILD-GUIDE 7.2", "Sets sw_last_enquiry cookie HttpOnly, SameSite=Lax, 5 min with {ref, type, service, equipment, sourcePage} and 303 redirect or JSON {redirectUrl, ref}", "unit")

    # SEO, JSON-LD, OG, Redirects, GA4
    add("BG-SEO-01", "BUILD-GUIDE 8.1", "sitemap.ts queries published records, omits credentials if 0, omits insights if 0, absolute canonical URLs", "unit")
    add("BG-SEO-02", "BUILD-GUIDE 8.1", "robots.ts allows /, disallows /admin, /api, /thank-you, references sitemap.xml", "unit")
    add("BG-SEO-03", "BUILD-GUIDE 8.2", "8 legacy redirects in next.config.ts configured with permanent: true (308)", "unit")
    add("BG-SEO-04", "BUILD-GUIDE 8.3", "buildOrganizationJsonLd produces Organization + GeneralContractor with @id #organization", "unit")
    add("BG-SEO-05", "BUILD-GUIDE 8.3", "Review JSON-LD output only when permissionFile is present AND isPublicOfficial === false", "unit")
    add("BG-SEO-06", "BUILD-GUIDE 8.4", "/api/og renders 1200x630 OG image with ink-900 bg, 8px murram bar, white logo, overline, title in Roboto Condensed 700 uppercase, footer bar", "unit")
    add("BG-SEO-07", "BUILD-GUIDE 8.5", "GA4 script does not load until sw_consent=analytics cookie is set", "e2e")
    add("BG-SEO-08", "BUILD-GUIDE 8.5", "trackEvent handles 10 events with exact names and parameters, no-op without consent", "unit")

    # Security & Tests & Deployment
    add("BG-SEC-01", "BUILD-GUIDE 9.1", "Security headers in next.config.ts: HSTS (max-age=63072000; includeSubDomains; preload), nosniff, XFO DENY, Referrer-Policy, Permissions-Policy", "grep")
    add("BG-TEST-01", "BUILD-GUIDE 9.2", "Unit test file exists and passes: tests/unit/phone.test.ts", "unit")
    add("BG-TEST-02", "BUILD-GUIDE 9.2", "Unit test file exists and passes: tests/unit/publishingGate.test.ts", "unit")
    add("BG-TEST-03", "BUILD-GUIDE 9.2", "E2E test file exists and passes: tests/e2e/ChromeAndA11y.spec.ts", "e2e")
    add("BG-TEST-04", "BUILD-GUIDE 9.2", "E2E test file exists and passes: tests/e2e/EnquiryFlows.spec.ts", "e2e")
    add("BG-TEST-05", "BUILD-GUIDE 9.2", "E2E test file exists and passes: tests/e2e/ProjectFilters.spec.ts", "e2e")
    add("BG-TEST-06", "BUILD-GUIDE 9.2", "E2E test file exists and passes: tests/e2e/ReducedMotion.spec.ts", "e2e")
    add("BG-OPS-01", "BUILD-GUIDE 9.3", "Daily backup script scripts/backup-db.sh runs pg_dump direct, uploads encrypted dump to R2 backup bucket with 30-day lifecycle", "manual")
    add("BG-OPS-02", "BUILD-GUIDE 9.3", "Restore test script scripts/restore-test.sh restores dump to test DB, verifies row counts and cleans up", "manual")
    add("BG-OPS-03", "BUILD-GUIDE 9.4", ".env.example contains all required environment variables without real secrets", "grep")

    # Milestones M1-M6
    add("BG-M1", "BUILD-GUIDE 10", "M1 Foundation & Design System exit gate verified", "unit")
    add("BG-M2", "BUILD-GUIDE 10", "M2 Payload CMS 3 & Seed Data exit gate verified", "unit")
    add("BG-M3", "BUILD-GUIDE 10", "M3 Global Chrome & Core Pages exit gate verified", "e2e")
    add("BG-M4", "BUILD-GUIDE 10", "M4 Projects, Equipment, Locations & Insights exit gate verified", "e2e")
    add("BG-M5", "BUILD-GUIDE 10", "M5 Enquiries Pipeline, SEO & Analytics exit gate verified", "e2e")
    add("BG-M6", "BUILD-GUIDE 10", "M6 QA, Accessibility, Vercel Deployment & Handover exit gate verified", "e2e")

    # Launch Acceptance Criteria 1-10
    add("BG-AC-01", "BUILD-GUIDE 11.1", "Acceptance criterion 1: Every Must requirement (F1-F13) passes automated and manual testing", "manual")
    add("BG-AC-02", "BUILD-GUIDE 11.2", "Acceptance criterion 2: Performance targets (LCP < 2.5s, INP < 200ms, CLS < 0.1, Mobile LH >= 90 x4, weight < 1.5MB) met", "e2e")
    add("BG-AC-03", "BUILD-GUIDE 11.3", "Acceptance criterion 3: Quote and hire forms store enquiry in NeonDB, email staff within 1 min, reject honeypot/Turnstile spam", "unit")
    add("BG-AC-04", "BUILD-GUIDE 11.4", "Acceptance criterion 4: Structured data validates with zero errors and sitemap submitted", "unit")
    add("BG-AC-05", "BUILD-GUIDE 11.5", "Acceptance criterion 5: Every legacy URL redirects (308) to a live page", "unit")
    add("BG-AC-06", "BUILD-GUIDE 11.6", "Acceptance criterion 6: Consent-gated GA4 conversion events fire only after consent and never without consent", "e2e")
    add("BG-AC-07", "BUILD-GUIDE 11.7", "Acceptance criterion 7: Privacy notice, cookie notice and cookie banner live", "e2e")
    add("BG-AC-08", "BUILD-GUIDE 11.8", "Acceptance criterion 8: NeonDB + Cloudflare R2 backup restored and verified in test (scripts/restore-test.sh log)", "manual")
    add("BG-AC-09", "BUILD-GUIDE 11.9", "Acceptance criterion 9: Shena Works staff (editor role) can publish Project and Equipment machine unaided in /admin", "manual")
    add("BG-AC-10", "BUILD-GUIDE 11.10", "Acceptance criterion 10: Every published claim, credential, project and testimonial passes enforcePublishingGate with zero [CONFIRM or superlatives", "unit")

    # =========================================================================
    # 4. DESIGN.md: Principles, Tokens, States, Components, Behaviors
    # =========================================================================
    add("DES-PRIN-01", "DESIGN 1", "Signal, not decoration: Murram accent marks what is interactive, selected, or in progress only", "visual")
    add("DES-PRIN-02", "DESIGN 1", "Warm, flat, square: Warm charcoal on white. Radius is 0. Lines are 2px", "visual")
    add("DES-PRIN-03", "DESIGN 1", "Type carries hierarchy: Uppercase condensed headings and labels over neutral humanist body", "visual")
    add("DES-PRIN-04", "DESIGN 1", "Motion explains change: Underlines draw, images wipe, panels slide. Everything decelerates. Nothing bounces", "visual")
    add("DES-PRIN-05", "DESIGN 1", "Hover and focus are siblings: Every pointer affordance has a keyboard twin, focus ring always visible", "visual")
    add("DES-PRIN-06", "DESIGN 1", "Works before it moves: Content readable without JS, usable by keyboard, calm under reduced motion", "e2e")

    # Palette
    color_tokens = [
        ("accent-500", "#c14a12"), ("accent-600", "#963a12"), ("accent-700", "#7a3214"), ("accent-on-dark", "#ff8f50"),
        ("ink-975", "#1a1713"), ("ink-950", "#221f1b"), ("ink-900", "#2e2a25"), ("ink-850", "#312e2a"),
        ("ink-800", "#3e3935"), ("ink-600", "#65615d"), ("grey-600", "#767676"), ("grey-500", "#9ea1a2"),
        ("grey-400", "#bdbbbb"), ("grey-300", "#d7d6d6"), ("grey-100", "#ebebea"), ("white", "#ffffff"),
        ("error", "#9d1c30"), ("error-tint", "#fdf1f2"), ("success", "#1d6b45"), ("success-tint", "#eef7f1"),
        ("warning", "#7a4f00"), ("warning-tint", "#fbf4e4")
    ]
    for name, hexval in color_tokens:
        add(f"DES-COL-{name.upper()}", "DESIGN 2.1", f"Color token --{name} equals {hexval}", "grep")

    add("DES-COL-RULE01", "DESIGN 2.1", "Pure black (#000) not used except in print stylesheet", "grep")
    add("DES-COL-RULE02", "DESIGN 2.1", "accent-500 text never placed on ink-900 (2.89:1 fails AA); accent-on-dark used on dark surfaces", "grep")
    add("DES-COL-RULE03", "DESIGN 2.1", "white text never placed on grey-400 (1.91:1 fails AA)", "grep")
    add("DES-COL-RULE04", "DESIGN 2.1", "Status color is for messages and validation only, always paired with icon and text", "visual")
    add("DES-SURF-01", "DESIGN 2.1", "Surfaces contextual tokens: default, subtle, dark, deep, accent, photo flip rules and focus ring", "grep")

    # Typography
    add("DES-TYP-01", "DESIGN 2.2", "Families: font-header is Roboto Condensed, font-body is Roboto, font-mono is system monospace", "grep")
    add("DES-TYP-02", "DESIGN 2.2", "Font weights are 400 and 700 only; no 300/500/600/800/900; no Condensed italic", "grep")
    add("DES-TYP-03", "DESIGN 2.2", "Headings are weight 400, uppercase via CSS text-transform: uppercase (not typed capitals)", "grep")
    add("DES-TYP-04", "DESIGN 2.2", "Headings display to h3 use -0.007em letter tracking from lg up", "grep")
    add("DES-TYP-05", "DESIGN 2.2", "Buttons, tabs, link lists and labels use Condensed weight 700 with uppercase", "grep")
    add("DES-TYP-06", "DESIGN 2.2", "Prose inline links: bold (700), no text-decoration, 2px underline drawn by background gradient, retracts on hover", "grep")
    add("DES-TYP-07", "DESIGN 2.2", "Prose rhythm: paragraph gap 1em, h2/h3 bottom margin 24px, hr 2px grey-300 with 56px margins, lists 28px left pad with 6px item pad and accent-500 square markers", "grep")
    add("DES-TYP-08", "DESIGN 2.2", "Blockquote: mt 46.7px (first) / 110px (after content), mb 64px, quote glyph 28x22.7px accent-500", "grep")
    add("DES-TYP-09", "DESIGN 2.2", "Max line length 75ch on body text", "grep")

    # Spacing, layout, sizing
    add("DES-SPC-01", "DESIGN 2.3", "Root font-size: 62.5% (1rem = 10px), fluid font-size: .666667vw from 1500px", "grep")
    add("DES-SPC-02", "DESIGN 2.3", "Spacing scale: space-1 (4px) to space-70 (280px), all multiples of 4px", "grep")
    add("DES-SPC-03", "DESIGN 2.3", "Section rhythm: Standard 64px (<lg) / 80px (>=lg); Spacious 80px (<lg) / 120px (>=lg)", "grep")
    add("DES-SPC-04", "DESIGN 2.3", "Container max-width and gutters: md 768/24, lg 1024/24, xl 1160/56, 2xl fluid/56", "grep")
    add("DES-SPC-05", "DESIGN 2.3", "Grid: 16 columns at lg (32px column gap); content frame in columns 2-15 (col-content 2/span 14)", "grep")
    add("DES-SPC-06", "DESIGN 2.3", "Mobile header bar 52px; desktop header 128px (secondary 40px + primary 88px)", "grep")
    add("DES-SPC-07", "DESIGN 2.3", "Header logo: 40x139.2px (<xl), 48x167px (>=xl); Footer logo: 48x215px", "grep")
    add("DES-SPC-08", "DESIGN 2.3", "Hero min-height: 560px (<lg) / 720px (>=lg)", "grep")
    add("DES-SPC-09", "DESIGN 2.3", "Touch target minimum 44x44px hit area on coarse pointers without changing visual size", "visual")
    add("DES-SPC-10", "DESIGN 2.3", "Field height 48px; Arrow/icon button 48x48px (dense 40x40px)", "grep")
    add("DES-SPC-11", "DESIGN 2.3", "Z-index layers: base 0, raised 10-16, sticky 20, scrim 25, header 30, drawer 40, dialog 50, skip/toast 60", "grep")

    # Shape & Elevation & Icons & Images
    add("DES-SHP-01", "DESIGN 2.4", "Radius is 0 everywhere; 50% only on radio controls and spinner rings", "grep")
    add("DES-SHP-02", "DESIGN 2.4", "Signature line is 2px for rules, underlines, control borders, outlines, progress", "grep")
    add("DES-SHP-03", "DESIGN 2.4", "Elevation: 0 none, 1 drop-shadow(0 2px 8px shade/.10), 2 drop-shadow(0 8px 24px shade/.16)", "grep")
    add("DES-ICO-01", "DESIGN 2.5", "Iconography: 24px grid, 2px stroke, square caps, mitered joins, currentColor, stroke only (no fills except play)", "grep")
    add("DES-ICO-02", "DESIGN 2.5", "Chevron rotates 180deg when aria-expanded='true' (200ms ease-out-cubic)", "visual")
    add("DES-ICO-03", "DESIGN 2.5", "Separator slash is 2x17px bar in currentColor, skewed -27.5deg, 12px side margins", "grep")
    add("DES-IMG-01", "DESIGN 2.6", "Image loading placeholder grey-100 until decoded; lazy images fade opacity 0->1 in 200ms", "e2e")
    add("DES-IMG-02", "DESIGN 2.6", "Art direction: two picture sources (portrait/square crop below lg, landscape crop from lg)", "grep")
    add("DES-IMG-03", "DESIGN 2.6", "Text on photography always over shade gradient, never over raw image", "visual")
    add("DES-IMG-04", "DESIGN 2.6", "Every image has real alt text and figcaption caption (mt 24px)", "grep")

    # Motion tokens & rules
    add("DES-MOT-01", "DESIGN 3.1", "Motion decelerates: every movement eases out, no spring, overshoot, or bounce", "visual")
    add("DES-MOT-02", "DESIGN 3.1", "Two paces: 200ms for feedback, 500ms-1s for atmosphere. Exits faster than entrances", "visual")
    add("DES-MOT-03", "DESIGN 3.1", "Cheap properties: motion uses transform, opacity, clip-path, background-size; no top/left/margin/box-shadow", "grep")
    add("DES-MOT-04", "DESIGN 3.1", "Visibility is stepped: visibility: hidden delayed until fade completes", "grep")
    add("DES-MOT-05", "DESIGN 3.1", "Hover intent: menus wait 200ms before closing", "e2e")
    add("DES-MOT-06", "DESIGN 3.2", "Easing tokens: ease-out-cubic, ease-out-expo, ease-in-out-cubic, ease-out-quad, ease-out-quart, linear", "grep")
    add("DES-MOT-07", "DESIGN 3.2", "Duration tokens: dur-fast (200ms), dur-medium (400ms), dur-slow (500ms), dur-wipe (750ms), dur-hero (1s), dur-autoplay (5s)", "grep")
    add("DES-MOT-08", "DESIGN 3.2", "Delay tokens: delay-intent (200ms), delay-settle (200ms), delay-stagger (100ms), delay-callout (250ms)", "grep")

    # Choreography catalog
    add("DES-CHO-01", "DESIGN 3.3 A", "Underline draw: enters from left, leaves to right (200ms ease-in-out-cubic)", "visual")
    add("DES-CHO-02", "DESIGN 3.3 A", "Underline held on aria-current='page' or aria-expanded='true'; hover retracts or changes text", "visual")
    add("DES-CHO-03", "DESIGN 3.3 A", "Swipe fill grows left to right over 200ms ease-in-out-cubic to hover fill", "visual")
    add("DES-CHO-04", "DESIGN 3.3 A", "Pressed fill is two steps darker, instant (0ms transition)", "visual")
    add("DES-CHO-05", "DESIGN 3.3 B", "Scrim: 500ms fade in; 200ms delay + 500ms fade out with visibility delayed 500ms", "visual")
    add("DES-CHO-06", "DESIGN 3.3 B", "Desktop header hides on scroll-down (translate3d(0,-100%,0), 400ms ease-out-cubic)", "e2e")
    add("DES-CHO-07", "DESIGN 3.3 B", "Desktop header returns white with elevation 1 on scroll-up", "e2e")
    add("DES-CHO-08", "DESIGN 3.3 B", "Mobile drawer slides in translateY(0) in 200ms ease-out-cubic; closed translateY(calc(-100dvh + 5.2rem))", "e2e")
    add("DES-CHO-09", "DESIGN 3.3 B", "Multi-level menu slides horizontally (level 0: 0, level 1: -100%, level 2: -200%, 200ms)", "e2e")
    add("DES-CHO-10", "DESIGN 3.3 B", "Desktop mega panel opens instantly; closes with opacity 200ms after 200ms delay", "e2e")
    add("DES-CHO-11", "DESIGN 3.3 C", "Accordion panel animates height between measured pixel values in 200ms ease-out-quad", "e2e")
    add("DES-CHO-12", "DESIGN 3.3 D", "Reveal on scroll: opacity 0, translateY(24px) -> opacity 1, transform: none (500ms ease-out-cubic, 100ms stagger up to 5)", "e2e")
    add("DES-CHO-13", "DESIGN 3.3 D", "Hero settle: opacity 0, scale(1.1) -> opacity 1, scale(1) (1s ease-out-expo, 200ms delay)", "visual")
    add("DES-CHO-14", "DESIGN 3.3 E", "Image wipes via clip-path: outgoing slide wipes away in direction of travel, incoming instant beneath", "visual")
    add("DES-CHO-15", "DESIGN 3.3 F", "Carousel progress bullets: track grey-300, fill accent-500, active bullet fills 5s linear with autoplay", "e2e")
    add("DES-CHO-16", "DESIGN 3.3 G", "Dialog panel enters opacity 0, translateY(24px) -> 1, 0 (400ms ease-out-cubic); exits 200ms", "e2e")
    add("DES-CHO-17", "DESIGN 3.3 G", "Spinner: 2px ring, 25% arc in currentColor, 800ms linear rotate(360deg)", "visual")
    add("DES-CHO-18", "DESIGN 3.3 G", "Skeleton: grey-100 block pulsing opacity .5 <-> 1 over 1.2s ease-in-out-cubic", "visual")
    add("DES-CHO-19", "DESIGN 3.3 I", "Timeline progress fill is scroll-linked from top as viewport center passes each entry; no fixed bg attachment", "visual")

    # Reduced motion
    add("DES-RED-01", "DESIGN 3.4", "prefers-reduced-motion: reduce: transition-duration 0s, animation-duration .001ms, scroll-behavior: auto", "grep")
    add("DES-RED-02", "DESIGN 3.4", "prefers-reduced-motion: reveals visible on load with no translate or stagger", "e2e")
    add("DES-RED-03", "DESIGN 3.4", "prefers-reduced-motion: carousel autoplay does not start; poster shown with visible play control", "e2e")
    add("DES-RED-04", "DESIGN 3.4", "prefers-reduced-motion: timeline static, fully filled", "e2e")
    add("DES-RED-05", "DESIGN 3.4", "prefers-reduced-motion: spinner replaced by opacity pulse (1.2s) with text Loading", "visual")
    add("DES-RED-06", "DESIGN 3.4", "Script-driven motion checks window.matchMedia('(prefers-reduced-motion: reduce)')", "grep")

    # State system
    add("DES-STA-01", "DESIGN 4.1", "State system implements default, hover (@media hover: hover), focus-visible, pressed, selected/current, expanded, disabled, read-only, loading, invalid, success, empty, visited", "visual")
    add("DES-STA-02", "DESIGN 4.1", "Visited link appearance is identical to default (brand links do not recolor)", "visual")
    add("DES-STA-03", "DESIGN 4.2", "State precedence: disabled > pressed > invalid > selected/current > hover > default; focus ring orthogonal", "visual")
    add("DES-STA-04", "DESIGN 4.3", "Focus ring: 2px solid accent-500 with outline-offset: 2px (white on dark/accent/photo surfaces)", "grep")
    add("DES-STA-05", "DESIGN 4.3", "No outline: 0 or outline: none without adjacent :focus-visible replacement", "grep")
    add("DES-STA-06", "DESIGN 4.3", "Skip link: fixed top-left, z 60, ink-900 surface, white label text, visible only on focus", "e2e")
    add("DES-STA-07", "DESIGN 4.4", "Target size: 44x44px minimum hit area on coarse pointers without changing visual size", "visual")
    add("DES-STA-08", "DESIGN 4.5", "State vocabulary uses standard ARIA attributes and designated data-* attributes", "grep")

    # Components 25 primitives
    components = [
        "Link", "Button", "IconButton", "Header", "MegaPanel", "MobileDrawer", "SectionNav",
        "Tabs", "Field", "TextField", "Select", "CheckboxRadio", "Accordion", "MessageBanner",
        "Dialog", "Carousel", "Card", "Timeline", "Media", "Prose", "Table", "Hero",
        "EmptyState", "Loading", "Breadcrumb", "Footer", "Scrim"
    ]
    for c in components:
        add(f"DES-CMP-{c.upper()}", "DESIGN 5", f"Component {c} implemented with spec props, states, ARIA and keyboard", "visual")

    # Behaviors 6.1 - 6.15
    add("DES-BEH-01", "DESIGN 6.1", "Scroll state: data-scrolled set at scrollY > 8, data-scroll-dir flips after 8px travel in direction", "e2e")
    add("DES-BEH-02", "DESIGN 6.2", "Scroll lock: counted locks for page/scrim, prevents layout shift via padding-right scrollbar compensation", "e2e")
    add("DES-BEH-03", "DESIGN 6.3", "Desktop header: hides on scroll down, returns white with elevation 1 on scroll up, reveals on focus-within", "e2e")
    add("DES-BEH-04", "DESIGN 6.4", "Desktop menus: 200ms hover intent delay before closing, Escape returns focus to trigger, ArrowDown enters panel", "e2e")
    add("DES-BEH-05", "DESIGN 6.5", "Mobile drawer: focus trapped, background inert, Escape returns focus to toggle, crossing lg resets", "e2e")
    add("DES-BEH-06", "DESIGN 6.6", "Tabs: roving tabindex, ArrowRight/Left moves focus and selects tab, Tab moves into active panel", "e2e")
    add("DES-BEH-07", "DESIGN 6.6", "Accordion: Enter/Space toggles, panels toggle via hidden and aria-expanded", "e2e")
    add("DES-BEH-08", "DESIGN 6.7", "Dialog: stores opener, moves focus inside, cycles Tab, Escape/scrim dismisses, returns focus to opener", "e2e")
    add("DES-BEH-09", "DESIGN 6.8", "Carousel: step is slide width + 16px gap, active slide at >=60% visibility, 5s autoplay with pause control and hover/focus pause", "e2e")
    add("DES-BEH-10", "DESIGN 6.9", "Reveal on scroll: one-shot IntersectionObserver (threshold 0.05), unobserves after reveal, 3.5s failsafe reveals unrevealed elements", "e2e")
    add("DES-BEH-11", "DESIGN 6.10", "Video & media: inline play button, autoplay muted playsinline paused off-screen, consent embeds load only after consent", "e2e")
    add("DES-BEH-12", "DESIGN 6.11", "In-page navigation: scroll-padding-top 68px below lg, 144px at lg, moves focus with preventScroll: true", "e2e")
    add("DES-BEH-13", "DESIGN 6.12", "Drag scrolling: mouse only (pointerType === 'mouse'), threshold 5px, 1.5x speed, suppresses follow-up click", "e2e")
    add("DES-BEH-14", "DESIGN 6.13", "Resize and orientation: debounced 100ms, matchMedia listeners reset transient state across breakpoints", "e2e")
    add("DES-BEH-15", "DESIGN 6.14", "Full keyboard map: Tab in DOM order, Enter/Space activation, Escape closes overlays, roving tabindex in tabs", "e2e")
    add("DES-BEH-16", "DESIGN 6.15", "Progressive enhancement: works without JS, modules isolated in try/catch, no inline display/visibility styles to toggle UI", "e2e")

    # Accessibility & Conformance
    add("DES-A11Y-01", "DESIGN 7", "Zero axe-core WCAG 2.2 AA violations across all routes and interactive states", "e2e")
    add("DES-A11Y-02", "DESIGN 7", "Heading hierarchy: exactly one h1 per page, no skipped heading levels", "e2e")
    add("DES-A11Y-03", "DESIGN 7", "Landmarks present: header, nav (labelled), main, footer, skip link first", "e2e")
    add("DES-A11Y-04", "DESIGN 7", "Form inputs have visible labels, programmatically tied via htmlFor/id, error tied via aria-describedby", "e2e")
    add("DES-A11Y-05", "DESIGN 7", "Target size minimum 24x24px, 44x44px standard on coarse pointers", "visual")

    # Print & Forced colors
    add("DES-PRT-01", "DESIGN 9.1", "Print stylesheet removes backgrounds/shadows, text #000 on white, hides nav/cta/scrim/controls, appends URLs in parens", "grep")
    add("DES-PRT-02", "DESIGN 9.2", "forced-colors: active uses real borders and text-decoration instead of background-drawn underlines/fills", "grep")

    # Do & Don't
    add("DES-DNT-01", "DESIGN 11", "No pure black outside print", "grep")
    add("DES-DNT-02", "DESIGN 11", "No blue-greys or default Tailwind colors (bg-gray-*, text-blue-*)", "grep")
    add("DES-DNT-03", "DESIGN 11", "No decorative gradients (linear-gradient/radial-gradient) outside specified scrims/underlines", "grep")
    add("DES-DNT-04", "DESIGN 11", "No border-radius except radio 50%", "grep")
    add("DES-DNT-05", "DESIGN 11", "No animated top, left, margin, or box-shadow", "grep")
    add("DES-DNT-06", "DESIGN 11", "No transition: all or transition-all", "grep")
    add("DES-DNT-07", "DESIGN 11", "No inline display or visibility styles written from script to open/close components", "grep")
    add("DES-DNT-08", "DESIGN 11", "No background-attachment: fixed for essential effects", "grep")
    add("DES-DNT-09", "DESIGN 11", "No autoplay with sound, and no autoplay without visible pause control", "grep")
    add("DES-DNT-10", "DESIGN 11", "No hover styles sticking on touch devices (@media (hover: hover) used)", "grep")

    # =========================================================================
    # 5. SITE-PLAN.md: Sitemap, Chrome, Blocks, Pages, Forms, Conditional, SEO, Analytics
    # =========================================================================
    add("SP-CONV-01", "SITE-PLAN 1", "Quoted copy in SITE-PLAN.md and copy tables is FINAL and matches word for word", "e2e")
    add("SP-CONV-02", "SITE-PLAN 1", "No published page contains the string [CONFIRM", "grep")
    add("SP-CONV-03", "SITE-PLAN 1", "Phone, WhatsApp, email, addresses are read dynamically from site-settings, not hard-coded", "grep")
    add("SP-VOICE-01", "SITE-PLAN 2", "Voice rule 1: Plain words and local terms (cabro, murram, grading, culverts, kerbs)", "manual")
    add("SP-VOICE-02", "SITE-PLAN 2", "Voice rule 2: Numbers only when verified (no 50+ projects, 100+ clients, 5+ years)", "grep")
    add("SP-VOICE-03", "SITE-PLAN 2", "Voice rule 3: No banned superlatives (premier, leading, best, world-class, exceptional, unrivalled, cutting-edge, seamless)", "grep")
    add("SP-VOICE-04", "SITE-PLAN 2", "Voice rule 4: Each page ends with fitting next step and varying CTA wording", "visual")
    add("SP-VOICE-05", "SITE-PLAN 2", "Voice rule 5: Name people behind work only with approval", "manual")
    add("SP-VOICE-06", "SITE-PLAN 2", "Voice rule 6: Do not call anyone Eng. or engineer as title unless EBK registered", "grep")

    # Sitemap routes
    sitemap_routes = [
        ("/", "Home"), ("/about", "About"), ("/about/leadership", "Leadership"),
        ("/about/credentials-and-safety", "Credentials"), ("/services", "Services index"),
        ("/services/road-construction-and-earthworks", "Service road construction"),
        ("/services/road-construction-and-earthworks/cabro-paving", "Service cabro paving"),
        ("/services/general-construction", "Service general construction"),
        ("/services/interior-design", "Service interior design"),
        ("/services/project-management", "Service project management"),
        ("/services/architecture-and-consultancy", "Service architecture (gated)"),
        ("/services/bills-of-quantities-and-estimating", "Service BoQ (gated)"),
        ("/projects", "Projects index"), ("/projects/[slug]", "Project case study"),
        ("/equipment", "Equipment index"), ("/equipment/[category]", "Equipment category"),
        ("/equipment/[category]/[slug]", "Machine page"), ("/insights", "Insights index"),
        ("/insights/category/[slug]", "Insights category"), ("/insights/[slug]", "Article"),
        ("/locations/meru", "Location Meru"), ("/locations/nairobi", "Location Nairobi (gated)"),
        ("/contact", "Contact"), ("/thank-you", "Thank you"), ("/privacy", "Privacy"),
        ("/cookies", "Cookies"), ("/downloads/company-profile", "Company profile download route"),
        ("/sitemap.xml", "Sitemap XML"), ("/robots.txt", "Robots TXT")
    ]
    for r, desc in sitemap_routes:
        add(f"SP-ROUTE-{r.replace('/', '-').strip('-') or 'home'}", "SITE-PLAN 3.2", f"Route exists and renders: {r} ({desc})", "e2e")

    # Global chrome
    add("SP-CHRM-01", "SITE-PLAN 4.1", "Desktop header: 128px height, secondary row 40px (Meru · Nairobi, Call, Company profile), primary row 88px", "visual")
    add("SP-CHRM-02", "SITE-PLAN 4.1", "Services mega panel: 3 columns by group + aside Hire equipment linking to /equipment", "visual")
    add("SP-CHRM-03", "SITE-PLAN 4.1", "Equipment dropdown: links to categories, All equipment, and How hire works anchor", "visual")
    add("SP-CHRM-04", "SITE-PLAN 4.1", "About dropdown: Company, Leadership, Credentials, Company profile download", "visual")
    add("SP-CHRM-05", "SITE-PLAN 4.2", "Mobile header 52px: logo left, WhatsApp icon and menu toggle right; multi-level drawer", "visual")
    add("SP-CHRM-06", "SITE-PLAN 4.3", "Mobile action bar: fixed bottom, 56px + safe-area inset, 3 cells (Call, WhatsApp, Quote), hidden at lg and on form focus", "visual")
    add("SP-CHRM-07", "SITE-PLAN 4.3", "Body has padding-bottom calc(56px + env(safe-area-inset-bottom)) below lg so footer is not covered", "grep")
    add("SP-CHRM-08", "SITE-PLAN 4.4", "CtaBand closing block: photo col 1-11, display headline 'Let's talk about your site', primary button, card col 12-4", "visual")
    add("SP-CHRM-09", "SITE-PLAN 4.5", "Footer: dark surface, logo, motto, 4 link groups (Services, Company, Equipment, Contact), social, credentials line, legal row", "visual")
    add("SP-CHRM-10", "SITE-PLAN 4.6", "WhatsApp pre-filled message per page encoded properly in wa.me link", "unit")
    add("SP-CHRM-11", "SITE-PLAN 4.7", "Breadcrumbs on all deep pages with matching BreadcrumbList JSON-LD", "e2e")
    add("SP-CHRM-12", "SITE-PLAN 4.8", "Cookie consent banner: bottom fixed, explains cookies, Accept analytics and Essential only buttons equal prominence", "e2e")

    # Block library (27 blocks)
    blocks = [
        "HomeHero", "PageHero", "PageHeader", "IntentSelector", "ProofBar", "SectionIntro",
        "ServiceGrid", "FeatureSplit", "StatementBlock", "ProjectGrid", "EquipmentTeaser",
        "WhyShena", "TestimonialBlock", "InsightsRow", "LocationsBand", "KeyFacts",
        "ScopeList", "ProcessSteps", "FaqAccordion", "Gallery", "ContactAside",
        "EnquiryForm", "CredentialTable", "DownloadCard", "Prose", "SubNavPanel",
        "MapBlock", "EmptyState"
    ]
    for b in blocks:
        add(f"SP-BLK-{b.upper()}", "SITE-PLAN 5", f"Block {b} exists and is imported/used per page specifications", "grep")

    # Page Copy & Structure checks for 6.1 - 6.18
    pages = [
        ("6.1", "Home", "Hero, IntentSelector, ProofBar, Services, Projects, EquipmentTeaser, WhyShena, Testimonial, Insights, Locations, CtaBand"),
        ("6.2", "About", "Hero, SubNavPanel, Intro, FeatureSplits, ProcessSteps, StatementBlock, LeadershipSplit, Locations, CtaBand"),
        ("6.3", "Leadership", "PageHeader, Newton portrait & summary, Bio prose, Experience timeline, Areas of work KeyFacts, Credentials"),
        ("6.4", "Credentials", "PageHeader, KeyFacts company, CredentialTable, Safety FeatureSplit, Prose insurance/env, DownloadCards, EnquiryForm"),
        ("6.5", "Services index", "PageHero, Group 1 Roads, Group 2 Buildings, Group 3 Planning, StatementBlock, CtaBand"),
        ("6.6", "Service road-construction", "PageHero, KeyFacts, Intro, ScopeList, Sub-services, ProcessSteps, Related projects, Equipment teaser, FAQ, EnquiryForm"),
        ("6.6", "Service cabro-paving", "PageHero, KeyFacts, Intro, ScopeList, ProcessSteps, FAQ, EnquiryForm"),
        ("6.6", "Service general-construction", "PageHero, KeyFacts, Intro, ScopeList, ProcessSteps, Related projects, FAQ, EnquiryForm"),
        ("6.6", "Service interior-design", "PageHero, KeyFacts, Intro, ScopeList, ProcessSteps, FAQ, EnquiryForm"),
        ("6.6", "Service project-management", "PageHero, KeyFacts, Intro, ScopeList, ProcessSteps, FAQ, EnquiryForm"),
        ("6.7", "Projects index", "PageHero, Filter bar (service, location, year), ProjectGrid, Load more button, EmptyState"),
        ("6.8", "Project case study", "Hero image, Title block with role & deliveringCompany, KeyFacts, Prose, ContactAside, Testimonial, Stat row, Gallery"),
        ("6.9", "Equipment index", "PageHero, Hire terms KeyFacts, Category links, Category sections with machine cards, ProcessSteps, FAQ, EnquiryForm"),
        ("6.10", "Equipment category", "PageHero, KeyFacts, Intro, Machine grid, ScopeList uses, FAQ, EnquiryForm"),
        ("6.11", "Machine page", "Gallery 4:3, Specs table, ScopeList uses, Hire terms, EnquiryForm prefilled, More machines"),
        ("6.12", "Insights index", "PageHeader, Category chips, Post grid with featured wide card, Pagination"),
        ("6.13", "Article", "Header, Cover image, Prose, Share links (WhatsApp, LinkedIn, Copy), Author card, Related service, Related posts"),
        ("6.14", "Location Meru", "PageHero, Office details, MapBlock, Local intro, ServiceGrid, Local projects, EquipmentTeaser, FAQ, CtaBand"),
        ("6.15", "Contact", "PageHeader, EnquiryForm with radio switcher, Aside Prefer to talk?, Office MapBlocks"),
        ("6.16", "Thank you", "PageHeader with dynamic copy by ?type, Enquiry reference line, link cards"),
        ("6.17", "Legal privacy & cookies", "PageHeader, Last updated date, Full Prose text matching CONTENT 11"),
        ("6.18", "Error 404 & 500", "Styled error pages with clear messages, link list, primary home/retry action")
    ]
    for num, name, summary in pages:
        add(f"SP-PAGE-{name.lower().replace(' ', '-').replace('/', '-')}", f"SITE-PLAN {num}", f"Page {name} renders specified blocks in order: {summary}", "e2e")

    # Forms
    add("SP-FORM-01", "SITE-PLAN 7.1", "EnquiryForm contains all 17 fields: type, name, phone, email, organisation, service, equipment, hireStart, hireDuration, location, budgetBand, timeline, message, files, consent, company_website, cf-turnstile-response", "e2e")
    add("SP-FORM-02", "SITE-PLAN 7.1", "Type radio switcher shows/hides conditional fields without submitting hidden values", "e2e")
    add("SP-FORM-03", "SITE-PLAN 7.2", "Form validation error messages match SITE-PLAN 7.2 verbatim", "unit")
    add("SP-FORM-04", "SITE-PLAN 7.3", "Staff notification email template matches SITE-PLAN 7.3 structure and fields", "unit")
    add("SP-FORM-05", "SITE-PLAN 7.4", "Customer acknowledgement email template matches SITE-PLAN 7.4 verbatim", "unit")

    # Conditional rendering table (14 rules)
    cond_rules = [
        ("01", "Unpublished or gate-failing records return 404, excluded from nav, sitemap, related lists, JSON-LD"),
        ("02", "Credentials page and nav links 404/hidden when 0 credentials published"),
        ("03", "Insights nav and index 404/hidden when 0 posts published"),
        ("04", "InsightsRow on Home hidden when < 3 published posts"),
        ("05", "Nairobi location page 404 when unpublished; header secondary row reads Meru, Kenya"),
        ("06", "ProofBar hidden when < 2 verified proof items"),
        ("07", "WhyShena unverified points hidden; block hidden at 0 points"),
        ("08", "TestimonialBlock hidden when 0 testimonials with permission file; public official never on Home/first"),
        ("09", "Company profile links hidden when no file uploaded; /downloads/company-profile 404"),
        ("10", "Response-time statement hidden when site-settings.responseTimeStatement is null"),
        ("11", "Machine availability line always renders (Available or On hire, ask for dates)"),
        ("12", "Case study stat row hidden when 0 key figures"),
        ("13", "Gallery renders 1-2 images as figures, >= 3 as gallery carousel"),
        ("14", "Equipment category page returns 404 when 0 published machines in category"),
        ("15", "Related lists block hidden when 0 items"),
        ("16", "[CONFIRM string in any published field impossible to publish and never rendered")
    ]
    for num, desc in cond_rules:
        add(f"SP-COND-{num}", "SITE-PLAN 8", f"Conditional rule {num}: {desc}", "e2e")

    # SEO metadata table
    seo_rows = [
        "Home", "About", "Leadership", "Credentials", "Services", "Projects", "Equipment",
        "Insights", "Contact", "Privacy", "Cookies", "Meru", "Nairobi"
    ]
    for item in seo_rows:
        add(f"SP-SEO-{item.upper()}", "SITE-PLAN 9", f"SEO title and meta description match SITE-PLAN 9 table for {item}", "unit")

    # Analytics 10 events
    events = [
        ("quote_submit", "enquiry_type, service, source_page"),
        ("hire_submit", "equipment, source_page"),
        ("whatsapp_click", "location, page_type"),
        ("call_click", "location, page_type"),
        ("email_click", "location"),
        ("file_download", "file_name"),
        ("cta_click", "cta_id"),
        ("form_start", "form_preset"),
        ("form_error", "error_count, fields"),
        ("filter_use", "filter, value")
    ]
    for ev, params in events:
        add(f"SP-EVT-{ev.upper()}", "SITE-PLAN 10", f"GA4 event {ev} fires with params ({params}) after consent and never without consent", "e2e")

    # Page checklist 10 items
    for i in range(1, 11):
        add(f"SP-CHK-{i:02d}", "SITE-PLAN 11", f"Page checklist item {i} verified across all page templates", "manual")

    # =========================================================================
    # 6. CONTENT.md: Settings, Discrepancies, Inputs, Seed Records, Legal
    # =========================================================================
    add("CNT-SET-01", "CONTENT 1.1", "site-settings global seed matches CONTENT 1.1 JSON structure", "grep")
    add("CNT-DISC-01", "CONTENT 1.2", "Discrepancy 1: Years in business held back until Certificate of Incorporation date confirmed; no 5+ years", "grep")
    add("CNT-DISC-02", "CONTENT 1.2", "Discrepancy 2: Project/client counts: no 50+ or 100+; only verified projects counted", "grep")
    add("CNT-DISC-03", "CONTENT 1.2", "Discrepancy 3: Professional registrations: no Eng. title; Architecture and BoQ services in draft", "grep")
    add("CNT-DISC-04", "CONTENT 1.2", "Discrepancy 4: Machinery ownership clearly stated and configurable per machine/global", "grep")
    add("CNT-DISC-05", "CONTENT 1.2", "Discrepancy 5: Dukes Cottages attributed to deliveringCompany: Dukes Limited, Newton role Site Project Manager", "grep")
    add("CNT-DISC-06", "CONTENT 1.2", "Discrepancy 6: KURA Director General quote stored with isPublicOfficial: true, draft, never on Home", "grep")
    add("CNT-PRF-01", "CONTENT 1.3", "proofItems seed has all 4 items with verified: false", "grep")

    # Client inputs I-01 to I-15
    for i in range(1, 16):
        add(f"CNT-INP-{i:02d}", "CONTENT 2.1", f"Client input I-{i:02d} mapped to features it blocks; features held back rather than faked", "manual", status="BLOCKED-ON-INPUT")

    add("CNT-DEC-01", "CONTENT 2.2", "Open decisions 1-7 recorded and not prematurely coded with fake values", "manual")
    add("CNT-GBP-01", "CONTENT 2.3", "NAP (Name, Address, Phone) identical character-for-character across site and JSON-LD", "grep")

    # Services seed records
    services_seed = [
        "road-construction-and-earthworks", "cabro-paving", "general-construction",
        "interior-design", "project-management", "architecture-and-consultancy",
        "bills-of-quantities-and-estimating"
    ]
    for s in services_seed:
        add(f"CNT-SRV-{s.upper().replace('-', '_')}", "CONTENT 3", f"Service seed record {s} exists with exact titles, summary, scope, process, faqs", "grep")

    # Project case studies
    projects_seed = [
        "the-black-perch-lounge", "the-pin-hideout", "dukes-cottages-restaurant-and-garden",
        "stone-lounge-and-villas", "meru-access-road-grading-and-drainage"
    ]
    for p in projects_seed:
        add(f"CNT-PRJ-{p.upper().replace('-', '_')}", "CONTENT 4", f"Project seed record {p} exists with exact slug, clientType, role, deliveringCompany, brief, work, result", "grep")

    # Equipment
    add("CNT-EQ-CAT", "CONTENT 5.1", "Equipment categories: Excavators, Motor graders, Rollers and compactors, Bulldozers seeded with uses", "grep")
    add("CNT-EQ-MACH", "CONTENT 5.2", "Machine seed records (Crawler Excavator, Motor Grader, Vibratory Roller, Crawler Bulldozer) seeded with hireTerms", "grep")
    add("CNT-EQ-FAQ", "CONTENT 5.3", "Equipment hire FAQs seeded with 5 exact questions and answers", "grep")

    # Team
    add("CNT-TEAM-01", "CONTENT 6", "Newton M. Muthee team record seeded with reconciled bio and experience timeline, no Eng. title", "grep")

    # Credentials
    add("CNT-CRED-01", "CONTENT 7", "8 Credentials seed records created with _status: draft and required gate fields", "grep")

    # Testimonials
    add("CNT-TEST-01", "CONTENT 8.1", "Testimonial 1 (Charles Imunde) seeded with _status: draft and permissionFile required", "grep")
    add("CNT-TEST-02", "CONTENT 8.2", "Testimonial 2 (Eng. Silas M. Kinoti) seeded with isPublicOfficial: true, _status: draft", "grep")

    # Locations
    add("CNT-LOC-01", "CONTENT 9.1", "Location 1 (Meru) seeded as published with address, phone, email, hours, intro, faqs", "grep")
    add("CNT-LOC-02", "CONTENT 9.2", "Location 2 (Nairobi) seeded as draft pending I-05 address confirmation", "grep")

    # Insights
    add("CNT-INS-01", "CONTENT 10.1", "4 post categories (Roads and paving, Equipment, Building, Planning and costs) seeded", "grep")
    add("CNT-INS-02", "CONTENT 10.2", "8 article seed records created in draft with outlines and related services", "grep")

    # Legal
    add("CNT-LEG-01", "CONTENT 11.1", "Privacy notice (/privacy) text matches CONTENT 11.1 Kenya Data Protection Act notice in full", "e2e")
    add("CNT-LEG-02", "CONTENT 11.2", "Cookie notice (/cookies) text matches CONTENT 11.2 in full with exact cookies table", "e2e")

    # Write out to audit/REGISTER.csv
    fieldnames = [
        "ID",
        "Source (doc + section)",
        "Requirement (verbatim or tight paraphrase)",
        "Verification method (grep / unit / e2e / visual / manual / DB / network)",
        "Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)",
        "Evidence (path or command)",
        "Notes"
    ]

    with open("audit/REGISTER.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

    print(f"Generated {len(rows)} requirement rows in audit/REGISTER.csv")

if __name__ == "__main__":
    build_register()
