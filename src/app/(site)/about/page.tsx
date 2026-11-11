import React from 'react'
import { PageHero } from '@/components/blocks/PageHero'
import { SubNavPanel } from '@/components/blocks/SubNavPanel'
import { FeatureSplit } from '@/components/blocks/FeatureSplit'
import { ProcessSteps } from '@/components/blocks/ProcessSteps'
import { StatementBlock } from '@/components/blocks/StatementBlock'
import { LocationsBand } from '@/components/blocks/LocationsBand'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getPublishedCredentials,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedMachines,
  getSiteSettings,
  getTeamMember,
} from '@/lib/content'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'About Shena Works | Meru Roads and Building Contractor',
  description:
    'Shena Works Limited is a Meru-based roads and building contractor with its own earthmoving plant, working across Meru, Nairobi and the rest of Kenya.',
  path: '/about',
})

export default function AboutPage() {
  const settings = getSiteSettings()
  const machines = getPublishedMachines()
  const categories = getPublishedEquipmentCategories()
  const locations = getPublishedLocations()
  const team = getTeamMember()
  const hasCredentials = getPublishedCredentials().length > 0
  const hasCompanyProfile = Boolean(settings.files.companyProfile?.url)

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'About' }]

  const subNavLinks = [
    { label: 'Company', href: '/about', current: true },
    { label: 'Leadership', href: '/about/leadership' },
    ...(hasCredentials
      ? [{ label: 'Credentials and safety', href: '/about/credentials-and-safety' }]
      : []),
    ...(hasCompanyProfile
      ? [{ label: 'Company profile', href: '/downloads/company-profile', download: true }]
      : []),
  ]

  const fleetBody =
    machines.length > 0
      ? `${machines.length} machines across ${categories.length} categories, maintained by us and operated by our own trained operators.`
      : 'Excavators, graders, rollers and bulldozers, maintained by us and operated by our own trained operators.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About Shena Works Limited',
        url: `${SITE_URL}/about`,
        mainEntity: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, '/about'),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. PageHero */}
      <PageHero
        breadcrumbs={breadcrumbs}
        overline="About"
        headline="A Meru contractor for roads and buildings"
        heroImage={{
          url: '/media/about-site-supervision.svg',
          alt: 'Shena Works site crew and heavy equipment working on a road project in Meru',
          caption: 'Road and building construction team on site in Meru County.',
        }}
      />

      {/* 2. Intro + SubNavPanel */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid items-start">
          <div className="col-span-4 lg:col-start-2 lg:col-span-9">
            <div className="lg:hidden">
              <SubNavPanel overline="About" links={subNavLinks} />
            </div>
            <h2 className="text-h2 text-[var(--ink-900)] mb-[2.4rem]">Who we are</h2>
            <div className="space-y-[2.0rem] text-body text-[var(--ink-900)] max-w-[65ch]">
              <p>
                Shena Works Limited is a roads and building contractor based in Meru, with an office
                in Nairobi. We build access and estate roads, lay cabro paving, cut drains and
                install culverts, and we put up homes, lounges, cottages and commercial premises.
              </p>
              <p>
                We own and operate our earthmoving plant (excavators, graders, rollers and
                bulldozers), so the machines a job needs are ours to schedule. We also hire them
                out, with operators, to other contractors, farmers and developers.
              </p>
              <p>
                We work for private developers, hospitality owners and public bodies, mostly in Meru
                County and Nairobi, and travel for the right job anywhere in Kenya.
              </p>
            </div>
          </div>

          <div className="hidden lg:block lg:col-start-12 lg:col-span-4">
            <SubNavPanel overline="About" links={subNavLinks} />
          </div>
        </div>
      </section>

      {/* 3. FeatureSplit — Roads and earthworks */}
      <FeatureSplit
        imagePosition="left"
        panelSurface="subtle"
        overline="Roads and earthworks"
        heading="From bush to finished surface"
        body="Site clearing, cut and fill, grading and compaction, drainage and culverts, then a murram, gravel, cabro or tarmac surface with kerbs and markings."
        buttonLabel="Road construction and earthworks"
        buttonHref="/services/road-construction-and-earthworks"
        image={{
          url: '/media/service-road-construction.svg',
          alt: 'Motor grader and vibratory roller shaping an access road in Meru',
          caption: 'Grading, drainage and sub-base compaction in Meru County.',
        }}
      />

      {/* 4. FeatureSplit — Buildings and interiors */}
      <FeatureSplit
        imagePosition="right"
        panelSurface="subtle"
        overline="Buildings and interiors"
        heading="Built to the drawings, finished inside"
        body="Foundations, structure, roofing and finishes for homes, lounges, cottages and commercial buildings, with interior fit-outs where the client wants one team to the end."
        buttonLabel="General construction"
        buttonHref="/services/general-construction"
        image={{
          url: '/media/service-general-construction.svg',
          alt: 'Commercial and hospitality building construction in Meru',
          caption: 'Turnkey structural, masonry and interior construction.',
        }}
      />

      {/* 5. FeatureSplit — Our fleet */}
      <FeatureSplit
        imagePosition="left"
        panelSurface="dark"
        overline="Our fleet"
        heading="Machines we own and run"
        body={fleetBody}
        buttonLabel="See the fleet"
        buttonHref="/equipment"
        image={{
          url: '/media/equipment-crawler-excavator.svg',
          alt: 'Shena Works excavator and earthmoving machinery fleet',
          caption: 'Excavators, graders, rollers and bulldozers maintained in-house.',
        }}
      />

      {/* 6. ProcessSteps — How we work */}
      <ProcessSteps
        id="how-we-work"
        heading="How we work"
        steps={[
          {
            title: 'Site visit and brief',
            description:
              'We visit the site, look at access, soil and drainage, and agree what you need.',
          },
          {
            title: 'Estimate and programme',
            description:
              'You get a written quotation with the scope, the programme and what is excluded.',
          },
          {
            title: 'Build and supervise',
            description: 'Our site manager runs the work day to day and reports progress to you.',
          },
          {
            title: 'Handover',
            description: 'We walk the finished work with you, fix any snags and hand over.',
          },
        ]}
      />

      {/* 7. StatementBlock — What we aim for */}
      <StatementBlock
        heading="What we aim for"
        body="Roads and buildings that do their job for years, delivered on the scope, price and programme we agreed with you, by a team that leaves the community better connected."
        caption="Our motto: Connecting communities. Building the future."
      />

      {/* 8. FeatureSplit — Leadership */}
      <FeatureSplit
        imagePosition="right"
        panelSurface="subtle"
        overline="Leadership"
        heading="Newton Muthee, Managing Director"
        body="Newton leads Shena Works. Before that he managed hospitality builds in Meru County and inspected road works for the Kenya Urban Roads Authority."
        buttonLabel="Read Newton's profile"
        buttonHref="/about/leadership"
        image={team.portrait}
        aspectRatio="1:1"
      />

      {/* 9. LocationsBand */}
      <LocationsBand heading="Our offices" locations={locations} />

      {/* 10. CtaBand */}
      <CtaBand buttonLabel="Contact us" buttonHref="/contact" />
    </>
  )
}
