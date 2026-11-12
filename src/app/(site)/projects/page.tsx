import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedProjects, getPublishedServices, getSiteSettings } from '@/lib/payload'
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
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
  const [projects, services, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteSettings(),
  ])

  const serviceMap = new Map<string, string>()
  services.forEach((s) => serviceMap.set(s.slug, s.shortTitle || s.title))

  // Server-side filtering fallback for JS-disabled clients
  const filterService = params.service || ''
  const filterLocation = params.location || ''
  const filterYear = params.year || ''

  const filteredProjects = projects.filter((p) => {
    if (filterService && !p.serviceSlugs.includes(filterService)) return false
    if (filterLocation && p.location.county !== filterLocation) return false
    if (filterYear && p.year !== filterYear) return false
    return true
  })

  // Extract distinct locations and years for the select options
  const counties = Array.from(new Set(projects.map((p) => p.location.county))).filter(Boolean)
  const years = Array.from(new Set(projects.map((p) => p.year))).filter(Boolean)

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

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'
  const telHref = `tel:${settings.contact?.phoneE164?.replace(/[\s-]/g, '') || '+254718971896'}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Page */}
      <section className="hero page" data-surface="photo" style={{ padding: 0 }}>
        <div className="ph">
          <Image
            src="https://images.pexels.com/photos/34188582/pexels-photo-34188582.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="A finished modern building handed over to the client"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Projects</span>
          </nav>
          <p className="over">Projects</p>
          <h1 className="h1" style={{ maxWidth: '14em' }}>
            Work we can show you
          </h1>
          <p className="lead">
            Every project here says what we built, where, and what our role was. Where another company delivered the work, we say so.
          </p>
        </div>
      </section>

      {/* 2. All projects & Filter bar */}
      <section aria-labelledby="ap-h" style={{ paddingBottom: '64px' }}>
        <div className="wrap">
          <h2 className="h2" id="ap-h">
            All projects
          </h2>
          <form action="/projects" className="fbar" id="fb" method="get">
            <div className="fld">
              <label htmlFor="fs">Service</label>
              <select id="fs" name="service" defaultValue={filterService}>
                <option value="">All services</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="fc">Location</label>
              <select id="fc" name="location" defaultValue={filterLocation}>
                <option value="">All locations</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="fy">Year</label>
              <select id="fy" name="year" defaultValue={filterYear}>
                <option value="">Any year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button className="btn sec apply" type="submit">
                Apply
              </button>
              <button className="clear" hidden id="clr" type="button">
                Clear filters
              </button>
            </div>
          </form>

          <p aria-live="polite" className="xs count" id="cnt" role="status">
            {`Showing ${filteredProjects.length} of ${projects.length} projects`}
          </p>

          <div className="grid c3" id="pg">
            {projects.map((p) => {
              const serviceLabels = p.serviceSlugs
                .map((slug) => serviceMap.get(slug) || slug)
                .join(', ')
              const isHiddenOnServer = !filteredProjects.some((fp) => fp.slug === p.slug)

              return (
                <article
                  key={p.slug}
                  className="card pcard"
                  data-c={p.location.county}
                  data-s={p.serviceSlugs.join(' ')}
                  data-y={p.year || ''}
                  hidden={isHiddenOnServer}
                >
                  <div className="ph r43">
                    <Image
                      src={
                        p.heroImage?.url ||
                        'https://images.pexels.com/photos/16120138/pexels-photo-16120138.jpeg?auto=compress&cs=tinysrgb&w=1200'
                      }
                      alt={p.heroImage?.alt || p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                  {serviceLabels && <p className="over">{serviceLabels}</p>}
                  <h3 className="h4">
                    <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="meta">
                    {p.year
                      ? `${p.location.town || p.location.county} · ${p.year}`
                      : p.location.town || p.location.county}
                  </p>
                  {p.deliveringCompany && p.deliveringCompany !== 'Shena Works Limited' && (
                    <p className="by">
                      {`Delivered by ${p.deliveringCompany}${
                        p.role ? `, where Newton Muthee was ${p.role}` : ''
                      }.`}
                    </p>
                  )}
                </article>
              )
            })}
          </div>

          <div className="empty" hidden={filteredProjects.length > 0} id="em">
            <h3 className="h3">No projects match these filters</h3>
            <p>Try a different service or location, or clear the filters.</p>
            <button className="btn sec" id="clr2" type="button">
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {/* 3. CtaBand */}
      <section aria-labelledby="cta-h" className="cta" style={{ paddingTop: '80px' }}>
        <div className="grid16">
          <div className="cta-photo" data-surface="photo">
            <div className="ph">
              <Image
                src="https://images.pexels.com/photos/40736607/pexels-photo-40736607.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="People and machines on a Shena road site"
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
            </div>
            <div className="in">
              <h2 className="d" id="cta-h">
                Let’s talk about
                <br /> your site
              </h2>
              <Link className="btn pri" href="/contact?type=project">
                Request a quote
              </Link>
            </div>
          </div>
          <aside className="cta-card">
            <p className="over">Talk to us</p>
            <h3 className="h4">Call or WhatsApp</h3>
            <p>{phone}</p>
            <div className="btns">
              <a className="btn sec" href={telHref}>
                Call
              </a>
              <a
                className="btn outl"
                href="https://wa.me/254718971896?text=Hello%20Shena%20Works%2C%20I%20found%20you%20on%20your%20website%20and%20would%20like%20to%20talk%20about%20a%20project."
                rel="noopener"
                target="_blank"
              >
                WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
