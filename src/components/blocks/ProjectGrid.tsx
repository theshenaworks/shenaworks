'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectRecord } from '@/types/content'

/**
 * ProjectGrid (Next.js 16 Declarative React Component)
 * Client-driven filtering with progressive enhancement (form GET fallback when JS disabled).
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
    imgSrc: '/media/project-black-perch.jpg',
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
    imgSrc: '/media/project-pin-hideout.jpg',
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
    imgSrc: '/media/project-dukes.jpg',
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
  const [filter, setFilter] = useState<string>(activeFilter)
  const [hasInteracted, setHasInteracted] = useState(false)

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
    (card) => filter === 'all' || card.tagList.includes(filter)
  ).length

  const handleChipClick = (e: React.MouseEvent, f: string) => {
    e.preventDefault()
    setHasInteracted(true)
    setFilter(f)
  }

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
              aria-pressed={filter === 'all' ? 'true' : 'false'}
              data-f="all"
              onClick={(e) => handleChipClick(e, 'all')}
            >
              All
            </button>
            <button
              type="submit"
              name="filter"
              value="roads"
              className="chip"
              aria-pressed={filter === 'roads' ? 'true' : 'false'}
              data-f="roads"
              onClick={(e) => handleChipClick(e, 'roads')}
            >
              Roads and paving
            </button>
            <button
              type="submit"
              name="filter"
              value="build"
              className="chip"
              aria-pressed={filter === 'build' ? 'true' : 'false'}
              data-f="build"
              onClick={(e) => handleChipClick(e, 'build')}
            >
              Buildings
            </button>
            <button
              type="submit"
              name="filter"
              value="hosp"
              className="chip"
              aria-pressed={filter === 'hosp' ? 'true' : 'false'}
              data-f="hosp"
              onClick={(e) => handleChipClick(e, 'hosp')}
            >
              Hospitality
            </button>
            <button
              type="submit"
              name="filter"
              value="int"
              className="chip"
              aria-pressed={filter === 'int' ? 'true' : 'false'}
              data-f="int"
              onClick={(e) => handleChipClick(e, 'int')}
            >
              Interiors
            </button>
          </div>
        </form>
        <p className="sr" id="pcount" aria-live="polite">
          {hasInteracted || filter !== 'all'
            ? `${shownCount} project${shownCount === 1 ? '' : 's'} shown`
            : ''}
        </p>
        <div className="grid c3" id="pgrid">
          {cards.map((card) => {
            const isVisible = filter === 'all' || card.tagList.includes(filter)
            return (
              <article
                key={card.id}
                className="card"
                data-t={card.tags}
                style={{ display: isVisible ? undefined : 'none' }}
              >
                <div className="ph r43">
                  <Image
                    src={card.imgSrc}
                    alt={card.imgAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
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
