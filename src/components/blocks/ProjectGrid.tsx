import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectRecord } from '@/types/content'

/**
 * 5 Projects (AGENTS.md Section 0 & Section 5 Phase B, C & D)
 * Reference: docs/reference/home/index.html lines 448-473
 * Progressive enhancement: form wrapper allows GET filter when JS is disabled.
 * Dynamic Payload CMS data integration with reference fallbacks.
 */
export interface ProjectGridProps {
  variant?: string
  overline?: string
  heading?: string
  body?: string
  actionLabel?: string
  actionHref?: string
  projects?: ProjectRecord[]
  services?: any[]
  activeFilter?: string
}

const DEFAULT_CARDS = [
  {
    id: 'the-black-perch-lounge',
    href: '/projects/the-black-perch-lounge',
    title: 'The Black Perch Lounge',
    tags: 'build hosp int roads',
    tagList: ['build', 'hosp', 'int', 'roads'],
    overline: 'General construction, Interior design',
    meta: 'Meru · Meru County',
    imgSrc:
      'https://images.pexels.com/photos/16120138/pexels-photo-16120138.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imgAlt: 'The Black Perch Lounge interior with sofas and ambient lighting',
  },
  {
    id: 'the-pin-hideout',
    href: '/projects/the-pin-hideout',
    title: 'The Pin Hideout',
    tags: 'roads hosp',
    tagList: ['roads', 'hosp'],
    overline: 'Road construction, Cabro paving',
    meta: 'Meru County',
    imgSrc:
      'https://images.pexels.com/photos/29989994/pexels-photo-29989994.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imgAlt: 'Outdoor seating on a paved courtyard',
  },
  {
    id: 'dukes-cottages-restaurant-and-garden',
    href: '/projects/dukes-cottages-restaurant-and-garden',
    title: 'Dukes Cottages, Restaurant & Garden',
    tags: 'build hosp',
    tagList: ['build', 'hosp'],
    overline: 'General construction, Project management',
    meta: 'Meru · 2020–2021',
    imgSrc:
      'https://images.pexels.com/photos/35612209/pexels-photo-35612209.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imgAlt: 'Cottages and gardens at the Dukes restaurant',
  },
]

function mapProjectTags(p: ProjectRecord): string[] {
  const tags: string[] = []
  const slugs = p.serviceSlugs || []
  if (slugs.includes('road-construction-and-earthworks') || slugs.includes('cabro-paving')) {
    tags.push('roads')
  }
  if (slugs.includes('general-construction')) {
    tags.push('build')
  }
  if (slugs.includes('interior-design')) {
    tags.push('int')
  }
  if (
    p.clientType?.toLowerCase().includes('hosp') ||
    p.title.toLowerCase().includes('lounge') ||
    p.title.toLowerCase().includes('hideout') ||
    p.title.toLowerCase().includes('restaurant') ||
    p.title.toLowerCase().includes('cottage')
  ) {
    tags.push('hosp')
  }
  return tags.length > 0 ? tags : ['build']
}

export function ProjectGrid({
  projects,
  activeFilter = 'all',
  overline = 'Projects',
  heading = 'Recent work',
  body = 'Lounges, cottages, villas, paved compounds and roads in Meru County and beyond. Each project page says what we did and who delivered it.',
  ..._props
}: ProjectGridProps = {}) {
  const cards =
    projects && projects.length > 0
      ? projects.slice(0, 3).map((p) => {
          const defaultMatch = DEFAULT_CARDS.find((d) => d.id === p.slug)
          const tagList = defaultMatch?.tagList || mapProjectTags(p)
          const town = p.location?.town
          const county = p.location?.county
          const meta =
            defaultMatch?.meta ||
            (town && county ? `${town} · ${county}` : 'Meru County')

          return {
            id: p.slug,
            href: `/projects/${p.slug}`,
            title: defaultMatch?.title || p.title,
            tags: defaultMatch?.tags || tagList.join(' '),
            tagList,
            overline: defaultMatch?.overline || p.role || 'General construction',
            meta,
            imgSrc:
              (p.heroImage?.url?.startsWith('http') ? p.heroImage.url : null) ||
              defaultMatch?.imgSrc ||
              DEFAULT_CARDS[0].imgSrc,
            imgAlt: defaultMatch?.imgAlt || p.heroImage?.alt || p.title,
          }
        })
      : DEFAULT_CARDS

  const shownCount = cards.filter(
    (card) => activeFilter === 'all' || card.tagList.includes(activeFilter)
  ).length

  return (
    <section data-surface="subtle" style={{ background: 'var(--g100)' }} aria-labelledby="pj-h">
      <div className="wrap">
        <div className="intro">
          <div>
            <p className="over">{overline}</p>
            <h2 className="h2" id="pj-h" style={{ margin: '8px 0 16px' }}>
              {heading}
            </h2>
            <p className="lead">{body}</p>
          </div>
        </div>
        <form method="GET" action="/#pgrid" style={{ display: 'contents' }}>
          <div className="chips" role="group" aria-label="Filter projects">
            <button
              type="submit"
              name="filter"
              value="all"
              className="chip"
              aria-pressed={activeFilter === 'all' ? 'true' : 'false'}
              data-f="all"
            >
              All
            </button>
            <button
              type="submit"
              name="filter"
              value="roads"
              className="chip"
              aria-pressed={activeFilter === 'roads' ? 'true' : 'false'}
              data-f="roads"
            >
              Roads and paving
            </button>
            <button
              type="submit"
              name="filter"
              value="build"
              className="chip"
              aria-pressed={activeFilter === 'build' ? 'true' : 'false'}
              data-f="build"
            >
              Buildings
            </button>
            <button
              type="submit"
              name="filter"
              value="hosp"
              className="chip"
              aria-pressed={activeFilter === 'hosp' ? 'true' : 'false'}
              data-f="hosp"
            >
              Hospitality
            </button>
            <button
              type="submit"
              name="filter"
              value="int"
              className="chip"
              aria-pressed={activeFilter === 'int' ? 'true' : 'false'}
              data-f="int"
            >
              Interiors
            </button>
          </div>
        </form>
        <p className="sr" id="pcount" aria-live="polite">
          {activeFilter !== 'all' ? `${shownCount} project${shownCount === 1 ? '' : 's'} shown` : ''}
        </p>
        <div className="grid c3" id="pgrid">
          {cards.map((card) => {
            const isVisible = activeFilter === 'all' || card.tagList.includes(activeFilter)
            return (
              <article
                key={card.id}
                className="card"
                data-t={card.tags}
                hidden={!isVisible}
              >
                <div className="ph r43">
                  <Image
                    src={card.imgSrc}
                    alt={card.imgAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                  />
                </div>
                <p className="over" style={{ color: 'var(--ink-600)' }}>
                  {card.overline}
                </p>
                <h3 className="h4">
                  <Link href={card.href}>{card.title}</Link>
                </h3>
                <p className="xs">{card.meta}</p>
              </article>
            )
          })}
        </div>
        <div className="more">
          <Link className="btn sec" href="/projects">
            All projects
          </Link>
        </div>
      </div>
    </section>
  )
}
