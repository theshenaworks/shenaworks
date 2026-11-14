#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.resolve(process.cwd(), 'public/media')
const force = process.argv.includes('--force')

const REFERENCE_MEDIA = [
  { file: 'hero-roads.jpg', id: '37333412', width: 1600 },
  { file: 'statement-machines.jpg', id: '8809466', width: 1600 },
  { file: 'statement-keys.jpg', id: '34188582', width: 1600 },
  { file: 'service-roads.jpg', id: '12267902', width: 1600 },
  { file: 'service-building.jpg', id: '33719014', width: 1600 },
  { file: 'service-cabro.jpg', id: '33566707', width: 1400 },
  { file: 'service-interior.jpg', id: '7851904', width: 1200 },
  { file: 'service-pm.jpg', id: '8961070', width: 1200 },
  { file: 'project-black-perch.jpg', id: '16120138', width: 1200 },
  { file: 'project-pin-hideout.jpg', id: '29989994', width: 1200 },
  { file: 'project-dukes.jpg', id: '35612209', width: 1200 },
  { file: 'project-stone-lounge.jpg', id: '20336639', width: 1200 },
  { file: 'equip-excavator.jpg', id: '25559747', width: 1600 },
  { file: 'equip-excavator-trench.jpg', id: '13931828', width: 1600 },
  { file: 'equip-excavator-loading.jpg', id: '29506754', width: 1600 },
  { file: 'equip-grader.jpg', id: '8809464', width: 1200 },
  { file: 'equip-roller.jpg', id: '27390316', width: 1200 },
  { file: 'equip-bulldozer.jpg', id: '9577586', width: 1200 },
  { file: 'why-crew.jpg', id: '5298215', width: 1600 },
  { file: 'cta-site.jpg', id: '40736607', width: 1600 },
  { file: 'newton-portrait.jpg', id: '17746097', width: 1200 },
]

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })
  let downloaded = 0
  let skipped = 0

  for (const item of REFERENCE_MEDIA) {
    const dest = path.join(OUT_DIR, item.file)
    if (!force) {
      try {
        const stat = await fs.stat(dest)
        if (stat.size > 1024) {
          skipped++
          continue
        }
      } catch {}
    }

    const url = `https://images.pexels.com/photos/${item.id}/pexels-photo-${item.id}.jpeg?auto=compress&cs=tinysrgb&w=${item.width}`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ShenaWorksSiteBuilder/1.0 (+https://shenaworksltd.com)',
        Accept: 'image/jpeg,image/*;q=0.9,*/*;q=0.8',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: HTTP ${res.status} ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      throw new Error(`Unexpected content-type for ${url}: ${contentType}`)
    }

    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1024 || buf[0] !== 0xff || buf[1] !== 0xd8) {
      throw new Error(`Invalid JPEG signature or size for ${item.file} (${buf.length} bytes)`)
    }

    await fs.writeFile(dest, buf)
    downloaded++
    console.log(`Downloaded ${item.file} (${Math.round(buf.length / 1024)} KB)`)
  }

  console.log(`Done: ${downloaded} downloaded, ${skipped} already present (${REFERENCE_MEDIA.length} total).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
