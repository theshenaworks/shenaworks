import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

      <div className="ph-head">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs dk" style={{ margin: '0 0 16px' }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.title}</span>
          </nav>
          <p className="over">Legal</p>
          <h1 className="h1">{page.title}</h1>
          <p className="xs">{`Last updated ${page.lastUpdated}`}</p>
        </div>
      </div>

      <div className="wrap">
        <div className="legal-prose">
          {page.sections.map((sec) => (
            <React.Fragment key={sec.heading}>
              <h2>{sec.heading}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {sec.bullets && (
                <ul>
                  {sec.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
