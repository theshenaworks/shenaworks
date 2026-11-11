'use client'

import React from 'react'
import { Icon } from '@/components/ui/Icon'
import { buildWhatsAppUrl, type WhatsAppMessageContext } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import type { MediaItem } from '@/types/content'

const DEFAULT_PORTRAIT: MediaItem = {
  url: '/media/founder-newton-muthee.svg',
  alt: 'Newton M. Muthee, Founder and Managing Director of Shena Works Limited',
  caption: 'Newton Muthee, Founder and Managing Director',
}

export interface ContactAsideProps {
  waContext?: WhatsAppMessageContext
  contact?: {
    phoneE164: string
    phoneDisplay: string
    whatsappNumber: string
    email: string
  }
  person?: {
    name: string
    role: string
    portrait: MediaItem
  }
}

export function ContactAside({
  waContext = { type: 'default' },
  contact = {
    phoneE164: '+254718971896',
    phoneDisplay: '+254 718 971 896',
    whatsappNumber: '254718971896',
    email: 'shenaworksltd@gmail.com',
  },
  person = {
    name: 'Newton M. Muthee',
    role: 'Founder and Managing Director',
    portrait: DEFAULT_PORTRAIT,
  },
}: ContactAsideProps) {
  const { phoneE164, phoneDisplay, whatsappNumber, email } = contact
  const whatsappUrl = buildWhatsAppUrl(waContext, whatsappNumber)

  return (
    <aside
      data-surface="dark"
      className="bg-[var(--ink-900)] text-[var(--white)] p-[3.2rem] lg:p-[4.0rem] lg:sticky lg:top-[16.0rem]"
    >
      <div className="mb-[2.0rem] aspect-square w-[9.6rem] overflow-hidden bg-[var(--ink-800)]">
        <img
          src={person.portrait.url}
          alt={person.portrait.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-label text-[var(--white)] mb-[0.4rem]">{person.name}</p>
      <p className="text-body-xs text-[var(--grey-500)] mb-[2.4rem]">{person.role}</p>

      <ul className="space-y-[1.2rem] border-t border-[var(--ink-600)] pt-[2.0rem] text-body-sm">
        <li>
          <a
            href={`tel:${phoneE164}`}
            onClick={() => trackEvent('call_click', { location: 'inline' })}
            className="inline-flex items-center gap-[1.0rem] text-[var(--white)] no-underline u-draw"
          >
            <Icon name="phone" size={18} />
            <span>{phoneDisplay}</span>
          </a>
        </li>
        <li>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'inline' })}
            className="inline-flex items-center gap-[1.0rem] text-[var(--white)] no-underline u-draw"
          >
            <Icon name="whatsapp" size={18} />
            <span>WhatsApp us</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${email}`}
            onClick={() => trackEvent('email_click', { location: 'inline' })}
            className="inline-flex items-center gap-[1.0rem] text-[var(--white)] no-underline u-draw"
          >
            <Icon name="mail" size={18} />
            <span>{email}</span>
          </a>
        </li>
      </ul>
    </aside>
  )
}
