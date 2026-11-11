# CONTENT.md — Shena Works CMS Seed Data, Copy Deck & Facts Register

Every CMS record, global setting, seed entry, legal notice and verification gate required to populate shenaworksltd.com. Paired with `SITE-PLAN.md` (layout and page-level copy) and `BUILD-GUIDE.md` (Payload CMS 3 schema and seed script).

**Contents**
1. Global `site-settings` and the verified facts register
2. Client input register (`I-01` to `I-15`)
3. Services seed records (7 services, including Cabro paving sub-service and 2 gated services)
4. Project case study seed records (5 initial case studies + filter taxonomy)
5. Equipment categories, machine seed records and hire FAQs
6. Team seed record: Newton M. Muthee (reconciled biography and timeline)
7. Credentials and certificates seed records
8. Testimonials seed records and public-official rules
9. Locations seed records (Meru and Nairobi)
10. Insights taxonomy and 8 first-quarter article seeds
11. Legal pages: full Privacy Notice and Cookie Notice (Kenya Data Protection Act, 2019)

---

## 1. Global `site-settings` and the verified facts register

### 1.1 `site-settings` seed values

```json
{
  "company": {
    "legalName": "Shena Works Limited",
    "tradingName": "Shena Works",
    "tagline": "Roads & Building Construction Contractors",
    "motto": "Connecting communities. Building the future.",
    "regNumber": "[CONFIRM: Certificate of Incorporation number, e.g. PVT-xxxxxxx]",
    "incorporationDate": "[CONFIRM: YYYY-MM]",
    "kraPin": "[CONFIRM: KRA PIN — publish only if Newton approves]",
    "directors": "[CONFIRM: Directors to be listed publicly]"
  },
  "contact": {
    "phoneE164": "+254718971896",
    "phoneDisplay": "+254 718 971 896",
    "whatsappNumber": "254718971896",
    "email": "shenaworksltd@gmail.com",
    "productionEmail": "[CONFIRM: e.g. info@shenaworksltd.com or enquiries@shenaworksltd.com once Google Workspace / Zoho Mail is live]",
    "officeHours": "[CONFIRM: e.g. Mon–Fri 8:00 am – 5:00 pm, Sat 8:00 am – 1:00 pm]",
    "responseTimeStatement": null,
    "enquiryRecipients": ["shenaworksltd@gmail.com"]
  },
  "social": {
    "linkedinUrl": null,
    "facebookUrl": null
  },
  "files": {
    "companyProfile": null
  }
}
```

### 1.2 Discrepancies between existing background profiles (must be resolved in Phase 0)

| Topic | `shena_works_company_profile.md` | `newton_muthee_profile.md` | Publishing gate rule | Resolution in seed data |
|---|---|---|---|---|
| Years in business | "5+ Years of Industry Experience" | Newton MD at Shena Works "Sept 2024 – Present"; Site Project Manager at Dukes "Feb 2020 – Feb 2021" | Use numbers only when Shena can prove them (spec 3) | Hold back until Certificate of Incorporation date is confirmed. Distinguish company incorporation year from Newton's personal experience (since 2020). |
| Project & client counts | "50+ Completed Projects", "100+ Satisfied Clients" | Names 3 highlighted projects | Publishing gate requires completion evidence per project | Do not publish "50+" or "100+". Count only verified projects or Newton's verified career count with evidence. |
| Professional registrations | "Registered multidisciplinary team of civil engineers, architects, quantity surveyors" | Lists Newton as "Civil Engineer" | Services and titles appear only with required registrations (EBK, BORAQS) | Do not use the protected title `Eng.` or claim in-house registered architects/QS until registration numbers are supplied. Keep Architecture and BoQ service pages in `draft`. |
| Machinery ownership | Shena Works maintains and operates a heavy equipment fleet | Newton is also Director at NEMU Traders (June 2023 – Present) and Site Engineer at Joleen Traders Ltd (June 2020 – Present) | Confirm which legal entity owns and contracts machinery hire (spec 12 & 16.3) | Equipment pages state hire terms clearly and store `owningEntity` per machine or globally once confirmed. |
| Dukes Cottages delivering company | Listed under Shena Works portfolio | Listed under Newton's contract role at **Dukes Limited** (Feb 2020 – Feb 2021) | State which company delivered it and in what role (spec 12) | Seed record sets `deliveringCompany: "Dukes Limited"` and `role: "Site Project Manager (Newton Muthee prior to founding Shena Works)"` `[CONFIRM]`. |
| KURA Director General quote | Used as lead testimonial | Listed as public sector reference | Endorsement from a public official is not used as lead proof (spec 3) | Stored with `isPublicOfficial: true` and `_status: "draft"`. Never rendered on Home or Leadership; only eligible on Credentials/Projects if written permission on file. |

### 1.3 `proofItems` seed (`ProofBar` on Home)

All four items start with `verified: false` so `ProofBar` remains hidden until certificates/evidence are uploaded:

| Slot | `value` | `label` | Gate condition to flip `verified: true` |
|---|---|---|---|
| 1 | `NCA [CONFIRM: e.g. 6]` | `Roads & building works registration` | NCA certificate PDF uploaded in Credentials |
| 2 | `[CONFIRM: YYYY]` | `Year incorporated in Kenya` | Certificate of Incorporation on file |
| 3 | `[CONFIRM: N]` | `Verified projects completed` | Count of project records with completion evidence |
| 4 | `Meru & Nairobi` | `Operating bases across Kenya` | Both office addresses confirmed (`Meru County` alone if Nairobi is unstaffed) |

---

## 2. Client input register (`I-01` to `I-15`)

Every `[CONFIRM: ...]` tag in `SITE-PLAN.md` and this file traces to one of these inputs from spec section 12:

| ID | Input needed from Newton / Shena | Needed by | Blocks |
|---|---|---|---|
| `I-01` | Certificate of Incorporation (name, reg number, date, directors to list) + KRA PIN decision | Phase 0 | Footer legal line, About, Credentials `KeyFacts`, JSON-LD |
| `I-02` | NCA certificate(s) with category & class, valid practising licence, KRA Tax Compliance, insurance summary, safety policy PDF, AGPO certificate (if any) | Phase 0 | Credentials page, `ProofBar` |
| `I-03` | EBK / BORAQS registration numbers of any engineers, architects or quantity surveyors (staff or named partner firms) | Phase 0 | Architecture & BoQ service pages, professional titles |
| `I-04` | Confirmation of every service Shena delivers directly | Phase 0 | Services index & navigation |
| `I-05` | Meru and Nairobi exact street/building addresses, Google Maps coordinates/links, office hours, confirmed WhatsApp number, domain email choice (Google Workspace vs Zoho Mail) | Phase 0 | Header, Footer, Contact, Locations, GBP |
| `I-06` | Legal entity that owns and contracts machinery hire + whether rates are indicative or quote-only + fuel/operator/transport terms | Phase 0 | Equipment pages & hire contract notice |
| `I-07` | Project list with Shena's role, delivering company, client type, year, location, key figures, completion evidence / client sign-off | Phase 1 | Projects index & case studies |
| `I-08` | Original real project and equipment photographs (landscape & square crops, before/during/after for road works) | Phase 1 | All visual blocks |
| `I-09` | Written permission (signed/dated message or email/WhatsApp screenshot) for Charles Imunde testimonial and any others | Phase 1 | `TestimonialBlock` |
| `I-10` | Machine fleet list: category, make, model, year, capacity/weight, bucket/blade/drum size, photos, service area | Phase 1 | Equipment catalogue |
| `I-11` | Newton's reconciled career dates, portrait photograph, EBK/academic credentials, CIPIT certificate | Phase 1 | Leadership page |
| `I-12` | Vector logo files (SVG full-color for light backgrounds, SVG all-white for dark/photo headers) | Phase 1 | Header, Footer, OG images, favicon |
| `I-13` | Named enquiry handler (`primaryContact`) and committed response time (e.g. "within one working day") | Phase 2 | `ContactAside`, Contact page, confirmation emails |
| `I-14` | Approval of the 8 Insights articles and named content approver | Phase 2 | Insights section |
| `I-15` | ODPC registration check under Kenya's Data Protection Act, 2019 | Phase 2 | `/privacy` notice |

### 2.2 Open decisions for Newton

1. Whether the *Architecture and consultancy* and *Bills of quantities and estimating* service pages launch at Phase 1 (depends on `I-03` EBK/BORAQS registrations).
2. Which legal entity owns the machinery and contracts hire (`Shena Works Limited` vs another entity; `I-06`).
3. Whether equipment pages show indicative hire rates or "Quoted per job" (`I-06`).
4. Whether a Swahili version (`F18`) is added after launch.
5. Target launch date and named content approver (`48-hour` turnaround target).
6. Who creates and manages the official Shena Works LinkedIn and Facebook pages (`sameAs` links).
7. Domain email provider for `@shenaworksltd.com` mailboxes: **Google Workspace** or **Zoho Mail** (`I-05`).

### 2.3 Local visibility & Google Business Profile checklist

- Verify a **Google Business Profile** for **Meru** (and **Nairobi** once the office is staffed), with primary category `General contractor`, secondary categories matching confirmed services (`Road construction company`, `Excavating contractor`, `Construction equipment supplier`, `Interior construction contractor`), real project photos and a WhatsApp review-request link.
- Keep **Name, Address and Phone (NAP)** character-for-character identical on the website, Google Business Profile, LinkedIn, Facebook and Kenyan business directories.

---

## 3. Services seed records

### 3.1 Service 1 — Road construction and earthworks

- **Slug:** `road-construction-and-earthworks`
- **Short title:** `Road construction`
- **Group:** `Roads and earthworks`
- **Status at launch:** `published`
- **Primary search keyword:** `road construction Meru`
- **Form preset:** `type = project`, `ctaLabel = "Request a road quote"`
- **SEO `<title>`:** `Road Construction & Earthworks in Meru & Kenya | Shena Works`
- **SEO description:** `Access roads, grading, murram gravelling, cabro paving, culverts, storm drains and tarmac works in Meru and across Kenya, built with our own plant.`
- **`heroHeadline`:** `Road construction, grading, drainage and paving`
- **`heroLead`:** `We clear, grade, drain and surface access roads, estate roads, commercial compounds and feeder roads in Meru County, Nairobi and across Kenya, using our own earthmoving and compaction plant.`
- **`summary` (card, ≤ 160 chars):** `Grading, murram gravelling, cabro block paving, concrete drains, culverts and tarmac surfacing for access roads and commercial compounds.`
- **`keyFacts`:**
  1. `Where we work` — `Meru County, Nairobi and nationwide across Kenya`
  2. `Typical projects` — `Estate & rural access roads, commercial compounds, petrol stations, parking yards and county road rehabilitation`
  3. `Surfaces` — `Compacted murram/gravel, heavy-duty cabro blocks, surface dressing and hot-mix asphalt (tarmac)`
  4. `Plant used` — `Excavators, motor graders, vibratory rollers and bulldozers from our own fleet`
