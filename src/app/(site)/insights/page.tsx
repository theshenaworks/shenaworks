import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CtaBand } from '@/components/blocks/CtaBand'
import { InsightsCatalogClient } from '@/components/blocks/InsightsCatalogClient'
import { getPublishedPostCategories, getPublishedPosts, getSiteSettings } from '@/lib/payload'
import { buildBlogJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Insights: Roads, Paving and Plant Hire | Shena Works',
  description:
    "Practical guides on road construction, cabro paving, earthmoving plant and building in Kenya, written from Shena Works' own projects.",
  path: '/insights',
})

export default async function InsightsIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; q?: string; category?: string }>
}) {
  const params = (await searchParams) || {}
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const initialQuery = (params.q || '').trim()
  const initialCategory = (params.category || '').trim()

  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts(),
    getPublishedPostCategories(),
    getSiteSettings(),
  ])

  // SITE-PLAN.md 8: Insights index renders only when >= 1 published post; otherwise 404
  if (posts.length === 0) {
    notFound()
  }

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Insights' }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBlogJsonLd({
        name: 'Insights | Shena Works Limited',
        description:
          "Practical articles on road construction, cabro paving, plant hire and building in Kenya, written from Shena Works' own projects.",
        path: '/insights',
      }),
      buildBreadcrumbJsonLd(breadcrumbs, '/insights'),
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
          <nav className="crumbs dk" aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Insights</span>
          </nav>
          <p className="over">Insights</p>
          <h1 className="h1">Notes from site</h1>
          <p className="lead">
            Practical guides on road construction, cabro paving, earthmoving plant and building in
            Kenya. Short enough to read between site visits.
          </p>
        </div>
      </div>

      <InsightsCatalogClient
        posts={posts}
        categories={categories}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
        basePath="/insights"
        currentPage={currentPage}
        pageSize={12}
      />

      <CtaBand settings={settings} />
    </>
  )
}
