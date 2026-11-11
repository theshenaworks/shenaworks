import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/PageHero'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { Prose } from '@/components/blocks/Prose'
import { ScopeList } from '@/components/blocks/ScopeList'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import {
  getEquipmentCategoryBySlug,
  getEquipmentIndex,
  getMachinesByCategory,
  getPublishedEquipmentCategories,
  getPublishedProjects,
  getPublishedServices,
} from '@/lib/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return getPublishedEquipmentCategories().map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getEquipmentCategoryBySlug(category)
  if (!cat) return {}
  return buildPageMetadata({
    title: cat.metaTitle,
    description: cat.metaDescription,
    path: `/equipment/${cat.slug}`,
  })
}

export default async function EquipmentCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getEquipmentCategoryBySlug(category)
  if (!cat) notFound()

  const machines = getMachinesByCategory(cat.slug)
  if (machines.length === 0) notFound()

  const indexData = getEquipmentIndex()
  const machineSlugs = new Set(machines.map((m) => m.slug))
  const relatedProjects = getPublishedProjects()
    .filter((p) => p.equipmentSlugs.some((slug) => machineSlugs.has(slug)))
    .slice(0, 3)
  const allServices = getPublishedServices()

  const whatsappUrl = buildWhatsAppUrl({ type: 'equipment', categoryName: cat.name })
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: cat.name },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OfferCatalog',
        name: `${cat.name} Hire`,
        url: `${SITE_URL}/equipment/${cat.slug}`,
        provider: { '@id': ORG_ID },
        itemListElement: machines.map((m) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: m.name,
            brand: m.make,
            model: m.model,
          },
        })),
      },
      buildBreadcrumbJsonLd(breadcrumbs, `/equipment/${cat.slug}`),
      ...(cat.faqs.length > 0 ? [buildFaqJsonLd(cat.faqs)] : []),
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
        overline="Equipment hire"
        headline={cat.heroHeadline}
        lead={cat.heroLead}
        heroImage={cat.heroImage}
        actions={
          <>
            <Button href="#enquiry" variant="primary">
              Request hire
            </Button>
            <Button href={whatsappUrl} external variant="outline-dark">
              WhatsApp us
            </Button>
          </>
        }
      />

      {/* 2. KeyFacts */}
      <KeyFacts items={indexData.hireTerms} />

      {/* 3. Prose intro */}
      <section className="bg-[var(--white)] pt-[6.4rem] lg:pt-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10">
            <Prose paragraphs={cat.intro} />
          </div>
        </div>
      </section>

      {/* 4. Machine grid */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
            {machines.map((machine) => {
              const isAvailable = machine.availability === 'available'
              return (
                <Card
                  key={machine.slug}
                  href={`/equipment/${cat.slug}/${machine.slug}`}
                  imageSrc={machine.heroImage.url}
                  imageAlt={machine.heroImage.alt}
                  aspectRatio="4:3"
                  overline={cat.singular}
                  title={machine.name}
                  summary={`${machine.make} ${machine.model} · ${machine.capacity}`}
                  meta={
                    <span className="inline-flex items-center gap-[0.6rem] text-[var(--ink-900)] font-bold">
                      <Icon name={isAvailable ? 'check' : 'info'} size={16} />
                      <span>{isAvailable ? 'Available' : 'On hire, ask for dates'}</span>
                    </span>
                  }
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Typical uses ScopeList */}
      <ScopeList heading={`What ${cat.plural} do on site`} items={cat.uses} />

      {/* 6. Related Projects */}
      <ProjectGrid
        variant="related"
        overline="Projects"
        heading={`Projects using our ${cat.plural}`}
        projects={relatedProjects}
        services={allServices}
      />

      {/* 7. FaqAccordion */}
      <FaqAccordion items={cat.faqs} />

      {/* 8. EnquiryForm */}
      <EnquiryForm
        id="enquiry"
        overline="Request hire"
        heading={`Hire ${cat.article} ${cat.singular}`}
        body="Tell us the dates and site location. We'll confirm availability and price."
        defaultType="hire"
        defaultEquipment={`any-${cat.slug}`}
      />
    </>
  )
}