- **`intro` (Prose):**
  Most road failures in Kenya start below the surface: poor subgrade preparation, inadequate camber, or water that has nowhere to go during the rains. When we build or rehabilitate a road, we start with the ground and the drainage before we lay a stone.

  Because Shena Works owns and operates its own excavators, graders and rollers, we do not wait on third-party plant yards to clear a corridor, cut side drains or compact a sub-base. Whether you need a graded murram access road to a farm or lodge, a cabro-paved compound that takes heavy trucks, or tarmac and culvert works on an urban link road, one site team manages the earthworks, drainage and surfacing from setting out to final rolling.
- **`scope` (`ScopeList`):**
  1. **Earthworks and site clearing** — Bush clearing, topsoil stripping, cut-and-fill to level, and removal of unsuitable black cotton or soft soil.
  2. **Precision grading and gravelling** — Formation shaping, cross-fall (camber) grading with motor graders, murram/gravel spreading, watering and vibratory compaction.
  3. **Drainage and culverts** — Precast concrete pipe culverts, box culverts, concrete side drains (invert block and trapezoidal), mitre drains, headwalls and scour checks.
  4. **Cabro and interlocking block paving** — 60 mm and 80 mm heavy-duty interlocking blocks on compacted quarry dust and sub-base for driveways, lounges, yards and petrol stations.
  5. **Tarmac and asphalt surfacing** — Prime coat, tack coat, asphalt concrete (AC) wearing course and surface dressing (chipping and bitumen) for urban and feeder roads.
  6. **Road repairs and rehabilitation** — Pothole cutting and patching, base reconstruction on failed sections, and shoulder re-grading.
  7. **Kerbs, channels and road furniture** — Precast concrete kerbs, channels, road markings, bollards and regulatory signage.
- **`process` (`ProcessSteps`):**
  1. **Site walk and levels** — We walk the route or compound with you, check existing soil, water flow and access for low-loaders, and measure lengths and widths.
  2. **Specification and itemised quote** — We recommend the layer build-up (sub-base thickness, drainage, murram vs cabro vs tarmac) for your traffic load and give you an itemised quotation.
  3. **Earthworks, drainage and base** — Our plant clears, grades and compacts the formation, installs culverts and side drains, and builds up the compacted sub-base.
  4. **Surfacing, kerbs and handover** — We lay and compact the final surface, set kerbs and markings, clear the site and walk the finished road with you.
- **`faqs` (`FaqAccordion`):**
  1. **Should I choose murram, cabro or tarmac for my access road?**
     It depends on gradient, traffic and budget. Well-compacted murram with proper side drains and culverts works well for farm and rural access roads on moderate slopes. Steep sections, commercial yards, lounges and estate roads carry less maintenance over time when paved with 60 mm or 80 mm cabro blocks or tarmac. We inspect the site first and price both options if you want to compare.
  2. **Why do you price drainage alongside the road surface?**
     Water is what destroys roads in Meru and central Kenya. Without side drains, mitre drains and culverts sized for heavy rain, runoff cuts channels through murram and washes out the bedding under cabro or tarmac. We always check where storm water enters and leaves the road.
  3. **What thickness of cabro blocks do I need?**
     Use 60 mm blocks for domestic driveways, footpaths and car parking. Use 80 mm heavy-duty interlocking blocks over a compacted crusher-run or stabilized sub-base where delivery trucks, tankers or buses will turn and park.
  4. **How do you price a road or paving job?**
     After visiting the site or reviewing your drawings/BoQ, we measure the area in square metres (`m²`) for paving and earthworks, and linear metres (`m`) for kerbs and drains, then quote per item including plant, materials and labour.
  5. **Can you work outside Meru County?**
     Yes. Our main yard is in Meru and we also operate from Nairobi, moving our plant by low-loader to projects across Kenya.
- **`formHeading`:** `Get a quote for road works or earthworks`
- **`formIntro`:** `Tell us the location, approximate length or area, and whether you need grading, drainage, cabro or tarmac.`

---

### 3.2 Service 1a (child) — Cabro paving

- **Slug:** `cabro-paving` (route `/services/road-construction-and-earthworks/cabro-paving`)
- **Parent:** `road-construction-and-earthworks`
- **Short title:** `Cabro paving`
- **Group:** `Roads and earthworks`
- **Status at launch:** `published`
- **Primary search keyword:** `cabro paving Meru`
- **Form preset:** `type = project`, `ctaLabel = "Request a cabro quote"`
- **SEO `<title>`:** `Cabro Paving Contractors in Meru & Nairobi | Shena Works`
- **SEO description:** `Heavy-duty 60mm and 80mm cabro paving in Meru and Nairobi, from subgrade compaction and kerbs to storm drainage. See our work and request a site measure.`
- **`heroHeadline`:** `Cabro paving for compounds, lounges, driveways and yards`
- **`heroLead`:** `Cabro only stays level when the ground underneath it is properly excavated, drained and compacted. We prepare the sub-base with our own rollers and lay 60 mm and 80 mm interlocking blocks across Meru and Nairobi.`
- **`summary`:** `60 mm and 80 mm interlocking cabro paving with machine-compacted sub-base, concrete kerbs and storm drainage for commercial and residential compounds.`
- **`keyFacts`:**
  1. `Block thicknesses` — `60 mm (cars & light areas) and 80 mm heavy-duty (trucks, yards & petrol stations)`
  2. `Base preparation` — `Excavation to level, compacted murram/hardcore sub-base, quarry dust bedding`
  3. `Edge restraint` — `Precast concrete road kerbs, flush kerbs and drainage channels haunched in concrete`
  4. `Completed examples` — `The Pin Hideout, The Black Perch Lounge`
- **`intro`:**
  Anyone can lay paving blocks on a thin layer of quarry dust, and within one rainy season the tyres leave ruts and puddles. Lasting cabro work is mostly civil work: stripping soft topsoil, grading the formation to a fall so water runs to the drains, compacting the sub-base in layers with a vibratory roller, and locking the perimeter with concrete-haunched kerbs before the blocks go down.

  We supply and lay complete cabro packages for hospitality venues, petrol stations, commercial complexes, apartment parking and private compounds.
- **`scope`:**
  1. **Site stripping and excavation** — Removing vegetation and soft soil down to firm formation and carting away spoil.
  2. **Sub-base construction and compaction** — Spreading and compacting graded murram, hardcore or crusher-run with vibratory rollers to the required falls.
  3. **Storm-water drainage and channels** — Concrete side channels, grated catch-pits and pipe culverts so rain clears off the paved surface quickly.
  4. **Kerbs and edge restraints** — Setting precast road kerbs, mountable kerbs and edge beams on concrete beds and haunching so blocks cannot spread under turning wheels.
  5. **Quarry dust screeding and block laying** — Screeding 30–50 mm of quarry dust, laying 60 mm or 80 mm blocks in herringbone, stretcher or basket-weave patterns, and cutting edges cleanly with a disc cutter.
  6. **Joint sanding and plate compaction** — Vibrating the blocks into the bedding and brushing fine dry sand into the joints to lock the pavement.
- **`process`:**
  1. **Measure and traffic check** — We measure the area (`m²`), check soil conditions and ask what vehicles will use the surface.
  2. **Drainage and levels plan** — We set falls toward drains or channels so water never ponds in front of entrances or parking bays.
  3. **Groundworks, base and kerbs** — Our plant excavates and compacts the sub-base and our masons fix all kerbs and channels.
  4. **Screeding, laying and compaction** — We lay the blocks, cut cleanly around manholes and corners, compact and sand the joints.
- **`faqs`:**
  1. **What drives the cost of cabro paving per square metre?**
     Four things: how much soft soil has to be dug out and replaced, the thickness of the compacted sub-base needed for your vehicles, the length of kerbs and drains around the edges, and whether you choose 60 mm or 80 mm blocks (and standard grey vs coloured/patterned blocks).
  2. **Why does cabro sink or develop ruts after a few months?**
     Almost always because the contractor skipped sub-base compaction, laid blocks directly over black cotton soil, used too thick a layer of loose quarry dust, or left water to soak under the blocks without drainage.
  3. **Which laying pattern is strongest for cars and trucks?**
     45-degree or 90-degree herringbone locks blocks together in both directions under braking and turning tyres, so we recommend herringbone for driveways, parking bays and commercial yards.
  4. **How long does a cabro job take?**
     A typical 500–1,500 m² compound takes between two and four weeks depending on the depth of excavation, drainage works and weather.
- **`formHeading`:** `Request a site measure and cabro quote`
- **`formIntro`:** `Tell us where the site is, the approximate area in square metres (if known), and whether it is for a home, lounge, apartments or heavy commercial vehicles.`

---

### 3.3 Service 2 — General construction

- **Slug:** `general-construction`
- **Short title:** `General construction`
- **Group:** `Buildings and interiors`
- **Status at launch:** `published`
- **Primary search keyword:** `building contractors Meru`
- **Form preset:** `type = project`, `ctaLabel = "Request a building quote"`
- **SEO `<title>`:** `Building Contractors in Meru & Nairobi | Shena Works`
- **SEO description:** `Commercial, hospitality and residential building contractors in Meru and Nairobi. Lounges, cottages, villas, apartments and commercial premises.`
- **`heroHeadline`:** `Commercial, hospitality and residential building construction`
- **`heroLead`:** `We build lounges, cottages, villas, commercial buildings and family homes in Meru and Nairobi — handling the groundworks, structural frame, masonry, roofing, services and finishes under one contract.`
- **`summary`:** `Turnkey building construction for hospitality venues, commercial premises, cottages, villas and residential homes, from foundations to handover.`
- **`keyFacts`:**
  1. `Sectors` — `Hospitality (lounges, cottages, restaurants), commercial buildings and residential homes`
  2. `Structure` — `Foundations, reinforced concrete frames, natural stone and block masonry, structural steelwork`
  3. `Site works included` — `Site grading, storm drainage, cabro parking and perimeter walls`
  4. `Completed examples` — `The Black Perch Lounge, Dukes Cottages Restaurant & Garden, Stone Lounge & Villas`
