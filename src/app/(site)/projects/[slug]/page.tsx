import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  getMachinesBySlugs,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { CtaBand } from '@/components/blocks/CtaBand'
import type { KeyFactItem } from '@/types/content'

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) return {}
  return buildPageMetadata({
    title: project.metaTitle,
    description: project.metaDescription,
    path: `/projects/${project.slug}`,
    ogSubtitle: `${project.location.town}, ${project.location.county}`,
  })
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const [allServices, linkedMachines, allProjects, settings] = await Promise.all([
    getPublishedServices(),
    getMachinesBySlugs(project.equipmentSlugs),
    getPublishedProjects(),
    getSiteSettings(),
  ])
  const linkedServices = allServices.filter((s) => project.serviceSlugs.includes(s.slug))

  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.serviceSlugs.some((s) => project.serviceSlugs.includes(s))
    )
    .slice(0, 3)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: project.title },
  ]

  const keyFactItems: KeyFactItem[] = [
    { term: 'Client type', value: project.clientType },
    { term: 'Status', value: project.status },
    { term: 'Year', value: project.year },
    { term: "Shena's role", value: project.role },
    { term: 'Delivered by', value: project.deliveringCompany },
    ...(linkedServices.length > 0
      ? [
          {
            term: 'Services',
            value: linkedServices.map((s) => s.shortTitle || s.title).join(', '),
          },
        ]
      : []),
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: project.title,
        description: project.metaDescription,
        url: `${SITE_URL}/projects/${project.slug}`,
        primaryImageOfPage: `${SITE_URL}${project.heroImage.url}`,
        about: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, `/projects/${project.slug}`),
    ],
  }

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'
  const telHref = `tel:${settings.contact?.phoneE164?.replace(/[\s-]/g, '') || '+254718971896'}`
  const galleryImages =
    project.gallery && project.gallery.length > 0 ? project.gallery : [project.heroImage]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header & Hero Image */}
      <section className="ph-head" style={{ paddingBottom: '32px' }}>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs dk" style={{ margin: '0 0 16px' }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/projects">Projects</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
          <p className="over">Projects</p>
          <h1 className="h1" style={{ marginBottom: '12px' }}>{project.title}</h1>
          <p className="lead" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '18px' }}>
            {`${project.location.town}, ${project.location.county}`}
          </p>
        </div>
      </section>

      <section style={{ padding: '0 0 48px' }}>
        <div className="wrap">
          <div className="ph" style={{ aspectRatio: '16/9', width: '100%', position: 'relative' }}>
            <Image
              src={project.heroImage.url}
              alt={project.heroImage.alt}
              fill
              priority
              sizes="100vw"
            />
          </div>
          {project.heroImage.caption && (
            <p className="xs" style={{ marginTop: '12px', fontStyle: 'italic' }}>
              {project.heroImage.caption}
            </p>
          )}
        </div>
      </section>

      {/* 2. Key Facts */}
      <section style={{ padding: '32px 0 48px', borderTop: '1px solid var(--g300)' }}>
        <div className="wrap">
          <h2 className="sr">Project details</h2>
          <dl className="kf" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
            {keyFactItems.map((kf, idx) => (
              <div key={idx}>
                <dt>{kf.term}</dt>
                <dd>{kf.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Brief, Work & Result */}
      <section data-surface="subtle" style={{ background: 'var(--g100)', padding: '64px 0' }}>
        <div className="wrap">
          <div className="msplit">
            <div className="mlead">
              <div style={{ marginBottom: '40px' }}>
                <h2 className="h3" style={{ marginBottom: '16px' }}>The brief</h2>
                <p className="lead" style={{ fontSize: '18px', lineHeight: '28px' }}>
                  {project.brief}
                </p>
              </div>
              <div style={{ marginBottom: '40px' }}>
                <h2 className="h3" style={{ marginBottom: '16px' }}>The work</h2>
                <p style={{ fontSize: '16px', lineHeight: '26px' }}>
                  {project.work}
                </p>
              </div>
              <div>
                <h2 className="h3" style={{ marginBottom: '16px' }}>The result</h2>
                <p style={{ fontSize: '16px', lineHeight: '26px' }}>
                  {project.result}
                </p>
              </div>
            </div>

            <aside className="mside">
              <div className="office" style={{ padding: '32px', background: '#fff' }}>
                <h3 className="h4" style={{ marginBottom: '16px' }}>Need similar work?</h3>
                <p className="sm" style={{ marginBottom: '24px' }}>
                  Tell us about your site and what you want built.
                </p>
                <Link className="btn pri" href={`/contact?type=project&project=${project.slug}`} style={{ width: '100%', marginBottom: '12px' }}>
                  Request a quote
                </Link>
                <a
                  className="btn outl"
                  href={`https://wa.me/254718971896?text=${encodeURIComponent(`Hello Shena Works, I saw the ${project.title} project and would like to discuss a similar project.`)}`}
                  target="_blank"
                  rel="noopener"
                  style={{ width: '100%' }}
                >
                  WhatsApp us
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. Key Figures */}
      {project.keyFigures.length > 0 && (
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--g300)' }}>
          <div className="wrap">
            <div className="grid c3">
              {project.keyFigures.map((fig, idx) => (
                <div key={idx} style={{ padding: '16px 0' }}>
                  <p className="h2" style={{ color: 'var(--accent)', marginBottom: '8px' }}>
                    {fig.value}
                  </p>
                  <p className="sm">{fig.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Gallery */}
      {galleryImages.length > 1 && (
        <section style={{ padding: '64px 0' }} aria-labelledby="gal-h">
          <div className="wrap">
            <h2 className="h2" id="gal-h" style={{ marginBottom: '32px' }}>
              Project gallery
            </h2>
            <div className="grid c3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="ph warm r43">
                  <Image
                    src={img.url}
                    alt={img.alt || `${project.title} photo ${idx + 1}`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Credits: Equipment used & Related Services */}
      {(linkedMachines.length > 0 || linkedServices.length > 0) && (
        <section style={{ padding: '48px 0 64px', borderTop: '1px solid var(--g300)' }}>
          <div className="wrap">
            <div className="grid c2" style={{ gap: '48px' }}>
              {linkedMachines.length > 0 && (
                <div>
                  <p className="over" style={{ marginBottom: '16px' }}>Equipment used</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {linkedMachines.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/equipment/${m.categorySlug}/${m.slug}`}
                        className="lbl"
                        style={{ color: 'var(--ink-900)' }}
                      >
                        {m.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {linkedServices.length > 0 && (
                <div>
                  <p className="over" style={{ marginBottom: '16px' }}>Related services</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {linkedServices.map((s) => (
                      <Link
                        key={s.slug}
                        href={s.parentSlug ? `/services/${s.parentSlug}/${s.slug}` : `/services/${s.slug}`}
                        className="lbl"
                        style={{ color: 'var(--ink-900)' }}
                      >
                        {s.shortTitle || s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. More projects */}
      {relatedProjects.length > 0 && (
        <section style={{ background: 'var(--g100)', padding: '64px 0 80px' }} data-surface="subtle" aria-labelledby="mp-h">
          <div className="wrap">
            <div className="intro">
              <div>
                <p className="over">Projects</p>
                <h2 className="h2" id="mp-h" style={{ marginTop: '8px' }}>
                  More projects
                </h2>
              </div>
              <Link className="arrow" href="/projects">
                All projects{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="grid c3">
              {relatedProjects.map((p) => (
                <article className="card pcard" key={p.slug}>
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
                  <h3 className="h4">
                    <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="meta">{p.location ? `${p.location.town}, ${p.location.county}` : 'Kenya'}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CtaBand */}
      <CtaBand
        settings={settings}
        headlineLine1="Planning something"
        headlineLine2="similar?"
        buttonHref={`/contact?type=project&service=${project.serviceSlugs[0] || ''}`}
      />
    </>
  )
}
