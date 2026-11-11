'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import type { MediaItem } from '@/types/content'

const DEFAULT_IMAGE: MediaItem = {
  url: '/media/hero-aerial-road.svg',
  alt: 'Aerial perspective of a civil road construction project by Shena Works',
  caption: 'Civil road construction and earthworks across Kenya.',
}

export interface CtaBandProps {
  headlineLine1?: string
  headlineLine2?: string
  buttonLabel?: string
  buttonHref?: string
  image?: MediaItem
  phoneE164?: string
  phoneDisplay?: string
  whatsappNumber?: string
  officeHours?: string
}

export function CtaBand({
  headlineLine1 = "Let's talk about",
  headlineLine2 = 'your site',
  buttonLabel = 'Request a quote',
  buttonHref = '/contact?type=project',
  image = DEFAULT_IMAGE,
  phoneE164 = '+254718971896',
  phoneDisplay = '+254 718 971 896',
  whatsappNumber = '254718971896',
  officeHours = 'Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm',
}: CtaBandProps) {
  const whatsappUrl = buildWhatsAppUrl({ type: 'default' }, whatsappNumber)

  return (
    <section className="bg-[var(--white)] py-[8.0rem] lg:py-[12.0rem]">
      <div className="site-grid items-center">
        {/* Left photo panel (col 1-11 at lg) */}
        <div
          data-surface="photo"
          className="col-span-4 lg:col-start-1 lg:col-span-11 lg:row-start-1 relative min-h-[36.0rem] lg:min-h-[48.0rem] flex items-end overflow-hidden bg-[var(--ink-900)] text-[var(--white)] p-[2.4rem] lg:p-[5.6rem]"
        >
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'var(--gradient-photo)' }}
          />
          <div className="relative z-10">
            <h2 className="text-display text-[var(--white)] mb-[2.4rem]">
              {headlineLine1} <br className="hidden md:inline" />
              {headlineLine2}
            </h2>
            <Button
              href={buttonHref}
              variant="primary"
              onClick={() => trackEvent('cta_click', { cta_id: 'ctaband_quote' })}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>

        {/* Right overlapping card (col 12-4 at lg) */}
        <div
          data-surface="subtle"
          className="col-span-4 lg:col-start-12 lg:col-span-4 lg:row-start-1 z-20 bg-[var(--grey-100)] lg:bg-[var(--white)] lg:shadow-[var(--shadow-1)] lg:border lg:border-[var(--grey-300)] p-[2.4rem] lg:p-[4.0rem]"
        >
          <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">Talk to us</p>
          <h3 className="text-h4 text-[var(--ink-900)] mb-[1.2rem]">Call or WhatsApp</h3>
          <p className="text-body font-bold text-[var(--ink-900)] mb-[0.4rem]">{phoneDisplay}</p>
          {officeHours && (
            <p className="text-body-xs text-[var(--ink-600)] mb-[2.4rem]">{officeHours}</p>
          )}
          <div className="flex flex-wrap items-center gap-[0.8rem]">
            <Button
              href={`tel:${phoneE164}`}
              variant="secondary"
              onClick={() => trackEvent('call_click', { location: 'cta_band' })}
            >
              Call
            </Button>
            <Button
              href={whatsappUrl}
              external
              variant="outline"
              onClick={() => trackEvent('whatsapp_click', { location: 'cta_band' })}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
