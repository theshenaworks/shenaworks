import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getChildServices,
  getMachinesBySlugs,
  getProjectsByService,
  getPublishedEquipmentCategories,
  getPublishedServices,
} from '@/lib/payload'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from '@/lib/seo/jsonld'
import type { ServiceRecord } from '@/types/content'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'

export interface ServiceDetailTemplateProps {
  service: ServiceRecord
  breadcrumbs: BreadcrumbItem[]
  path: string
}

export async function ServiceDetailTemplate({
  service,
  breadcrumbs,
  path,
}: ServiceDetailTemplateProps) {
  const [
    childServices,
    allProjects,
    allServices,
    equipmentUsedAll,
    equipmentCategories,
  ] = await Promise.all([
    getChildServices(service.slug).catch(() => []),
    getProjectsByService(service.slug).catch(() => []),
    getPublishedServices().catch(() => []),
    getMachinesBySlugs(service.equipmentSlugs || []).catch(() => []),
    getPublishedEquipmentCategories().catch(() => []),
  ])

  const relatedProjects = allProjects.slice(0, 3)
  const equipmentUsed = equipmentUsedAll.slice(0, 3)
  const whatsappUrl = buildWhatsAppUrl({ type: 'service', serviceTitle: service.title })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildServiceJsonLd({
        name: service.title,
        description: service.metaDescription,
        path,
        serviceType: service.group,
      }),
      buildBreadcrumbJsonLd(breadcrumbs, path),
      ...(service.faqs && service.faqs.length > 0 ? [buildFaqJsonLd(service.faqs)] : []),
    ],
  }

  const heroImg =
    service.heroImage?.url ||
    'https://images.pexels.com/photos/12267902/pexels-photo-12267902.jpeg?auto=compress&cs=tinysrgb&w=1600'
  const heroAlt = service.heroImage?.alt || service.title

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
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden="true">/</span>}
                {b.href ? (
                  <Link href={b.href}>{b.label}</Link>
                ) : (
                  <span aria-current="page">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          <p className="over">{service.group}</p>
          <h1 className="h1" style={{ maxWidth: '14em' }}>
            {service.heroHeadline || service.title}
          </h1>
          <p className="lead" style={{ marginBottom: '32px', maxWidth: '34em' }}>
            {service.heroLead || service.summary}
          </p>
          <div className="btns">
            <a className="btn pri" href="#enquiry">
              {service.ctaLabel || 'Request a quote'}
            </a>
            <a className="btn out" href={whatsappUrl} target="_blank" rel="noopener">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Facts */}
      {service.keyFacts && service.keyFacts.length > 0 && (
        <section style={{ padding: '48px 0 32px' }}>
          <div className="wrap">
            <h2 className="sr">Key facts</h2>
            <dl className="kf">
              {service.keyFacts.map((kf, idx) => (
                <div key={idx}>
                  <dt>{kf.term}</dt>
                  <dd>{kf.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* 3. Intro Prose */}
      {service.intro && service.intro.length > 0 && (
        <section style={{ padding: '32px 0 64px' }}>
          <div className="wrap">
            <div className="prose">
              {service.intro.map((para, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? 'lead' : undefined}
                  style={idx === 0 ? { fontSize: '20px', lineHeight: '30px' } : undefined}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Scope (What we do) */}
      {service.scope && service.scope.length > 0 && (
        <section style={{ padding: '0 0 64px' }} aria-labelledby="sc-h">
          <div className="wrap">
            <h2 className="h2" id="sc-h">
              What we do
            </h2>
            <ul className="scope">
              {service.scope.map((item, idx) => (
                <li key={idx}>
                  <h3 className="h4">{item.title}</h3>
                  <p className="sm">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 5. Specialist work (child services) */}
      {childServices.length > 0 && (
        <section style={{ background: 'var(--g100)', padding: '64px 0' }} data-surface="subtle" aria-labelledby="sp-h">
          <div className="wrap">
            <h2 className="h2" id="sp-h" style={{ marginBottom: '40px' }}>
              Specialist work
            </h2>
            <div className="grid c3">
              {childServices.map((child) => (
                <article className="card" key={child.slug}>
                  <div className="ph warm r43">
                    <Image
                      src={child.heroImage?.url || 'https://images.pexels.com/photos/33566707/pexels-photo-33566707.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                      alt={child.heroImage?.alt || child.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                  <p className="over">{child.group}</p>
                  <h3 className="h4">
                    <Link href={`/services/${service.slug}/${child.slug}`}>{child.title}</Link>
                  </h3>
                  <p className="sm">{child.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Process steps */}
      {service.process && service.process.length > 0 && (
        <section style={{ padding: '64px 0' }} aria-labelledby="pr-h">
          <div className="wrap">
            <h2 className="h2" id="pr-h">
              {`How a ${service.shortTitle || service.title} job runs`}
            </h2>
            <ol className="steps">
              {service.process.map((step, idx) => (
                <li className="step" key={idx}>
                  <p className="over">{`Step ${idx + 1}`}</p>
                  <h3 className="h4">{step.title}</h3>
                  <p className="sm">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 7. Related Projects */}
      {relatedProjects.length > 0 && (
        <section style={{ background: 'var(--g100)', padding: '64px 0' }} data-surface="subtle" aria-labelledby="rp-h">
          <div className="wrap">
            <div className="intro">
              <div>
                <p className="over">Projects</p>
                <h2 className="h2" id="rp-h" style={{ marginTop: '8px' }}>
                  {`${service.shortTitle || service.title} we’ve delivered`}
                </h2>
              </div>
              <Link className="arrow" href={`/projects?service=${service.slug}`}>
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
                        src={p.heroImage?.url || 'https://images.pexels.com/photos/16120138/pexels-photo-16120138.jpeg?auto=compress&cs=tinysrgb&w=1200'}
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

      {/* 8. Machines on these jobs */}
      {equipmentUsed.length > 0 && (
        <section className="eq spacious" data-surface="dark" aria-labelledby="eq-h">
          <div className="wrap">
            <h2 className="h2" id="eq-h" style={{ marginBottom: '40px' }}>
              Machines on these jobs
            </h2>
            <div className="grid c3">
              {equipmentUsed.map((m) => {
                const categorySlug = m.categorySlug || 'excavators'
                return (
                  <article className="card" key={m.slug}>
                    <div className="ph warm r43">
                      <Image
                        src={m.heroImage?.url || 'https://images.pexels.com/photos/25559747/pexels-photo-25559747.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                        alt={m.heroImage?.alt || m.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    </div>
                    <p className="over">{categorySlug}</p>
                    <h3 className="h4">
                      <Link href={`/equipment/${categorySlug}/${m.slug}`}>{m.name}</Link>
                    </h3>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 9. FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section style={{ padding: '64px 0' }} aria-labelledby="fq-h">
          <div className="wrap">
            <h2 className="h2" id="fq-h">
              Questions we’re asked
            </h2>
            <div className="faq">
              {service.faqs.map((faq, idx) => (
                <details key={idx}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Enquiry section with form and prefer-to-talk sidebar */}
      <section
        id="enquiry"
        style={{ background: 'var(--g100)', padding: '64px 0 80px' }}
        data-surface="subtle"
        aria-labelledby="en-h"
      >
        <div className="wrap fwrap">
          <div>
            <p className="over">{service.ctaLabel || 'Request a quote'}</p>
            <h2 className="h2" id="en-h" style={{ margin: '8px 0 16px' }}>
              {service.formHeading || `Get a quote for ${service.shortTitle || service.title}`}
            </h2>
            <p className="lead" style={{ fontSize: '18px', lineHeight: '26px', maxWidth: '34em' }}>
              {service.formIntro ||
                'Tell us the location, approximate length or area, and your required scope.'}
            </p>
            <form className="f" id="cf" method="post" action="/api/enquiry" encType="multipart/form-data" noValidate>
              <div className="sum" id="sum" role="alert" tabIndex={-1} hidden>
                <h3 id="st"></h3>
                <ul id="sl"></ul>
              </div>
              <p className="help" style={{ margin: 0 }}>
                * required
              </p>
              <input type="hidden" name="type" value="project" />
              <input type="hidden" name="service" value={service.slug} />
              <input type="hidden" name="sourcePage" value={`/services/${service.slug}`} />
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
                    aria-describedby="phh"
                    required
                  />
                  <p className="help" id="phh">
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
              <div>
                <label htmlFor="location">Site location *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  aria-describedby="lch"
                  required
                />
                <p className="help" id="lch">
                  Town, area or road, e.g. Makutano, Meru.
                </p>
              </div>
              <div className="row2">
                <div>
                  <label htmlFor="budget">Budget</label>
                  <select id="budget" name="budgetBand">
                    <option value="">Choose a range</option>
                    <option>Under KES 1 million</option>
                    <option>KES 1–5 million</option>
                    <option>KES 5–20 million</option>
                    <option>KES 20–50 million</option>
                    <option>Over KES 50 million</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline">When do you want to start?</label>
                  <select id="timeline" name="timeline">
                    <option value="">Choose a time</option>
                    <option>As soon as possible</option>
                    <option>Within 3 months</option>
                    <option>3–6 months</option>
                    <option>Later than 6 months</option>
                    <option>Just pricing for now</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message">Tell us about the project *</label>
                <textarea
                  id="message"
                  name="message"
                  maxLength={3000}
                  aria-describedby="mh"
                  required
                ></textarea>
                <p className="help" id="mh">
                  Size, what’s there now, and what you want at the end.
                </p>
              </div>
              <div>
                <label htmlFor="files">Attach drawings, BoQ or photos (optional)</label>
                <input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
                <p className="help">Up to 3 files, 10 MB each. PDF, JPG, PNG or WEBP.</p>
              </div>
              <div className="chk">
                <input type="checkbox" id="consent" name="consent" required />
                <label htmlFor="consent">
                  I agree that Shena Works may use these details to respond to my enquiry, as described in the{' '}
                  <Link href="/privacy">privacy notice</Link>. *
                </label>
              </div>
              <div>
                <button className="btn pri" type="submit" id="sb">
                  {service.ctaLabel || 'Request a quote'}
                </button>
              </div>
            </form>
          </div>
          <aside className="cside" aria-labelledby="pt-h">
            <h2 className="h4" id="pt-h">
              Prefer to talk?
            </h2>
            <a className="btn sec" href="tel:+254718971896">
              Call +254 718 971 896
            </a>
            <a className="btn outl" href={whatsappUrl} target="_blank" rel="noopener">
              WhatsApp us
            </a>
            <a className="em" href="mailto:shenaworksltd@gmail.com">
              shenaworksltd@gmail.com
            </a>
          </aside>
        </div>
      </section>
    </>
  )
}
