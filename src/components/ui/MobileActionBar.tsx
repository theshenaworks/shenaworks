'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'
import { buildWhatsAppUrl, type WhatsAppMessageContext } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

export interface MobileActionBarProps {
  phoneE164: string
  whatsappNumber: string
  email: string
}

function getActionSpec(pathname: string): {
  label: string
  href: string
  waContext: WhatsAppMessageContext
  isEmail?: boolean
} {
  if (pathname === '/contact') {
    return {
      label: 'Email us',
      href: 'mailto:shenaworksltd@gmail.com',
      waContext: { type: 'contact' },
      isEmail: true,
    }
  }
  if (pathname.startsWith('/equipment')) {
    const parts = pathname.split('/').filter(Boolean)
    const slug = parts.length === 3 ? parts[2] : undefined
    return {
      label: 'Request hire',
      href: slug ? `/contact?type=hire&equipment=${slug}` : '/contact?type=hire',
      waContext: { type: 'equipment' },
    }
  }
  if (
    pathname === '/services/interior-design' ||
    pathname === '/services/project-management'
  ) {
    const slug = pathname.split('/').pop() || ''
    return {
      label: 'Book a consultation',
      href: `/contact?type=consultation&service=${slug}`,
      waContext: { type: 'service', serviceTitle: slug.replace(/-/g, ' ') },
    }
  }
  if (pathname.startsWith('/services/')) {
    const slug = pathname.split('/').pop() || ''
    return {
      label: 'Request a quote',
      href: `/contact?type=project&service=${slug}`,
      waContext: { type: 'service', serviceTitle: slug.replace(/-/g, ' ') },
    }
  }
  return {
    label: 'Request a quote',
    href: '/contact?type=project',
    waContext: { type: 'default' },
  }
}

export function MobileActionBar({ phoneE164, whatsappNumber, email }: MobileActionBarProps) {
  const pathname = usePathname() || '/'
  const [hiddenByOverlayOrFocus, setHiddenByOverlayOrFocus] = useState(false)

  useEffect(() => {
    const checkState = () => {
      const drawerOpen = document.documentElement.hasAttribute('data-drawer-open')
      const dialogOpen = document.querySelector('dialog[open]') !== null
      const active = document.activeElement
      const inputFocused =
        active instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)
      setHiddenByOverlayOrFocus(drawerOpen || dialogOpen || inputFocused)
    }

    const observer = new MutationObserver(checkState)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-drawer-open'],
    })

    window.addEventListener('focusin', checkState)
    window.addEventListener('focusout', checkState)
    return () => {
      observer.disconnect()
      window.removeEventListener('focusin', checkState)
      window.removeEventListener('focusout', checkState)
    }
  }, [])

  if (pathname === '/thank-you') return null

  const spec = getActionSpec(pathname)
  const whatsappUrl = buildWhatsAppUrl(spec.waContext, whatsappNumber)

  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-0 bottom-0 z-[20] bg-[var(--white)] border-t border-[var(--grey-300)] shadow-[var(--shadow-1)] pb-[env(safe-area-inset-bottom)] transition-transform duration-200 lg:hidden ${
        hiddenByOverlayOrFocus ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="grid grid-cols-3 h-[5.6rem]">
        <a
          href={`tel:${phoneE164}`}
          onClick={() => trackEvent('call_click', { location: 'action_bar' })}
          className="flex items-center justify-center gap-[0.8rem] text-label text-[var(--ink-900)] no-underline border-r border-[var(--grey-300)] active:bg-[var(--grey-300)]"
        >
          <Icon name="phone" size={18} />
          <span>Call</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'action_bar' })}
          className="flex items-center justify-center gap-[0.8rem] text-label text-[var(--ink-900)] no-underline border-r border-[var(--grey-300)] active:bg-[var(--grey-300)]"
        >
          <Icon name="whatsapp" size={18} />
          <span>WhatsApp</span>
        </a>

        <a
          href={spec.isEmail ? `mailto:${email}` : spec.href}
          onClick={() => {
            if (spec.isEmail) {
              trackEvent('email_click', { location: 'action_bar' })
            } else {
              trackEvent('cta_click', { cta_id: 'action_bar_quote' })
            }
          }}
          className="button button--primary h-full w-full justify-center px-[0.8rem] text-center"
        >
          <span className="truncate">{spec.label}</span>
        </a>
      </div>
    </nav>
  )
}
