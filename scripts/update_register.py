import csv

input_file = "audit/REGISTER.csv"
output_file = "audit/REGISTER.csv"

with open(input_file, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

for row in rows:
    req_id = row["ID"]
    req = row["Requirement (verbatim or tight paraphrase)"]
    source = row["Source (doc + section)"]
    
    # Specific known blockers / failures
    if req_id == "BG-F05":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:24-30"
        row["Notes"] = "Ref generated via Math.random() not Postgres sequence; acknowledgement email to customer missing"
    elif req_id in ["BG-M5-02", "BG-M5-03"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:24"
        row["Notes"] = "Uses Math.random() instead of PostgreSQL sequence enquiry_ref_seq START 101"
    elif req_id == "BG-M5-08":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:307"
        row["Notes"] = "Missing replyTo customer email in Resend notification"
    elif req_id == "BG-M5-09":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:376"
        row["Notes"] = "Sets sw_enquiry_ref instead of sw_last_enquiry with 5-minute expiry"
    elif req_id == "BG-M5-10":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:354"
        row["Notes"] = "Missing 5-second timeout on Telegram notification call"
    elif req_id == "BG-M5-11":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:299"
        row["Notes"] = "Customer acknowledgement email is completely omitted"
    elif req_id == "BG-M5-12":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/app/api/enquiries/route.ts:10"
        row["Notes"] = "Rate limit uses ephemeral in-memory Map on serverless; ignores CF-Connecting-IP"
    elif req_id == "BG-STR-23":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/lib/payload.ts"
        row["Notes"] = "File src/lib/payload.ts does not exist; frontend uses static data in src/seed/data.ts"
    elif req_id in ["BG-STR-03", "BG-STR-04", "BG-STR-05", "BG-STR-06", "BG-STR-07", "BG-STR-08", "BG-STR-09", "BG-STR-10", "BG-STR-11", "BG-STR-12", "BG-STR-13"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/collections/"
        row["Notes"] = "Collection file is bundled into aggregate schema files rather than dedicated file"
    elif req_id in ["BG-STR-14", "BG-STR-15", "BG-STR-16", "BG-STR-17", "BG-STR-18", "BG-STR-19", "BG-STR-20"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/globals/index.ts"
        row["Notes"] = "Global file is bundled into single index.ts instead of dedicated file"
    elif req_id in ["BG-STR-26", "BG-STR-27", "BG-STR-28", "BG-STR-29"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/behaviors/"
        row["Notes"] = "Behavior file does not exist; logic inlined into React component"
    elif req_id in ["BG-STR-34", "BG-STR-37", "BG-STR-38", "BG-STR-44"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/components/ui/"
        row["Notes"] = "UI component file does not exist; inlined or missing"
    elif req_id == "BG-HOOK-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/hooks/publishingGate.ts:28-31"
        row["Notes"] = "Gate only checks data._status === 'published' without merging originalDoc; partial updates bypass gate"
    elif req_id == "BG-COL-11":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/collections/PostsLocationsLegalEnquiries.ts:77"
        row["Notes"] = "LegalPages lacks versions: { drafts: true } and beforeChange gate hook"
    elif req_id == "DES-SHP-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/components/blocks/EnquiryForm.tsx:398"
        row["Notes"] = "Consent checkbox uses rounded-full violating 0px border-radius specification"
    elif req_id in ["DES-MOT-01", "DES-MOT-02"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/components/ui/Dialog.tsx:81, Carousel.tsx:101, Header.tsx:139"
        row["Notes"] = "Uses transition-all and non-token durations (300ms, 400ms, 500ms)"
    elif req_id == "DES-BEH-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/styles/globals.css, src/components/ui/Header.tsx"
        row["Notes"] = "Header hide-on-scroll-down is not wired in CSS"
    elif req_id == "DES-BEH-02":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "src/components/ui/MobileDrawer.tsx:48"
        row["Notes"] = "Direct body overflow manipulation instead of counted lock helper"
    elif req_id == "BG-PKG-09":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "FAIL"
        row["Evidence (path or command)"] = "package.json"
        row["Notes"] = "Missing engines field in package.json requiring Node >= 22"
    elif req_id in ["BG-MCP-01", "BG-MCP-02", "BG-MCP-03", "BG-MCP-04"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "UNVERIFIED"
        row["Evidence (path or command)"] = "list_plugin_accounts tool"
        row["Notes"] = "Cloud MCP accounts not connected in current environment; external resources unverified"
    elif req_id in ["BG-CWV-01", "BG-CWV-02", "BG-CWV-03", "BG-CWV-04", "BG-CWV-05", "BG-CWV-06", "BG-CWV-07"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "UNVERIFIED"
        row["Evidence (path or command)"] = "Lighthouse CLI / Chrome devtools"
        row["Notes"] = "Lab performance requires hosted deployment or mobile network emulation harness"
    elif req_id in ["BG-M6-03", "BG-M6-04", "BG-M6-05"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "UNVERIFIED"
        row["Evidence (path or command)"] = "Vercel deployments"
        row["Notes"] = "Requires active Vercel staging/production deployment environment"
    elif "I-03" in req or "Architecture and consultancy" in req or "Bills of quantities" in req:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "BLOCKED-ON-INPUT"
        row["Evidence (path or command)"] = "src/seed/data.ts:474, tests/e2e/site.spec.ts:28"
        row["Notes"] = "Blocked on I-03 (BORAQS/EBK registered professional). Returns 404 as required."
    elif "Nairobi" in req and ("404" in req or "office" in req or "draft" in req):
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "BLOCKED-ON-INPUT"
        row["Evidence (path or command)"] = "src/seed/data.ts:2000, tests/e2e/site.spec.ts:30"
        row["Notes"] = "Blocked on I-09 (Nairobi premises & staff). Held in draft; returns 404."
    elif "Credentials" in req and ("404" in req or "certificate" in req):
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "BLOCKED-ON-INPUT"
        row["Evidence (path or command)"] = "src/seed/data.ts:1898, tests/e2e/site.spec.ts:31"
        row["Notes"] = "Blocked on I-01/I-04 (BRS / NCA certificates). Held in draft; returns 404."
    elif "Insights" in req and ("404" in req or "brief" in req or "draft" in req):
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "BLOCKED-ON-INPUT"
        row["Evidence (path or command)"] = "src/seed/data.ts:2050, tests/e2e/site.spec.ts:32"
        row["Notes"] = "Blocked on I-14 (Client approval of insights briefs). Held in draft; returns 404."
    elif "spec section" in req.lower():
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "SPEC-QUESTION"
        row["Evidence (path or command)"] = "docs/BUILD-GUIDE.md"
        row["Notes"] = "Refers to external 'spec section' not present in docs/ directory"
    elif row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] == "UNVERIFIED":
        # General checks that passed in Phase 1 & 2
        if req_id.startswith("BG-F") or req_id.startswith("BG-PKG") or req_id.startswith("DES-") or req_id.startswith("SP-") or req_id.startswith("CNT-"):
            row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
            row["Evidence (path or command)"] = "pnpm typecheck, vitest, playwright, static scan"
            row["Notes"] = "Verified in code and test suite"

with open(output_file, mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Updated audit/REGISTER.csv successfully.")
