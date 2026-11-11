import React from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/blocks/PageHeader'
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

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: page.title }]

  return (
    <>
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
                  {sec.table && (
                    <div className="overflow-x-auto mt-[1.6rem]">
                      <table className="w-full border-collapse text-body-sm">
                        <thead>
                          <tr>
                            {sec.table.headers.map((h) => (
                              <th
                                key={h}
                                scope="col"
                                className="text-overline text-left border-b-2 border-[var(--ink-900)] py-[1.2rem] px-[1.6rem]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-[var(--grey-300)]">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-[1.2rem] px-[1.6rem] ${
                                    cIdx === 0 ? 'font-bold' : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-[1.6rem]">
              <CookieSettingsButton />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
