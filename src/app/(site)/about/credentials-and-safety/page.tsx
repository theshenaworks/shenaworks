import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedCredentials, getSiteSettings } from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { InlineEnquiryForm } from '@/components/blocks/InlineEnquiryForm'

export const metadata = buildPageMetadata({
  title: 'Credentials and Safety | Shena Works Limited',
  description:
    'Registrations, certificates, insurance and site safety for Shena Works Limited. Procurement teams can request certified copies for tenders.',
  path: '/about/credentials-and-safety',
})

export default async function CredentialsAndSafetyPage() {
  const [credentials, settings] = await Promise.all([
    getPublishedCredentials(),
    getSiteSettings(),
  ])

  // SITE-PLAN.md 8.2: If 0 credentials pass the gate: /about/credentials-and-safety returns 404
  if (credentials.length === 0) {
    notFound()
  }

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

  const credentialRows = credentials.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    number: c.number || '',
    category: c.category || '',
    validUntil: c.validUntil || '',
    fileUrl: c.certificateFileUrl,
  }))

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
              src="/media/why-crew.jpg"
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
          <InlineEnquiryForm
            mode="consultation"
            sourcePage="/about/credentials-and-safety"
            defaultService="tender"
            locationRequired={false}
            serviceOptions={[
              { value: 'tender', label: 'Tender and procurement documents' },
              {
                value: 'road-construction-and-earthworks',
                label: 'Road construction and earthworks',
              },
              { value: 'general-construction', label: 'General construction' },
              { value: 'interior-design', label: 'Interior design' },
              { value: 'project-management', label: 'Project management' },
              { value: 'not-sure', label: 'Not sure yet' },
            ]}
            messageLabel="What do you need help with? *"
            submitLabel="Send enquiry"
          />
        </div>
      </section>
    </>
  )
}

