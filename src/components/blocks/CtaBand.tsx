import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettingsRecord } from '@/types/content'

/**
 * 11 CtaBand (AGENTS.md Section 0 & Home Reference)
 * Exact structure from docs/reference/home/index.html
 */
export interface CtaBandProps {
  settings?: SiteSettingsRecord | null
  buttonLabel?: string
  buttonHref?: string
  headlineLine1?: string
  headlineLine2?: string
  imageSrc?: string
  imageAlt?: string
}

export function CtaBand({
  settings,
  buttonLabel = 'Request a quote',
  buttonHref = '/contact?type=project',
  headlineLine1 = 'Let’s talk about',
  headlineLine2 = 'your site',
  imageSrc,
  imageAlt,
}: CtaBandProps = {}) {
  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'

  const imgSrc =
    imageSrc ||
    (settings?.ctaImage?.url ? settings.ctaImage.url : null) ||
    '/media/cta-site.jpg'

  const imgAlt =
    imageAlt ||
    settings?.ctaImage?.alt ||
    'People and machines on a Shena road site'

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
            <h2 className="d" id="cta-h">
              {headlineLine1}{' '}
              <strong>{headlineLine2}</strong>
            </h2>
            <Link className="btn pri" href={buttonHref}>
              {buttonLabel}
            </Link>
          </div>
        </div>
        <aside className="cta-card">
          <div className="box">
            <p className="over">Talk to us</p>
            <h3 className="h4">Call or WhatsApp</h3>
            <p className="num">{phoneDisplay}</p>
            <div className="btns">
              <a className="btn sec" href={`tel:${phoneE164.replace(/[\s-]/g, '')}`}>
                Call
              </a>
              <a
                className="btn outl"
                href={`https://wa.me/${whatsappNumber.replace(/[\s+-]/g, '')}?text=${encodeURIComponent(
                  'Hello Shena Works, I found you on your website and would like to talk about a project.'
                )}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
