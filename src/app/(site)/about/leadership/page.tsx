import React from 'react'
import { PageHeader } from '@/components/blocks/PageHeader'
import { Prose } from '@/components/blocks/Prose'
import { Timeline } from '@/components/ui/Timeline'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { CredentialTable } from '@/components/blocks/CredentialTable'
import { CtaBand } from '@/components/blocks/CtaBand'
import { Button } from '@/components/ui/Button'
import { getPublishedCredentials, getTeamMember } from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Newton Muthee, Managing Director | Shena Works',
  description:
    'Newton Muthee leads Shena Works Limited, with experience in county road works, urban roads inspection and hospitality site management in Meru.',
  path: '/about/leadership',
})

export default async function LeadershipPage() {
  const [team, credentials] = await Promise.all([
    getTeamMember(),
    getPublishedCredentials(),
  ])
  const personalCredentials = credentials.filter(
    (c) => c.holderSlug === 'newton-muthee',
  )

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Leadership' },
  ]

  const timelineEntries = team.experience.map((exp, idx) => ({
    id: `exp-${idx}`,
    overline: exp.period,
    title: exp.role,
    subtitle: `${exp.organisation} (${exp.location})`,
    body: exp.summary,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        url: `${SITE_URL}/about/leadership`,
        mainEntity: {
          '@type': 'Person',
          name: team.name,
          jobTitle: team.role,
          worksFor: { '@id': ORG_ID },
          image: `${SITE_URL}${team.portrait.url}`,
        },
      },
      buildBreadcrumbJsonLd(breadcrumbs, '/about/leadership'),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. PageHeader */}
      <PageHeader breadcrumbs={breadcrumbs} overline="About" headline="Leadership" />

      {/* 2. Person intro */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem] border-b border-[var(--grey-300)]">
        <div className="site-grid items-center gap-y-[3.2rem]">
          <div className="col-span-4 lg:col-start-2 lg:col-span-5">
            <div className="aspect-square overflow-hidden bg-[var(--grey-100)]">
              <img
                src={team.portrait.url}
                alt={team.portrait.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="col-span-4 lg:col-start-8 lg:col-span-8">
            <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">{team.role}</p>
            <h2 className="text-h2 text-[var(--ink-900)] mb-[1.6rem]">{team.name}</h2>
            <p className="text-lead text-[var(--ink-600)] mb-[3.2rem]">{team.summary}</p>
            <div className="flex flex-wrap items-center gap-[1.2rem]">
              {team.phone && (
                <Button href={`tel:${team.phone}`} variant="secondary">
                  Call Newton
                </Button>
              )}
              <Button href={`mailto:${team.email}`} variant="outline">
                Email
              </Button>
              {team.linkedinUrl && (
                <Button href={team.linkedinUrl} variant="link" external>
                  LinkedIn
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Biography Prose */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10">
            <Prose heading="Biography" paragraphs={team.bio} />
          </div>
        </div>
      </section>

      {/* 4. Experience Timeline */}
      <section
        data-surface="subtle"
        className="bg-[var(--grey-100)] py-[6.4rem] lg:py-[8.0rem] border-t border-b border-[var(--grey-300)]"
      >
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14">
            <h2 className="text-h2 text-[var(--ink-900)] mb-[4.0rem] lg:text-center">
              Experience
            </h2>
            <Timeline entries={timelineEntries} variant="centered" />
          </div>
        </div>
      </section>

      {/* 5. Areas of work KeyFacts */}
      <KeyFacts heading="Areas of work" items={team.areasOfWork} />

      {/* 6. Personal Credentials (hidden if none) */}
      <CredentialTable heading="Credentials" credentials={personalCredentials} />

      {/* 7. CtaBand */}
      <CtaBand />
    </>
  )
}
