import React from 'react'
import { Card } from '@/components/ui/Card'
import { SectionIntro } from './SectionIntro'
import type { ServiceRecord } from '@/types/content'

export interface ServiceGridProps {
  id?: string
  overline?: string
  heading?: string
  body?: string
  actionLabel?: string
  actionHref?: string
  services: ServiceRecord[]
}

export function ServiceGrid({
  id,
  overline = 'Services',
  heading = 'What we build',
  body,
  actionLabel,
  actionHref,
  services,
}: ServiceGridProps) {
  if (services.length === 0) return null

  return (
    <section id={id} className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <SectionIntro
        overline={overline}
        heading={heading}
        body={body}
        actionLabel={actionLabel}
        actionHref={actionHref}
      />

      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
          {services.map((service) => {
            const href = service.parentSlug
              ? `/services/${service.parentSlug}/${service.slug}`
              : `/services/${service.slug}`
            return (
              <Card
                key={service.slug}
                href={href}
                imageSrc={service.heroImage.url}
                imageAlt={service.heroImage.alt}
                aspectRatio="4:3"
                overline={service.group}
                title={service.title}
                summary={service.summary}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