- **`intro`:**
  Building a lounge, cottage development, commercial block or home takes coordination between the people digging the ground, the structural team pouring concrete, the masons, roofers, plumbers, electricians and finishers. When those trades are split across separate informal agreements, delays and finger-pointing follow.

  Shena Works takes responsibility for the whole build. We set out from your approved drawings and bill of quantities, run the site with a dedicated supervisor, coordinate the external civil works (access, drainage and parking) alongside the building, and report progress clearly at every stage.
- **`scope`:**
  1. **Substructure and foundations** — Site clearance, bulk excavation, strip and pad foundations, column bases, plinth walls, hardcore packing, anti-termite treatment and damp-proof membranes.
  2. **Reinforced concrete and structural steel** — Columns, beams, suspended slabs, staircases, retaining walls and structural steel roof/pavilion frames.
  3. **Masonry and external walls** — Dressed natural stone, machine-cut quarry stone, hollow concrete blockwork and architectural stone facades.
  4. **Roofing and rainwater goods** — Timber and steel roof trusses, versatile/box-profile sheets, stone-coated tiles, flat-roof waterproofing, gutters and downpipes.
  5. **Mechanical, electrical and plumbing (MEP) first & second fix** — Coordination of concealed conduits, power and lighting, water supply, drainage, biodigesters/septic tanks and specialist wellness plumbing (saunas, steam rooms, carwash bays).
  6. **Plastering, flooring, joinery and finishes** — Internal and external plastering, ceramic/porcelain/grass-tile flooring, ceilings, doors, windows, painting and external works.
  7. **Renovations and structural extensions** — Refitting existing commercial properties, converting spaces for hospitality use, and adding new wings or floors.
- **`process`:**
  1. **Drawings and BoQ review** — We review your architectural and structural drawings and price your Bill of Quantities (or visit the site to prepare a detailed scope estimate).
  2. **Contract, programme and mobilisation** — We agree the contract sum, payment milestones and build schedule, then mobilise plant, site hoarding and storage.
  3. **Staged construction and inspections** — We build stage by stage — substructure, frame, walling, roofing, services and finishes — with inspections at each milestone before the next stage is covered.
  4. **Snagging, testing and handover** — We test all plumbing and electrical installations, complete a joint snagging walk-through with you, and hand over the keys and clean site.
- **`faqs`:**
  1. **Do I need finished drawings and a Bill of Quantities before asking for a quote?**
     If you already have approved drawings and a BoQ, send them with your enquiry and we will price them directly. If you are still at the idea stage, contact us anyway — we can inspect the plot and advise on the next steps before construction starts.
  2. **How do payments work during a building project?**
     We work on agreed milestone stages or monthly valuations of work actually completed on site (for example: substructure complete, frame complete, roof on, plastering complete, finishes and handover), never 100% upfront.
  3. **Can you build both the premises and the parking, drainage and access road?**
     Yes. That is one of the main reasons hospitality and commercial clients in Meru choose Shena Works — our road and earthmoving plant prepares the site, storm drainage and cabro parking while our building team puts up the structures.
  4. **Can you handle specialist hospitality facilities like lounges, restaurants, saunas and carwashes?**
     Yes. Our team built The Black Perch Lounge in Meru (lounges, restaurant areas, sauna, massage rooms and commercial carwash bays) and managed construction on Dukes Cottages, Restaurant & Garden.
- **`formHeading`:** `Request a building quote`
- **`formIntro`:** `Attach your drawings or Bill of Quantities if you have them, or tell us what you plan to build and where the plot is.`

---

### 3.4 Service 3 — Interior design

- **Slug:** `interior-design`
- **Short title:** `Interior design`
- **Group:** `Buildings and interiors`
- **Status at launch:** `published` `[CONFIRM: I-04 — Newton confirms interior design & fit-out is delivered at launch]`
- **Primary search keyword:** `interior design Meru`
- **Form preset:** `type = consultation`, `ctaLabel = "Request a consultation"`
- **SEO `<title>`:** `Interior Design & Commercial Fit-Out in Meru | Shena Works`
- **SEO description:** `Interior design and turnkey fit-outs for lounges, restaurants, hotels, offices and homes in Meru and Nairobi. Space planning, lighting, joinery and finishes.`
- **`heroHeadline`:** `Interior design and fit-out for hospitality, commercial and residential spaces`
- **`heroLead`:** `We plan layouts, choose durable materials, design lighting and build custom joinery and finishes for lounges, restaurants, cottages, offices and homes in Meru and Nairobi.`
- **`summary`:** `Space planning, lighting, custom joinery, flooring and full interior fit-outs for hospitality venues, commercial spaces and homes.`
- **`keyFacts`:**
  1. `Spaces` — `Hospitality lounges, restaurants, cottages, offices, retail units and family homes`
  2. `Scope` — `Space planning, 3D concept visuals, material boards, lighting, joinery and full site fit-out`
  3. `Delivered by` — `One build team from shell to finished interior`
  4. `Completed examples` — `The Black Perch Lounge (Meru), Stone Lounge & Villas`
- **`intro`:**
  A hospitality venue or home is judged by how it feels to sit in, how traffic moves between the bar, kitchen, seating and washrooms, how the lighting looks after dark, and whether the finishes survive daily use. When the interior designer and the builder are separate, ideas on paper often get lost or overpriced on site.

  Because Shena Works both designs and builds interiors, we choose materials, ceiling details, lighting and joinery that we know how to source and install cleanly in Kenya.
- **`scope`:**
  1. **Space planning and layout** — Seating capacity, bar and service workflows, guest circulation, acoustic separation and furniture layouts.
  2. **Finishes and material selection** — Porcelain and ceramic tiling, grass-tile and indoor-outdoor lounge flooring, natural stone feature walls, wall textures and washable commercial paints.
  3. **Lighting and ambiance** — Warm ambient and task LED lighting, recessed ceiling bulkheads, pendant and feature fixtures, and outdoor pavilion lighting.
  4. **Custom joinery and fittings** — Reception and bar counters, shelving, booths, wardrobes, kitchen cabinetry and vanity units built to measure.
  5. **Ceilings and acoustic treatments** — Gypsum bulkheads, timber/baffle features and acoustic control for lounges and dining spaces.
  6. **Turnkey fit-out execution** — Managing all electrical, plumbing, tiling, carpentry and painting trades through to final styling and handover.
- **`process`:**
  1. **Site visit and brief** — We measure the space, discuss how it will be used (guest numbers, brand feel, budget) and check existing services.
  2. **Layout, materials and pricing** — We propose a floor layout, finishes and lighting plan with an itemised fit-out budget.
  3. **Off-site fabrication and site prep** — Joinery is fabricated while electrical, plumbing, ceiling and floor preparation happen on site.
  4. **Installation, lighting focus and handover** — We install finishes and fittings, test and aim the lighting, clean the space and hand over ready for use.
- **`faqs`:**
  1. **Can you fit out an existing building that someone else built?**
     Yes. We take on shell-and-core commercial spaces as well as refurbishments of existing lounges, restaurants, offices and homes.
  2. **Do you only provide drawings, or do you also do the actual fit-out work?**
     We focus on design-and-build fit-outs where our team carries out the ceiling, flooring, lighting, joinery and painting works on site so the finished room matches the agreed plan and budget.
  3. **How do you keep hospitality interiors durable?**
     High-traffic lounges and restaurants need commercial-grade slip-resistant floor tiles, moisture-resistant counters, cleanable wall finishes and accessible LED drivers. We specify materials built for heavy foot traffic rather than fragile domestic finishes.
  4. **How much does an interior fit-out cost?**
     Cost depends on the floor area, the condition of the shell, and the level of custom joinery and lighting. After measuring the space and agreeing the scope, we give you an itemised quotation so you can adjust finishes to fit your budget.
- **`formHeading`:** `Book an interior consultation`
- **`formIntro`:** `Tell us what kind of space you are fitting out, where it is, and when you want it open.`

---

### 3.5 Service 4 — Project management

- **Slug:** `project-management`
- **Short title:** `Project management`
- **Group:** `Planning and delivery`
- **Status at launch:** `published`
- **Primary search keyword:** `construction project management Kenya`
- **Form preset:** `type = consultation`, `ctaLabel = "Request a consultation"`
- **SEO `<title>`:** `Construction Project Management in Meru & Nairobi | Shena Works`
- **SEO description:** `On-site construction project management in Meru and Nairobi: scheduling, contractor coordination, quality inspections, cost control and handover.`
- **`heroHeadline`:** `Construction project management and site supervision`
- **`heroLead`:** `For developers and property owners who want experienced eyes on site every day — managing the programme, checking materials and workmanship, controlling variations and reporting clearly.`
- **`summary`:** `End-to-end site supervision, scheduling, subcontractor coordination, quality inspections and cost tracking for private and commercial builds.`
- **`keyFacts`:**
  1. `For whom` — `Private developers, diaspora builders, hospitality owners and commercial clients`
  2. `Core stages` — `Initiation, planning, execution, monitoring & cost control, closure & handover`
  3. `Reporting` — `Scheduled site progress reports with dated photographs, cost updates and milestone sign-offs`
  4. `Lead experience` — `Hospitality complexes and urban road inspection experience`
- **`intro`:**
  Many building projects in Kenya go over budget or stall because the owner cannot be on site every day to verify material deliveries, check reinforcement before concrete is poured, or keep subcontractors working in the right sequence.

  Led by Managing Director Newton Muthee — who has managed hospitality developments in Meru County and inspected road works for the Kenya Urban Roads Authority — Shena Works provides structured project management from pre-construction planning through to final snagging and handover.
