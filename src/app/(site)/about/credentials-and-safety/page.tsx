import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPublishedCredentials, getSiteSettings } from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Credentials and Safety | Shena Works Limited',
  description:
    'Registrations, certificates, insurance and site safety for Shena Works Limited. Procurement teams can request certified copies for tenders.',
  path: '/about/credentials-and-safety',
})

const PLACEHOLDER_CREDENTIALS = [
  {
    name: 'Certificate of Incorporation',
    issuer: 'Registrar of Companies (BRS Kenya)',
    number: 'To be added',
    category: 'Limited Company',
    validUntil: 'Perpetual',
    fileUrl: null,
  },
  {
    name: 'National Construction Authority: Road Works',
    issuer: 'National Construction Authority (NCA)',
    number: 'To be added',
    category: 'To be added',
    validUntil: 'To be added',
    fileUrl: null,
  },
  {
    name: 'National Construction Authority: Building Works',
    issuer: 'National Construction Authority (NCA)',
    number: 'To be added',
    category: 'To be added',
    validUntil: 'To be added',
    fileUrl: null,
  },
  {
    name: 'NCA Annual Contractor Practising Licence',
    issuer: 'National Construction Authority (NCA)',
    number: 'To be added',
    category: 'Road and Building Works',
    validUntil: 'To be added',
    fileUrl: null,
  },
  {
    name: 'Tax Compliance Certificate',
    issuer: 'Kenya Revenue Authority (KRA)',
    number: 'To be added',
    category: 'Corporate Tax Compliance',
    validUntil: 'To be added',
    fileUrl: null,
  },
  {
    name: 'Contractors All Risks / WIBA Insurance',
    issuer: 'To be added',
    number: 'To be added',
    category: 'Site and Workforce Insurance',
    validUntil: 'To be added',
    fileUrl: null,
  },
  {
    name: 'Single Business Permit',
    issuer: 'County Government of Meru',
    number: 'To be added',
    category: 'Construction and Engineering',
    validUntil: 'To be added',
    fileUrl: null,
  },
]

