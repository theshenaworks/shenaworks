import React from 'react'
import { PageHero } from '@/components/blocks/PageHero'
import { ProjectsCatalogClient } from '@/components/blocks/ProjectsCatalogClient'
import { CtaBand } from '@/components/blocks/CtaBand'
import { getPublishedProjects, getPublishedServices } from '@/lib/content'
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Projects: Roads, Paving and Buildings | Shena Works',
  description:
    "Lounges, cottages, villas, cabro-paved compounds and roads built in Meru County and beyond, with Shena Works' role stated on every project.",
  path: '/projects',
})

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string; year?: string }>
}) {
  const params = await searchParams
  const projects = getPublishedProjects()
  const services = getPublishedServices()

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Projects' }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Shena Works Projects',
        url: `${SITE_URL}/projects`,
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

      <PageHero
        breadcrumbs={breadcrumbs}
        overline="Projects"
        headline="Work we can show you"
        lead="Every project here says what we built, where, and what our role was. Where another company delivered the work, we say so."
        heroImage={{
          url: '/media/project-black-perch-lounge.svg',
          alt: 'The Black Perch Lounge hospitality pavilions and cabro compound in Meru',
          caption: 'The Black Perch Lounge in Meru County — built and paved by Shena Works.',
        }}
      />

      <ProjectsCatalogClient
        projects={projects}
        services={services}
        initialService={params.service || ''}
        initialLocation={params.location || ''}
        initialYear={params.year || ''}
      />

      <CtaBand />
    </>
  )
}
