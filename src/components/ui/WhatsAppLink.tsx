'use client'

import React from 'react'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, type WhatsAppMessageContext } from '@/lib/whatsapp'

export interface WhatsAppLinkProps {
  phoneDigits: string
  context?: WhatsAppMessageContext
  location?: string
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function WhatsAppLink({
  phoneDigits,
  context = { type: 'default' },
  location,
  className = 'u-draw font-bold',
  children,
  onClick,
}: WhatsAppLinkProps) {
  const url = buildWhatsAppUrl(context, phoneDigits)

  const handleClick = () => {
    trackEvent('whatsapp_click', { location })
    onClick?.()
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children || 'WhatsApp us'}
    </a>
  )
}