- **`scope`:**
  1. **Pre-construction review and planning** — Reviewing drawings, bills of quantities and permits; setting up a realistic master programme and procurement schedule.
  2. **Contractor and trade coordination** — Sequencing civil, structural, MEP and finishing trades so one team does not hold up the next or damage completed work.
  3. **Quality assurance and milestone inspections** — Checking setting out, trench depths, steel reinforcement, concrete mixes, road compaction and finishes against specifications before work is covered up.
  4. **Cost control and valuation verification** — Measuring completed work on site before interim payments are certified, tracking material usage and assessing variation claims.
  5. **Site safety and regulatory compliance** — Enforcing daily site safety practices, county permit conditions and environmental requirements.
  6. **Snagging, testing and handover** — Running pre-handover inspections, logging defects, verifying rectification and closing out final accounts.
- **`process`:**
  1. **Brief and project audit** — Whether your project is about to start or is already underway, we review the drawings, budget, contracts and current site status.
  2. **Programme and control baseline** — We establish the schedule, milestone inspection points, reporting routine and payment verification process.
  3. **Site supervision and reporting** — We supervise execution on site, coordinate trades and send you clear, dated progress and cost updates.
  4. **Snagging and closure** — We oversee testing, snagging rectification and final handover documentation.
- **`faqs`:**
  1. **Can you manage a project if I live in Nairobi or abroad and am building in Meru?**
     Yes. Many clients need a trusted technical representative on the ground in Meru who verifies deliveries, checks quality at every stage and sends regular photo and cost reports before milestones are paid.
  2. **What is the difference between hiring Shena Works as general contractor versus project manager?**
     As general contractor, we employ the site teams, supply the plant and materials, and contract to build the works for an agreed sum. As project manager, we act on your behalf to plan, supervise and verify the work of the contractors and suppliers on your project.
  3. **Can you step in on a project that has already started?**
     Yes. We start with a site and commercial audit — measuring what has been built against what has been paid, checking structural and workmanship quality, and setting a clear recovery programme for the remaining works.
  4. **How do you charge for project management?**
     Depending on the project size and how often we are needed on site, we agree either a fixed monthly supervision fee for the build duration or a percentage of the construction value, stated upfront in writing.
- **`formHeading`:** `Talk to us about managing your build`
- **`formIntro`:** `Tell us where the project is, what stage it is at, and what support you need on site.`

---

### 3.6 Service 5 (GATED) — Architecture and consultancy

- **Slug:** `architecture-and-consultancy`
- **Short title:** `Architecture`
- **Group:** `Planning and delivery`
- **Status at launch:** `draft` (**Gate `I-03`:** stays in `draft` until a BORAQS-registered architect — in-house or a named partner architectural practice — is confirmed and recorded on the service.)
- **Primary search keyword:** `architectural design Meru`
- **Form preset:** `type = consultation`, `ctaLabel = "Request a consultation"`
- **SEO `<title>`:** `Architectural Design & Building Consultancy in Meru | Shena Works`
- **SEO description:** `Architectural planning, 2D working drawings, 3D visualisations, site feasibility and county approval coordination in Meru and Nairobi.`
- **`heroHeadline`:** `Architectural planning, working drawings and site feasibility`
- **`heroLead`:** `Practical architectural design and working drawings coordinated with structural engineering and real construction costs from the start.` `[CONFIRM: delivered in-house by registered architect or with named partner practice]`
- **`summary`:** `Site feasibility, concept design, 2D construction drawings, 3D visualisations and county approval coordination.`
- **`keyFacts`:**
  1. `Deliverables` — `Concept layouts, 3D visualisations, architectural working drawings and approval sets`
  2. `Sectors` — `Hospitality, commercial developments and custom residential homes`
  3. `Delivered with` — `[CONFIRM: Name and BORAQS reg. no. of registered architect / partner practice]`
  4. `Coordination` — `Aligned with structural engineering, BoQ estimating and site construction`
- **`intro`:**
  Good drawings do more than pass approvals — they fit the slope and drainage of the plot, respect your budget, and give the site team clear dimensions to build from without guesswork. Working with `[CONFIRM: registered architect / partner firm name]`, we take projects from first site feasibility through to county submission and construction working drawings.
- **`scope`:**
  1. **Site feasibility and brief development** — Assessing plot access, slope, orientation, zoning and utilities to establish what fits the site and budget.
  2. **Concept design and spatial planning** — Floor plans, room relationships, site master-planning and traffic/parking layouts.
  3. **3D visualisations** — Exterior and interior 3D renders so you can see proportions and materials before committing to construction.
  4. **Construction working drawings** — Dimensioned plans, sections, elevations, door/window schedules and construction details.
  5. **Structural and MEP coordination** — Coordinating architectural layouts with structural engineers and services requirements.
  6. **County approval coordination** — Preparing and tracking submission drawings for county planning approval.
- **`process`:**
  1. **Plot visit and brief** — We visit the plot, review the survey/beacons and agree your accommodation brief and target budget.
  2. **Concept plans and 3D views** — We prepare initial floor layouts and 3D massing for your review and adjustments.
  3. **Detailed working drawings** — Once the layout is signed off, we produce complete architectural drawings coordinated with structural design.
  4. **Approvals and transition to build** — Drawings are submitted for statutory approvals and handed to the estimating/construction team for pricing.
- **`faqs`:**
  1. **Who signs the architectural drawings for county approval?**
     All statutory submission drawings are prepared and signed with `[CONFIRM: Name and BORAQS registration number]`.
  2. **Why design with a team that also builds?**
     Drawings produced without construction input often exceed the client's budget once priced. Designing alongside estimators and site engineers keeps structural spans, roof geometry and material choices grounded in real Kenyan build costs.
  3. **What do I need to bring to a first meeting?**
     Bring a copy of the title deed or survey map showing the plot dimensions, any photos of the site, and a rough list of the spaces you need and your target budget.
  4. **Can you prepare drawings if I plan to build in phases?**
     Yes. Many hospitality and residential projects are master-planned as a whole and detailed so Phase 1 can open and operate cleanly while later phases are built.
- **`formHeading`:** `Book an architectural consultation`
- **`formIntro`:** `Tell us where your plot is and what you would like to design.`

---

### 3.7 Service 6 (GATED) — Bills of quantities and estimating

- **Slug:** `bills-of-quantities-and-estimating`
- **Short title:** `Bills of quantities`
- **Group:** `Planning and delivery`
- **Status at launch:** `draft` (**Gate `I-03`:** stays in `draft` until a BORAQS-registered Quantity Surveyor is confirmed for statutory QS work, OR Newton approves publishing it purely as "Construction estimating and tender pricing" without claiming statutory QS registration.)
- **Primary search keyword:** `bill of quantities Kenya`
- **Form preset:** `type = consultation`, `ctaLabel = "Request an estimate"`
- **SEO `<title>`:** `Bills of Quantities & Construction Estimating | Shena Works`
- **SEO description:** `Itemised Bills of Quantities (BoQ), quantity takeoffs, construction cost estimates, tender preparation and interim valuations in Meru and Nairobi.`
- **`heroHeadline`:** `Bills of quantities, quantity takeoffs and construction cost estimates`
- **`heroLead`:** `Know what your road or building will cost before work starts on site — itemised quantities of materials, plant and labour that let you budget accurately and compare quotes fairly.`
- **`summary`:** `Quantity takeoffs, itemised Bills of Quantities (BoQ), cost estimates, tender pricing and interim payment valuations.`
- **`keyFacts`:**
  1. `Deliverables` — `Preliminaries, preambles, measured works, provisional sums, prime cost sums and contingencies`
  2. `Used for` — `Project budgeting, bank financing, tender comparisons and stage payments`
  3. `Prepared by` — `[CONFIRM: Registered QS name/partner OR Shena estimating team]`
  4. `Turnaround` — `Typically 5–15 working days depending on drawing completeness`
- **`intro`:**
  Starting a build on a single lump-sum figure or a rough per-square-metre guess is the fastest way to run out of money mid-project. A proper Bill of Quantities breaks your drawings down into every cubic metre of excavation and concrete, every square metre of walling, roofing and paving, and every metre of pipe and drain — so you see exactly what you are paying for.
- **`scope`:**
  1. **Preliminaries and preambles** — Defining site setup requirements, insurances, supervision, material standards and workmanship benchmarks.
  2. **Measured works takeoffs** — Itemised measurement of earthworks, substructure, concrete frame, masonry, roofing, finishes, plumbing, electrical and external civil works from your drawings.
  3. **Prime Cost (PC) and Provisional Sums** — Clear allowances for client-selected fixtures and specialist works so there are no hidden gaps in the budget.
  4. **Contingency and risk allowances** — Sensible reserves for unforeseen ground or site conditions.
  5. **Contractor bid evaluation** — Comparing quotes line by line on the same quantities to spot under-priced or over-priced items.
  6. **Interim valuations and final accounts** — Measuring work completed on site at each milestone and assessing variations fairly.
- **`process`:**
  1. **Drawings check** — You send us your architectural and structural drawings (PDF or CAD) and tell us the site location and finish level you want.
  2. **Quantity takeoff** — We measure every trade item systematically from the drawings.
  3. **Pricing and review** — We apply current Meru/Nairobi material, plant and labour rates (or issue an unpriced BoQ for tendering) and walk you through the summary.
  4. **Cost control on site** — During construction, the same BoQ is used to track progress, value milestones and control variations.
- **`faqs`:**
  1. **Why do I need a Bill of Quantities if I already have architectural drawings?**
     Drawings show what the building looks like; a BoQ lists the exact quantities of materials and work needed to build it. Without a BoQ, three contractors will price three different assumptions and you cannot compare their quotes fairly.
  2. **What drawings do you need to prepare a BoQ?**
     Ideally both architectural working drawings and structural engineering drawings. If you only have architectural plans so far, we can prepare an indicative cost estimate and refine it once structural drawings are ready.
  3. **Can you price a BoQ that my own Quantity Surveyor has already prepared?**
     Yes — send the unpriced BoQ and drawings through our quote form and we will submit a priced tender for the construction works.
  4. **Are your estimates based on current local rates?**
     Yes. Because we actively buy materials and run plant on road and building sites in Meru and Nairobi, our estimates reflect current quarry, steel, cement, bitumen, fuel and labour prices on the ground.
- **`formHeading`:** `Request a Bill of Quantities or cost estimate`
- **`formIntro`:** `Attach your drawings (PDF) and tell us where the project is located.`

---
## 4. Project case study seed records

### 4.0 Filter taxonomy (`SITE-PLAN.md` 5.9 & 6.7)

