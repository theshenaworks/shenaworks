import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  getPublishedEquipmentCategories,
  getPublishedMachine,
  getPublishedMachines,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildMachineProductJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateStaticParams() {
  const machines = await getPublishedMachines()
  return machines.map((m) => ({
    category: m.categorySlug,
    slug: m.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const found = await getPublishedMachine(category, slug)
  if (!found) return {}
  const { category: cat, machine } = found
  return buildPageMetadata({
    title: `${machine.name} for Hire | Shena Works`,
    description: `Hire our ${machine.make} ${machine.model} ${cat.singular} with operator in Meru and across Kenya. ${machine.capacity}. Check availability and request a quote.`,
    path: `/equipment/${cat.slug}/${machine.slug}`,
  })
}

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const found = await getPublishedMachine(category, slug)
  if (!found) notFound()

  const { category: cat, machine } = found
  const isAvailable = machine.availability === 'available'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: cat.name, href: `/equipment/${cat.slug}` },
    { label: machine.name },
  ]

  const whatsappUrl = buildWhatsAppUrl({
    type: 'machine',
    machineName: machine.name,
    make: machine.make,
    model: machine.model,
  })

  const [allCategories, allMachines] = await Promise.all([
    getPublishedEquipmentCategories(),
    getPublishedMachines(),
  ])
  const catMap = new Map<string, string>()
  allCategories.forEach((c) => catMap.set(c.slug, c.name))

  const otherMachines = allMachines
    .filter((m) => m.slug !== machine.slug)
    .sort(
      (a, b) =>
        Number(b.categorySlug === machine.categorySlug) -
        Number(a.categorySlug === machine.categorySlug)
    )
    .slice(0, 3)

  const galleryImages =
    machine.gallery && machine.gallery.length > 0 ? machine.gallery : [machine.heroImage]

  const path = `/equipment/${cat.slug}/${machine.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildMachineProductJsonLd({
        name: machine.name,
        make: machine.make,
        model: machine.model,
        categoryName: cat.name,
        image: machine.heroImage.url,
        path,
        available: isAvailable,
      }),
      buildBreadcrumbJsonLd(breadcrumbs, path),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header & Gallery */}
      <section aria-label={machine.name}>
        <div className="wrap mhead">
          <div
            aria-label="Machine gallery"
            aria-roledescription="carousel"
            className="gal"
            id="gal"
            role="region"
            tabIndex={0}
          >
            <div className="gtrack" id="gt">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  aria-label={`${machine.name}, image ${idx + 1} of ${galleryImages.length}`}
                  className="ph warm"
                  role="img"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${machine.name} photo ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? undefined : 'lazy'}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
              ))}
            </div>
            <div className="gctl">
              <button aria-label="Previous image" id="gp" type="button">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </button>
              <span aria-live="polite" className="ct" id="gc">
                {`1 / ${galleryImages.length}`}
              </span>
              <button aria-label="Next image" id="gn" type="button">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="minfo">
            <nav aria-label="Breadcrumb" className="crumbs dk" style={{ margin: 0 }}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/equipment">Equipment</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/equipment/${cat.slug}`}>{cat.name}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{machine.name}</span>
            </nav>
            <p className="over">{cat.singular || cat.name.replace(/s$/, '')}</p>
            <h1 className="h1">{machine.name}</h1>
            <p className="avl">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 5 5 9-10" />
              </svg>
              Availability: {isAvailable ? 'Available' : 'On hire, ask for dates'}
            </p>
            <p className="sm" style={{ maxWidth: '30em' }}>
              {`${machine.make} ${machine.model} (${machine.capacity}). Hired with our own trained operator.`}
            </p>
            <div className="btns">
              <a className="btn pri" href="#enquiry">
                Request hire
              </a>
              <a className="btn outl" href={whatsappUrl} rel="noopener" target="_blank">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typical uses */}
      {machine.uses && machine.uses.length > 0 && (
        <section aria-labelledby="us-h" data-surface="subtle" style={{ background: 'var(--g100)', padding: '64px 0' }}>
          <div className="wrap">
            <h2 className="h2" id="us-h">
              Typical uses
            </h2>
            <ul className="scope">
              {machine.uses.map((use, idx) => (
                <li key={idx}>
                  <h3 className="h4">{use.title}</h3>
                  <p className="sm">{use.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. Hire terms */}
      <section aria-labelledby="ht-h" style={{ padding: '64px 0' }}>
        <div className="wrap">
          <h2 className="h2" id="ht-h" style={{ marginBottom: '32px' }}>
            Hire terms
          </h2>
          <dl className="kf" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            <div>
              <dt>Operator</dt>
              <dd>{machine.hireTerms.operator}</dd>
            </div>
            <div>
              <dt>Fuel</dt>
              <dd>{machine.hireTerms.fuel}</dd>
            </div>
            <div>
              <dt>Transport</dt>
              <dd>{machine.hireTerms.transport}</dd>
            </div>
            <div>
              <dt>Service area</dt>
              <dd>{machine.hireTerms.serviceArea}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 4. Request hire form */}
      <section aria-labelledby="en-h" id="enquiry" style={{ background: 'var(--g100)', padding: '64px 0 80px' }}>
        <div className="wrap">
          <p className="over">Request hire</p>
          <h2 className="h2" id="en-h" style={{ margin: '8px 0 16px' }}>
            {`Hire the ${machine.name}`}
          </h2>
          <p className="lead" style={{ fontSize: '18px', lineHeight: '26px', maxWidth: '34em' }}>
            Tell us the machine, dates and site. We’ll confirm availability and price.
          </p>
          <form action="/api/enquiry" className="form f" id="hf" method="post" noValidate>
            <div className="sum" hidden id="sum" role="alert" tabIndex={-1}>
              <h3>Please fix these before sending</h3>
              <ul id="sl" />
            </div>
            <p className="help" style={{ margin: 0 }}>
              * required
            </p>
            <input name="type" type="hidden" value="hire" />
            <input name="sourcePage" type="hidden" value={path} />
            <div aria-hidden="true" className="hp">
              <label>
                Company website
                <input autoComplete="off" name="company_website" tabIndex={-1} type="text" />
              </label>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="name">Your name *</label>
                <input autoComplete="name" id="name" name="name" required type="text" />
              </div>
              <div>
                <label htmlFor="phone">Phone number *</label>
                <input
                  aria-describedby="ph-h"
                  autoComplete="tel"
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                />
                <p className="help" id="ph-h">
                  We’ll call or WhatsApp you on this number.
                </p>
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="email">Email (optional)</label>
                <input autoComplete="email" id="email" name="email" type="email" />
              </div>
              <div>
                <label htmlFor="org">Company or organisation (optional)</label>
                <input autoComplete="organization" id="org" name="organisation" type="text" />
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="equipment">Machine *</label>
                <select id="equipment" name="equipment" required defaultValue={machine.name}>
                  <option value="">Choose a machine or type</option>
                  {allMachines.map((m) => (
                    <option key={m.slug} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location">Site location *</label>
                <input
                  aria-describedby="lc-h"
                  autoComplete="address-level2"
                  id="location"
                  name="location"
                  required
                  type="text"
                />
                <p className="help" id="lc-h">
                  Town, area or road, e.g. Makutano, Meru.
                </p>
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="start">Start date *</label>
                <input id="start" name="hireStart" required type="date" />
              </div>
              <div>
                <label htmlFor="dur">How long do you need it? *</label>
                <select id="dur" name="hireDuration" required defaultValue="">
                  <option value="">Choose a duration</option>
                  <option>1 day</option>
                  <option>2–6 days</option>
                  <option>1–2 weeks</option>
                  <option>2–4 weeks</option>
                  <option>More than a month</option>
                  <option>Not sure</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="msg">Anything we should know about the site or work? (optional)</label>
              <textarea id="msg" maxLength={3000} name="message" />
            </div>
            <div className="chk">
              <input id="consent" name="consent" required type="checkbox" />
              <label htmlFor="consent">
                I agree that Shena Works may use these details to respond to my enquiry, as described in
                the <Link href="/privacy">privacy notice</Link>. *
              </label>
            </div>
            <div>
              <button className="btn pri" type="submit">
                Request hire
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. Other machines */}
      {otherMachines.length > 0 && (
        <section aria-labelledby="om-h" style={{ padding: '64px 0 80px' }}>
          <div className="wrap">
            <h2 className="h2" id="om-h" style={{ marginBottom: '40px' }}>
              Other machines
            </h2>
            <div className="grid c3">
              {otherMachines.map((m) => (
                <article className="card mc" key={m.slug}>
                  <div className="ph warm r43">
                    <Image
                      src={
                        m.heroImage?.url ||
                        'https://images.pexels.com/photos/8809464/pexels-photo-8809464.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
                  <p className="meta">{`${m.make} ${m.model} · ${m.capacity}`}</p>
                  <p className="av">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                    {m.availability === 'available' ? 'Available' : 'On hire, ask for dates'}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
