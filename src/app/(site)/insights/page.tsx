import React from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/blocks/PageHeader'
import { CtaBand } from '@/components/blocks/CtaBand'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getPublishedPostCategories, getPublishedPosts } from '@/lib/payload'
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Insights: Roads, Paving and Plant Hire | Shena Works',
  description:
    "Practical articles on road construction, cabro paving, plant hire and building in Kenya, written from Shena Works' own projects.",
  path: '/insights',
})

export default async function InsightsIndexPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedPostCategories(),
  ])
  // SITE-PLAN.md 8: Insights index renders only when >= 1 published post; otherwise 404
  if (posts.length === 0) {
    notFound()
  }
  const catMap = new Map<string, string>()
  categories.forEach((c) => catMap.set(c.slug, c.name))

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Insights' }]
  const jsonLd = buildBreadcrumbJsonLd(breadcrumbs, '/insights')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        breadcrumbs={breadcrumbs}
        overline="Insights"
        headline="Notes from site"
        lead="Practical articles on roads, paving, plant hire and building, written from jobs we've done."
      />

      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14 mb-[4.0rem] flex items-center gap-[0.8rem] overflow-x-auto pb-[0.8rem]">
            <Button
              href="/insights"
              variant="subtle"
              aria-current="page"
              className="bg-[var(--ink-900)] text-[var(--white)] border-[var(--ink-900)] shrink-0"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                href={`/insights/category/${cat.slug}`}
                variant="subtle"
                className="shrink-0"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
            {posts.map((post) => (
              <Card
                key={post.slug}
                href={`/insights/${post.slug}`}
                imageSrc={post.coverImage.url}
                imageAlt={post.coverImage.alt}
                aspectRatio="16:9"
                overline={catMap.get(post.categorySlug) || post.categorySlug}
                title={post.title}
                summary={post.excerpt}
                meta={`${post.publishedAt} · ${post.readingTimeMinutes} min read`}
              />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
