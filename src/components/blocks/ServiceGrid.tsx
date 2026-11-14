import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ServiceRecord } from '@/types/content'

/**
 * 4 Services (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 427-446
 * Enforces publishing gate: gated services (architecture, estimating) remain hidden if in draft.
 */
export interface ServiceGridProps {
  id?: string
  overline?: string
  heading?: string
  body?: string
  actionLabel?: string
  actionHref?: string
  services?: ServiceRecord[]
}

const DEFAULT_SERVICES = [
  {
    slug: 'road-construction-and-earthworks',
    href: '/services/road-construction-and-earthworks',
    group: 'Roads and earthworks',
    title: 'Road construction and earthworks',
    summary:
      'Grading, murram gravelling, cabro block paving, concrete drains, culverts and tarmac surfacing for access roads and commercial compounds.',
    imgSrc: '/media/service-roads.jpg',
    imgAlt: 'A grader levelling a murram road',
  },
  {
    slug: 'general-construction',
    href: '/services/general-construction',
    group: 'Buildings and interiors',
    title: 'General construction',
    summary:
      'Turnkey building construction for hospitality venues, commercial premises, cottages, villas and residential homes, from foundations to handover.',
    imgSrc: '/media/service-building.jpg',
    imgAlt: 'A building under construction with scaffolding',
  },
  {
    slug: 'cabro-paving',
    href: '/services/road-construction-and-earthworks/cabro-paving',
    group: 'Roads and earthworks',
    title: 'Cabro paving',
    summary:
      '60 mm and 80 mm interlocking cabro paving with machine-compacted sub-base, concrete kerbs and storm drainage for commercial and residential compounds.',
    imgSrc: '/media/service-cabro.jpg',
    imgAlt: 'Interlocking cabro paving blocks in warm sunlight',
  },
  {
    slug: 'interior-design',
    href: '/services/interior-design',
    group: 'Buildings and interiors',
    title: 'Interior design',
    summary:
      'Space planning, lighting, custom joinery, flooring and full interior fit-outs for hospitality venues, commercial spaces and homes.',
    imgSrc: '/media/service-interior.jpg',
    imgAlt: 'A finished interior fit-out with modern furnishings',
  },
  {
    slug: 'project-management',
    href: '/services/project-management',
    group: 'Planning and delivery',
    title: 'Project management',
    summary:
      'End-to-end site supervision, scheduling, subcontractor coordination, quality inspections and cost tracking for private and commercial builds.',
    imgSrc: '/media/service-pm.jpg',
    imgAlt: 'Site engineers reviewing project plans',
  },
]

export function ServiceGrid({
  services,
  overline = 'Services',
  heading = 'What we build',
  body = 'One contractor for the road in, the ground it sits on and the building at the end of it.',
  actionLabel = 'All services',
  actionHref = '/services',
  ..._props
}: ServiceGridProps = {}) {
  // Filter out gated services per Rule 2 (keep architecture/estimating draft until registered professionals recorded)
  const publishedServices = (services || []).filter(
    (s) =>
      s._status === 'published' &&
      s.slug !== 'architecture-and-consultancy' &&
      s.slug !== 'bills-of-quantities-and-estimating'
  )

  const items =
    publishedServices.length > 0
      ? publishedServices.map((s) => {
          const defaultMatch = DEFAULT_SERVICES.find((d) => d.slug === s.slug)
          const href = s.parentSlug
            ? `/services/${s.parentSlug}/${s.slug}`
            : `/services/${s.slug}`
          return {
            slug: s.slug,
            href,
            group: s.group || defaultMatch?.group || 'Services',
            title: s.title,
            summary: s.summary || defaultMatch?.summary || '',
            imgSrc:
              (s.heroImage?.url?.startsWith('http') ? s.heroImage.url : null) ||
              defaultMatch?.imgSrc ||
              DEFAULT_SERVICES[0].imgSrc,
            imgAlt: s.heroImage?.alt || defaultMatch?.imgAlt || s.title,
          }
        })
      : DEFAULT_SERVICES

  return (
    <section id="services" aria-labelledby="sv-h">
      <div className="wrap">
        <div className="intro">
          <div>
            <p className="over">{overline}</p>
            <h2 className="h2" id="sv-h" style={{ margin: '8px 0 16px' }}>
              {heading}
            </h2>
            <p className="lead">{body}</p>
          </div>
          <Link className="arrow" href={actionHref}>
            {actionLabel}{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
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
              <p className="over">{item.group}</p>
              <h3 className="h4">
                <Link href={item.href}>{item.title}</Link>
              </h3>
              <p className="sm">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
