import React from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/blocks/PageHeader'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { CredentialTable } from '@/components/blocks/CredentialTable'
import { FeatureSplit } from '@/components/blocks/FeatureSplit'
import { DownloadCard } from '@/components/blocks/DownloadCard'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'
import { getPublishedCredentials, getSiteSettings } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { KeyFactItem } from '@/types/content'

export const metadata = buildPageMetadata({
  title: 'Credentials and Safety | Shena Works Limited',
  description:
    'Registrations, certificates, insurance and site safety for Shena Works Limited. Procurement teams can request certified copies for tenders.',
  path: '/about/credentials-and-safety',
})

export default async function CredentialsAndSafetyPage() {
  const credentials = await getPublishedCredentials()
  // SITE-PLAN.md 6.4 & 8: If no credential has passed the gate, this route returns 404
  if (credentials.length === 0) {
    notFound()
  }

  const settings = await getSiteSettings()
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Credentials and safety' },
  ]

  const companyFacts: KeyFactItem[] = [
    { term: 'Registered name', value: settings.company.legalName },
    ...(settings.company.regNumber
      ? [{ term: 'Registration number', value: settings.company.regNumber }]
      : []),
    ...(settings.company.incorporationDate
      ? [{ term: 'Incorporated', value: settings.company.incorporationDate }]
      : []),
    ...(settings.company.kraPin ? [{ term: 'KRA PIN', value: settings.company.kraPin }] : []),
    ...(settings.company.directors
      ? [{ term: 'Directors', value: settings.company.directors }]
      : []),
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        overline="About"
        headline="Credentials and safety"
        lead="Registrations, certificates and site safety for procurement teams. Every document listed here is on file and can be supplied as a certified copy."
      />

      <KeyFacts items={companyFacts} />

      <CredentialTable heading="Registrations and certificates" credentials={credentials} />

      <FeatureSplit
        imagePosition="left"
        panelSurface="subtle"
        overline="Safety"
        heading="Safety on site"
        body="Every site has a named supervisor, a daily briefing, and protective equipment for everyone on it, including visitors. Machines are operated only by trained operators and checked before each shift."
        buttonLabel="Contact us"
        buttonHref="/contact"
        image={{
          url: '/media/about-site-supervision.svg',
          alt: 'Site safety briefing and personal protective equipment on a Shena Works site',
          caption: 'Daily site safety supervision and plant pre-shift inspections.',
        }}
      />

      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10 space-y-[3.2rem]">
            <div>
              <h3 className="text-h3 text-[var(--ink-900)] mb-[1.2rem]">Environment</h3>
              <p className="text-body text-[var(--ink-600)]">
                We follow the environmental conditions attached to each permit and keep sites,
                drains and roads clear of spoil and waste.
              </p>
            </div>
            <div>
              <h3 className="text-h3 text-[var(--ink-900)] mb-[1.2rem]">Data protection</h3>
              <p className="text-body text-[var(--ink-600)]">
                We handle personal data under Kenya&apos;s Data Protection Act, 2019.{' '}
                <a href="/privacy" className="font-bold text-[var(--ink-900)] underline">
                  See our privacy notice
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {settings.files.companyProfile && (
        <section className="bg-[var(--white)] pb-[6.4rem]">
          <div className="site-grid">
            <div className="col-span-4 lg:col-start-2 lg:col-span-7">
              <DownloadCard
                title="Company profile"
                sizeMb={settings.files.companyProfile.sizeMb || '1.2 MB'}
                href="/downloads/company-profile"
              />
            </div>
          </div>
        </section>
      )}

      <EnquiryForm
        overline="For procurement teams"
        heading="Request documents for a tender"
        body="Tell us the tender number and what you need. We'll send certified copies."
        defaultType="consultation"
        defaultService="tender-documents"
      />
    </>
  )
}