export default async function CredentialsAndSafetyPage() {
  const [credentials, settings] = await Promise.all([
    getPublishedCredentials(),
    getSiteSettings(),
  ])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Credentials and safety' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'Credentials and safety | Shena Works Limited',
        url: `${SITE_URL}/about/credentials-and-safety`,
        mainEntity: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, '/about/credentials-and-safety'),
    ],
  }

  const credentialRows =
    credentials.length > 0
      ? credentials.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          number: c.number || 'To be added',
          category: c.category || 'To be added',
          validUntil: c.validUntil || 'To be added',
          fileUrl: c.certificateFileUrl,
        }))
      : PLACEHOLDER_CREDENTIALS

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Page Header */}
      <div className="ph-head">
        <div className="wrap">
          <nav className="crumbs dk" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/about">About</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Credentials and safety</span>
          </nav>
          <p className="over">About</p>
          <h1 className="h1">Credentials and safety</h1>
          <p className="lead">
            Registrations, certificates and site safety for procurement teams. Every document listed here is on file and can be supplied as a certified copy.
          </p>
        </div>
      </div>

      {/* 2. Company Details */}
      <section style={{ padding: '24px 0 48px' }}>
        <div className="wrap">
          <h2 className="sr">Company details</h2>
          <dl className="kf">
            <div>
              <dt>Registered name</dt>
              <dd>{settings.company?.legalName || 'Shena Works Limited'}</dd>
            </div>
            {settings.company?.regNumber && (
              <div>
                <dt>Registration number</dt>
                <dd>{settings.company.regNumber}</dd>
              </div>
            )}
            {settings.company?.incorporationDate && (
              <div>
                <dt>Incorporated</dt>
                <dd>{settings.company.incorporationDate}</dd>
              </div>
            )}
            {settings.company?.kraPin && (
              <div>
                <dt>KRA PIN</dt>
                <dd>{settings.company.kraPin}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* 3. Registrations and Certificates Table */}
      <section style={{ padding: '0 0 64px' }} aria-labelledby="ct-h">
        <div className="wrap">
          <h2 className="h2" id="ct-h">Registrations and certificates</h2>
          <p className="note">
            <strong>Prototype note:</strong> these rows are placeholders. Each one appears on the live page only after its certificate is uploaded and checked, and this page stays unpublished until at least one has passed.
          </p>
          <div className="tw" tabIndex={0} role="region" aria-label="Registrations and certificates table">
            <table>
              <caption className="sr">Shena Works Limited registrations and certificates</caption>
              <thead>
                <tr>
                  <th scope="col">Credential</th>
                  <th scope="col">Issued by</th>
                  <th scope="col">Number</th>
                  <th scope="col">Category</th>
                  <th scope="col">Valid until</th>
                  <th scope="col">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {credentialRows.map((row, idx) => {
                  const isNaNumber = row.number === 'To be added'
                  const isNaIssuer = row.issuer === 'To be added'
                  const isNaCategory = row.category === 'To be added'
                  const isNaValid = row.validUntil === 'To be added'
                  return (
                    <tr key={idx}>
                      <td>{row.name}</td>
                      <td className={isNaIssuer ? 'na' : undefined}>{row.issuer}</td>
                      <td className={isNaNumber ? 'na' : undefined}>{row.number}</td>
                      <td>
                        {isNaCategory ? <span className="na">To be added</span> : row.category}
                      </td>
                      <td>
                        {isNaValid ? <span className="na">To be added</span> : row.validUntil}
                      </td>
                      {row.fileUrl ? (
                        <td>
                          <a href={row.fileUrl} target="_blank" rel="noopener">
                            View copy
                          </a>
                        </td>
                      ) : (
                        <td className="na">Not yet uploaded</td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Safety on site FeatureSplit */}
      <section className="fsec">
        <div className="split">
          <div className="ph">
            <Image
              src="https://images.pexels.com/photos/5298215/pexels-photo-5298215.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Crew members in protective equipment on a Shena site"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
            />
          </div>
          <div className="panel subtle">
            <p className="over">Safety</p>
            <h3 className="h3">Safety on site</h3>
            <p>
              Every site has a named supervisor, a daily briefing, and protective equipment for everyone on it, including visitors. Machines are operated only by trained operators and checked before each shift.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Environment and data protection */}
      <section style={{ padding: '64px 0' }} aria-label="Environment and data protection">
        <div className="wrap">
          <div className="prose">
            <h3 className="h3">Environment</h3>
            <p>
              We follow the environmental conditions attached to each permit and keep sites, drains and roads clear of spoil and waste.
            </p>
            <h3 className="h3">Data protection</h3>
            <p>
              We handle personal data under Kenya’s Data Protection Act, 2019. See our{' '}
              <Link href="/privacy">privacy notice</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Tender documents enquiry form */}
      <section id="enquiry" style={{ background: 'var(--g100)', padding: '64px 0 80px' }} aria-labelledby="en-h">
        <div className="wrap">
          <p className="over">For procurement teams</p>
          <h2 className="h2" id="en-h" style={{ margin: '8px 0 16px' }}>Request documents for a tender</h2>
          <p className="lead" style={{ fontSize: '18px', lineHeight: '26px', maxWidth: '34em' }}>
            Tell us the tender number and what you need. We’ll send certified copies.
          </p>
          <form className="f" id="cf" method="post" action="/api/enquiries" encType="multipart/form-data" noValidate>
            <div className="sum" id="sum" role="alert" tabIndex={-1} hidden>
              <h3 id="st"></h3>
              <ul id="sl"></ul>
            </div>
            <p className="help" style={{ margin: 0 }}>* required</p>
            <input type="hidden" name="type" value="consultation" />
            <input type="hidden" name="sourcePage" value="/about/credentials-and-safety" />
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
                <input id="phone" name="phone" type="tel" autoComplete="tel" aria-describedby="phh" required />
                <p className="help" id="phh">We’ll call or WhatsApp you on this number.</p>
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
                <label htmlFor="service">Service *</label>
                <select id="service" name="service" defaultValue="tender">
                  <option value="">Choose a service</option>
                  <option value="tender">Tender and procurement documents</option>
                  <option value="road-construction-and-earthworks">Road construction and earthworks</option>
                  <option value="general-construction">General construction</option>
                  <option value="interior-design">Interior design</option>
                  <option value="project-management">Project management</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="location">Site location</label>
                <input id="location" name="location" type="text" autoComplete="address-level2" />
              </div>
            </div>
            <div className="row2">
              <div>
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
              <div>
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
            <div>
              <label htmlFor="message">What do you need help with? *</label>
              <textarea id="message" name="message" maxLength={3000} required></textarea>
            </div>
            <div>
              <label htmlFor="files">Attach drawings, BoQ or photos (optional)</label>
              <input id="files" name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp" />
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
                Send enquiry
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

