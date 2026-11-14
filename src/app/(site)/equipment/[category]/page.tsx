import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  getEquipmentCategoryBySlug,
  getEquipmentIndex,
  getMachinesByCategory,
  getPublishedEquipmentCategories,
  getPublishedProjects,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { KeyFactItem } from '@/types/content'
import { InlineEnquiryForm } from '@/components/blocks/InlineEnquiryForm'

export async function generateStaticParams() {
  const categories = await getPublishedEquipmentCategories().catch(() => [])
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = await getEquipmentCategoryBySlug(category).catch(() => null)
  if (!cat) return {}
  return buildPageMetadata({
    title: cat.metaTitle,
    description: cat.metaDescription,
    path: `/equipment/${cat.slug}`,
  })
}

const DEFAULT_TERMS = [
  { term: 'Operator', value: 'Included with every machine' },
  { term: 'Fuel', value: 'Dry or wet rate, stated on your quote' },
  { term: 'Transport', value: 'Low-loader delivery quoted by distance' },
  { term: 'Service area', value: 'Meru County and surrounding counties; further by arrangement' },
  { term: 'Rates', value: 'Quoted per job' },
]

export default async function EquipmentCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = await getEquipmentCategoryBySlug(category).catch(() => null)
  if (!cat) notFound()

  const [machines, indexData, allProjects] = await Promise.all([
    getMachinesByCategory(cat.slug).catch(() => []),
    getEquipmentIndex().catch(() => ({ hireTerms: DEFAULT_TERMS, faqs: [] })),
    getPublishedProjects().catch(() => []),
  ])

  const relatedProjects = allProjects.slice(0, 3)
  const whatsappUrl = buildWhatsAppUrl({
    type: 'equipment',
    categoryName: cat.name,
  })

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: cat.name },
  ]

  const faqs = cat.faqs && cat.faqs.length > 0 ? cat.faqs : indexData.faqs || []
  const terms: KeyFactItem[] = indexData.hireTerms && indexData.hireTerms.length > 0 ? indexData.hireTerms : DEFAULT_TERMS

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbs, `/equipment/${cat.slug}`),
      ...(faqs.length > 0 ? [buildFaqJsonLd(faqs)] : []),
    ],
  }

  const heroImg =
    cat.heroImage?.url ||
    '/media/equip-excavator.jpg'
  const heroAlt = cat.heroImage?.alt || `${cat.name} on site`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Page Hero */}
      <section className="hero page" style={{ padding: 0 }} data-surface="photo">
        <div className="ph warm">
          <Image src={heroImg} alt={heroAlt} fill priority sizes="100vw" />
        </div>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/equipment">Equipment</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{cat.name}</span>
          </nav>
          <p className="over">Equipment hire</p>
          <h1 className="h1" style={{ maxWidth: '14em' }}>
            {cat.heroHeadline || `${cat.name} hire in Meru and across Kenya`}
          </h1>
          <p className="lead" style={{ marginBottom: '32px', maxWidth: '34em' }}>
            {cat.heroLead || cat.summary}
          </p>
          <div className="btns">
            <a className="btn pri" href="#enquiry">
              Request hire
            </a>
            <a className="btn out" href={whatsappUrl} target="_blank" rel="noopener">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* 2. Hire Terms */}
      <section style={{ padding: '48px 0 32px' }}>
        <div className="wrap">
          <h2 className="sr">Hire terms</h2>
          <dl className="kf" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {terms.map((kf, idx) => (
              <div key={idx}>
                <dt>{kf.term}</dt>
                <dd>{kf.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Intro Prose */}
      {cat.intro && cat.intro.length > 0 && (
        <section style={{ padding: '32px 0 64px' }}>
          <div className="wrap">
            <div className="prose">
              {cat.intro.map((p, idx) => (
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
      )}

      {/* 4. Machines grid */}
      <section style={{ padding: '0 0 64px' }} aria-labelledby="mg-h">
        <div className="wrap">
          <h2 className="sr" id="mg-h">
            {`${cat.name} for hire`}
          </h2>
          <div className="grid c3">
            {machines.map((m) => (
              <article className="card mc" key={m.slug}>
                <div className="ph warm r43">
                  <Image
                    src={
                      m.heroImage?.url ||
                      '/media/equip-grader.jpg'
                    }
                    alt={m.heroImage?.alt || m.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <p className="over">{cat.singular || cat.name.replace(/s$/, '')}</p>
                <h3 className="h4">
                  <Link href={`/equipment/${cat.slug}/${m.slug}`}>{m.name}</Link>
                </h3>
                <p className="meta">{`${m.make} ${m.model} · ${m.capacity}`}</p>
                <p className="av">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                  {m.availability === 'available' ? 'Available' : 'On hire, ask for dates'}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What machines do on site (Scope) */}
      {cat.uses && cat.uses.length > 0 && (
        <section style={{ background: 'var(--g100)', padding: '64px 0' }} data-surface="subtle" aria-labelledby="us-h">
          <div className="wrap">
            <h2 className="h2" id="us-h">
              {`What ${cat.name.toLowerCase()} do on site`}
            </h2>
            <ul className="scope">
              {cat.uses.map((item, idx) => (
                <li key={idx}>
                  <h3 className="h4">{item.title}</h3>
                  <p className="sm">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 6. Projects that used our machines */}
      {relatedProjects.length > 0 && (
        <section style={{ padding: '64px 0' }} aria-labelledby="rp-h">
          <div className="wrap">
            <div className="intro">
              <div>
                <p className="over">Projects</p>
                <h2 className="h2" id="rp-h" style={{ marginTop: '8px' }}>
                  {`Projects that used our ${cat.name.toLowerCase()}`}
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
              {relatedProjects.map((p) => {
                const serviceTitles = (p.serviceSlugs || []).join(', ')
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
                    {serviceTitles && <p className="over">{serviceTitles}</p>}
                    <h3 className="h4">
                      <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="meta">{p.location ? `${p.location.town}, ${p.location.county}` : 'Kenya'}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Hire Questions */}
      {faqs.length > 0 && (
        <section style={{ padding: '0 0 64px' }} aria-labelledby="fq-h">
          <div className="wrap">
            <h2 className="h2" id="fq-h">
              Hire questions
            </h2>
            <div className="faq">
              {faqs.map((faq, idx) => (
                <details key={idx}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Enquiry Form */}
      <section
        id="enquiry"
        style={{ background: 'var(--g100)', padding: '64px 0 80px' }}
        aria-labelledby="en-h"
      >
        <div className="wrap">
          <p className="over">Request hire</p>
          <h2 className="h2" id="en-h" style={{ margin: '8px 0 16px' }}>
            {`Hire an ${cat.name.replace(/s$/, '').toLowerCase()}`}
          </h2>
          <p className="lead" style={{ fontSize: '18px', lineHeight: '26px', maxWidth: '34em' }}>
            Tell us the machine, dates and site. We’ll confirm availability and price.
          </p>
          <InlineEnquiryForm
            mode="hire"
            sourcePage={`/equipment/${cat.slug}`}
            defaultEquipment={`Any ${cat.name.replace(/s$/, '').toLowerCase()}`}
            equipmentOptions={[
              {
                value: `Any ${cat.name.replace(/s$/, '').toLowerCase()}`,
                label: `Any ${cat.name.replace(/s$/, '').toLowerCase()}`,
              },
              ...machines.map((m) => ({ value: m.name, label: m.name })),
            ]}
            submitLabel="Request hire"
          />
        </div>
      </section>
    </>
  )
}
