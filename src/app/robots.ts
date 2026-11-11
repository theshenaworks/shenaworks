import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/jsonld'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/admin', '/api/', '/thank-you'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