| Filter chip (Home) | Maps to `services` slugs |
|---|---|
| `All` | all |
| `Roads and paving` | `road-construction-and-earthworks`, `cabro-paving` |
| `Buildings` | `general-construction` |
| `Hospitality` | projects with `clientType = "Hospitality"` |
| `Interiors` | `interior-design` |

Every project record requires `role` and `deliveringCompany` before it can publish (spec section 3 publishing gate).

---

### 4.1 Case study 1 — The Black Perch Lounge

- **Title:** `The Black Perch Lounge`
- **Slug:** `the-black-perch-lounge`
- **Location:** `town: "Meru"`, `county: "Meru County"` `[CONFIRM: exact area/road in Meru]`
- **Client type:** `Commercial & Hospitality`
- **Status:** `Completed`
- **Year:** `[CONFIRM: YYYY, e.g. 2024]`
- **Shena's role:** `General Contractor & Project Manager` `[CONFIRM: I-07]`
- **Delivering company:** `Shena Works Limited` `[CONFIRM: I-07]`
- **Services linked:** `general-construction`, `interior-design`, `cabro-paving`, `road-construction-and-earthworks`, `project-management`
- **Equipment used:** Excavator, Motor grader, Vibratory roller
- **Featured on Home:** `true`
- **SEO `<title>`:** `The Black Perch Lounge, Meru | Shena Works Projects`
- **SEO description:** `Construction, interior fit-out, wellness facilities, carwash bays and cabro parking for The Black Perch Lounge in Meru County by Shena Works.`
- **Key figures (`keyFigures[]`):**
  - `[CONFIRM: m²] m²` — `Built and paved area`
  - `[CONFIRM: N] months` — `Build duration`
  - `5 zones` — `Lounge pavilions, restaurant, sauna & massage, carwash bays & cabro parking`
- **Case study copy (195 words total):**
  - **`h2` The brief:**
    The client wanted to turn a Meru site into a multi-service hospitality and lifestyle destination — combining modern indoor and outdoor lounge pavilions, a restaurant, sauna, steam and massage rooms, commercial carwash bays and customer parking on a single plot. Every zone needed its own plumbing, drainage and atmosphere while sharing one coherent layout and entrance.
  - **`h2` The work:**
    We handled both the building construction and the site civil works. Our earthmoving team cleared and graded the plot, installed storm-water drainage and petrol/oil interceptors for the carwash bays, compacted the sub-base and laid heavy-duty cabro paving across the drive-in and parking areas. On the buildings and interiors, we built the lounge pavilions and wellness rooms, installed moisture-resistant plumbing and finishes for the sauna, steam and massage suites, laid custom grass-tile and porcelain flooring in the social areas, and fitted warm architectural and mood lighting for evening service.
  - **`h2` The result:**
    The Black Perch Lounge opened as a complete day-to-night venue where guests can use the carwash, wellness rooms, restaurant and lounges without congestion or drainage issues during heavy Meru rains.
- **Gallery brief (6–12 real photos required, `I-08`):**
  1. Wide exterior view of the lounge pavilions and cabro forecourt at dusk (hero image).
  2. Lounge interior showing custom grass-tile flooring, seating and ambient ceiling lighting.
  3. Cabro-paved parking and drive-through circulation showing kerbs and surface drainage.
  4. Commercial carwash bays and drainage channels.
  5. Wellness area: sauna/steam or massage room finishes.
  6. Construction/earthworks progress photo showing grading or cabro sub-base compaction.

---

### 4.2 Case study 2 — The Pin Hideout

- **Title:** `The Pin Hideout`
- **Slug:** `the-pin-hideout`
- **Location:** `town: "[CONFIRM: town]"`, `county: "Meru County"` `[CONFIRM: county]`
- **Client type:** `Commercial & Hospitality`
- **Status:** `Completed`
- **Year:** `[CONFIRM: YYYY]`
- **Shena's role:** `Civil Works & Cabro Paving Contractor; Project Management` `[CONFIRM: I-07]`
- **Delivering company:** `Shena Works Limited` `[CONFIRM: I-07]`
- **Services linked:** `road-construction-and-earthworks`, `cabro-paving`, `project-management`
- **Equipment used:** Excavator, Motor grader, Vibratory roller
- **Testimonial linked:** Charles Imunde, Director, The Pin Hideout (once written permission is uploaded)
- **Featured on Home:** `true`
- **SEO `<title>`:** `The Pin Hideout Cabro Paving & Access Roads | Shena Works`
- **SEO description:** `Site grading, storm-water drainage, access road works and heavy-duty cabro paving for The Pin Hideout commercial complex by Shena Works.`
- **Key figures:**
  - `[CONFIRM: m²] m²` — `Cabro paving laid`
  - `[CONFIRM: m] m` — `Access road & drainage built`
  - `[CONFIRM: weeks] weeks` — `Delivery time`
- **Case study copy (175 words total):**
  - **`h2` The brief:**
    The Pin Hideout needed an all-weather access road and a level, well-drained cabro compound capable of handling daily guest vehicles and delivery trucks without mud in the wet season or dust in the dry season.
  - **`h2` The work:**
    We started by stripping the soft surface soil and grading the approach road and parking compound to clear falls. Using our own grader and vibratory roller, we built up and compacted the sub-base in layers, installed concrete side drains and culverts at the water crossings, and fixed concrete-haunched road kerbs around every bay and island. We then screeded quarry dust bedding, laid interlocking cabro blocks in a herringbone pattern, cut clean edges around inspection chambers, and compacted and sanded the joints.
  - **`h2` The result:**
    The finished access road and compound drain cleanly during downpours and have stayed level under daily commercial traffic, giving visitors a clean approach from the main road to the entrance.
- **Gallery brief (6–10 real photos, `I-08`):**
  1. Completed cabro-paved compound and entrance at The Pin Hideout (hero).
  2. Approach road showing cross-fall, kerbs and side drainage.
  3. Close-up of herringbone cabro joints and kerb haunching.
  4. Earthworks stage: motor grader shaping the formation.
  5. Compaction stage: vibratory roller on the murram sub-base.
  6. Block-laying crew screeding quarry dust and laying cabro.

---

### 4.3 Case study 3 — Dukes Cottages, Restaurant & Garden

- **Title:** `Dukes Cottages, Restaurant & Garden`
- **Slug:** `dukes-cottages-restaurant-and-garden`
- **Location:** `town: "Meru"`, `county: "Meru County"`
- **Client type:** `Hospitality`
- **Status:** `Completed`
- **Year:** `2020–2021`
- **Shena's role:** `Site Project Manager (delivered by Newton Muthee prior to founding Shena Works)`
- **Delivering company:** `Dukes Limited`
- **Services linked:** `general-construction`, `project-management`
- **Featured on Home:** `true`
- **SEO `<title>`:** `Dukes Cottages, Restaurant & Garden, Meru | Shena Works`
- **SEO description:** `Site project management for the Dukes Cottages, Restaurant & Garden hospitality complex in Meru County, supervised by Newton Muthee for Dukes Limited.`
- **Key figures:**
  - `13 months` — `On-site supervision (Feb 2020 – Feb 2021)`
  - `3 elements` — `Guest cottages, full-service restaurant & landscaped gardens`
- **Case study copy (180 words total):**
  - **`h2` The brief:**
    Dukes Cottages, Restaurant & Garden in Meru County brought together detached guest cottages, a central dining restaurant and landscaped grounds on one site. The build required tight daily coordination of masonry, roofing, plumbing, electrical, kitchen/restaurant fit-out and external landscaping teams so all units reached completion together.
  - **`h2` The work:**
    Before founding Shena Works Limited, our Managing Director Newton Muthee served on contract as Site Project Manager for Dukes Limited from February 2020 to February 2021. On site every day, he planned trade sequences, allocated workforces, managed material inventories and deliveries, checked structural and finishing quality across each cottage and the restaurant block, and coordinated the garden pathways and external drainage.
  - **`h2` The result:**
    The cottages, restaurant and grounds were completed to specification and handed over ready for guests — establishing the hands-on hospitality site management approach we now bring to Shena Works projects across Meru.
- **Gallery brief (6–8 real photos with permission, `I-08`):**
  1. Completed guest cottages and landscaped garden path (hero).
  2. Restaurant building exterior and outdoor dining terrace.
  3. Cottage roofing, stonework and veranda detail.
  4. Landscaped grounds, pathways and drainage integration.
  5. Construction-phase site supervision photo.
  6. Interior finish detail of a completed cottage or dining area.

---

### 4.4 Case study 4 — Stone Lounge & Villas

- **Title:** `Stone Lounge & Villas`
- **Slug:** `stone-lounge-and-villas`
- **Location:** `town: "[CONFIRM: town]"`, `county: "[CONFIRM: county, e.g. Meru County]"`
- **Client type:** `Hospitality & Residential`
- **Status:** `Completed` `[CONFIRM: status & year]`
- **Year:** `[CONFIRM: YYYY]`
- **Shena's role:** `[CONFIRM: e.g. General Contractor / Building & Fit-Out Contractor]`
- **Delivering company:** `[CONFIRM: Shena Works Limited or other entity]`
- **Services linked:** `general-construction`, `interior-design`
- **Featured on Home:** `true`
- **SEO `<title>`:** `Stone Lounge & Villas | Shena Works Projects`
- **SEO description:** `Natural stone masonry, structural works and contemporary interior finishes for Stone Lounge & Villas by Shena Works.`
- **Key figures:**
  - `[CONFIRM: N] units` — `Villas & lounge pavilion`
  - `[CONFIRM: m²] m²` — `Built floor area`
- **Case study copy (165 words total):**
  - **`h2` The brief:**
    Stone Lounge & Villas paired private residential villas with an upscale social lounge, using dressed natural stone facades on the outside and contemporary finishes inside. The client wanted buildings that looked rooted in the landscape while staying dry, bright and easy to maintain.
  - **`h2` The work:**
    We executed the structural foundations and frames, built the load-bearing and architectural natural stone masonry walls with clean mortar jointing, erected the roofs, and completed the internal plastering, tiling, joinery, lighting and bathroom fit-outs. Externally, we graded the compound, built storm drains and paved the approach and parking areas. `[CONFIRM: exact scope delivered by Shena]`
  - **`h2` The result:**
    The finished villas and lounge combine heavy natural stone character with clean modern interiors, delivered on a well-drained, accessible compound.
