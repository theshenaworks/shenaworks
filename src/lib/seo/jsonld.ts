import type { FaqItem, SiteSettingsRecord } from '@/types/content'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shenaworksltd.com'
export const ORG_ID = `${SITE_URL}/#organization`

export function buildOrganizationJsonLd(settings?: SiteSettingsRecord) {
  const legalName = settings?.company?.legalName || 'Shena Works Limited'
  const tradingName = settings?.company?.tradingName || 'Shena Works'
  const phone = settings?.contact?.phoneE164 || '+254718971896'
  const email = settings?.contact?.email || 'shenaworksltd@gmail.com'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'GeneralContractor'],
        '@id': ORG_ID,
        name: legalName,
        alternateName: tradingName,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-color.svg`,
        telephone: phone,
        email: email,
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Meru County' },
          { '@type': 'AdministrativeArea', name: 'Nairobi County' },
          { '@type': 'Country', name: 'Kenya' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Meru',
          addressRegion: 'Meru County',
          addressCountry: 'KE',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: legalName,
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], currentPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : `${SITE_URL}${currentPath}`,
    })),
  }
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildServiceJsonLd(params: {
  name: string
  description: string
  path: string
  serviceType: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    serviceType: params.serviceType,
    url: `${SITE_URL}${params.path}`,
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Meru County' },
      { '@type': 'AdministrativeArea', name: 'Nairobi County' },
      { '@type': 'Country', name: 'Kenya' },
    ],
  }
}

export function buildMachineProductJsonLd(params: {
  name: string
  make: string
  model: string
  categoryName: string
  image: string
  path: string
  available: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    brand: { '@type': 'Brand', name: params.make },
    model: params.model,
    category: params.categoryName,
    image: `${SITE_URL}${params.image}`,
    url: `${SITE_URL}${params.path}`,
    offers: {
      '@type': 'Offer',
      availability: params.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      seller: { '@id': ORG_ID },
    },
  }
}
