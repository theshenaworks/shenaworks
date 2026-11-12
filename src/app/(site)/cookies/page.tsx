import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CookieSettingsButton } from '@/components/ui/CookieSettingsButton'
import { getLegalPageBySlug } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Cookie Notice | Shena Works',
  description:
    'Information about cookies used on the Shena Works website, including consent choices for optional analytics.',
  path: '/cookies',
})

export default async function CookiesPage() {
  const page = await getLegalPageBySlug('cookies')
  if (!page) notFound()

  return (
    <>
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
              {sec.table && (
                <div style={{ overflowX: 'auto', margin: '24px 0' }}>
                  <table className="specs" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        {sec.table.headers.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} style={cIdx === 0 ? { fontWeight: 700 } : undefined}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </React.Fragment>
          ))}

          <div style={{ marginTop: '32px' }}>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </>
  )
}
