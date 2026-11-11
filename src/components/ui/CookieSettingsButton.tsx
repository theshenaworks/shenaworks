'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'

export function CookieSettingsButton() {
  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shena:open-cookie-banner'))
    }
  }

  return (
    <Button variant="secondary" onClick={openCookieSettings}>
      Change cookie settings
    </Button>
  )
}
