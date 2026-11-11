'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { trackEvent } from '@/lib/analytics'
import type { MediaItem } from '@/seed/data'

export interface HomeHeroProps {
  overline: string
  headline: string
  lead: string
  heroImage: MediaItem
}

export function HomeHero({ overline, headline, lead, heroImage }: HomeHeroProps) {
  return (
    <section
      data-surface="photo"
      className="relative min-h-[56.0rem] lg:min-h-[72.0rem] flex items-end overflow-hidden bg-[var(--ink-900)] text-[var(--white)] pt-[12.0rem] lg:pt-[16.0rem]"
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

      <div className="site-grid relative z-10 w-full pb-[6.4rem] lg:pb-[8.0rem]">
        <div className="col-span-4 lg:col-start-2 lg:col-span-9">
          <p className="text-overline text-[var(--white)] mb-[1.6rem]">{overline}</p>
          <h1 className="text-display text-[var(--white)] mb-[2.4rem]">{headline}</h1>
          <p className="text-lead text-[var(--white)] max-w-[56ch] mb-[3.2rem]">{lead}</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[0.8rem]">
            <Button
              href="/contact?type=project"
              variant="primary"
              onClick={() => trackEvent('cta_click', { cta_id: 'hero_quote' })}
            >
              Request a quote
            </Button>
            <Button
              href="/equipment"
              variant="outline-dark"
              onClick={() => trackEvent('cta_click', { cta_id: 'hero_hire' })}
            >
              Hire equipment
            </Button>
          </div>
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
