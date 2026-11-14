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
import { MachineGalleryClient } from '@/components/blocks/MachineGalleryClient'
import { InlineEnquiryForm } from '@/components/blocks/InlineEnquiryForm'

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
          <MachineGalleryClient machineName={machine.name} images={galleryImages} />

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
            <div className="btns" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a className="btn pri" href="#enquiry">
                Request hire
              </a>
              <a className="btn outl" href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                WhatsApp us
              </a>
              <a
                className="btn sec"
                href={`/downloads/specs/${machine.slug}.pdf`}
                download
              >
                Specification sheet (PDF)
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
          <InlineEnquiryForm
            mode="hire"
            sourcePage={path}
            defaultEquipment={machine.name}
            equipmentOptions={allMachines.map((m) => ({ value: m.name, label: m.name }))}
            submitLabel="Request hire"
          />
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
                        '/media/equip-grader.jpg'
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
