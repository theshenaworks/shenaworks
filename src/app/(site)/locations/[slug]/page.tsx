import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/PageHero'
import { MapBlock } from '@/components/blocks/MapBlock'
import { Prose } from '@/components/blocks/Prose'
import { ServiceGrid } from '@/components/blocks/ServiceGrid'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { EquipmentTeaser } from '@/components/blocks/EquipmentTeaser'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { CtaBand } from '@/components/blocks/CtaBand'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import {
  getFeaturedMachines,
  getProjectsByCounty,
  getPublishedEquipmentCategories,
  getPublishedLocationBySlug,
  getPublishedLocations,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return getPublishedLocations().map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const loc = getPublishedLocationBySlug(slug)
  if (!loc) return {}
  return buildPageMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: `/locations/${loc.slug}`,
  })
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const location = getPublishedLocationBySlug(slug)
  // SITE-PLAN.md 8: Unpublished locations (e.g. Nairobi while in draft) return 404
  if (!location) notFound()

  const settings = getSiteSettings()
  const services = getPublishedServices()
  const localProjects = getProjectsByCounty(location.county).slice(0, 6)
  const machines = getFeaturedMachines()
  const equipmentCategories = getPublishedEquipmentCategories()

  const whatsappUrl = buildWhatsAppUrl({ type: 'location', town: location.town })
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: location.town },
  ]

  const path = `/locations/${location.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': `${SITE_URL}${path}#branch`,
        name: `Shena Works Limited — ${location.town}`,
        parentOrganization: { '@id': ORG_ID },
        telephone: settings.contact.phoneE164,
        email: location.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: location.address,
          addressLocality: location.town,
          addressRegion: location.county,
          addressCountry: 'KE',
        },
        areaServed: location.county,
      },
      buildBreadcrumbJsonLd(breadcrumbs, path),
      ...(location.faqs.length > 0 ? [buildFaqJsonLd(location.faqs)] : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. PageHero */}
      <PageHero
        breadcrumbs={breadcrumbs}
        overline="Locations"
        headline={location.heroHeadline}
        lead={location.heroLead}
        heroImage={location.heroImage}
        actions={
          <>
            <Button href={`tel:${settings.contact.phoneE164}`} variant="primary">
              Call {settings.contact.phoneDisplay}
            </Button>
            <Button href={whatsappUrl} external variant="outline-dark">
              WhatsApp us
            </Button>
          </>
        }
      />

      {/* 2. Office + Map */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem] border-b border-[var(--grey-300)]">
        <div className="site-grid items-center gap-y-[3.2rem]">
          <div className="col-span-4 lg:col-start-2 lg:col-span-6">
            <h2 className="text-h2 text-[var(--ink-900)] mb-[2.0rem]">
              Our {location.town} office
            </h2>
            <address className="not-italic space-y-[1.2rem] text-body text-[var(--ink-900)] mb-[2.4rem]">
              <p>{location.address}</p>
              <p className="font-bold">
                <a href={`tel:${settings.contact.phoneE164}`} className="no-underline u-draw">
                  {location.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${location.email}`} className="no-underline u-draw">
                  {location.email}
                </a>
              </p>
              {location.hours && (
                <p className="text-body-xs text-[var(--ink-600)]">{location.hours}</p>
              )}
            </address>
            <a
              href={location.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
            >
              <span>Get directions</span>
              <Icon name="external-link" size={16} />
            </a>
          </div>

          <div className="col-span-4 lg:col-start-8 lg:col-span-8">
            <MapBlock
              town={location.town}
              address={location.address}
              embedUrl={location.mapEmbedUrl}
              directionsUrl={location.directionsUrl}
            />
          </div>
        </div>
      </section>

      {/* 3. Local intro Prose */}
      <section className="bg-[var(--white)] pt-[6.4rem] lg:pt-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10">
            <Prose paragraphs={location.intro} />
          </div>
        </div>
      </section>

      {/* 4. ServiceGrid */}
      <ServiceGrid
        overline="Services"
        heading={`What we do in ${location.town}`}
        services={services}
      />

      {/* 5. ProjectGrid */}
      <ProjectGrid
        variant="related"
        overline="Projects"
        heading={`Projects in ${location.county}`}
        actionLabel="All projects"
        actionHref={`/projects?location=${encodeURIComponent(location.county)}`}
        projects={localProjects}
        services={services}
      />

      {/* 6. EquipmentTeaser */}
      <EquipmentTeaser
        overline="Equipment hire"
        heading={`Equipment hire in ${location.town}`}
        machines={machines}
        categories={equipmentCategories}
      />

      {/* 7. FaqAccordion */}
      <FaqAccordion items={location.faqs} />

      {/* 8. CtaBand */}
      <CtaBand />
    </>
  )
}
