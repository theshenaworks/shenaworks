import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedMachines,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'
import { ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Shena Works | Request a Quote',
  description:
    'Request a quote for roads, paving, building or equipment hire. Call or WhatsApp +254 718 971 896, or send us the details online.',
  path: '/contact',
})

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; service?: string; equipment?: string; project?: string }>
}) {
  const params = await searchParams
  const [settings, services, machines, categories, locations] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getPublishedMachines(),
    getPublishedEquipmentCategories(),
    getPublishedLocations(),
  ])

  const initialType =
    params.type === 'hire' || params.type === 'consultation' || params.type === 'other'
      ? params.type
      : 'project'

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'
  const telHref = `tel:${settings.contact?.phoneE164?.replace(/[\s-]/g, '') || '+254718971896'}`
  const email = settings.contact?.email || 'shenaworksltd@gmail.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact Shena Works Limited',
        url: `${SITE_URL}/contact`,
        mainEntity: {
          '@id': ORG_ID,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: phone,
            contactType: 'sales',
            areaServed: 'KE',
            availableLanguage: ['en', 'sw'],
          },
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="ph-head">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs dk">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <p className="over">Contact</p>
          <h1 className="h1">Request a quote or get in touch</h1>
          <p className="lead">
            Tell us about the site and what you need. The more detail you give, the more useful our first reply will be.
          </p>
        </div>
      </div>

      <div className="wrap cwrap">
        <form
          action="/api/enquiry"
          aria-label="Enquiry form"
          className="f"
          encType="multipart/form-data"
          id="cf"
          method="post"
          noValidate
        >
          <div className="sum" hidden id="sum" role="alert" tabIndex={-1}>
            <h2 id="st">Please fix these before sending</h2>
            <ul id="sl" />
          </div>

          <p className="help" style={{ margin: 0 }}>
            * required
          </p>

          <fieldset>
            <legend>What can we help with? *</legend>
            <div className="rcs">
              <label className="rc">
                <input
                  defaultChecked={initialType === 'project'}
                  name="type"
                  type="radio"
                  value="project"
                />
                Build or renovate a project
              </label>
              <label className="rc">
                <input
                  defaultChecked={initialType === 'hire'}
                  name="type"
                  type="radio"
                  value="hire"
                />
                Hire equipment
              </label>
              <label className="rc">
                <input
                  defaultChecked={initialType === 'consultation'}
                  name="type"
                  type="radio"
                  value="consultation"
                />
                Design, estimate or consultation
              </label>
              <label className="rc">
                <input
                  defaultChecked={initialType === 'other'}
                  name="type"
                  type="radio"
                  value="other"
                />
                Something else (suppliers, subcontractors, jobs)
              </label>
            </div>
          </fieldset>

          <div aria-hidden="true" className="hp">
            <label>
              Company website
              <input autoComplete="off" name="company_website" tabIndex={-1} type="text" />
            </label>
          </div>

          <input name="sourcePage" type="hidden" value="/contact" />

          <div className="row2">
            <div className="fw">
              <label htmlFor="name">Your name *</label>
              <input autoComplete="name" id="name" name="name" type="text" />
            </div>
            <div className="fw">
              <label htmlFor="phone">Phone number *</label>
              <input aria-describedby="phh" autoComplete="tel" id="phone" name="phone" type="tel" />
              <p className="help" id="phh">
                We’ll call or WhatsApp you on this number.
              </p>
            </div>
          </div>

          <div className="row2">
            <div className="fw">
              <label htmlFor="email">Email (optional)</label>
              <input autoComplete="email" id="email" name="email" type="email" />
            </div>
            <div className="fw">
              <label htmlFor="org">Company or organisation (optional)</label>
              <input autoComplete="organization" id="org" name="organisation" type="text" />
            </div>
          </div>

          <div className="row2">
            <div className="fw" data-t="project consultation">
              <label htmlFor="service">Service *</label>
              <select id="service" name="service" defaultValue={params.service || ''}>
                <option value="">Choose a service</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
                <option value="not-sure">Not sure yet</option>
              </select>
            </div>

            <div className="fw" data-t="hire" hidden>
              <label htmlFor="equipment">Machine *</label>
              <select id="equipment" name="equipment" defaultValue={params.equipment || ''}>
                <option value="">Choose a machine or type</option>
                {categories.map((c) => (
                  <option key={c.slug} value={`any-${c.slug}`}>
                    {`Any ${c.singular.toLowerCase()}`}
                  </option>
                ))}
                {machines.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="fw" data-t="project hire consultation">
              <label htmlFor="location">
                Site location <span data-t-req="">*</span>
              </label>
              <input
                aria-describedby="lch"
                autoComplete="address-level2"
                id="location"
                name="location"
                type="text"
              />
              <p className="help" id="lch">
                Town, area or road, e.g. Makutano, Meru.
              </p>
            </div>
          </div>

          <div className="row2" data-t="hire" hidden>
            <div className="fw">
              <label htmlFor="start">Start date *</label>
              <input id="start" name="hireStart" type="date" />
            </div>
            <div className="fw">
              <label htmlFor="dur">How long do you need it? *</label>
              <select id="dur" name="hireDuration" defaultValue="">
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

          <div className="row2" data-t="project consultation">
            <div className="fw">
              <label htmlFor="budget">Budget</label>
              <select id="budget" name="budgetBand" defaultValue="">
                <option value="">Choose a range</option>
                <option>Under KES 1 million</option>
                <option>KES 1–5 million</option>
                <option>KES 5–20 million</option>
                <option>KES 20–50 million</option>
                <option>Over KES 50 million</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="fw">
              <label htmlFor="timeline">When do you want to start?</label>
              <select id="timeline" name="timeline" defaultValue="">
                <option value="">Choose a time</option>
                <option>As soon as possible</option>
                <option>Within 3 months</option>
                <option>3–6 months</option>
                <option>Later than 6 months</option>
                <option>Just pricing for now</option>
              </select>
            </div>
          </div>

          <div className="fw">
            <label htmlFor="message" id="ml">
              Tell us about the project *
            </label>
            <textarea aria-describedby="mh" id="message" maxLength={3000} name="message" />
            <p className="help" id="mh">
              Size, what’s there now, and what you want at the end.
            </p>
          </div>

          <div className="fw" data-t="project consultation other">
            <label htmlFor="files">Attach drawings, BoQ or photos (optional)</label>
            <input
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              id="files"
              multiple
              name="files"
              type="file"
            />
            <p className="help">Up to 3 files, 10 MB each. PDF, JPG, PNG or WEBP.</p>
          </div>

          <div className="chk">
            <input id="consent" name="consent" type="checkbox" />
            <label htmlFor="consent">
              I agree that Shena Works may use these details to respond to my enquiry, as described in
              the <Link href="/privacy">privacy notice</Link>. *
            </label>
          </div>

          <div>
            <button className="btn pri" id="sb" type="submit">
              Send enquiry
            </button>
          </div>
        </form>

        <aside aria-labelledby="pt-h" className="cside">
          <h2 className="h4" id="pt-h">
            Prefer to talk?
          </h2>
          <a className="btn sec" href={telHref}>
            {`Call ${phone}`}
          </a>
          <a
            className="btn outl"
            href={`https://wa.me/254718971896?text=${encodeURIComponent('Hello Shena Works, I found you on your website and would like to talk about a project.')}`}
            rel="noopener"
            target="_blank"
          >
            WhatsApp us
          </a>
          <a className="em" href={`mailto:${email}`}>
            {email}
          </a>
          <hr />
          <h2 className="h4">Offices</h2>
          {locations.map((loc) => (
            <React.Fragment key={loc.slug}>
              <span className="lbl">{loc.town}</span>
              <p className="sm" style={{ marginBottom: '16px' }}>{loc.address || 'Headquarters and plant yard'}</p>
            </React.Fragment>
          ))}
        </aside>
      </div>
    </>
  )
}
