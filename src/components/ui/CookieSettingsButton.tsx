'use client'

import React from 'react'

export function CookieSettingsButton({
  className,
  children = 'Cookie settings',
}: {
  className?: string
  children?: React.ReactNode
}) {
  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shena:open-cookie-banner'))
    }
  }

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={
        className ||
        'text-[var(--grey-500)] hover:text-[var(--white)] underline transition-colors cursor-pointer text-left p-0 bg-transparent border-0'
      }
    >
      {children}
    </button>
  )
}
