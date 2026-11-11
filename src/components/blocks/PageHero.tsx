import React from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb'
import type { MediaItem } from '@/types/content'

export interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[]
  overline: string
  headline: string
  lead?: string
  heroImage: MediaItem
  actions?: React.ReactNode
}

export function PageHero({
  breadcrumbs,
  overline,
  headline,
  lead,
  heroImage,
  actions,
}: PageHeroProps) {
  return (
    <section
      data-surface="photo"
      className="relative min-h-[40.0rem] lg:min-h-[56.0rem] flex items-end overflow-hidden bg-[var(--ink-900)] text-[var(--white)] pt-[11.2rem] lg:pt-[16.0rem]"
    >
      <div className="hero-media absolute inset-0 z-0">
        <img
          src={heroImage.url}
          alt={heroImage.alt}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'var(--gradient-photo-top)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'var(--gradient-photo)' }}
        />
      </div>

      <div className="site-grid relative z-10 w-full pb-[4.8rem] lg:pb-[6.4rem]">
        <div className="col-span-4 lg:col-start-2 lg:col-span-10">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-[1.6rem]">
              <Breadcrumb items={breadcrumbs} onPhoto />
            </div>
          )}
          <p className="text-overline text-[var(--white)] mb-[1.2rem]">{overline}</p>
          <h1 className="text-h1 text-[var(--white)] mb-[2.0rem]">{headline}</h1>
          {lead && <p className="text-lead text-[var(--white)] max-w-[60ch] mb-[2.4rem]">{lead}</p>}
          {actions && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[0.8rem] mt-[0.8rem]">
              {actions}
            </div>
          )}
        </div>
      </div>

      {heroImage.caption && (
        <p className="hidden md:block absolute right-[2.4rem] bottom-[2.4rem] z-10 text-caption text-white/80">
          {heroImage.caption}
        </p>
      )}
    </section>
  )
}
