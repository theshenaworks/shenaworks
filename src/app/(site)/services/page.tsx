import React from 'react'
import { PageHero } from '@/components/blocks/PageHero'
import { StatementBlock } from '@/components/blocks/StatementBlock'
import { CtaBand } from '@/components/blocks/CtaBand'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { getPublishedServices } from '@/lib/payload'
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { ServiceRecord } from '@/types/content'

export const metadata = buildPageMetadata({
  title: 'Construction Services in Meru and Nairobi | Shena Works',
  description:
    'Road construction, earthworks, cabro paving, building construction, interior design and project management from one Meru-based contractor.',
  path: '/services',
})

const GROUPS: {
  id: string
  name: ServiceRecord['group']
  intro: string
  subtle?: boolean
}[] = [
  {
    id: 'roads-and-earthworks',
    name: 'Roads and earthworks',
    intro:
      'Access, estate and feeder roads, paved compounds and the drainage that keeps them standing.',
  },
  {
    id: 'buildings-and-interiors',
    name: 'Buildings and interiors',
    intro: 'Homes, hospitality and commercial buildings, from foundations to fit-out.',
    subtle: true,
  },
  {
    id: 'planning-and-delivery',
    name: 'Planning and delivery',
    intro:
      'Managing projects for clients, and the estimates and documents that come before a build.',
  },
]

export default async function ServicesIndexPage() {
  const allServices = await getPublishedServices()
  const topLevelServices = allServices.filter((s) => !s.parentSlug)
  const cabroService = allServices.find((s) => s.slug === 'cabro-paving')

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Services' }]
  const jsonLd = buildBreadcrumbJsonLd(breadcrumbs, '/services')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        overline="Services"
        headline="What we build"
        lead="Roads and earthworks, buildings and interiors, and the planning that keeps them on budget. We list only the work we deliver ourselves."
        heroImage={{
          url: '/media/service-road-construction.svg',
          alt: 'Shena Works road construction and building site operations in Meru',
          caption: 'Roads, earthworks, cabro paving and building construction across Kenya.',
        }}
      />

      {GROUPS.map((group) => {
        const groupServices = topLevelServices.filter((s) => s.group === group.name)
        if (groupServices.length === 0) return null

        return (
          <section
            key={group.id}
            id={group.id}
            data-surface={group.subtle ? 'subtle' : undefined}
            className={`${
              group.subtle
                ? 'bg-[var(--grey-100)] border-t border-b border-[var(--grey-300)]'
                : 'bg-[var(--white)]'
            } py-[6.4rem] lg:py-[8.0rem]`}
          >
            <div className="site-grid mb-[4.8rem]">
              <div className="col-span-4 lg:col-start-2 lg:col-span-9">
                <h2 className="text-h2 text-[var(--ink-900)] mb-[1.2rem]">{group.name}</h2>
                <p className="text-body text-[var(--ink-600)]">{group.intro}</p>
              </div>
            </div>

            <div className="space-y-[6.4rem]">
              {groupServices.map((service, idx) => {
                const isImageRight = idx % 2 === 1
                const hasCabroChild =
                  service.slug === 'road-construction-and-earthworks' && Boolean(cabroService)

                return (
                  <div key={service.slug} className="site-grid items-center gap-y-[2.4rem]">
                    <div
                      className={`col-span-4 ${
                        isImageRight
                          ? 'lg:col-start-9 lg:col-span-7 lg:row-start-1'
                          : 'lg:col-start-2 lg:col-span-7 lg:row-start-1'
                      }`}
                    >
                      <div className="aspect-video overflow-hidden bg-[var(--grey-300)]">
                        <img
                          src={service.heroImage.url}
                          alt={service.heroImage.alt}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div
                      className={`col-span-4 ${
                        isImageRight
                          ? 'lg:col-start-2 lg:col-span-6 lg:row-start-1'
                          : 'lg:col-start-9 lg:col-span-7 lg:row-start-1'
                      }`}
                    >
                      <h3 className="text-h3 text-[var(--ink-900)] mb-[1.2rem]">{service.title}</h3>
                      <p className="text-body text-[var(--ink-600)] mb-[2.0rem]">
                        {service.summary}
                      </p>

                      <ul className="list-disc pl-[2.0rem] space-y-[0.6rem] text-body-sm text-[var(--ink-900)] mb-[2.4rem]">
                        {service.scope.slice(0, 5).map((item) => (
                          <li key={item.title}>{item.title}</li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-[2.4rem]">
                        <Button href={`/services/${service.slug}`} variant="secondary">
                          View {service.shortTitle}
                        </Button>
                        {hasCabroChild && (
                          <a
                            href="/services/road-construction-and-earthworks/cabro-paving"
                            className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
                          >
                            <span>Cabro paving</span>
                            <Icon name="arrow-right" size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <StatementBlock
        heading="Not sure what you need?"
        body="Describe the site and what you want at the end. We'll tell you which services apply and what it is likely to involve."
        buttonLabel="Tell us about the job"
        buttonHref="/contact?type=project"
      />

      <CtaBand />
    </>
  )
}
