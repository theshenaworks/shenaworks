import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import {
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedMachines,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'
import { ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { EnquiryType } from '@/lib/validation/enquiry'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Shena Works | Request a Quote',
  description:
    'Request a quote for roads, paving, building or equipment hire. Call or WhatsApp +254 718 971 896, or send us the details online.',
  path: '/contact',
})

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; service?: string; equipment?: string; project?: string }>
}) {
  const params = await searchParams
  const [settings, services, machines, categories, locations] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getPublishedMachines(),
    getPublishedEquipmentCategories(),
    getPublishedLocations(),
  ])

  const initialType: EnquiryType =
    params.type === 'hire' || params.type === 'consultation' || params.type === 'other'
      ? (params.type as EnquiryType)
      : 'project'

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact Shena Works Limited',
        url: `${SITE_URL}/contact`,
        mainEntity: {
          '@id': ORG_ID,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: phone,
            contactType: 'sales',
            areaServed: 'KE',
            availableLanguage: ['en', 'sw'],
          },
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="ph-head">
        <div className="wrap">
          <nav className="crumbs dk" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <p className="over">Contact</p>
          <h1 className="h1">Request a quote or get in touch</h1>
          <p className="lead">
            Tell us about the site and what you need. The more detail you give, the more useful our
            first reply will be.
          </p>
        </div>
      </div>

      <EnquiryForm
        id="cf"
        showSectionIntro={false}
        defaultType={initialType}
        defaultService={params.service}
        defaultEquipment={params.equipment}
        services={services.map((s) => ({ slug: s.slug, title: s.title }))}
        categories={categories.map((c) => ({ slug: c.slug, singular: c.singular || c.name }))}
        machines={machines.map((m) => ({
          slug: m.slug,
          name: m.name,
          make: m.make || '',
          model: m.model || '',
        }))}
        locations={locations.map((l) => ({
          slug: l.slug,
          town: l.town,
          address: l.address || '',
          directionsUrl: l.directionsUrl || '',
        }))}
        contact={{
          phoneE164: settings.contact?.phoneE164 || '+254718971896',
          phoneDisplay: settings.contact?.phoneDisplay || '+254 718 971 896',
          whatsappNumber: settings.contact?.whatsappNumber || '254718971896',
          officeHours: settings.contact?.officeHours,
          responseTimeStatement: settings.contact?.responseTimeStatement,
        }}
      />
    </>
  )
}
