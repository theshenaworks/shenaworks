import React from 'react'
import { HomeHero } from '@/components/blocks/HomeHero'
import { IntentSelector } from '@/components/blocks/IntentSelector'
import { ProofBar } from '@/components/blocks/ProofBar'
import { ServiceGrid } from '@/components/blocks/ServiceGrid'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { EquipmentTeaser } from '@/components/blocks/EquipmentTeaser'
import { WhyShena } from '@/components/blocks/WhyShena'
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock'
import { InsightsRow } from '@/components/blocks/InsightsRow'
import { LocationsBand } from '@/components/blocks/LocationsBand'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getFeaturedMachines,
  getFeaturedProjects,
  getHomePage,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedPostCategories,
  getPublishedPosts,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteSettings,
} from '@/lib/payload'
import { buildOrganizationJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Road & Building Contractors in Meru and Nairobi | Shena Works',
  description:
    'Shena Works builds roads, cabro paving, drainage and buildings across Meru, Nairobi and Kenya, with its own excavators, graders and rollers. Request a quote.',
  path: '/',
})

export default async function HomePage() {
  const [
    home,
    settings,
    services,
    projects,
    machines,
    equipmentCategories,
    testimonials,
    posts,
    postCategories,
    locations,
  ] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getPublishedServices(),
    getFeaturedProjects(),
    getFeaturedMachines(),
    getPublishedEquipmentCategories(),
    getPublishedTestimonials({ excludePublicOfficials: true }),
    getPublishedPosts(),
    getPublishedPostCategories(),
    getPublishedLocations(),
  ])

  const architecturePublished = services.some((s) => s.slug === 'architecture-and-consultancy')
  const jsonLd = buildOrganizationJsonLd(settings)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HomeHero */}
      <HomeHero
        overline={home.heroOverline}
        headline={home.heroHeadline}
        lead={home.heroLead}
        heroImage={home.heroImage}
      />

      {/* 2. IntentSelector */}
      <IntentSelector architecturePublished={architecturePublished} />

      {/* 3. ProofBar (renders only if >= 2 verified items) */}
      <ProofBar items={settings.proofItems} />

      {/* 4. Services */}
      <ServiceGrid
        id="services"
        overline="Services"
        heading="What we build"
        body="One contractor for the road in, the ground it sits on and the building at the end of it."
        actionLabel="All services"
        actionHref="/services"
        services={services}
      />

      {/* 5. Projects */}
      <ProjectGrid
        variant="home"
        overline="Projects"
        heading="Recent work"
        body="Lounges, cottages, villas, paved compounds and roads in Meru County and beyond. Each project page says what we did and who delivered it."
        projects={projects}
        services={services}
      />

      {/* 6. EquipmentTeaser */}
      <EquipmentTeaser
        overline="Equipment hire"
        heading="Our machines, with our operators"
        body="Hire an excavator, grader, roller or bulldozer for your site. We quote for the machine, operator and transport, and confirm dates before we move."
        machines={machines}
        categories={equipmentCategories}
      />

      {/* 7. WhyShena */}
      <WhyShena
        overline={home.whyShena.overline}
        heading={home.whyShena.heading}
        image={home.whyShena.image}
        points={home.whyShena.points}
      />

      {/* 8. TestimonialBlock (hidden until a non-public-official testimonial passes the gate) */}
      <TestimonialBlock testimonials={testimonials} />

      {/* 9. InsightsRow (hidden until >= 3 posts are published) */}
      <InsightsRow posts={posts} categories={postCategories} />

      {/* 10. LocationsBand */}
      <LocationsBand heading="Where to find us" locations={locations} />

      {/* 11. CtaBand */}
      <CtaBand />
    </>
  )
}
