import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  getPublishedProjects,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { CtaBand } from '@/components/blocks/CtaBand'
import { ProjectsCatalogClient } from '@/components/blocks/ProjectsCatalogClient'

export const metadata: Metadata = buildPageMetadata({
  title: 'Projects: Roads, Paving, Hospitality & Building | Shena Works',
  description:
    'Completed roads, cabro paving, hospitality builds and commercial projects across Meru and Kenya. Every project says what we did and who delivered it.',
  path: '/projects',
})

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string; year?: string }>
}) {
  const params = await searchParams
  const [projects, services, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteSettings(),
  ])

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Projects' }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Projects | Shena Works Limited',
        description:
          'Completed road construction, cabro paving and commercial builds by Shena Works across Meru and Kenya.',
        url: `${SITE_URL}/projects`,
        about: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, '/projects'),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero page" style={{ padding: 0 }} data-surface="photo">
        <div className="ph">
          <Image
            src="/media/statement-keys.jpg"
            alt="A finished modern building handed over to the client"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Projects</span>
          </nav>
          <p className="over">Projects</p>
          <h1 className="h1" style={{ maxWidth: '14em' }}>
            Work we can show you
          </h1>
          <p className="lead">
            Every project here says what we built, where, and what our role was. Where another
            company delivered the work, we say so.
          </p>
        </div>
      </section>

      <ProjectsCatalogClient
        projects={projects}
        services={services}
        initialService={params.service || ''}
        initialLocation={params.location || ''}
        initialYear={params.year || ''}
      />

      <CtaBand settings={settings} />
    </>
  )
}
