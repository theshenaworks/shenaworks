import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CtaBand } from '@/components/blocks/CtaBand'
import { ShareBar } from '@/components/ui/ShareBar'
import { formatPostDate } from '@/lib/format'
import {
  getPublishedPostBySlug,
  getPublishedPostCategories,
  getPublishedPosts,
  getPublishedServiceBySlug,
  getSiteSettings,
  getTeamMember,
} from '@/lib/payload'
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
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
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

  const [categories, author, relatedService, allPosts, settings] = await Promise.all([
    getPublishedPostCategories(),
    getTeamMember(),
    post.relatedServiceSlug ? getPublishedServiceBySlug(post.relatedServiceSlug) : Promise.resolve(undefined),
    getPublishedPosts(),
    getSiteSettings(),
  ])

  const catMap = new Map<string, string>()
  categories.forEach((c) => catMap.set(c.slug, c.name))

  const category = categories.find((c) => c.slug === post.categorySlug)
  const sameCategory = allPosts.filter(
    (p) => p.slug !== post.slug && p.categorySlug === post.categorySlug,
  )
  const otherPosts = allPosts.filter(
    (p) => p.slug !== post.slug && p.categorySlug !== post.categorySlug,
  )
  const relatedPosts = [...sameCategory, ...otherPosts].slice(0, 3)

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
      buildArticleJsonLd({
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage.url,
        datePublished: post.publishedAt,
        authorName: author.name,
        path,
      }),
      buildBreadcrumbJsonLd(breadcrumbs, path),
    ],
  }

  const formattedDate = formatPostDate(post.publishedAt)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="ph-head art-h">
        <div className="wrap">
          <nav className="crumbs dk" aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/insights">Insights</Link>
            {category && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/insights/category/${category.slug}`}>{category.name}</Link>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span aria-current="page">{post.title}</span>
          </nav>
          <p className="over">{category?.name || 'Insights'}</p>
          <h1 className="h1">{post.title}</h1>
          <p className="meta">
            {`By ${author.name}`}
            {formattedDate && (
              <>
                {' · '}
                <time dateTime={post.publishedAt}>{formattedDate}</time>
              </>
            )}
            {` · ${post.readingTimeMinutes} min read`}
          </p>
        </div>
      </div>

      <div className="wrap">
        <figure className="cover">
          <div className="ph">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              sizes="(min-width: 1160px) 1048px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {post.coverImage.caption && <figcaption>{post.coverImage.caption}</figcaption>}
        </figure>
      </div>

      <article className="art">
        <div className="wrap">
          <div className="body">
            {post.sections.map((sec) => (
              <React.Fragment key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </React.Fragment>
            ))}
          </div>

          <ShareBar title={post.title} slug={post.slug} />

          <aside className="acard" aria-label="Author">
            <div className="ph">
              <Image
                src={author.portrait?.url || '/media/newton-portrait.jpg'}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div>
              <b>{author.name}</b>
              <span>{author.role || 'Managing Director, Shena Works'}</span>
            </div>
          </aside>
        </div>
      </article>

      {relatedService ? (
        <section className="fsec" aria-label="Related service">
          <div className="split">
            <div className="ph">
              <Image
                src={relatedService.heroImage.url}
                alt={relatedService.heroImage.alt}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="panel" data-surface="dark">
              <p className="over">Need this done?</p>
              <h2 className="h3">{relatedService.title}</h2>
              <p>{relatedService.summary}</p>
              <Link
                className="btn out"
                href={`/contact?type=${relatedService.formType}&service=${relatedService.slug}`}
              >
                {relatedService.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <CtaBand settings={settings} />
      )}

      {relatedPosts.length > 0 && (
        <section className="rel" aria-labelledby="rl-h">
          <div className="wrap">
            <h2 className="h2" id="rl-h" style={{ marginBottom: '40px' }}>
              More from Insights
            </h2>
            <div className="pgrid">
              {relatedPosts.map((rp) => (
                <article key={rp.slug} className="pc">
                  <div className="ph r169">
                    <Image
                      src={rp.coverImage.url}
                      alt={rp.coverImage.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="over">{catMap.get(rp.categorySlug) || rp.categorySlug}</p>
                  <h3 className="h4">
                    <Link href={`/insights/${rp.slug}`}>{rp.title}</Link>
                  </h3>
                  <p className="sm">{rp.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
