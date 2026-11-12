import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettingsRecord } from '@/types/content'

/**
 * 11 CtaBand (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html & docs/reference/pages/*.html
 */
export interface CtaBandProps {
  settings?: SiteSettingsRecord | null
  heading?: string
  body?: string
  buttonLabel?: string
  buttonHref?: string
  headlineLine1?: string
  headlineLine2?: string
  hasBox?: boolean
}

export function CtaBand({
  settings,
  buttonLabel = 'Request a quote',
  buttonHref = '/contact?type=project',
  hasBox = false,
}: CtaBandProps = {}) {
  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'
  const imgSrc =
    (settings?.ctaImage?.url?.startsWith('http') ? settings.ctaImage.url : null) ||
    (hasBox
      ? 'https://images.pexels.com/photos/40736607/pexels-photo-40736607.jpeg?auto=compress&cs=tinysrgb&w=1600'
      : 'https://images.pexels.com/photos/8809466/pexels-photo-8809466.jpeg?auto=compress&cs=tinysrgb&w=1200')
  const imgAlt =
    settings?.ctaImage?.alt ||
    (hasBox ? 'People and machines on a Shena road site' : 'Crew standing beside a road roller on a murram road')

  const cardContent = (
    <>
      <p className="over">Talk to us</p>
      <h3 className="h4">Call or WhatsApp</h3>
      <p className={hasBox ? 'num' : undefined}>{phoneDisplay}</p>
      <div className="btns">
        <a className="btn sec" href={`tel:${phoneE164}`}>
          Call
        </a>
        <a
          className="btn outl"
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            'Hello Shena Works, I found you on your website and would like to talk about a project.'
          )}`}
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
      </div>
    </>
  )

  return (
    <section className="cta" style={{ paddingTop: '80px' }} aria-labelledby="cta-h">
      <div className="grid16">
        <div className="cta-photo" data-surface="photo">
          <div className="ph">
            <Image
              src={imgSrc}
              alt={imgAlt}
              fill
              sizes="(min-width: 1024px) 75vw, 100vw"
            />
          </div>
          <div className="in">
            {hasBox ? (
              <h2 className="d" id="cta-h">
                Let’s talk about <strong>your site</strong>
              </h2>
            ) : (
              <h2 className="d" id="cta-h">
                Let’s talk about<br /> your site
              </h2>
            )}
            <Link className="btn pri" href={buttonHref}>
              {buttonLabel}
            </Link>
          </div>
        </div>
        <aside className="cta-card">
          {hasBox ? <div className="box">{cardContent}</div> : cardContent}
        </aside>
      </div>
    </section>
  )
}
