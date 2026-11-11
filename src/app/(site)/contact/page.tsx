import React from 'react'
import { PageHeader } from '@/components/blocks/PageHeader'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { MapBlock } from '@/components/blocks/MapBlock'
import { getPublishedLocations, getSiteSettings } from '@/lib/content'
import { ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { EnquiryType } from '@/lib/validation/enquiry'

export const metadata = buildPageMetadata({
  title: 'Contact Shena Works | Request a Quote',
  description:
    'Request a quote for roads, paving, building or equipment hire. Call or WhatsApp +254 718 971 896, or send us the details online.',
  path: '/contact',
})

function resolvePresetType(typeParam?: string, equipmentParam?: string): EnquiryType {
  if (equipmentParam) return 'hire'
  if (
    typeParam === 'project' ||
    typeParam === 'hire' ||
    typeParam === 'consultation' ||
    typeParam === 'other'
  ) {
    return typeParam
  }
  return 'project'
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; service?: string; equipment?: string }>
}) {
  const params = await searchParams
  const settings = getSiteSettings()
  const locations = getPublishedLocations()

  const defaultType = resolvePresetType(params.type, params.equipment)
  const defaultService = params.service || ''
  const defaultEquipment = params.equipment || ''

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
            telephone: settings.contact.phoneE164,
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

      <PageHeader
        overline="Contact"
        headline="Request a quote or get in touch"
        lead="Tell us about the site and what you need. The more detail you give, the more useful our first reply will be."
      />

      <EnquiryForm
        id="enquiry"
        showSectionIntro={false}
        surface="white"
        showOfficesInAside
        defaultType={defaultType}
        defaultService={defaultService}
        defaultEquipment={defaultEquipment}
      />

      {locations.length > 0 && (
        <section
          data-surface="subtle"
          className="bg-[var(--grey-100)] py-[6.4rem] lg:py-[8.0rem] border-t border-[var(--grey-300)]"
        >
          <div className="site-grid">
            <div className="col-span-4 lg:col-start-2 lg:col-span-14">
              <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">Find our offices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[3.2rem]">
                {locations.map((loc) => (
                  <div key={loc.slug} className="space-y-[1.6rem]">
                    <div>
                      <h3 className="text-h4 text-[var(--ink-900)] mb-[0.4rem]">{loc.town}</h3>
                      <p className="text-body-sm text-[var(--ink-600)]">{loc.address}</p>
                    </div>
                    <MapBlock
                      town={loc.town}
                      address={loc.address}
                      embedUrl={loc.mapEmbedUrl}
                      directionsUrl={loc.directionsUrl}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
