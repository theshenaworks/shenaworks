'use client'

import React from 'react'
import { trackEvent } from '@/lib/analytics'

export interface PhoneLinkProps {
  phoneE164: string
  phoneDisplay: string
  location?: string
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function PhoneLink({
  phoneE164,
  phoneDisplay,
  location,
  className = 'u-draw font-bold',
  children,
  onClick,
}: PhoneLinkProps) {
  const handleClick = () => {
    trackEvent('call_click', { location, phone: phoneE164 })
    onClick?.()
  }

  return (
    <a href={`tel:${phoneE164}`} onClick={handleClick} className={className}>
      {children || phoneDisplay}
    </a>
  )
}
