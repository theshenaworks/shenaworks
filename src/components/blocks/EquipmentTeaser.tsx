import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { MachineRecord } from '@/types/content'

/**
 * 6 EquipmentTeaser (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 475-492
 */
export interface EquipmentTeaserProps {
  overline?: string
  heading?: string
  body?: string
  actionLabel?: string
  actionHref?: string
  machines?: MachineRecord[]
  categories?: any[]
  compact?: boolean
}

const DEFAULT_MACHINES = [
  {
    slug: 'crawler-excavator',
    categorySlug: 'excavators',
    categoryName: 'Excavators',
    name: 'Crawler excavator',
    href: '/equipment/excavators/crawler-excavator',
    description: 'Bulk excavation, culvert trenches, dams and tipper loading',
    imgSrc: '/media/equip-excavator.jpg',
    imgAlt: 'Crawler excavator digging on site',
  },
  {
    slug: 'motor-grader',
    categorySlug: 'graders',
    categoryName: 'Motor graders',
    name: 'Motor grader',
    href: '/equipment/graders/motor-grader',
    description: 'Road grading, camber shaping, murram spreading and drain cutting',
    imgSrc: '/media/equip-grader.jpg',
    imgAlt: 'Motor grader levelling a dirt road',
  },
  {
    slug: 'vibratory-roller',
    categorySlug: 'rollers',
    categoryName: 'Rollers and compactors',
    name: 'Single-drum vibratory roller',
    href: '/equipment/rollers/vibratory-roller',
    description: 'Subgrade, murram road and cabro sub-base compaction',
    imgSrc: '/media/equip-roller.jpg',
    imgAlt: 'Single-drum vibratory roller compacting a road',
  },
]

export function EquipmentTeaser({
  machines,
  overline = 'Equipment hire',
  heading = 'Our machines, with our operators',
  body = 'Hire an excavator, grader, roller or bulldozer for your site. We quote for the machine, operator and transport, and confirm dates before we move.',
  actionLabel = 'See the fleet',
  actionHref = '/equipment',
  ..._props
}: EquipmentTeaserProps = {}) {
  const refSlugs = ['crawler-excavator', 'motor-grader', 'vibratory-roller']

  const items = refSlugs.map((slug) => {
    const defaultMatch = DEFAULT_MACHINES.find((d) => d.slug === slug)!
    const m = (machines || []).find((x) => x.slug === slug)

    const categorySlug = m?.categorySlug || defaultMatch.categorySlug
    const categoryName =
      categorySlug === 'excavators'
        ? 'Excavators'
        : categorySlug === 'graders'
        ? 'Motor graders'
        : categorySlug === 'rollers'
        ? 'Rollers and compactors'
        : 'Bulldozers'
    const href = `/equipment/${categorySlug}/${slug}`

    return {
      slug,
      categoryName,
      name: defaultMatch.name,
      href,
      description: defaultMatch.description,
      imgSrc:
        (m?.heroImage?.url?.startsWith('http') ? m.heroImage.url : null) ||
        defaultMatch.imgSrc,
      imgAlt: defaultMatch.imgAlt,
    }
  })

  return (
    <section className="eq spacious" data-surface="dark" aria-labelledby="eq-h">
      <div className="wrap">
        <div className="intro">
          <div>
            <p className="over">{overline}</p>
            <h2 className="h2" id="eq-h" style={{ margin: '8px 0 16px' }}>
              {heading}
            </h2>
            <p className="lead">{body}</p>
          </div>
          <Link className="btn out" href={actionHref}>
            {actionLabel}
          </Link>
        </div>
        <div className="grid c3">
          {items.map((item) => (
            <article className="card" key={item.slug}>
              <div className="ph warm r43">
                <Image
                  src={item.imgSrc}
                  alt={item.imgAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                />
              </div>
              <p className="over">{item.categoryName}</p>
              <h3 className="h4">
                <Link href={item.href}>{item.name}</Link>
              </h3>
              <p
                className="xs"
                style={{
                  textTransform: 'none',
                  fontFamily: 'var(--body)',
                  fontWeight: 400,
                  letterSpacing: 0,
                }}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