- **Gallery brief (6–8 real photos, `I-08`):**
  1. Exterior elevation showing natural stone facade and roof lines (hero).
  2. Villa entrance and veranda detail.
  3. Lounge interior showing stone feature wall, lighting and flooring.
  4. Masonry workmanship close-up.
  5. Compound paving and drainage.
  6. Completed villa interior bedroom or living space.

---

### 4.5 Case study 5 — Access Road Grading, Culverts & Drainage Works

- **Title:** `[CONFIRM: Specific road name, e.g. Makutano–... Access Road Grading & Drainage]`
- **Slug:** `meru-access-road-grading-and-drainage` (update slug once exact road name is confirmed)
- **Location:** `town: "[CONFIRM: Ward / Town]"`, `county: "Meru County"`
- **Client type:** `[CONFIRM: County Government / Road Agency / Private Estate Developer]`
- **Status:** `Completed`
- **Year:** `[CONFIRM: YYYY]`
- **Shena's role:** `[CONFIRM: Main Civil Contractor / Earthworks & Drainage Subcontractor]`
- **Delivering company:** `[CONFIRM: Shena Works Limited / Joleen Traders Limited]`
- **Services linked:** `road-construction-and-earthworks`
- **Equipment used:** Motor grader, Excavator, Vibratory roller
- **Featured on Home:** `true`
- **SEO `<title>`:** `Road Grading, Culverts & Drainage in Meru | Shena Works`
- **SEO description:** `Precision road grading, murram gravelling, culvert installation and storm-water drainage in Meru County by Shena Works.`
- **Key figures:**
  - `[CONFIRM: X.X] km` — `Road length graded and compacted`
  - `[CONFIRM: N]` — `Culvert lines installed`
  - `[CONFIRM: m] m` — `Side & mitre drains cut`
- **Case study copy (175 words total):**
  - **`h2` The brief:**
    Seasonal rains had cut deep gullies along `[CONFIRM: road name/location]`, washing out low crossings and leaving the route impassable to cars and farm transport after heavy showers. The brief was to restore the road profile, put in permanent cross-drainage and compact a durable running surface.
  - **`h2` The work:**
    Our excavator cleared encroaching bush, opened blocked outlets and excavated trenches at the low crossing points, where we laid precast concrete pipe culverts with stone-pitched headwalls and aprons. Our motor grader then reshaped the road formation to a true camber, cut trapezoidal side drains and mitre drains to lead water safely off the reserve, and spread selected murram gravel. Finally, we watered and compacted the surface in passes with our vibratory roller.
  - **`h2` The result:**
    Storm water now discharges through the side drains and culverts instead of running down the wheel tracks, keeping the road open year-round for residents and deliveries.
- **Gallery brief (6–8 before/during/after photos, `I-08`):**
  1. Finished graded and compacted road showing camber and clean side drains (hero).
  2. Before photo showing eroded surface or washed-out crossing.
  3. Excavator trenching and lowering concrete culvert rings.
  4. Completed culvert headwall and stone pitching.
  5. Motor grader shaping the formation and cutting side drains.
  6. Vibratory roller compacting watered murram layer.

---

## 5. Equipment categories, machine seed records and hire FAQs

### 5.1 Equipment categories (`equipment-categories` collection)

| # | Name (`name`) | Singular | Slug (`slug`) | Primary search keyword | `heroHeadline` | `heroLead` | `summary` |
|---|---|---|---|---|---|---|---|
| 1 | `Excavators` | `excavator` | `excavators` | `excavator hire Meru` | `Excavator hire in Meru and across Kenya` | `Crawler and wheeled excavators with experienced operators for bulk excavation, foundation trenching, culvert installation, quarry loading, dam desilting and demolition.` | `Deep excavations, trenching, culvert laying, rock/quarry loading, dam digging and site clearing.` |
| 2 | `Motor graders` | `motor grader` | `graders` | `grader hire Kenya` | `Motor grader hire in Meru and across Kenya` | `Precision motor graders with skilled operators for access road formation, camber shaping, murram spreading, side-drain cutting and bank sloping.` | `Road formation grading, camber shaping, murram spreading, side-drain cutting and sub-base leveling.` |
| 3 | `Rollers and compactors` | `roller` | `rollers` | `roller hire Meru` | `Vibratory roller and compactor hire in Meru and Kenya` | `Single-drum and double-drum vibratory rollers with operators for soil, murram sub-base, hardcore and asphalt compaction.` | `Subgrade, murram, crusher-run and cabro/asphalt compaction to specification.` |
| 4 | `Bulldozers` | `bulldozer` | `bulldozers` | `bulldozer hire Kenya` | `Bulldozer hire for bush clearing and bulk earthworks` | `Heavy crawler dozers with operators for bush clearing, ripping, cut-and-fill earthworks and dam construction across Kenya.` | `Heavy bush clearing, ripping, bulk cut-and-fill earthmoving and stockpiling.` |

#### Category typical uses (`uses[]` for `ScopeList` on category pages)

- **Excavators (`excavators`):**
  1. **Foundation and basement excavation** — Digging pad bases, strip trenches and deep basements cleanly to level.
  2. **Road drainage and culvert trenches** — Excavating side-drain channels, culvert crossings and soak pits.
  3. **Dam digging and water pans** — Excavating and shaping farm dams, reservoirs and water pans.
  4. **Quarry and tipper loading** — High-output loading of murram, ballast, hardcore and spoil into tippers.
  5. **Bush clearing and stump removal** — Uprooting trees, boulders and old foundations before construction.
- **Motor graders (`graders`):**
  1. **Access and feeder road grading** — Reshaping rutted murram roads and restoring proper cross-fall (camber).
  2. **Sub-base spreading and leveling** — Spreading imported murram or graded crushed stone to uniform thickness before rolling.
  3. **Side-drain and mitre-drain cutting** — Using blade angle and tilt to cut clean V-drains along road shoulders.
  4. **Compound and yard leveling** — Trimming large commercial compounds and parking yards to accurate falls before cabro or tarmac.
- **Rollers and compactors (`rollers`):**
  1. **Road subgrade and murram compaction** — Compacting watered murram layers so access roads resist rutting and washouts.
  2. **Cabro and building sub-base preparation** — Locking hardcore and quarry dust sub-bases before paving or floor slabs.
  3. **Asphalt and surface dressing rolling** — Compacting hot-mix tarmac and stone chippings to a smooth, sealed finish.
- **Bulldozers (`bulldozers`):**
  1. **Heavy bush and land clearing** — Clearing thick bush, trees and boulders on new farm, estate or road corridors.
  2. **Bulk cut-and-fill earthworks** — Pushing large volumes of soil over short-to-medium haul distances to level sloping plots.
  3. **Ripping hard ground and murram pits** — Ripping weathered rock and hard murram for excavation or road gravelling.

---

### 5.2 Machine seed records (`equipment` collection)

Replace `[CONFIRM: ...]` with the exact make, model and specs from fleet input `I-10`. Add one record per physical machine (or per machine class) Shena hires out:

| # | `name` | `slug` | `category` | `make` | `model` | `capacity` | `uses` (summary) | `availability` |
|---|---|---|---|---|---|---|---|---|
| 1 | `Crawler Excavator` | `crawler-excavator` | `excavators` | `[CONFIRM: e.g. Caterpillar / Komatsu / Hitachi / Sany]` | `[CONFIRM: e.g. 320D / PC200 / ZX200]` | `[CONFIRM: e.g. 20-tonne class, 1.0 m³ bucket]` | Bulk excavation, culvert trenches, dam digging, quarry loading, demolition | `available` |
| 2 | `Motor Grader` | `motor-grader` | `graders` | `[CONFIRM: e.g. Caterpillar / Komatsu / XCMG]` | `[CONFIRM: e.g. 140K / GD555]` | `[CONFIRM: e.g. 140–190 hp, 3.7 m moldboard blade]` | Road grading, camber shaping, murram spreading, V-drain cutting, site leveling | `available` |
| 3 | `Single-Drum Vibratory Roller` | `vibratory-roller` | `rollers` | `[CONFIRM: e.g. Hamm / Dynapac / Bomag / Caterpillar]` | `[CONFIRM: e.g. 3410 / CA250]` | `[CONFIRM: e.g. 10–12 tonne smooth drum]` | Subgrade, murram road and commercial compound sub-base compaction | `available` |
| 4 | `Crawler Bulldozer` | `crawler-bulldozer` | `bulldozers` | `[CONFIRM: e.g. Caterpillar / Komatsu / Shantui]` | `[CONFIRM: e.g. D6R / D65]` | `[CONFIRM: e.g. 18–22 tonne, semi-U blade with ripper]` | Heavy bush clearing, ripping, cut-and-fill earthworks and dam pushing | `available` |

Each machine record carries:
- `hireTerms`:
  - `operator`: `"Included — machine is hired only with a Shena-trained operator"` `[CONFIRM]`
  - `fuel`: `"[CONFIRM: Dry rate (client supplies diesel on site) or wet rate option]"`
  - `transport`: `"Low-loader mobilisation and demobilisation quoted from Meru or Nairobi yard to your site"`
  - `minimumHire`: `"[CONFIRM: e.g. 1 day (8 working hours)]"`
  - `serviceArea`: `"Meru, Isiolo, Laikipia, Tharaka-Nithi, Nyeri, Embu, Kirinyaga, Nairobi and nationwide for longer hires"`

---

### 5.3 Equipment hire FAQs (`equipment-index.faqs`)

1. **Do your machines come with an operator?**
   Yes. Every excavator, grader, roller and bulldozer is hired with our own trained, experienced operator who knows the machine and conducts daily pre-shift checks. We do not hire out bare machines without our operators.
2. **Is fuel included in the hire rate (wet vs dry rate)?**
   We can quote either a **dry rate** (machine and operator, where you supply clean diesel on site) or a **wet rate** (inclusive of fuel) depending on how your project is set up. Our quotation states clearly which basis is priced.
3. **How does the machine get to my site?**
   We arrange low-loader transport from our yard to your site and back. Mobilisation and demobilisation are itemised separately on your quote based on the distance and road access.
4. **What is the minimum hire period?**
   Our standard minimum hire is `[CONFIRM: e.g. one full day (8 machine working hours)]`. For multi-week road or site works we offer discounted weekly or monthly terms.
5. **What happens if a machine has a mechanical issue during hire?**
   Our mechanics maintain our fleet directly. Logged working hours exclude any mechanical downtime on our side, and we dispatch our service team promptly to keep your job moving.

