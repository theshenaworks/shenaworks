'use client'

import { useEffect } from 'react'

export function AnalyticsLoader() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return

    const loadGaScript = () => {
      const hasConsent = document.cookie
        .split('; ')
        .some((row) => row === 'sw_consent=analytics')

      if (!hasConsent) return
      if (document.getElementById('ga4-script')) return

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', measurementId, {
        anonymize_ip: true,
      })

      const script = document.createElement('script')
      script.id = 'ga4-script'
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.async = true
      document.head.appendChild(script)
    }

    loadGaScript()

    const onConsentChanged = () => loadGaScript()
    window.addEventListener('shena:consent-changed', onConsentChanged)
    return () => window.removeEventListener('shena:consent-changed', onConsentChanged)
  }, [measurementId])

  return null
}
