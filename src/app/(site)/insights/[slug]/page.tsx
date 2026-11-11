import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/blocks/PageHeader'
import { FeatureSplit } from '@/components/blocks/FeatureSplit'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getPublishedPostBySlug,
  getPublishedPostCategories,
  getPublishedServiceBySlug,
  getTeamMember,
} from '@/lib/content'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) return {}
  return buildPageMetadata({
    title: `${post.title} | Shena Works`,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) notFound()

  const categories = getPublishedPostCategories()
  const category = categories.find((c) => c.slug === post.categorySlug)
  const author = getTeamMember()
  const relatedService = getPublishedServiceBySlug(post.relatedServiceSlug)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    ...(category
      ? [{ label: category.name, href: `/insights/category/${category.slug}` }]
      : []),
    { label: post.title },
  ]

  const path = `/insights/${post.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        image: `${SITE_URL}${post.coverImage.url}`,
        datePublished: post.publishedAt,
        author: {
          '@type': 'Person',
          name: author.name,
        },
        publisher: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, path),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        breadcrumbs={breadcrumbs}
        overline={category?.name || 'Insights'}
        headline={post.title}
        meta={`By ${author.name} · ${post.publishedAt} · ${post.readingTimeMinutes} min read`}
      />

      <section className="bg-[var(--white)] pt-[4.0rem] pb-[6.4rem] lg:pb-[8.0rem]">
        <div className="site-grid">
          <figure className="col-span-4 lg:col-start-2 lg:col-span-14 mb-[4.8rem]">
            <div className="aspect-video overflow-hidden bg-[var(--grey-100)]">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                className="h-full w-full object-cover"
              />
            </div>
            {post.coverImage.caption && (
              <figcaption className="text-figcaption text-[var(--ink-600)] mt-[0.8rem]">
                {post.coverImage.caption}
              </figcaption>
            )}
          </figure>

          <div className="col-span-4 lg:col-start-4 lg:col-span-10 space-y-[3.2rem]">
            {post.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="text-h2 text-[var(--ink-900)] mb-[1.6rem]">{sec.heading}</h2>
                <div className="space-y-[1.6rem] text-body text-[var(--ink-900)]">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedService ? (
        <FeatureSplit
          imagePosition="left"
          panelSurface="dark"
          overline="Need this done?"
          heading={relatedService.title}
          body={relatedService.summary}
          buttonLabel={relatedService.ctaLabel}
          buttonHref={`/contact?type=${relatedService.formType}&service=${relatedService.slug}`}
          image={relatedService.heroImage}
        />
      ) : (
        <CtaBand />
      )}
    </>
  )
}
