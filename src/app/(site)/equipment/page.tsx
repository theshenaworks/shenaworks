import React from 'react'
import { PageHero } from '@/components/blocks/PageHero'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { SectionIntro } from '@/components/blocks/SectionIntro'
import { ProcessSteps } from '@/components/blocks/ProcessSteps'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import {
  getEquipmentIndex,
  getMachinesByCategory,
  getPublishedEquipmentCategories,
} from '@/lib/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Excavator, Grader and Roller Hire in Meru | Shena Works',
  description:
    'Hire excavators, motor graders, rollers and bulldozers with trained operators in Meru and across Kenya. Check availability and get a quote.',
  path: '/equipment',
})

export default function EquipmentIndexPage() {
  const indexData = getEquipmentIndex()
  const categories = getPublishedEquipmentCategories()
  const whatsappUrl = buildWhatsAppUrl({ type: 'equipment' })

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Equipment hire' }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbs, '/equipment'),
      buildFaqJsonLd(indexData.faqs),
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
        headline="Excavator, grader, roller and bulldozer hire"
        lead="Machines we own and maintain, with our own operators, for contractors, farmers and developers in Meru and across Kenya."
        heroImage={{
          url: '/media/equipment-crawler-excavator.svg',
          alt: 'Shena Works 20-tonne crawler excavator and heavy plant fleet in Meru',
          caption: 'Heavy plant fleet maintained and operated by Shena Works in Meru County.',
        }}
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

      {/* 2. KeyFacts (hireTerms) */}
      <KeyFacts items={indexData.hireTerms} />

      {/* 3. Category links row */}
      <section className="bg-[var(--white)] pt-[3.2rem] pb-[1.6rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14 flex items-center gap-[0.8rem] overflow-x-auto pb-[0.8rem]">
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                href={`/equipment/${cat.slug}`}
                variant="subtle"
                className="shrink-0"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category sections */}
      {categories.map((cat, idx) => {
        const machines = getMachinesByCategory(cat.slug)
        const subtle = idx % 2 === 1

        return (
          <section
            key={cat.slug}
            data-surface={subtle ? 'subtle' : undefined}
            className={`${
              subtle
                ? 'bg-[var(--grey-100)] border-t border-b border-[var(--grey-300)]'
                : 'bg-[var(--white)]'
            } py-[6.4rem] lg:py-[8.0rem]`}
          >
            <SectionIntro
              heading={cat.name}
              body={cat.summary}
              actionLabel={`${cat.name} hire`}
              actionHref={`/equipment/${cat.slug}`}
            />

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
        )
      })}

      {/* 5. ProcessSteps — How hire works */}
      <ProcessSteps
        id="how-hire-works"
        heading="How hire works"
        steps={[
          {
            title: 'Tell us the job',
            description: 'Machine, site location, dates and what the work is.',
          },
          {
            title: 'Get a quote',
            description:
              'We confirm availability and send a price for the machine, operator and transport.',
          },
          {
            title: 'We deliver',
            description:
              'The machine arrives on a low-loader with its operator, ready to start.',
          },
          {
            title: 'Work and collect',
            description:
              'We log hours daily and collect the machine when the job is done.',
          },
        ]}
      />

      {/* 6. FaqAccordion */}
      <FaqAccordion heading="Hire questions" items={indexData.faqs} />

      {/* 7. EnquiryForm */}
      <EnquiryForm
        id="enquiry"
        overline="Request hire"
        heading="Check availability"
        body="Tell us the machine, dates and site. We'll confirm availability and price."
        defaultType="hire"
      />
    </>
  )
}
