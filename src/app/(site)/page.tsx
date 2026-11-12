import React from 'react'
import { HomeHero } from '@/components/blocks/HomeHero'
import { IntentSelector } from '@/components/blocks/IntentSelector'
import { ProofBar } from '@/components/blocks/ProofBar'
import { StatementBlock } from '@/components/blocks/StatementBlock'
import { ServiceGrid } from '@/components/blocks/ServiceGrid'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { EquipmentTeaser } from '@/components/blocks/EquipmentTeaser'
import { WhyShena } from '@/components/blocks/WhyShena'
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock'
import { InsightsRow } from '@/components/blocks/InsightsRow'
import { LocationsBand } from '@/components/blocks/LocationsBand'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getHomePage,
  getSiteSettings,
  getPublishedServices,
  getFeaturedProjects,
  getFeaturedMachines,
  getPublishedTestimonials,
  getPublishedPosts,
  getPublishedLocations,
} from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Road & Building Contractors in Meru and Nairobi | Shena Works',
  description:
    'Shena Works builds roads, cabro paving, drainage and buildings across Meru, Nairobi and Kenya, with its own excavators, graders and rollers. Request a quote.',
  path: '/',
})

/**
 * Home Page (AGENTS.md Section 0 & Section 5 Phase B, C & D)
 * Emits one component per numbered section comment in the reference,
 * in the same order, using Payload data (Local API, cached, revalidated by tag).
 * Conditional rendering rules (SITE-PLAN 8):
 * - ProofBar: hidden unless >= 2 verified proof items exist.
 * - TestimonialBlock: hidden unless >= 1 testimonial with permission file exists (never public-official first).
 * - InsightsRow: hidden unless >= 3 published posts exist.
 * - Project filter chips support progressive enhancement via GET searchParams.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const activeFilter =
    typeof resolvedSearchParams?.filter === 'string'
      ? resolvedSearchParams.filter
      : 'all'

  const [
    home,
    settings,
    services,
    projects,
    machines,
    testimonials,
    posts,
    locations,
  ] = await Promise.all([
    getHomePage().catch(() => null),
    getSiteSettings().catch(() => null),
    getPublishedServices().catch(() => []),
    getFeaturedProjects().catch(() => []),
    getFeaturedMachines().catch(() => []),
    getPublishedTestimonials({ excludePublicOfficials: true }).catch(() => []),
    getPublishedPosts().catch(() => []),
    getPublishedLocations().catch(() => []),
  ])

  // SITE-PLAN 8: ProofBar renders only when >= 2 verified proof items
  const verifiedProofItems = (settings?.proofItems || []).filter((p: any) => p.verified)

  // SITE-PLAN 8: Testimonials render only when >= 1 valid item (non-public-official on Home)
  const showTestimonials = testimonials && testimonials.length > 0

  // SITE-PLAN 8: InsightsRow renders only when >= 3 published posts
  const showInsights = posts && posts.length >= 3

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': ['Organization', 'GeneralContractor'],
                name: settings?.company?.legalName || 'Shena Works Limited',
                url: 'https://shenaworksltd.com/',
                telephone: settings?.contact?.phoneE164 || '+254718971896',
                email: settings?.contact?.email || 'shenaworksltd@gmail.com',
                areaServed: ['Meru', 'Nairobi', 'Kenya'],
              },
              {
                '@type': 'WebSite',
                name: settings?.company?.tradingName || 'Shena Works',
                url: 'https://shenaworksltd.com/',
              },
            ],
          }),
        }}
      />

      {/* 1 HomeHero */}
      <HomeHero hero={home} />

      {/* 2 IntentSelector */}
      <IntentSelector services={services} />

      {/* 3 ProofBar: hidden until >= 2 proof items are verified (SITE-PLAN 8) */}
      {verifiedProofItems.length >= 2 && <ProofBar items={verifiedProofItems} />}

      {/* Statement */}
      <StatementBlock />

      {/* 4 Services */}
      <ServiceGrid services={services} />

      {/* 5 Projects */}
      <ProjectGrid projects={projects} activeFilter={activeFilter} />

      {/* 6 EquipmentTeaser */}
      <EquipmentTeaser machines={machines} />

      {/* 7 WhyShena */}
      <WhyShena whyShena={home?.whyShena} />

      {/* 8 TestimonialBlock: hidden until >= 1 passes gate (SITE-PLAN 8) */}
      {showTestimonials && <TestimonialBlock testimonials={testimonials} />}

      {/* 9 InsightsRow: hidden until >= 3 published posts (SITE-PLAN 8) */}
      {showInsights && <InsightsRow posts={posts} />}

      {/* 10 LocationsBand */}
      <LocationsBand locations={locations} />

      {/* 11 CtaBand */}
      <CtaBand settings={settings} />
    </>
  )
}