---

## 6. Team seed record: Newton M. Muthee

- **Slug:** `newton-muthee`
- **Name:** `Newton M. Muthee`
- **Role:** `Managing Director`
- **Summary (`lead` on `/about/leadership`):**
  `Newton leads Shena Works Limited's road, building and equipment operations from Meru and Nairobi, combining public-sector road inspection experience with hands-on hospitality and commercial site management.`
- **Reconciled biography (`bio` Prose, 210 words):**
  Newton M. Muthee is the Managing Director of Shena Works Limited, where he oversees road construction, earthworks, commercial and residential building works, and heavy plant operations across Meru, Nairobi and the wider region.

  Before leading Shena Works, Newton worked on both sides of the construction table — as a site manager delivering commercial and hospitality builds and as a public-sector roads inspector checking contractor compliance. From February 2020 to February 2021 he served as Site Project Manager for Dukes Limited in Meru County, supervising the workforce, materials, subcontractors and quality control on hospitality developments including Dukes Cottages, Restaurant & Garden. From February 2021 to January 2022 he worked as a Roads Inspector with the Kenya Urban Roads Authority (KURA), inspecting urban road construction, drainage structures, grading and asphalt works against KURA engineering and safety standards.

  Alongside his work at Shena Works, he has overseen site operations at Joleen Traders Limited and business operations at NEMU Traders `[CONFIRM: Newton approves mentioning Joleen Traders and NEMU Traders on the website, or prefers listing only Dukes, KURA and Shena Works]`.

  On every Shena Works project, Newton remains closely involved from initial site inspection and estimating through to final compaction, snagging and handover.
- **Experience timeline (`experience[]`, newest first):**
  1. **`September 2024 – Present`** · **Managing Director** · **Shena Works Limited** (Meru & Nairobi)
     Directs road and building construction projects, client relations, estimating, procurement and heavy equipment fleet operations across Meru and Nairobi.
  2. **`February 2021 – January 2022`** · **Roads Inspector** · **Kenya Urban Roads Authority (KURA)** (Kenya)
     Inspected road construction, grading, drainage structures, culvert installations and asphalt works for compliance with KURA specifications, road-reserve bylaws and site safety rules.
  3. **`February 2020 – February 2021`** · **Site Project Manager** · **Dukes Limited** (Meru County)
     Supervised site execution, trade scheduling, material inventories and quality standards for hospitality developments in Meru County, including Dukes Cottages, Restaurant & Garden.
  *(Optional additional entries if Newton confirms in `I-11`: Site Engineer, Joleen Traders Limited; Director, NEMU Traders.)*

---

## 7. Credentials and certificates seed records

All records start with `_status: "draft"`. The CMS blocks publishing any credential until `certificateFile` (PDF) and `validUntil` are populated.

| # | `name` | `issuer` | `number` | `category` | `validUntil` | Gate input |
|---|---|---|---|---|---|---|
| 1 | `Certificate of Incorporation` | `Registrar of Companies (BRS Kenya)` | `[CONFIRM: PVT-...]` | `Limited Company` | `Perpetual` | `I-01` |
| 2 | `National Construction Authority — Road Works` | `National Construction Authority (NCA)` | `[CONFIRM]` | `[CONFIRM: e.g. NCA 6 — Road Works]` | `[CONFIRM: YYYY-MM-DD]` | `I-02` |
| 3 | `National Construction Authority — Building Works` | `National Construction Authority (NCA)` | `[CONFIRM]` | `[CONFIRM: e.g. NCA 6 — Building Works]` | `[CONFIRM: YYYY-MM-DD]` | `I-02` |
| 4 | `NCA Annual Contractor Practising Licence` | `National Construction Authority (NCA)` | `[CONFIRM]` | `Road & Building Works` | `[CONFIRM: YYYY-MM-DD]` | `I-02` |
| 5 | `Tax Compliance Certificate` | `Kenya Revenue Authority (KRA)` | `[CONFIRM]` | `Corporate Tax Compliance` | `[CONFIRM: YYYY-MM-DD]` | `I-02` |
| 6 | `Contractors All Risks / WIBA Insurance` | `[CONFIRM: Insurer]` | `[CONFIRM]` | `Site & Workforce Insurance` | `[CONFIRM: YYYY-MM-DD]` | `I-02` |
| 7 | `Single Business Permit` | `County Government of Meru` | `[CONFIRM]` | `Construction & Engineering` | `[CONFIRM: YYYY-12-31]` | `I-02` |
| 8 | `Data Protection Training Certificate` *(holder: `newton-muthee`)* | `CIPIT — Strathmore University` | `[CONFIRM]` | `Data Protection & Governance` | `Perpetual` | `I-11` |

---

## 8. Testimonials seed records

Both records start with `_status: "draft"` until `permissionFile` and `date` are uploaded (`I-09`).

### 8.1 Testimonial 1 — Charles Imunde (eligible for Home, Services, Pin Hideout)

