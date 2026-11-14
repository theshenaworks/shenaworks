import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedServices, getSiteSettings } from '@/lib/payload'
import { CtaBand } from '@/components/blocks/CtaBand'
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { ServiceRecord } from '@/types/content'

export const metadata = buildPageMetadata({
  title: 'Construction Services in Meru and Nairobi | Shena Works',
  description:
    'Road construction, earthworks, cabro paving, building construction, interior design and project management from one Meru-based contractor.',
  path: '/services',
})

const DEFAULT_SERVICES = {
  roads: {
    title: 'Road construction and earthworks',
    slug: 'road-construction-and-earthworks',
    summary:
      'Grading, murram gravelling, cabro block paving, concrete drains, culverts and tarmac surfacing for access roads and commercial compounds.',
    bullets: [
      'Earthworks and site clearing',
      'Precision grading and gravelling',
      'Drainage and culverts',
      'Cabro and interlocking block paving',
      'Tarmac and asphalt surfacing',
    ],
    image: '/media/service-roads.jpg',
    alt: 'A grader levelling a murram road',
  },
  buildings: {
    title: 'General construction',
    slug: 'general-construction',
    summary:
      'Turnkey building construction for hospitality venues, commercial premises, cottages, villas and residential homes, from foundations to handover.',
    bullets: [
      'Substructure and foundations',
      'Reinforced concrete and structural steel',
      'Masonry and external walls',
      'Roofing and rainwater goods',
      'Mechanical, electrical and plumbing (MEP) first and second fix',
    ],
    image: '/media/service-building.jpg',
    alt: 'A building under construction with scaffolding',
  },
  interiors: {
    title: 'Interior design',
    slug: 'interior-design',
    summary:
      'Space planning, lighting, custom joinery, flooring and full interior fit-outs for hospitality venues, commercial spaces and homes.',
    bullets: [
      'Space planning and layout',
      'Finishes and material selection',
      'Lighting and ambiance',
      'Custom joinery and fittings',
      'Ceilings and acoustic treatments',
    ],
    image: '/media/service-interior.jpg',
    alt: 'A finished interior fit-out with modern furnishings',
  },
  pm: {
    title: 'Project management',
    slug: 'project-management',
    summary:
      'End-to-end site supervision, scheduling, subcontractor coordination, quality inspections and cost tracking for private and commercial builds.',
    bullets: [
      'Pre-construction review and planning',
      'Contractor and trade coordination',
      'Quality assurance and milestone inspections',
      'Cost control and valuation verification',
      'Site safety and regulatory compliance',
    ],
    image: '/media/service-pm.jpg',
    alt: 'Site engineers reviewing project plans',
  },
}

