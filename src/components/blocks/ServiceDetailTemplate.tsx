import React from 'react'
import { PageHero } from '@/components/blocks/PageHero'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { Prose } from '@/components/blocks/Prose'
import { ScopeList } from '@/components/blocks/ScopeList'
import { ProcessSteps } from '@/components/blocks/ProcessSteps'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { EquipmentTeaser } from '@/components/blocks/EquipmentTeaser'
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  getChildServices,
  getMachinesBySlugs,
  getProjectsByService,
  getPublishedEquipmentCategories,
  getPublishedServices,
  getPublishedTestimonials,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from '@/lib/seo/jsonld'
import type { ServiceRecord } from '@/types/content'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'

export interface ServiceDetailTemplateProps {
  service: ServiceRecord
  breadcrumbs: BreadcrumbItem[]
  path: string
}

export async function ServiceDetailTemplate({
  service,
  breadcrumbs,
  path,
}: ServiceDetailTemplateProps) {
  const [
    childServices,
    allProjects,
    allServices,
    equipmentUsedAll,
    equipmentCategories,
    testimonials,
  ] = await Promise.all([
    getChildServices(service.slug),
    getProjectsByService(service.slug),
    getPublishedServices(),
    getMachinesBySlugs(service.equipmentSlugs || []),
    getPublishedEquipmentCategories(),
    getPublishedTestimonials({ serviceSlug: service.slug }),
  ])
  const relatedProjects = allProjects.slice(0, 3)
  const equipmentUsed = equipmentUsedAll.slice(0, 3)
  const whatsappUrl = buildWhatsAppUrl({ type: 'service', serviceTitle: service.title })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildServiceJsonLd({
        name: service.title,
        description: service.metaDescription,
        path,
        serviceType: service.group,
      }),
      buildBreadcrumbJsonLd(breadcrumbs, path),
      ...(service.faqs.length > 0 ? [buildFaqJsonLd(service.faqs)] : []),
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
        overline={service.group}
        headline={service.heroHeadline}
        lead={service.heroLead}
        heroImage={service.heroImage}
        actions={
          <>
            <Button href="#enquiry" variant="primary">
              {service.ctaLabel}
            </Button>
            <Button href={whatsappUrl} external variant="outline-dark">
              WhatsApp us
            </Button>
          </>
        }
      />

      {/* 2. KeyFacts */}
      <KeyFacts items={service.keyFacts} />

      {/* 3. Intro Prose */}
      <section className="bg-[var(--white)] pt-[6.4rem] lg:pt-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10">
            <Prose paragraphs={service.intro} />
          </div>
        </div>
      </section>

      {/* 4. ScopeList */}
      <ScopeList heading="What we do" items={service.scope} />

      {/* 5. Sub-services (parent pages only) */}
      {childServices.length > 0 && (
        <section className="bg-[var(--white)] pb-[6.4rem] lg:pb-[8.0rem]">
          <div className="site-grid">
            <div className="col-span-4 lg:col-start-2 lg:col-span-14">
              <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">Specialist work</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
                {childServices.map((child) => (
                  <Card
                    key={child.slug}
                    href={`/services/${service.slug}/${child.slug}`}
                    imageSrc={child.heroImage.url}
                    imageAlt={child.heroImage.alt}
                    aspectRatio="4:3"
                    overline={child.group}
                    title={child.title}
                    summary={child.summary}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. ProcessSteps */}
      <ProcessSteps
        heading={`How a ${service.shortTitle.toLowerCase()} job runs`}
        steps={service.process}
      />

      {/* 8. Related Projects */}
      <ProjectGrid
        variant="related"
        overline="Projects"
        heading={`${service.shortTitle} we've delivered`}
        actionLabel="All projects"
        actionHref={`/projects?service=${service.slug}`}
        projects={relatedProjects}
        services={allServices}
      />

      {/* 9. Equipment Used */}
      <EquipmentTeaser
        overline="Equipment"
        heading="Machines on these jobs"
        machines={equipmentUsed}
        categories={equipmentCategories}
        compact
      />

      {/* 10. TestimonialBlock */}
      <TestimonialBlock testimonials={testimonials} />

      {/* 11. FaqAccordion */}
      <FaqAccordion items={service.faqs} />

      {/* 12. EnquiryForm */}
      <EnquiryForm
        id="enquiry"
        overline={service.ctaLabel}
        heading={service.formHeading}
        body={service.formIntro}
        defaultType={service.formType}
        defaultService={service.slug}
      />
    </>
  )
}
