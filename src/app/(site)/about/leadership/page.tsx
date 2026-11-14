import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CtaBand } from '@/components/blocks/CtaBand'
import { getSiteSettings, getTeamMember } from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Newton Muthee, Managing Director | Shena Works',
  description:
    'Newton Muthee leads Shena Works Limited, with experience in county road works, urban roads inspection and hospitality site management in Meru.',
  path: '/about/leadership',
})

export default async function LeadershipPage() {
  const [team, settings] = await Promise.all([getTeamMember(), getSiteSettings()])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Leadership' },
  ]

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

  const defaultBio = [
    'Newton M. Muthee is the Managing Director of Shena Works Limited, where he oversees road construction, earthworks, commercial and residential building works, and heavy plant operations across Meru, Nairobi and the wider region.',
    'Before leading Shena Works, Newton worked on both sides of the construction table: as a site manager delivering commercial and hospitality builds and as a public-sector roads inspector checking contractor compliance. From February 2020 to February 2021 he served as Site Project Manager for Dukes Limited in Meru County, supervising the workforce, materials, subcontractors and quality control on hospitality developments including Dukes Cottages, Restaurant & Garden. From February 2021 to January 2022 he worked as a Roads Inspector with the Kenya Urban Roads Authority (KURA), inspecting urban road construction, drainage structures, grading and asphalt works against KURA engineering and safety standards.',
    'On every Shena Works project, Newton remains closely involved from initial site inspection and estimating through to final compaction, snagging and handover.',
  ]

  const defaultExperience = [
    {
      period: 'September 2024 – Present',
      role: 'Managing Director',
      organisation: 'Shena Works Limited',
      location: 'Meru and Nairobi',
      summary:
        'Directs road and building construction projects, client relations, estimating, procurement and heavy equipment fleet operations across Meru and Nairobi.',
    },
    {
      period: 'February 2021 – January 2022',
      role: 'Roads Inspector',
      organisation: 'Kenya Urban Roads Authority (KURA)',
      location: 'Urban Roads',
      summary:
        'Inspected road construction, grading, drainage structures, culvert installations and asphalt works for compliance with KURA specifications, road-reserve bylaws and site safety rules.',
    },
    {
      period: 'February 2020 – February 2021',
      role: 'Site Project Manager',
      organisation: 'Dukes Limited',
      location: 'Meru County',
      summary:
        'Supervised site execution, trade scheduling, material inventories and quality standards for hospitality developments in Meru County, including Dukes Cottages, Restaurant & Garden.',
    },
  ]

  const defaultAreas = [
    { term: 'Roads', value: 'Grading, drainage, cabro and tarmac works; road inspection' },
    { term: 'Buildings', value: 'Hospitality and commercial site management' },
    { term: 'Commercial', value: 'Estimating, bills of quantities review and cost control' },
    { term: 'Compliance', value: 'Site safety and environmental requirements' },
  ]

  const bioParagraphs =
    team.bio && team.bio.length > 0
      ? team.bio.map((p) => p.replace('table — as', 'table: as'))
      : defaultBio
  const experienceList =
    team.experience && team.experience.length > 0
      ? team.experience.map((exp) => ({
          period: exp.period,
          role: exp.role,
          organisation:
            exp.location && exp.location !== 'Kenya'
              ? `${exp.organisation} (${exp.location.replace('&', 'and')})`
              : exp.organisation,
          summary: exp.summary,
        }))
      : defaultExperience
  const areasList = (
    team.areasOfWork && team.areasOfWork.length > 0 ? team.areasOfWork : defaultAreas
  ).map((area) => ({
    term: area.term,
    value: area.value.replace('; data protection governance', ''),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Page Header */}
      <div className="ph-head">
        <div className="wrap">
          <nav className="crumbs dk" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/about">About</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Leadership</span>
          </nav>
          <p className="over">About</p>
          <h1 className="h1">Leadership</h1>
        </div>
      </div>

      {/* 2. Person Intro */}
      <section aria-labelledby="nm-h">
        <div className="wrap person">
          <div className="ph grey" role="img" aria-label={`Portrait of ${team.name?.replace('M. ', '') || 'Newton Muthee'}`}>
            <Image
              src={team.portrait?.url || '/media/newton-portrait.jpg'}
              alt={`Portrait of ${team.name?.replace('M. ', '') || 'Newton Muthee'}`}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </div>
          <div>
            <p className="over">{team.role || 'Managing Director'}</p>
            <h2 className="h2" id="nm-h">{team.name?.replace('M. ', '') || 'Newton Muthee'}</h2>
            <p className="lead">
              Newton leads Shena Works Limited’s road, building and equipment operations from Meru and Nairobi, combining public-sector road inspection experience with hands-on hospitality and commercial site management.
            </p>
            <div className="btns">
              <a className="btn outl" href={`mailto:${team.email || 'shenaworksltd@gmail.com'}`}>
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Biography */}
      <section className="bio" style={{ padding: '0 0 64px' }} aria-labelledby="bio-h">
        <div className="wrap">
          <div className="prose">
            <h2 className="h2" id="bio-h" style={{ marginBottom: '24px' }}>Biography</h2>
            {bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Timeline */}
      <section style={{ padding: '0 0 64px', background: 'var(--g100)' }} data-surface="subtle" aria-labelledby="ex-h">
        <div className="wrap" style={{ paddingTop: '64px' }}>
          <h2 className="h2" id="ex-h">Experience</h2>
          <ol className="tl">
            {experienceList.map((exp, idx) => (
              <li key={idx}>
                <p className="per">{exp.period}</p>
                <div className="txt">
                  <h3 className="h4">{exp.role}</h3>
                  <p className="org">{exp.organisation}</p>
                  <p className="sm">{exp.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Areas of work */}
      <section style={{ padding: '64px 0' }} aria-labelledby="aw-h">
        <div className="wrap">
          <h2 className="h2" id="aw-h">Areas of work</h2>
          <dl className="kf">
            {areasList.map((area, idx) => (
              <div key={idx}>
                <dt>{area.term}</dt>
                <dd>{area.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6. CtaBand */}
      <CtaBand settings={settings} buttonLabel="Request a quote" buttonHref="/contact?type=project" />
    </>
  )
}

