import type { Metadata } from 'next'
import { SITE_URL } from './jsonld'

export interface PageMetaInput {
  title: string
  description: string
  path: string
  ogSubtitle?: string
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogSubtitle = 'Meru & Nairobi, Kenya',
  noIndex = false,
}: PageMetaInput): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    title.replace(/\s*\|\s*Shena Works.*$/i, ''),
  )}&subtitle=${encodeURIComponent(ogSubtitle)}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Shena Works Limited',
      locale: 'en_KE',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}
