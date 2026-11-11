'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export interface ThankYouTrackerProps {
  enquiry: {
    ref?: string
    type?: string
    service?: string
    equipment?: string
    sourcePage?: string
  } | null
}

export function ThankYouTracker({ enquiry }: ThankYouTrackerProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!enquiry || !enquiry.ref || firedRef.current) return
    firedRef.current = true

    const eventName = enquiry.type === 'hire' ? 'hire_submit' : 'quote_submit'
    trackEvent(eventName, {
      reference: enquiry.ref,
      type: enquiry.type,
      service: enquiry.service,
      equipment: enquiry.equipment,
      source_page: enquiry.sourcePage,
    })
  }, [enquiry])

  return null
}
