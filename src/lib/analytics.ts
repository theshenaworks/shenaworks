'use client'

export type AnalyticsEventName =
  | 'quote_submit'
  | 'hire_submit'
  | 'whatsapp_click'
  | 'call_click'
  | 'email_click'
  | 'file_download'
  | 'cta_click'
  | 'form_start'
  | 'form_error'
  | 'filter_use'
  | 'share'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split('; ').some((row) => row === 'sw_consent=analytics')
}

export function trackEvent(
  event: AnalyticsEventName,
  params: Record<string, string | number | boolean | undefined> = {},
): void {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}
