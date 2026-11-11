import React from 'react'
import { Icon } from '@/components/ui/Icon'
import { SectionIntro } from './SectionIntro'
import type { LocationRecord } from '@/seed/data'

export interface LocationsBandProps {
  heading?: string
  locations: LocationRecord[]
}

export function LocationsBand({ heading = 'Where to find us', locations }: LocationsBandProps) {
  if (locations.length === 0) return null

  return (
    <section
      data-surface="subtle"
      className="bg-[var(--grey-100)] py-[6.4rem] lg:py-[8.0rem] border-t border-[var(--grey-300)]"
    >
      <SectionIntro heading={heading} />

      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 gap-[3.2rem]">
          {locations.map((loc) => (
            <div
              key={loc.slug}
              className="border-t-2 border-[var(--grey-300)] pt-[2.4rem] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-h3 text-[var(--ink-900)] mb-[1.2rem]">{loc.town}</h3>
                <address className="not-italic text-body text-[var(--ink-600)] mb-[0.8rem]">
                  {loc.address}
                </address>
                <p className="text-body font-bold text-[var(--ink-900)] mb-[0.8rem]">
                  <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="no-underline u-draw">
                    {loc.phone}
                  </a>
                </p>
                {loc.hours && (
                  <p className="text-body-xs text-[var(--ink-600)] mb-[2.0rem]">{loc.hours}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-[2.4rem]">
                <a
                  href={loc.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
                >
                  <span>Get directions</span>
                  <Icon name="external-link" size={16} />
                </a>
                <a
                  href={`/locations/${loc.slug}`}
                  className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
                >
                  <span>{loc.town} page</span>
                  <Icon name="arrow-right" size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
