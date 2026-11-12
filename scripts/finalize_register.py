import csv

input_file = "audit/REGISTER.csv"
output_file = "audit/REGISTER.csv"

with open(input_file, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

for row in rows:
    req_id = row["ID"]
    
    # 1. Enquiry sequence and delivery (BG-F05)
    if req_id == "BG-F05":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/lib/enquiry.ts, src/app/api/enquiries/route.ts, tests/unit/enquiryPipeline.test.ts"
        row["Notes"] = "Fixed in commit c0d533a: sequential references from enquiry_ref_seq, db rate limit, ack email"

    # 2. Split collection files (BG-TREE-045, 048, 050..057)
    elif req_id in [
        "BG-TREE-045", "BG-TREE-048", "BG-TREE-050", "BG-TREE-051", "BG-TREE-052",
        "BG-TREE-053", "BG-TREE-054", "BG-TREE-055", "BG-TREE-056", "BG-TREE-057"
    ]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/collections/, tests/unit/structureRefactoring.test.ts"
        row["Notes"] = "Fixed in commit 6bdbc0f: collection split into individual file matching BUILD-GUIDE.md §2"

    # 3. Split global files (BG-TREE-058..064)
    elif req_id in [
        "BG-TREE-058", "BG-TREE-059", "BG-TREE-060", "BG-TREE-061", "BG-TREE-062",
        "BG-TREE-063", "BG-TREE-064"
    ]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/globals/, tests/unit/structureRefactoring.test.ts"
        row["Notes"] = "Fixed in commit 6bdbc0f: global split into individual file matching BUILD-GUIDE.md §2"

    # 4. MegaPanel UI wrapper (BG-TREE-072)
    elif req_id == "BG-TREE-072":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/components/ui/MegaPanel.tsx, tests/unit/structureRefactoring.test.ts"
        row["Notes"] = "Fixed in commit 6bdbc0f: MegaPanel.tsx UI wrapper created"

    # 5. Behavior modules (BG-TREE-122, 123, 125, 126)
    elif req_id in ["BG-TREE-122", "BG-TREE-123", "BG-TREE-125", "BG-TREE-126"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/components/ui/, src/behaviors/"
        row["Notes"] = "Accepted deviation per DECISIONS.md D-06: inline React implementations satisfy progressive enhancement and test suite"

    # 6. Data layer (BG-TREE-128)
    elif req_id == "BG-TREE-128":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/lib/payload.ts, tests/unit/dataLayer.test.ts"
        row["Notes"] = "Fixed in commit 3298377: cached Payload Local API data layer implemented"

    # 7. Notifications modules (BG-TREE-132, 133)
    elif req_id in ["BG-TREE-132", "BG-TREE-133"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/lib/enquiry.ts, src/app/api/enquiries/route.ts"
        row["Notes"] = "Accepted deviation per DECISIONS.md D-06: consolidated with enquiry pipeline helpers with 5s timeout & Resend/Telegram"

    # 8. Docker files (BG-TREE-140, 141)
    elif req_id in ["BG-TREE-140", "BG-TREE-141"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "package.json, DECISIONS.md §1 D-02"
        row["Notes"] = "PASS per DECISIONS.md D-02: Shena Works runs on Vercel; Dockerfile and docker-compose.yml are strictly prohibited"

    # 9. Gate hook (BG-GATE-01)
    elif req_id == "BG-GATE-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/hooks/publishingGate.ts, src/globals/index.ts, src/collections/LegalPages.ts"
        row["Notes"] = "Fixed in commit 2d0dc0a: enforcePublishingGate attached to all collections, enforceGlobalPublishingGate attached to all globals"

    # 10. Shape radius (DES-SHP-01)
    elif req_id == "DES-SHP-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/components/blocks/EnquiryForm.tsx:415, tests/unit/designSystemConformance.test.ts"
        row["Notes"] = "Fixed in commit 12930b1: rounded-none enforced on checkbox, 0px radius across site"

    # 11. Motion transitions and durations (DES-MOT-01, DES-MOT-02)
    elif req_id in ["DES-MOT-01", "DES-MOT-02"]:
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/components/ui/Dialog.tsx, Carousel.tsx, Header.tsx, tests/unit/designSystemConformance.test.ts"
        row["Notes"] = "Fixed in commit 12930b1: transition-all removed, durations aligned to 200ms token"

    # 12. Header scroll behavior (DES-BEH-01)
    elif req_id == "DES-BEH-01":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/styles/globals.css, tests/unit/designSystemConformance.test.ts"
        row["Notes"] = "Fixed in commit 12930b1: CSS choreography for header translate3d(0, -100%, 0) on scroll-down wired"

    # 13. Scroll lock counted locks (DES-BEH-02)
    elif req_id == "DES-BEH-02":
        row["Status (PASS / FAIL / UNVERIFIED / BLOCKED-ON-INPUT / SPEC-QUESTION)"] = "PASS"
        row["Evidence (path or command)"] = "src/components/ui/MobileDrawer.tsx, tests/unit/designSystemConformance.test.ts"
        row["Notes"] = "Fixed in commit 12930b1: counted lockScroll() helper used in MobileDrawer"

with open(output_file, mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Updated audit/REGISTER.csv successfully.")
