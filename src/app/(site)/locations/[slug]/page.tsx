import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  getFeaturedMachines,
  getProjectsByCounty,
  getPublishedEquipmentCategories,
  getPublishedLocationBySlug,
  getPublishedLocations,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { CtaBand } from '@/components/blocks/CtaBand'

export async function generateStaticParams() {
  const locs = await getPublishedLocations()
  return locs.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const loc = await getPublishedLocationBySlug(slug)
  if (!loc) return {}
  return buildPageMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: `/locations/${loc.slug}`,
  })
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const location = await getPublishedLocationBySlug(slug)
  if (!location) notFound()

  const [settings, services, allCountyProjects, machines, categories] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getProjectsByCounty(location.county),
    getFeaturedMachines(),
    getPublishedEquipmentCategories(),
  ])
  const localProjects = allCountyProjects.slice(0, 6)

  const serviceMap = new Map<string, string>()
  services.forEach((s) => serviceMap.set(s.slug, s.shortTitle || s.title))

  const catMap = new Map<string, string>()
  categories.forEach((c) => catMap.set(c.slug, c.name))

  const whatsappUrl = buildWhatsAppUrl({ type: 'location', town: location.town })
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: location.town },
  ]

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'
  const telHref = `tel:${settings.contact?.phoneE164?.replace(/[\s-]/g, '') || '+254718971896'}`

  const path = `/locations/${location.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': `${SITE_URL}${path}#branch`,
        name: `Shena Works Limited — ${location.town}`,
        parentOrganization: { '@id': ORG_ID },
        telephone: phone,
        email: location.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: location.address,
          addressLocality: location.town,
          addressRegion: location.county,
          addressCountry: 'KE',
        },
        areaServed: location.county,
      },
      buildBreadcrumbJsonLd(breadcrumbs, path),
      ...(location.faqs.length > 0 ? [buildFaqJsonLd(location.faqs)] : []),
    ],
  }

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
            src={location.heroImage?.url || '/media/cta-site.jpg'}
            alt={location.heroImage?.alt || `People and machines on a Shena road site in ${location.town}`}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{location.town}</span>
          </nav>
          <p className="over">Locations</p>
          <h1 className="h1" style={{ maxWidth: '15em' }}>
            {location.heroHeadline || `Road and building contractors in ${location.town}`}
          </h1>
          <p className="lead" style={{ marginBottom: '32px', maxWidth: '34em' }}>
            {location.heroLead}
          </p>
          <div className="btns">
            <a className="btn pri" href={telHref}>
              {`Call ${phone}`}
            </a>
            <a className="btn out" href={whatsappUrl} rel="noopener" target="_blank">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* 2. Office + Map */}
      <section aria-labelledby="of-h" style={{ padding: '64px 0' }}>
        <div className="wrap office">
          <div>
            <h2 className="h2" id="of-h">
              {`Our ${location.town} office`}
            </h2>
            <p className="sm" style={{ marginTop: '12px' }}>
              Headquarters and plant yard
            </p>
            <dl>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={telHref}>{phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${location.email}`}>{location.email}</a>
                </dd>
              </div>
            </dl>
          </div>
          <div aria-label="Map placeholder" className="mapbox" role="img">
            <p className="sm">
              The map appears here once the office address is confirmed. Maps are provided by Google and may set cookies.
            </p>
          </div>
        </div>
      </section>

      {/* 3. About working in location */}
      <section aria-label={`About working in ${location.town}`} style={{ padding: '0 0 64px' }}>
        <div className="wrap">
          <div className="prose">
            {location.intro.map((p, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'lead' : undefined}
                style={idx === 0 ? { fontSize: '20px', lineHeight: '30px' } : undefined}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What we do in location */}
      <section aria-labelledby="sv-h" data-surface="subtle" style={{ background: 'var(--g100)', padding: '64px 0' }}>
        <div className="wrap">
          <h2 className="h2" id="sv-h" style={{ marginBottom: '40px' }}>
            {`What we do in ${location.town}`}
          </h2>
          <div className="grid c3">
            {services.slice(0, 6).map((s) => (
              <article className="card" key={s.slug}>
                <div className="ph warm r43">
                  <Image
                    src={s.heroImage?.url || '/media/service-roads.jpg'}
                    alt={s.heroImage?.alt || s.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <p className="over">{s.group}</p>
                <h3 className="h4">
                  <Link href={s.parentSlug ? `/services/${s.parentSlug}/${s.slug}` : `/services/${s.slug}`}>
                    {s.title}
                  </Link>
                </h3>
                <p className="sm">{s.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Projects in location */}
      {localProjects.length > 0 && (
        <section aria-labelledby="pr-h" style={{ padding: '64px 0' }}>
          <div className="wrap">
            <div className="intro">
              <div>
                <p className="over">Projects</p>
                <h2 className="h2" id="pr-h" style={{ marginTop: '8px' }}>
                  {`Projects in ${location.county}`}
                </h2>
              </div>
              <Link className="arrow" href={`/projects?location=${encodeURIComponent(location.county)}`}>
                All projects{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="grid c3">
              {localProjects.map((p) => {
                const serviceTitles = p.serviceSlugs
                  .map((slug) => serviceMap.get(slug) || slug)
                  .join(', ')

                return (
                  <article className="card pcard" key={p.slug}>
                    <div className="ph r43">
                      <Image
                        src={
                          p.heroImage?.url ||
                          '/media/hero-roads.jpg'
                        }
                        alt={p.heroImage?.alt || p.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    </div>
                    {serviceTitles && (
                      <p className="over" style={{ color: 'var(--accent)' }}>
                        {serviceTitles}
                      </p>
                    )}
                    <h3 className="h4">
                      <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="meta">{p.location ? `${p.location.town || p.location.county}` : 'Kenya'}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Equipment hire in location */}
      {machines.length > 0 && (
        <section aria-labelledby="eq-h" className="eq spacious" data-surface="dark">
          <div className="wrap">
            <div className="intro">
              <div>
                <p className="over">Equipment hire</p>
                <h2 className="h2" id="eq-h" style={{ margin: '8px 0 16px' }}>
                  {`Equipment hire in ${location.town}`}
                </h2>
                <p className="lead">
                  Hire an excavator, grader, roller or bulldozer for your site. We quote for the machine, operator and transport, and confirm dates before we move.
                </p>
              </div>
              <Link className="btn out" href="/equipment">
                See the fleet
              </Link>
            </div>
            <div className="grid c3">
              {machines.slice(0, 3).map((m) => (
                <article className="card" key={m.slug}>
                  <div className="ph warm r43">
                    <Image
                      src={
                        m.heroImage?.url ||
                        '/media/equip-excavator.jpg'
                      }
                      alt={m.heroImage?.alt || m.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                  <p className="over">{catMap.get(m.categorySlug) || m.categorySlug}</p>
                  <h3 className="h4">
                    <Link href={`/equipment/${m.categorySlug}/${m.slug}`}>{m.name}</Link>
                  </h3>
                  <p
                    className="xs"
                    style={{
                      textTransform: 'none',
                      fontFamily: 'var(--body)',
                      fontWeight: 400,
                      letterSpacing: 0,
                    }}
                  >
                    {`${m.make} ${m.model} · ${m.capacity}`}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQs */}
      {location.faqs && location.faqs.length > 0 && (
        <section aria-labelledby="fq-h" style={{ padding: '64px 0' }}>
          <div className="wrap">
            <h2 className="h2" id="fq-h">
              {`${location.town} questions`}
            </h2>
            <div className="faq">
              {location.faqs.map((faq, idx) => (
                <details key={idx}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CtaBand */}
      <CtaBand settings={settings} />
    </>
  )
}
