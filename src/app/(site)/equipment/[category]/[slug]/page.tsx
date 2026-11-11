import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Gallery } from '@/components/blocks/Gallery'
import { ScopeList } from '@/components/blocks/ScopeList'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { DataTable, type TableColumn } from '@/components/ui/Table'
import {
  getPublishedEquipmentCategories,
  getPublishedMachine,
  getPublishedMachines,
} from '@/lib/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildMachineProductJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { KeyFactItem } from '@/seed/data'

export function generateStaticParams() {
  return getPublishedMachines().map((m) => ({
    category: m.categorySlug,
    slug: m.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const found = getPublishedMachine(category, slug)
  if (!found) return {}
  const { category: cat, machine } = found
  return buildPageMetadata({
    title: `${machine.name} for Hire | Shena Works`,
    description: `Hire our ${machine.make} ${machine.model} ${cat.singular} with operator in Meru and across Kenya. ${machine.capacity}. Check availability and request a quote.`,
    path: `/equipment/${cat.slug}/${machine.slug}`,
  })
}

interface SpecRow {
  spec: string
  value: string
}

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const found = getPublishedMachine(category, slug)
  if (!found) notFound()

  const { category: cat, machine } = found
  const isAvailable = machine.availability === 'available'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: cat.name, href: `/equipment/${cat.slug}` },
    { label: machine.name },
  ]

  const whatsappUrl = buildWhatsAppUrl({
    type: 'machine',
    machineName: machine.name,
    make: machine.make,
    model: machine.model,
  })

  const specRows: SpecRow[] = [
    { spec: 'Make', value: machine.make },
    { spec: 'Model', value: machine.model },
    ...(machine.year ? [{ spec: 'Year', value: machine.year }] : []),
    ...(machine.operatingWeight
      ? [{ spec: 'Operating weight', value: machine.operatingWeight }]
      : []),
    ...(machine.attachmentSize
      ? [{ spec: 'Bucket / blade / drum size', value: machine.attachmentSize }]
      : []),
    ...(machine.enginePower ? [{ spec: 'Engine power', value: machine.enginePower }] : []),
  ]

  const specColumns: TableColumn<SpecRow>[] = [
    { key: 'spec', header: 'Specification', render: (r) => r.spec },
    { key: 'value', header: 'Details', render: (r) => r.value },
  ]

  const hireFacts: KeyFactItem[] = [
    { term: 'Operator', value: machine.hireTerms.operator },
    { term: 'Fuel', value: machine.hireTerms.fuel },
    { term: 'Transport', value: machine.hireTerms.transport },
    { term: 'Minimum hire', value: machine.hireTerms.minimumHire },
    { term: 'Service area', value: machine.hireTerms.serviceArea },
  ]

  const allCategories = getPublishedEquipmentCategories()
  const catMap = new Map<string, string>()
  allCategories.forEach((c) => catMap.set(c.slug, c.singular))

  const otherMachines = getPublishedMachines()
    .filter((m) => m.slug !== machine.slug)
    .sort(
      (a, b) =>
        Number(b.categorySlug === machine.categorySlug) -
        Number(a.categorySlug === machine.categorySlug),
    )
    .slice(0, 3)

  const path = `/equipment/${cat.slug}/${machine.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildMachineProductJsonLd({
        name: machine.name,
        make: machine.make,
        model: machine.model,
        categoryName: cat.name,
        image: machine.heroImage.url,
        path,
        available: isAvailable,
      }),
      buildBreadcrumbJsonLd(breadcrumbs, path),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header layout (white, no photo hero; header white per SITE-PLAN.md 6.11) */}
      <section className="bg-[var(--white)] pt-[9.2rem] lg:pt-[18.4rem] pb-[6.4rem] border-b border-[var(--grey-300)]">
        <div className="site-grid items-start gap-y-[3.2rem]">
          {/* Left col 2-8: Gallery 4:3 */}
          <div className="col-span-4 lg:col-start-2 lg:col-span-8">
            <Gallery
              id={`machine-gallery-${machine.slug}`}
              title={`${machine.name} photos`}
              images={machine.gallery.length > 0 ? machine.gallery : [machine.heroImage]}
              aspectRatio="4:3"
            />
          </div>

          {/* Right col 10-5: Breadcrumb, overline, h1, availability, spec table, buttons */}
          <div className="col-span-4 lg:col-start-10 lg:col-span-6">
            <div className="mb-[1.6rem]">
              <Breadcrumb items={breadcrumbs} />
            </div>
            <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">{cat.singular}</p>
            <h1 className="text-h1 text-[var(--ink-900)] mb-[1.6rem]">{machine.name}</h1>

            <p className="inline-flex items-center gap-[0.8rem] text-body-xs font-bold text-[var(--ink-900)] mb-[2.4rem]">
              <Icon name={isAvailable ? 'check' : 'info'} size={18} />
              <span>
                Availability: {isAvailable ? 'Available' : 'On hire, ask for dates'}
              </span>
            </p>

            <div className="mb-[3.2rem]">
              <DataTable
                caption={`${machine.name} specifications`}
                hideCaption
                columns={specColumns}
                rows={specRows}
                getRowKey={(r) => r.spec}
              />
            </div>

            <div className="flex flex-wrap items-center gap-[1.2rem]">
              <Button href="#enquiry" variant="primary">
                Request hire
              </Button>
              <Button href={whatsappUrl} external variant="outline">
                WhatsApp us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typical uses ScopeList */}
      <ScopeList heading="Typical uses" items={machine.uses} />

      {/* 3. Hire terms KeyFacts */}
      <KeyFacts heading="Hire terms" items={hireFacts} />

      {/* 4. EnquiryForm */}
      <EnquiryForm
        id="enquiry"
        overline="Request hire"
        heading={`Hire the ${machine.name}`}
        body="Tell us your start date and site location. We'll confirm availability and transport cost."
        defaultType="hire"
        defaultEquipment={machine.slug}
      />

      {/* 5. Other machines */}
      {otherMachines.length > 0 && (
        <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
          <div className="site-grid">
            <div className="col-span-4 lg:col-start-2 lg:col-span-14">
              <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">Other machines</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[3.2rem]">
                {otherMachines.map((m) => (
                  <Card
                    key={m.slug}
                    href={`/equipment/${m.categorySlug}/${m.slug}`}
                    imageSrc={m.heroImage.url}
                    imageAlt={m.heroImage.alt}
                    aspectRatio="4:3"
                    overline={catMap.get(m.categorySlug) || m.categorySlug}
                    title={m.name}
                    summary={`${m.make} ${m.model} · ${m.capacity}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