- **`person`:** `Charles Imunde`
- **`title`:** `Director`
- **`organisation`:** `The Pin Hideout`
- **`project`:** `the-pin-hideout`
- **`services`:** `road-construction-and-earthworks`, `cabro-paving`
- **`isPublicOfficial`:** `false`
- **`date`:** `[CONFIRM: YYYY-MM]`
- **`permissionFile`:** `[REQUIRED BEFORE PUBLISH — I-09]`
- **`quote`:**
  `"From the initial consultation to the final handover, Shena Works demonstrated professionalism throughout. The team delivered our project with close attention to detail, and the quality of the construction and paving has stood up well to daily use."` *(Note: if Charles Imunde's signed permission covers the exact original wording from the company profile, use his exact signed words verbatim.)*

### 8.2 Testimonial 2 — Eng. Silas M. Kinoti, EBS (public official — restricted placement)

- **`person`:** `Eng. Silas M. Kinoti, EBS`
- **`title`:** `Director General`
- **`organisation`:** `Kenya Urban Roads Authority (KURA)`
- **`isPublicOfficial`:** `true` (**Rule:** never rendered on Home, never rendered on Leadership, never first in a list, never included in `Review` JSON-LD. Eligible only as a secondary reference if written permission is on file and Newton confirms.)
- **`date`:** `[CONFIRM: YYYY-MM]`
- **`permissionFile`:** `[REQUIRED BEFORE PUBLISH — I-09]`
- **`quote`:**
  `"Shena Works has proven to be a professional and reliable firm, delivering quality work with technical competence and efficiency. Their commitment to high standards, proper project management, and timely execution makes them a dependable partner in infrastructure development."`

---

## 9. Locations seed records

### 9.1 Location 1 — Meru (Headquarters & Plant Yard)

- **Slug:** `meru`
- **Town:** `Meru`
- **County:** `Meru County`
- **Status at launch:** `published`
- **Primary search keyword:** `road construction Meru`, `building contractors Meru`
- **SEO `<title>`:** `Road & Building Contractors in Meru | Shena Works`
- **SEO description:** `Shena Works Limited's Meru headquarters and plant yard. Road construction, cabro paving, building construction and excavator/grader hire across Meru County.`
- **`heroHeadline`:** `Road and building contractors in Meru`
- **`heroLead`:** `Meru is our home base and plant yard. We grade and pave roads, build hospitality, commercial and residential projects, and hire out excavators, graders and rollers across Meru County and Mount Kenya East.`
- **`address`:** `[CONFIRM: Building/plot name, road, town, e.g. Makutano, Meru, Kenya]`
- **`phone`:** `+254 718 971 896`
- **`email`:** `shenaworksltd@gmail.com`
- **`hours`:** `[CONFIRM: e.g. Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm]`
- **`intro`:**
  Working in Meru County means building for steep volcanic slopes, heavy seasonal rainfall, red loam and pockets of black cotton soil. Because our yard, team and heavy plant are based right here in Meru, we can visit your plot quickly, mobilise excavators, graders and rollers without long-haul transport delays, and supervise work on site every day.

  We work across Imenti North, Imenti South, Imenti Central, Tigania, Igembe, Buuri and neighbouring counties (Tharaka-Nithi, Isiolo, Laikipia, Nyeri and Embu).
- **`faqs`:**
  1. **How quickly can you visit a site in Meru County for a quote?**
     For sites within Meru town, Makutano, Nkubu, Maua, Timau and surrounding areas, we can usually arrange a site visit within two to three working days of your call.
  2. **Do you keep your excavators, graders and rollers in Meru?**
     Yes. Our primary plant yard is in Meru, which keeps low-loader mobilisation costs down for road, earthworks and plant-hire jobs in the region.
  3. **Can we visit your Meru office or see completed projects nearby?**
     Yes. Call or WhatsApp us on +254 718 971 896 to book a time at our office or arrange a visit to a completed reference site in Meru such as The Black Perch Lounge or The Pin Hideout.

---

### 9.2 Location 2 — Nairobi (Branch Office)

- **Slug:** `nairobi`
- **Town:** `Nairobi`
- **County:** `Nairobi County`
- **Status at launch:** `draft` (**Gate `I-05`:** publish once the physical Nairobi office address and staffing are confirmed.)
- **Primary search keyword:** `contractors Nairobi`
- **SEO `<title>`:** `Building & Road Contractors in Nairobi | Shena Works`
- **SEO description:** `Shena Works Limited's Nairobi office: commercial and residential building construction, cabro paving, interior fit-outs, civil works and plant hire.`
- **`heroHeadline`:** `Building, paving and civil contractors in Nairobi`
- **`heroLead`:** `From our Nairobi office we handle residential and commercial building construction, cabro compounds, interior fit-outs, road works and project management across Nairobi, Kiambu, Machakos and Kajiado.`
- **`address`:** `[CONFIRM: Building, street, area, Nairobi, Kenya]`
- **`phone`:** `+254 718 971 896`
- **`email`:** `shenaworksltd@gmail.com`
- **`hours`:** `[CONFIRM: e.g. Monday – Friday 8:00 am – 5:00 pm]`
- **`intro`:**
  Our Nairobi office serves commercial clients, property developers and homeowners across Nairobi and the surrounding metropolitan counties, as well as Nairobi-based clients who are developing land or hospitality projects in Meru and Mount Kenya.
- **`faqs`:**
  1. **Which areas around Nairobi do you cover?**
     We work across Nairobi County as well as Kiambu, Machakos and Kajiado for building construction, cabro paving, drainage works, interior fit-outs and project management.
  2. **Can I meet you in Nairobi to plan a project being built in Meru?**
     Yes. Many of our clients live or work in Nairobi while building homes, cottages or commercial premises in Meru County. We can review drawings and contracts in Nairobi and supervise the build from our Meru base.

---

## 10. Insights taxonomy and 8 first-quarter article seeds

### 10.1 Categories (`post-categories`)

1. `Roads and paving` (`roads-and-paving`)
2. `Equipment` (`equipment`)
3. `Building` (`building`)
4. `Planning and costs` (`planning-and-costs`)

### 10.2 First 8 articles (spec section 10 content plan)

Each article is seeded in `draft` with its structure, target search phrase, related service and outline ready for Newton's review (`I-14`):

| # | Slug | Title | Category | Related service | Outline (h2 sections to draft from Shena's field notes) |
|---|---|---|---|---|---|
| 1 | `cabro-paving-cost-kenya` | `Cabro paving in Kenya: what actually drives the cost per square metre` | `Roads and paving` | `cabro-paving` | 1. Why two "per m²" cabro quotes can differ by 40% · 2. Ground excavation and black cotton replacement · 3. Sub-base thickness and roller compaction · 4. 60 mm vs 80 mm blocks, colours and patterns · 5. Kerbs, channels and storm drainage · 6. Checklist before you accept a cabro quote |
| 2 | `murram-gravel-cabro-or-tarmac-access-road` | `Murram, cabro or tarmac: choosing the right surface for an access road` | `Roads and paving` | `road-construction-and-earthworks` | 1. Matching the surface to slope, traffic and rainfall · 2. When graded and compacted murram is enough · 3. Where cabro beats murram (steep pinches, gates, yards) · 4. When surface dressing or tarmac pays back · 5. Why drainage matters more than the top layer |
| 3 | `hiring-an-excavator-in-meru-what-to-ask` | `Hiring an excavator in Meru: 7 questions to ask before the machine leaves the yard` | `Equipment` | `road-construction-and-earthworks` *(+ links `/equipment/excavators`)* | 1. Bucket size and machine weight for your soil · 2. Wet rate vs dry rate and hourly fuel burn · 3. Low-loader transport and site access width · 4. Operator experience on trenches vs bulk loading · 5. How daily machine hours are logged · 6. Breakdown policy |
| 4 | `what-a-motor-grader-does-on-a-road-job` | `What a motor grader actually does on a road job (and why a tractor blade isn't the same)` | `Equipment` | `road-construction-and-earthworks` *(+ links `/equipment/graders`)* | 1. Wheelbase, blade articulation and true levels · 2. Cutting the road formation and cross-fall (camber) · 3. Shaping V-drains and mitre drains · 4. Spreading murram in even lifts for the roller · 5. How many kilometres a grader covers in a day |
| 5 | `how-to-read-a-bill-of-quantities-kenya` | `How to read a Bill of Quantities before you sign a building contract` | `Planning and costs` | `general-construction` | 1. What a BoQ is and why lump-sum quotes hide risk · 2. Preliminaries and preambles explained · 3. Measured works: checking quantities against your drawings · 4. Provisional sums and Prime Cost (PC) sums — where budgets blow up · 5. Using the BoQ to value stage payments on site |
| 6 | `what-nca-categories-mean-when-choosing-a-contractor` | `What NCA categories and classes mean when you choose a contractor in Kenya` | `Planning and costs` | `general-construction` | 1. Building works vs road works vs specialist classes · 2. Categories NCA 1 to NCA 8 and contract value limits · 3. Checking a contractor's current Annual Practising Licence · 4. Why project registration with NCA protects the owner |
| 7 | `why-roads-fail-without-drainage` | `Why Kenyan roads fail without drainage: side drains, mitre drains and culverts explained` | `Roads and paving` | `road-construction-and-earthworks` | 1. How water weakens subgrade and washes out murram · 2. Camber (cross-fall): getting water off the running surface · 3. Side drains, mitre drains and scour checks on Meru slopes · 4. Sizing pipe culverts (600 mm vs 900 mm) and headwalls · 5. Simple maintenance after the rains |
| 8 | `planning-a-hospitality-build-from-drawings-to-handover` | `Planning a lounge, cottage or hotel build in Meru: from plot to opening night` | `Building` | `general-construction` | 1. Site zoning: separating guest arrival, service deliveries and parking · 2. Getting drainage, power, water storage and waste right underground first · 3. Coordinating building structure with interior lighting and acoustics · 4. Sequencing external cabro and landscaping · 5. Lessons from The Black Perch Lounge and Dukes Cottages |

---

## 11. Legal pages: full text (Kenya Data Protection Act, 2019)

### 11.1 `/privacy` — Privacy notice

- **Slug:** `privacy`
- **Title:** `Privacy notice`
- **Last updated:** `10 November 2026`
- **Body (Prose):**

  ## 1. Who we are (Data Controller)
  This website (`shenaworksltd.com`) is operated by **Shena Works Limited** ("we", "us", "our"), a company registered in Kenya (`Registration No. [CONFIRM: I-01]`) with offices in Meru and Nairobi, Kenya. For the purposes of Kenya's **Data Protection Act, 2019**, Shena Works Limited is the data controller of the personal data collected through this website.

  - **Email:** shenaworksltd@gmail.com
  - **Telephone:** +254 718 971 896
  - **Postal / physical address:** `[CONFIRM: I-05 Meru office address]`

  ## 2. Personal data we collect
  We collect only the personal data you choose to give us or that is needed to run and secure this website:

  - **Enquiry and quote details:** your name, phone number, email address (if provided), company or organisation name, site location, project or equipment hire details, budget band, timeline, and any drawings, Bills of Quantities or photographs you attach when you submit a form on our site.
  - **Direct communications:** records of phone calls, emails or WhatsApp messages when you contact us using the links on this site.
  - **Technical and security data:** your IP address, browser type, device type, pages visited and Cloudflare Turnstile anti-spam verification tokens.
  - **Analytics data (only with your consent):** anonymised page views and interaction events (such as button clicks) collected via Google Analytics 4 if you click "Accept analytics" on our cookie banner.

  ## 3. Why we use your data and our lawful basis
  Under Section 30 of the Data Protection Act, 2019, we process your personal data on the following lawful bases:

  - **To take steps at your request before entering into a contract (and to perform a contract):** reviewing your site requirements, preparing a construction quotation or equipment-hire quote, calling or messaging you back, and delivering our services.
  - **Your consent:** when you tick the consent box on our enquiry form, or when you accept analytics cookies or load an embedded Google Map. You may withdraw consent at any time.
  - **Legitimate interests:** protecting our website and forms from spam, abuse and security threats, and maintaining internal records of business enquiries.
  - **Legal obligations:** keeping accounting, tax and contractual records required under Kenyan law.

  ## 4. Who we share your data with
  We **never sell** your personal data. We share data only with trusted service providers (data processors) that help us run this website and respond to you, under strict confidentiality and data protection terms:

  - **Hosting, database and content delivery:** **Vercel** (application hosting), **Neon (NeonDB)** (managed PostgreSQL database hosting), and **Cloudflare** (CDN, DDoS protection, R2 media storage and Turnstile spam protection).
  - **Transactional email:** Resend / our email provider, to deliver your enquiry to our staff and send your confirmation email.
  - **Messaging (if you contact us via WhatsApp):** WhatsApp (Meta), when you choose to click a WhatsApp link to chat with us.
  - **Analytics (only if you consent):** Google Ireland Limited (Google Analytics 4).

  Where any processor stores or processes data outside Kenya, we ensure appropriate safeguards are in place in accordance with Part VI of the Data Protection Act, 2019.

  ## 5. How long we keep your data
  - **Unsuccessful or general enquiries:** kept for **24 months** from our last contact with you so we can follow up if your project restarts, then securely deleted from our database and media storage.
  - **Enquiries that become contracts or projects:** kept for **7 years** after completion of the contract in line with Kenyan tax and limitation-of-actions laws.
  - **Server and security logs:** kept for up to **90 days**.

  ## 6. Your rights under the Data Protection Act, 2019
  Under Section 26 of the Kenya Data Protection Act, 2019, you have the right to:

  - Be informed of the use to which your personal data is to be put;
  - Access your personal data in our custody;
  - Object to the processing of all or part of your personal data;
  - Correct false or misleading data; and
  - Request deletion of false, misleading or no-longer-needed personal data.

  To exercise any of these rights, email **shenaworksltd@gmail.com** or call **+254 718 971 896**. We will respond within 30 days. You also have the right to lodge a complaint with the **Office of the Data Protection Commissioner (ODPC)** at `https://www.odpc.go.ke`.

---

### 11.2 `/cookies` — Cookie notice

- **Slug:** `cookies`
- **Title:** `Cookie notice`
- **Last updated:** `10 November 2026`
- **Body (Prose):**

  ## 1. How we use cookies
  A cookie is a small text file stored on your phone or computer when you visit a website. We keep cookies to a minimum:

  - **Essential cookies** are always active because the site, spam protection and your cookie preference cannot work without them.
  - **Analytics cookies** are **off by default** and are set only if you click "Accept analytics" on our cookie banner.
  - **Third-party maps** (Google Maps on our location and contact pages) are blocked by default until you click "Load map".

  ## 2. Cookies used on this site

  | Cookie name | Provider | Category | Purpose | Expiry |
  |---|---|---|---|---|
  | `sw_consent` | `shenaworksltd.com` | Essential | Remembers whether you chose "Accept analytics" or "Essential only" | 12 months |
  | `cf_clearance` / Turnstile tokens | Cloudflare | Essential | Protects our enquiry forms against automated spam without tracking you across sites | Session / up to 30 minutes |
  | `payload-token` | `shenaworksltd.com` | Essential (staff only) | Keeps Shena Works staff signed in to the CMS admin panel; never set for normal visitors | Session / 7 days |
  | `_ga`, `_ga_*` | Google Analytics 4 | Analytics (consent required) | Counts visits and helps us see which pages and forms are useful; IP addresses are anonymised | Up to 13 months |

  ## 3. Changing your choice
  You can change or withdraw your analytics consent at any time using the button below, or via the "Cookie settings" link in the footer of every page. When you switch to "Essential only", we immediately stop sending analytics events and delete existing `_ga` cookies on our domain.
