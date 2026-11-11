import fs from 'node:fs'
import path from 'node:path'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { getSiteSettings } from '../src/lib/content'

async function generateProfile() {
  const pdfDoc = await PDFDocument.create()
  const settings = getSiteSettings()

  // Murram accent (#c14a12) = rgb(193/255, 74/255, 18/255)
  const murramColor = rgb(193 / 255, 74 / 255, 18 / 255)
  const inkDark = rgb(23 / 255, 23 / 255, 23 / 255)
  const inkMuted = rgb(82 / 255, 82 / 255, 82 / 255)
  const greyBg = rgb(245 / 255, 245 / 255, 244 / 255)
  const white = rgb(1, 1, 1)

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // ---------------- Page 1: Cover & Company Overview ----------------
  const page1 = pdfDoc.addPage([595.28, 841.89]) // A4
  const { width, height } = page1.getSize()

  // Top header banner
  page1.drawRectangle({
    x: 0,
    y: height - 160,
    width,
    height: 160,
    color: inkDark,
  })

  // Accent stripe (2px)
  page1.drawRectangle({
    x: 0,
    y: height - 162,
    width,
    height: 2,
    color: murramColor,
  })

  page1.drawText('SHENA WORKS LIMITED', {
    x: 48,
    y: height - 60,
    size: 26,
    font: boldFont,
    color: white,
  })

  page1.drawText('CIVIL ENGINEERING, ROAD CONTRACTING & BUILDING WORKS', {
    x: 48,
    y: height - 85,
    size: 11,
    font: boldFont,
    color: murramColor,
  })

  page1.drawText('Company Profile & Capabilities Deck', {
    x: 48,
    y: height - 115,
    size: 13,
    font: regularFont,
    color: rgb(212 / 255, 212 / 255, 212 / 255),
  })

  // Executive summary
  let y = height - 200
  page1.drawText('1. COMPANY OVERVIEW', {
    x: 48,
    y,
    size: 14,
    font: boldFont,
    color: murramColor,
  })

  y -= 25
  const overviewText = [
    'Shena Works Limited is an integrated Kenyan construction and civil engineering firm headquartered in',
    'Meru County with liaison operations in Nairobi. We specialise in road construction, bulk earthworks,',
    'heavy-duty cabro paving, structural building works, and interior architectural fit-out.',
    '',
    'Founded and directed by Newton M. Muthee, Shena Works combines experienced on-site engineering supervision',
    'with company-owned heavy earthmoving machinery — delivering reliable infrastructure on time and on budget.',
  ]
  for (const line of overviewText) {
    page1.drawText(line, { x: 48, y, size: 10, font: regularFont, color: inkDark })
    y -= 16
  }

  // Key Facts Table / Box
  y -= 15
  page1.drawRectangle({
    x: 48,
    y: y - 110,
    width: width - 96,
    height: 110,
    color: greyBg,
    borderColor: rgb(220 / 255, 220 / 255, 220 / 255),
    borderWidth: 1,
  })

  page1.drawText('KEY CORPORATE DETAILS', {
    x: 64,
    y: y - 24,
    size: 11,
    font: boldFont,
    color: inkDark,
  })

  const facts = [
    ['Company Name:', 'Shena Works Limited'],
    ['Head Office:', 'Ground Floor, Al-Haqq Building, Makutano, Meru County (P.O. Box 2872-60200)'],
    ['Nairobi Office:', 'Park Suites, Parklands, Nairobi'],
    ['Managing Director:', 'Newton M. Muthee'],
    ['Contact Phone:', settings.contact.phoneDisplay],
    ['Email & Web:', `${settings.contact.email} | https://shenaworksltd.com`],
  ]

  let factY = y - 42
  for (const [k, v] of facts) {
    page1.drawText(k, { x: 64, y: factY, size: 9, font: boldFont, color: inkDark })
    page1.drawText(v, { x: 180, y: factY, size: 9, font: regularFont, color: inkDark })
    factY -= 14
  }

  // Core Services Section
  y -= 140
  page1.drawText('2. CORE SERVICES', {
    x: 48,
    y,
    size: 14,
    font: boldFont,
    color: murramColor,
  })

  y -= 25
  const services = [
    {
      title: 'Road Construction & Bulk Earthworks',
      desc: 'Grading, camber shaping, mitre drains, sub-base compaction and all-weather murram road delivery.',
    },
    {
      title: 'Cabro Paving & Heavy-Duty Surfacing',
      desc: 'Excavation, compacted sub-base, kerb restraints, and 60mm/80mm interlocking blocks for yards and bays.',
    },
    {
      title: 'General Building Construction',
      desc: 'Substructures, reinforced concrete frames, masonry walls, roofing and full turnkey delivery.',
    },
    {
      title: 'Interior Design & Architectural Fit-Out',
      desc: 'Custom ceilings, architectural lighting, moisture-resistant wellness suites and hospitality finishes.',
    },
    {
      title: 'Project Management & Construction Supervision',
      desc: 'BoQ verification, site QA/QC, progress milestones, material testing and subcontractor coordination.',
    },
  ]

  for (const s of services) {
    page1.drawText(`•  ${s.title}`, { x: 48, y, size: 10, font: boldFont, color: inkDark })
    y -= 14
    page1.drawText(s.desc, { x: 60, y, size: 9, font: regularFont, color: inkMuted })
    y -= 18
  }

  // Footer page 1
  page1.drawText('Shena Works Limited — Company Profile | Page 1 of 2', {
    x: 48,
    y: 36,
    size: 8,
    font: regularFont,
    color: inkMuted,
  })

  // ---------------- Page 2: Plant Fleet & Completed Projects ----------------
  const page2 = pdfDoc.addPage([595.28, 841.89])

  // Top header banner
  page2.drawRectangle({
    x: 0,
    y: height - 70,
    width,
    height: 70,
    color: inkDark,
  })
  page2.drawRectangle({
    x: 0,
    y: height - 72,
    width,
    height: 2,
    color: murramColor,
  })

  page2.drawText('SHENA WORKS LIMITED — PLANT FLEET & TRACK RECORD', {
    x: 48,
    y: height - 44,
    size: 14,
    font: boldFont,
    color: white,
  })

  y = height - 110
  page2.drawText('3. HEAVY EQUIPMENT & PLANT FLEET', {
    x: 48,
    y,
    size: 14,
    font: boldFont,
    color: murramColor,
  })

  y -= 25
  const fleet = [
    {
      name: '20-Tonne Class Crawler Excavator',
      specs: '20,000 kg operating weight | 1.0 m³ bucket | Bulk excavation, trenches & quarry loading',
    },
    {
      name: 'Heavy-Duty Motor Grader',
      specs: '140–190 hp | 3.7 m hydraulic moldboard blade with scarifier | Road shaping & cambering',
    },
    {
      name: 'Single-Drum Vibratory Roller',
      specs: '10–12 tonne smooth vibratory drum | High-amplitude sub-base & murram road compaction',
    },
    {
      name: 'Crawler Bulldozer with Ripper',
      specs: '18–22 tonne class | Semi-U blade + rear ripper | Bush clearing, ripping & bulk cut-and-fill',
    },
  ]

  for (const m of fleet) {
    page2.drawText(`•  ${m.name}`, { x: 48, y, size: 10, font: boldFont, color: inkDark })
    y -= 14
    page2.drawText(m.specs, { x: 60, y, size: 9, font: regularFont, color: inkMuted })
    y -= 16
  }

  y -= 15
  page2.drawText('4. REPRESENTATIVE COMPLETED PROJECTS', {
    x: 48,
    y,
    size: 14,
    font: boldFont,
    color: murramColor,
  })

  y -= 25
  const projects = [
    {
      name: 'The Black Perch Lounge — Meru County (2024)',
      scope: 'General contractor & PM: Lounge pavilions, sauna & wellness suites, carwash bays & cabro parking.',
    },
    {
      name: 'The Pin Hideout — Meru County (2023)',
      scope: 'Renovation contractor & fit-out: Pavilion extensions, acoustic interior ceilings & mood lighting.',
    },
    {
      name: 'Duke’s Cottages, Restaurant & Garden — Meru County (2023)',
      scope: 'General contractor: Cut-stone cottages, drainage channels, landscaped cabro walkways & gardens.',
    },
    {
      name: 'Stone Lounge & Villas — Meru County (2022)',
      scope: 'Civil & building contractor: Stone masonry villas, pool earthworks & private cabro access road.',
    },
    {
      name: 'Meru Access Road Grading & Drainage (2024)',
      scope: 'Civil works: Corridor bush clearing, camber grading, mitre drains and vibratory roller compaction.',
    },
  ]

  for (const p of projects) {
    page2.drawText(`•  ${p.name}`, { x: 48, y, size: 10, font: boldFont, color: inkDark })
    y -= 14
    page2.drawText(p.scope, { x: 60, y, size: 9, font: regularFont, color: inkMuted })
    y -= 18
  }

  // Contact & Hire Callout
  y -= 10
  page2.drawRectangle({
    x: 48,
    y: y - 80,
    width: width - 96,
    height: 80,
    color: greyBg,
    borderColor: murramColor,
    borderWidth: 1.5,
  })

  page2.drawText('TALK TO OUR ENGINEERING TEAM', {
    x: 64,
    y: y - 24,
    size: 11,
    font: boldFont,
    color: murramColor,
  })

  page2.drawText('For road construction, cabro paving, site earthworks or plant hire across Kenya:', {
    x: 64,
    y: y - 42,
    size: 9,
    font: regularFont,
    color: inkDark,
  })

  page2.drawText(
    `Telephone: ${settings.contact.phoneDisplay} | WhatsApp: +${settings.contact.whatsappNumber} | Email: ${settings.contact.email}`,
    {
      x: 64,
      y: y - 60,
      size: 9,
      font: boldFont,
      color: inkDark,
    },
  )

  // Footer page 2
  page2.drawText('Shena Works Limited — Company Profile | Page 2 of 2', {
    x: 48,
    y: 36,
    size: 8,
    font: regularFont,
    color: inkMuted,
  })

  const pdfBytes = await pdfDoc.save()
  const outDir = path.resolve(process.cwd(), 'public/downloads')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'shena-works-company-profile.pdf')
  fs.writeFileSync(outPath, pdfBytes)

  console.log(`[profile-pdf] Created ${outPath} (${pdfBytes.length} bytes)`)
}

generateProfile().catch((err) => {
  console.error('[profile-pdf] Error:', err)
  process.exit(1)
})
