'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './Button'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasCookie = document.cookie
      .split('; ')
      .some((row) => row.startsWith('sw_consent='))
    if (!hasCookie) {
      setVisible(true)
    }

    const onOpen = () => setVisible(true)
    window.addEventListener('shena:open-cookie-banner', onOpen)
    return () => window.removeEventListener('shena:open-cookie-banner', onOpen)
  }, [])

  const setConsent = (choice: 'analytics' | 'essential') => {
    const maxAge = 60 * 60 * 24 * 365 // 12 months
    document.cookie = `sw_consent=${choice}; path=/; max-age=${maxAge}; SameSite=Lax`

    if (choice === 'essential') {
      // Remove any existing _ga cookies if switching to essential only (CONTENT.md 11.2)
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0]?.trim()
        if (name && (name === '_ga' || name.startsWith('_ga_'))) {
          document.cookie = `${name}=; path=/; max-age=0`
        }
      })
    }

    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-[5.6rem] lg:bottom-0 z-[60] bg-[var(--white)] border-t-2 border-[var(--ink-900)] shadow-[var(--shadow-2)] py-[2.4rem]"
    >
      <div className="site-grid items-center gap-y-[1.6rem]">
        <div className="col-span-4 lg:col-start-2 lg:col-span-9">
          <p className="text-body font-bold text-[var(--ink-900)] mb-[0.4rem]">
            Cookies on this site
          </p>
          <p className="text-body-sm text-[var(--ink-600)]">
            We use essential cookies to make this site work. With your permission we&apos;d also
            like to use analytics cookies (Google Analytics) to understand which pages help
            visitors. You can change your choice at any time from &ldquo;Cookie settings&rdquo; in
            the footer.{' '}
            <a href="/cookies" className="font-bold text-[var(--ink-900)] underline">
              Read our cookie notice
            </a>
            .
          </p>
        </div>

        <div className="col-span-4 lg:col-start-11 lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-[0.8rem]">
          <Button variant="secondary" onClick={() => setConsent('analytics')}>
            Accept analytics
          </Button>
          <Button variant="outline" onClick={() => setConsent('essential')}>
            Essential only
          </Button>
        </div>
      </div>
    </aside>
  )
}
