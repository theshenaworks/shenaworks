import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { ThankYouTracker } from '@/components/analytics/ThankYouTracker'

export const metadata = buildPageMetadata({
  title: 'Thank You | Shena Works',
  description: 'We have received your enquiry.',
  path: '/thank-you',
  noIndex: true,
})

const COPY_BY_TYPE: Record<string, [string, string]> = {
  project: [
    'Thank you, we have your enquiry',
    'We’ll look at the details and call or email you soon. If it’s urgent, call us on +254 718 971 896.',
  ],
  hire: [
    'Thank you, we’re checking availability',
    'We’ll confirm whether the machine is free for your dates and send a price. For urgent hire, call +254 718 971 896.',
  ],
  consultation: [
    'Thank you, we’ll be in touch to arrange a time',
    'We’ll contact you to agree a time to talk through the project.',
  ],
  other: [
    'Thank you for getting in touch',
    'We’ve received your message and will reply by email or phone.',
  ],
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const cookieStore = await cookies()
  const lastEnquiryRaw = cookieStore.get('sw_last_enquiry')?.value
  let lastEnquiry: {
    ref?: string
    type?: string
    service?: string
    equipment?: string
    sourcePage?: string
  } | null = null

  if (lastEnquiryRaw) {
    try {
      lastEnquiry = JSON.parse(lastEnquiryRaw)
    } catch {}
  }

  const reference = lastEnquiry?.ref || cookieStore.get('sw_enquiry_ref')?.value
  const settings = await getSiteSettings()

  const phone = settings.contact?.phoneDisplay || '+254 718 971 896'
  const telHref = `tel:${settings.contact?.phoneE164?.replace(/[\s-]/g, '') || '+254718971896'}`

  const typeKey =
    params.type && COPY_BY_TYPE[params.type]
      ? params.type
      : lastEnquiry?.type && COPY_BY_TYPE[lastEnquiry.type]
        ? lastEnquiry.type
        : 'other'

  const copy = COPY_BY_TYPE[typeKey] || COPY_BY_TYPE.other

  return (
    <>
      <ThankYouTracker enquiry={lastEnquiry} />

      <div className="ph-head">
        <div className="wrap">
          <p className="over">Enquiry received</p>
          <h1 className="h1" id="ty-h" tabIndex={-1}>
            {copy[0]}
          </h1>
          <p className="lead" id="ty-l">
            {copy[1]}
          </p>
          <p className="xs ref" hidden={!reference} id="ref">
            Your reference: <span id="ref-v">{reference || ''}</span>
          </p>
        </div>
      </div>

      <section aria-label="Where to go next" style={{ padding: '0 0 64px' }}>
        <div className="wrap">
          <ul className="tiles" style={{ listStyle: 'none', padding: 0 }}>
            <li className="tile">
              <h2 className="h4">
                <Link href="/projects">Projects</Link>
              </h2>
              <p className="sm">See what we have built, and what our role was on each job.</p>
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </li>
            <li className="tile">
              <h2 className="h4">
                <Link href="/equipment">Equipment</Link>
              </h2>
              <p className="sm">Excavators, graders, rollers and bulldozers, hired with our operators.</p>
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </li>
            <li className="tile">
              <h2 className="h4">
                <Link href="/services">Services</Link>
              </h2>
              <p className="sm">Roads and earthworks, buildings and interiors, and project management.</p>
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="cb-h" style={{ padding: '0 0 96px' }}>
        <div className="wrap">
          <aside className="cta-card solo">
            <p className="over">Talk to us</p>
            <h2 className="h4" id="cb-h">
              Call or WhatsApp
            </h2>
            <p>{phone}</p>
            <div className="btns">
              <a className="btn sec" href={telHref}>
                Call
              </a>
              <a
                className="btn outl"
                href={`https://wa.me/254718971896?text=${encodeURIComponent('Hello Shena Works, I just sent an enquiry through your website.')}`}
                rel="noopener"
                target="_blank"
              >
                WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
