'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildWhatsAppUrl, type WhatsAppMessageContext } from '@/lib/whatsapp'

export interface MobileActionBarClientProps {
  phoneDisplay?: string
  phoneE164?: string
  whatsappNumber?: string
  email?: string
}

export function MobileActionBarClient({
  phoneDisplay = '+254 718 971 896',
  phoneE164 = '+254718971896',
  whatsappNumber = '254718971896',
  email = 'shenaworksltd@gmail.com',
}: MobileActionBarClientProps) {
  const pathname = usePathname() || '/'

  // Hidden on thank-you per SITE-PLAN.md 4.4
  if (pathname === '/thank-you') {
    return null
  }

  const isContactPage = pathname === '/contact'
  const isEquipmentRoute = pathname.startsWith('/equipment')
  const isServiceRoute = pathname.startsWith('/services')
  const isProjectRoute = pathname.startsWith('/projects')

  // Contextual WhatsApp Message
  let waContext: WhatsAppMessageContext = { type: 'default' }
  if (isContactPage) {
    waContext = { type: 'contact' }
  } else if (isEquipmentRoute) {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length >= 3) {
      // /equipment/[category]/[slug]
      waContext = {
        type: 'machine',
        machineName: parts[2].replace(/-/g, ' '),
        make: 'Fleet',
        model: 'Standard',
      }
    } else if (parts.length === 2) {
      // /equipment/[category]
      waContext = { type: 'equipment', categoryName: parts[1].replace(/-/g, ' ') }
    } else {
      waContext = { type: 'equipment' }
    }
  } else if (isServiceRoute) {
    const parts = pathname.split('/').filter(Boolean)
    const serviceSlug = parts[parts.length - 1] || 'construction'
    waContext = { type: 'service', serviceTitle: serviceSlug.replace(/-/g, ' ') }
  } else if (isProjectRoute) {
    const parts = pathname.split('/').filter(Boolean)
    const projectSlug = parts[1] || 'work'
    waContext = { type: 'project', projectTitle: projectSlug.replace(/-/g, ' ') }
  }

  const waUrl = buildWhatsAppUrl(waContext, whatsappNumber)

  // Third cell logic (SITE-PLAN.md 4.4)
  let cell3Node: React.ReactNode

  if (isContactPage) {
    // On /contact: replace Quote with "Email us" (SITE-PLAN.md 4.4)
    cell3Node = (
      <a href={`mailto:${email}`} className="pri">
        Email us
      </a>
    )
  } else if (isEquipmentRoute) {
    const parts = pathname.split('/').filter(Boolean)
    const machineSlug = parts.length >= 3 ? parts[2] : undefined
    const hireHref = machineSlug
      ? `/contact?type=hire&equipment=${machineSlug}`
      : '/contact?type=hire'
    cell3Node = (
      <Link href={hireHref} className="pri">
        Request hire
      </Link>
    )
  } else if (isServiceRoute) {
    const parts = pathname.split('/').filter(Boolean)
    const serviceSlug = parts[parts.length - 1]
    const quoteHref = serviceSlug
      ? `/contact?type=project&service=${serviceSlug}`
      : '/contact?type=project'
    cell3Node = (
      <Link href={quoteHref} className="pri">
        Request a quote
      </Link>
    )
  } else {
    cell3Node = (
      <Link href="/contact?type=project" className="pri">
        Request a quote
      </Link>
    )
  }

  return (
    <nav aria-label="Quick actions" className="actions">
      {/* Cell 1: Call */}
      <a href={`tel:${phoneE164}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--accent)' }}
          aria-hidden="true"
        >
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
        <span>Call</span>
      </a>

      {/* Cell 2: WhatsApp */}
      <a href={waUrl} target="_blank" rel="noopener noreferrer">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: '#25d366' }}
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
        </svg>
        <span>WhatsApp</span>
      </a>

      {/* Cell 3: Contextual Action */}
      {cell3Node}
    </nav>
  )
}