export default async function ServicesIndexPage() {
  const [allServices, settings] = await Promise.all([
    getPublishedServices().catch(() => []),
    getSiteSettings().catch(() => null),
  ])

  const findService = (slug: string) => allServices.find((s) => s.slug === slug)
  const roadSvc = findService('road-construction-and-earthworks')
  const generalSvc = findService('general-construction')
  const interiorSvc = findService('interior-design')
  const pmSvc = findService('project-management')

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Services' }]
  const jsonLd = buildBreadcrumbJsonLd(breadcrumbs, '/services')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Page Hero */}
      <section className="hero page" style={{ padding: 0 }} data-surface="photo">
        <div className="ph">
          <Image
            src="/media/hero-roads.jpg"
            alt="Road construction crew and equipment working on a road"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Services</span>
          </nav>
          <p className="over">Services</p>
          <h1 className="h1">What we build</h1>
          <p className="lead">
            Roads and earthworks, buildings and interiors, and the planning that keeps them on budget. We list only the work we deliver ourselves.
          </p>
        </div>
      </section>

      {/* 2. Group: Roads and earthworks */}
      <section className="group" id="roads-and-earthworks" aria-labelledby="roads-and-earthworks-h">
        <div className="wrap">
          <div className="intro">
            <div>
              <h2 className="h2" id="roads-and-earthworks-h" style={{ marginBottom: '16px' }}>
                Roads and earthworks
              </h2>
              <p className="lead">
                Access, estate and feeder roads, paved compounds and the drainage that keeps them standing.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="ph warm">
              <Image
                src={roadSvc?.heroImage?.url || DEFAULT_SERVICES.roads.image}
                alt={roadSvc?.heroImage?.alt || DEFAULT_SERVICES.roads.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </div>
            <div className="txt">
              <h3 className="h3">{roadSvc?.title || DEFAULT_SERVICES.roads.title}</h3>
              <p className="body">{roadSvc?.summary || DEFAULT_SERVICES.roads.summary}</p>
              <ul>
                {(roadSvc?.scope && roadSvc.scope.length > 0
                  ? roadSvc.scope.map((s) => s.title)
                  : DEFAULT_SERVICES.roads.bullets
                ).map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div className="acts">
                <Link className="btn sec" href="/services/road-construction-and-earthworks">
                  View road construction
                </Link>
                <Link className="arrow" href="/services/road-construction-and-earthworks/cabro-paving">
                  Cabro paving{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 12h16m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Group: Buildings and interiors */}
      <section
        className="group"
        id="buildings-and-interiors"
        data-surface="subtle"
        aria-labelledby="buildings-and-interiors-h"
      >
        <div className="wrap">
          <div className="intro">
            <div>
              <h2 className="h2" id="buildings-and-interiors-h" style={{ marginBottom: '16px' }}>
                Buildings and interiors
              </h2>
              <p className="lead">
                Homes, hospitality and commercial buildings, from foundations to fit-out.
              </p>
            </div>
          </div>

          {/* General construction */}
          <div className="row flip">
            <div className="ph warm">
              <Image
                src={generalSvc?.heroImage?.url || DEFAULT_SERVICES.buildings.image}
                alt={generalSvc?.heroImage?.alt || DEFAULT_SERVICES.buildings.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
            <div className="txt">
              <h3 className="h3">{generalSvc?.title || DEFAULT_SERVICES.buildings.title}</h3>
              <p className="body">{generalSvc?.summary || DEFAULT_SERVICES.buildings.summary}</p>
              <ul>
                {(generalSvc?.scope && generalSvc.scope.length > 0
                  ? generalSvc.scope.map((s) => s.title)
                  : DEFAULT_SERVICES.buildings.bullets
                ).map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div className="acts">
                <Link className="btn sec" href="/services/general-construction">
                  View general construction
                </Link>
              </div>
            </div>
          </div>

          {/* Interior design */}
          <div className="row">
            <div className="ph warm">
              <Image
                src={interiorSvc?.heroImage?.url || DEFAULT_SERVICES.interiors.image}
                alt={interiorSvc?.heroImage?.alt || DEFAULT_SERVICES.interiors.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </div>
            <div className="txt">
              <h3 className="h3">{interiorSvc?.title || DEFAULT_SERVICES.interiors.title}</h3>
              <p className="body">{interiorSvc?.summary || DEFAULT_SERVICES.interiors.summary}</p>
              <ul>
                {(interiorSvc?.scope && interiorSvc.scope.length > 0
                  ? interiorSvc.scope.map((s) => s.title)
                  : DEFAULT_SERVICES.interiors.bullets
                ).map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div className="acts">
                <Link className="btn sec" href="/services/interior-design">
                  View interior design
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Group: Planning and delivery */}
      <section className="group" id="planning-and-delivery" aria-labelledby="planning-and-delivery-h">
        <div className="wrap">
          <div className="intro">
            <div>
              <h2 className="h2" id="planning-and-delivery-h" style={{ marginBottom: '16px' }}>
                Planning and delivery
              </h2>
              <p className="lead">
                Managing projects for clients, and the estimates and documents that come before a build.
              </p>
            </div>
          </div>
          <div className="row flip">
            <div className="ph warm">
              <Image
                src={pmSvc?.heroImage?.url || DEFAULT_SERVICES.pm.image}
                alt={pmSvc?.heroImage?.alt || DEFAULT_SERVICES.pm.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
            <div className="txt">
              <h3 className="h3">{pmSvc?.title || DEFAULT_SERVICES.pm.title}</h3>
              <p className="body">{pmSvc?.summary || DEFAULT_SERVICES.pm.summary}</p>
              <ul>
                {(pmSvc?.scope && pmSvc.scope.length > 0
                  ? pmSvc.scope.map((s) => s.title)
                  : DEFAULT_SERVICES.pm.bullets
                ).map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div className="acts">
                <Link className="btn sec" href="/services/project-management">
                  View project management
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statement */}
      <section className="statement" aria-labelledby="st-h">
        <div className="wrap">
          <div className="in">
            <h2 className="h2" id="st-h">Not sure what you need?</h2>
            <p>Describe the site and what you want at the end. We’ll tell you which services apply and what it is likely to involve.</p>
            <Link className="btn pri" href="/contact?type=project">
              Tell us about the job
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CtaBand */}
      <CtaBand settings={settings} buttonLabel="Request a quote" buttonHref="/contact?type=project" />
    </>
  )
}
