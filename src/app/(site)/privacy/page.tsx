import React from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/blocks/PageHeader'
import { getLegalPageBySlug } from '@/lib/payload'
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Privacy Notice | Shena Works',
  description:
    "How Shena Works Limited collects, uses and protects personal data under Kenya's Data Protection Act, 2019.",
  path: '/privacy',
})

export default async function PrivacyPage() {
  const page = await getLegalPageBySlug('privacy')
  if (!page) notFound()

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: page.title }]
  const jsonLd = buildBreadcrumbJsonLd(breadcrumbs, '/privacy')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        breadcrumbs={breadcrumbs}
        overline="Legal"
        headline={page.title}
        meta={`Last updated ${page.lastUpdated}`}
      />

      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-4 lg:col-span-10 space-y-[4.0rem]">
            {page.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="text-h3 text-[var(--ink-900)] mb-[1.6rem]">{sec.heading}</h2>
                <div className="space-y-[1.6rem] text-body text-[var(--ink-900)]">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                  {sec.bullets && (
                    <ul className="list-disc pl-[2.4rem] space-y-[0.8rem]">
                      {sec.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
