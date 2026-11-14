import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/blocks/CtaBand'
import { InsightsCatalogClient } from '@/components/blocks/InsightsCatalogClient'
import { getPublishedPostCategories, getPublishedPosts, getSiteSettings } from '@/lib/payload'
import { buildBlogJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const categories = await getPublishedPostCategories()
  const activeCat = categories.find((c) => c.slug === slug)
  if (!activeCat) return {}
  return buildPageMetadata({
    title: `${activeCat.name} Articles & Site Guides | Shena Works`,
    description: `Practical notes from site covering ${activeCat.name.toLowerCase()} across Meru, Nairobi and Kenya.`,
    path: `/insights/category/${activeCat.slug}`,
  })
}

export default async function InsightsCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ q?: string }>
}) {
  const [{ slug }, queryParams] = await Promise.all([
    params,
    searchParams || Promise.resolve({} as { q?: string }),
  ])
  const [categories, allPosts, settings] = await Promise.all([
    getPublishedPostCategories(),
    getPublishedPosts(),
    getSiteSettings(),
  ])

  const activeCat = categories.find((c) => c.slug === slug)
  if (!activeCat) notFound()

  const categoryPosts = allPosts.filter((p) => p.categorySlug === slug)
  if (categoryPosts.length === 0) notFound()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    { label: activeCat.name },
  ]
  const path = `/insights/category/${activeCat.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBlogJsonLd({
        name: `${activeCat.name} | Insights | Shena Works Limited`,
        description: `Practical notes from site covering ${activeCat.name.toLowerCase()} across Meru, Nairobi and Kenya.`,
        path,
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

      <div className="ph-head">
        <div className="wrap">
          <nav className="crumbs dk" aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/insights">Insights</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{activeCat.name}</span>
          </nav>
          <p className="over">Insights</p>
          <h1 className="h1">{activeCat.name}</h1>
          <p className="lead">
            Practical guides on road construction, cabro paving, earthmoving plant and building in
            Kenya.
          </p>
        </div>
      </div>

      <InsightsCatalogClient
        posts={allPosts}
        categories={categories}
        initialCategory={activeCat.slug}
        initialQuery={(queryParams?.q || '').trim()}
        basePath={path}
      />

      <CtaBand settings={settings} />
    </>
  )
}
