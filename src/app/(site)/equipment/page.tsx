import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getEquipmentIndex,
  getPublishedEquipmentCategories,
  getPublishedMachines,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Excavator, Grader and Roller Hire in Meru | Shena Works',
  description:
    'Hire excavators, motor graders, rollers and bulldozers with trained operators in Meru and across Kenya. Check availability and get a quote.',
  path: '/equipment',
})

const DEFAULT_TERMS = [
  { term: 'Operator', value: 'Included with every machine' },
  { term: 'Fuel', value: 'Dry or wet rate, stated on your quote' },
  { term: 'Transport', value: 'Low-loader delivery quoted by distance' },
  { term: 'Service area', value: 'Meru County and surrounding counties; further by arrangement' },
  { term: 'Rates', value: 'Quoted per job' },
]

export default async function EquipmentIndexPage() {
  const [indexData, categories, allMachines] = await Promise.all([
    getEquipmentIndex().catch(() => ({ hireTerms: DEFAULT_TERMS, process: [], faqs: [] })),
    getPublishedEquipmentCategories().catch(() => []),
    getPublishedMachines().catch(() => []),
  ])

  const whatsappUrl = buildWhatsAppUrl({ type: 'equipment' })
  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Equipment' }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbs, '/equipment'),
      ...(indexData.faqs && indexData.faqs.length > 0 ? [buildFaqJsonLd(indexData.faqs)] : []),
    ],
  }

  const terms = indexData.hireTerms && indexData.hireTerms.length > 0 ? indexData.hireTerms : DEFAULT_TERMS

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
            src="https://images.pexels.com/photos/13931828/pexels-photo-13931828.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="A crawler excavator digging on a construction site"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Equipment</span>
          </nav>
          <p className="over">Equipment hire</p>
          <h1 className="h1" style={{ maxWidth: '15em' }}>
            Excavator, grader, roller and bulldozer hire
          </h1>
          <p className="lead" style={{ marginBottom: '32px' }}>
            Machines we own and maintain, with our own operators, for contractors, farmers and developers in Meru and across Kenya.
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

      {/* 2. Hire terms (Key facts) */}
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

      {/* 3. Category chips */}
      <section style={{ padding: '0 0 48px' }}>
        <div className="wrap">
          <div className="chips" aria-label="Equipment categories" style={{ margin: 0 }}>
            {categories.map((c) => (
              <a key={c.slug} className="chip" href={`#${c.slug}`}>
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category sections */}
      {categories.map((cat, idx) => {
        const catMachines = allMachines.filter(
          (m) => m.categorySlug === cat.slug
        )
        const isSubtle = idx % 2 === 1

        return (
          <section
            key={cat.slug}
            className="cat"
            id={cat.slug}
            data-surface={isSubtle ? 'subtle' : undefined}
            aria-labelledby={`${cat.slug}-h`}
          >
            <div className="wrap">
              <div className="intro">
                <div>
                  <h2 className="h2" id={`${cat.slug}-h`} style={{ marginBottom: '16px' }}>
                    {cat.name}
                  </h2>
                  <p className="lead" style={{ fontSize: '18px', lineHeight: '26px' }}>
                    {cat.summary}
                  </p>
                </div>
                <Link className="arrow" href={`/equipment/${cat.slug}`}>
                  {`${cat.name} hire`}{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 12h16m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="grid c3">
                {catMachines.map((m) => (
                  <article className="card mc" key={m.slug}>
                    <div className="ph warm r43">
                      <Image
                        src={
                          m.heroImage?.url ||
                          'https://images.pexels.com/photos/25559747/pexels-photo-25559747.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
        )
      })}

      {/* 5. How hire works */}
      <section id="how-hire-works" style={{ padding: '64px 0' }} aria-labelledby="hh-h">
        <div className="wrap">
          <h2 className="h2" id="hh-h">
            How hire works
          </h2>
          <ol className="steps">
            <li className="step">
              <p className="over">Step 1</p>
              <h3 className="h4">Tell us the job</h3>
              <p className="sm">Machine, site location, dates and what the work is.</p>
            </li>
            <li className="step">
              <p className="over">Step 2</p>
              <h3 className="h4">Get a quote</h3>
              <p className="sm">We confirm availability and send a price for the machine, operator and transport.</p>
            </li>
            <li className="step">
              <p className="over">Step 3</p>
              <h3 className="h4">We deliver</h3>
              <p className="sm">The machine arrives on a low-loader with its operator, ready to start.</p>
            </li>
            <li className="step">
              <p className="over">Step 4</p>
              <h3 className="h4">Work and collect</h3>
              <p className="sm">We log hours daily and collect the machine when the job is done.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* 6. Hire questions (FAQs) */}
      {indexData.faqs && indexData.faqs.length > 0 && (
        <section style={{ padding: '0 0 64px' }} aria-labelledby="fq-h">
          <div className="wrap">
            <h2 className="h2" id="fq-h">
              Hire questions
            </h2>
            <div className="faq">
              {indexData.faqs.map((faq, idx) => (
                <details key={idx}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Enquiry Form */}
      <section
        id="enquiry"
        style={{ background: 'var(--g100)', padding: '64px 0 80px' }}
        aria-labelledby="en-h"
      >
        <div className="wrap">
          <p className="over">Request hire</p>
          <h2 className="h2" id="en-h" style={{ margin: '8px 0 16px' }}>
            Check availability
          </h2>
          <p className="lead" style={{ fontSize: '18px', lineHeight: '26px', maxWidth: '34em' }}>
            Tell us the machine, dates and site. We’ll confirm availability and price.
          </p>
          <form className="form f" id="hf" method="post" action="/api/enquiry" noValidate>
            <div className="sum" id="sum" role="alert" tabIndex={-1} hidden>
              <h3>Please fix these before sending</h3>
              <ul id="sl"></ul>
            </div>
            <p className="help" style={{ margin: 0 }}>
              * required
            </p>
            <input type="hidden" name="type" value="hire" />
            <input type="hidden" name="sourcePage" value="/equipment" />
            <div className="hp" aria-hidden="true">
              <label>
                Company website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="name">Your name *</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  aria-describedby="ph-h"
                />
                <p className="help" id="ph-h">
                  We’ll call or WhatsApp you on this number.
                </p>
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="email">Email (optional)</label>
                <input id="email" name="email" type="email" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="org">Company or organisation (optional)</label>
                <input id="org" name="organisation" type="text" autoComplete="organization" />
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="equipment">Machine *</label>
                <select id="equipment" name="equipment" required>
                  <option value="">Choose a machine or type</option>
                  <option>Any excavator</option>
                  <option>Any motor grader</option>
                  <option>Any roller</option>
                  <option>Any bulldozer</option>
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
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  required
                  aria-describedby="lc-h"
                />
                <p className="help" id="lc-h">
                  Town, area or road, e.g. Makutano, Meru.
                </p>
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="start">Start date *</label>
                <input id="start" name="hireStart" type="date" required />
              </div>
              <div>
                <label htmlFor="dur">How long do you need it? *</label>
                <select id="dur" name="hireDuration" required>
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
              <textarea id="msg" name="message" maxLength={3000}></textarea>
            </div>
            <div className="chk">
              <input type="checkbox" id="consent" name="consent" required />
              <label htmlFor="consent">
                I agree that Shena Works may use these details to respond to my enquiry, as described in the{' '}
                <Link href="/privacy">privacy notice</Link>. *
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
    </>
  )
}
