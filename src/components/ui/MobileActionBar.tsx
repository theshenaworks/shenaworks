import React from 'react'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'

/**
 * MobileActionBar (AGENTS.md Section 0 & Section 5 Phase A & D)
 * Server Component emitting reference DOM with dynamic Payload data and reference fallbacks.
 */
export async function MobileActionBar() {
  const settings = await getSiteSettings().catch(() => null)
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'

  return (
    <nav className="actions" aria-label="Quick actions">
      <a href={`tel:${phoneE164}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
        Call
      </a>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          'Hello Shena Works, I found you on your website and would like to talk about a project.'
        )}`}
        target="_blank"
        rel="noopener"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.300 1.200-1.800 1.200-.5.100-1 .2-3.300-.7-2.800-1.100-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .5l-.3.400-.4.400c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2 1.300 2.300 1.400.3.100.5.100.6-.1l.9-1.100c.2-.2.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.200.1.700-.1 1.200Z" />
        </svg>
        WhatsApp
      </a>
      <Link className="pri" href="/contact?type=project">
        Request a quote
      </Link>
    </nav>
  )
}
