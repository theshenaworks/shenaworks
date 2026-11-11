import { describe, expect, it } from 'vitest'
import { getPayloadClient } from '@/lib/payload'
import {
  generateSequentialReference,
  checkRateLimit,
  hashIp,
  buildCustomerAckEmail,
  buildStaffNotificationEmail,
  formatLastEnquiryCookie,
  getClientIp,
} from '@/lib/enquiry'

describe('Enquiry Pipeline (AUD-06 to AUD-11, D-10)', () => {
  it('generates sequential references from PostgreSQL sequence under concurrency (AUD-06)', async () => {
    const payload = await getPayloadClient()

    // Run 10 concurrent reference generations
    const refs = await Promise.all(
      Array.from({ length: 10 }).map(() => generateSequentialReference(payload)),
    )

    // All must match SW-YYYY-NNNN format
    const year = new Date().getFullYear()
    const regex = new RegExp(`^SW-${year}-\\d{4,}$`)
    for (const ref of refs) {
      expect(ref).toMatch(regex)
    }

    // All must be unique
    const unique = new Set(refs)
    expect(unique.size).toBe(10)

    // Numbers must be consecutive integers from sequence
    const numbers = refs.map((r) => parseInt(r.split('-')[2], 10))
    const sorted = numbers.slice().sort((a, b) => a - b)
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]).toBe(sorted[i - 1] + 1)
    }
  })

  it('enforces PostgreSQL database rate limiting: 5 per 15 min, 6th blocked (AUD-11)', async () => {
    const payload = await getPayloadClient()
    const testIp = `198.51.100.${Math.floor(Math.random() * 250) + 1}`

    // 5 attempts should succeed
    for (let i = 1; i <= 5; i++) {
      const result = await checkRateLimit(payload, testIp)
      expect(result.allowed).toBe(true)
    }

    // 6th attempt should be blocked
    const sixth = await checkRateLimit(payload, testIp)
    expect(sixth.allowed).toBe(false)
  })

  it('hashes client IP before storing in database (AUD-11)', () => {
    const ip = '203.0.113.195'
    const hash = hashIp(ip)
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    expect(hashIp(ip)).toBe(hash)
  })

  it('determines client IP according to proxy header rules (D-10)', () => {
    // 1. Untrusted client x-forwarded-for must not be used over real Vercel headers
    const vercelHeaders = new Headers({
      'x-vercel-forwarded-for': '198.51.100.42',
      'x-forwarded-for': '1.2.3.4, 5.6.7.8',
    })
    expect(getClientIp(vercelHeaders, false)).toBe('198.51.100.42')

    // 2. x-real-ip used if x-vercel-forwarded-for not present
    const realIpHeaders = new Headers({
      'x-real-ip': '198.51.100.99',
      'x-forwarded-for': '1.2.3.4',
    })
    expect(getClientIp(realIpHeaders, false)).toBe('198.51.100.99')

    // 3. CF-Connecting-IP used only when Cloudflare proxy is confirmed
    const cfHeaders = new Headers({
      'cf-connecting-ip': '198.51.100.77',
      'x-vercel-forwarded-for': '198.51.100.42',
    })
    expect(getClientIp(cfHeaders, true)).toBe('198.51.100.77')
    expect(getClientIp(cfHeaders, false)).toBe('198.51.100.42')
  })

  it('builds customer acknowledgement email with correct copy and fallback (AUD-07, D-10)', () => {
    // With responseTimeStatement
    const emailWithSla = buildCustomerAckEmail({
      name: 'Jane Wanjiru',
      type: 'project',
      reference: 'SW-2026-0142',
      phoneDisplay: '+254 718 971 896',
      meruAddress: 'Makutano, Meru County, Kenya',
      website: 'https://www.shenaworksltd.com',
      responseTimeStatement: 'within 2 business days',
    })

    expect(emailWithSla.subject).toBe("We've received your enquiry (SW-2026-0142)")
    expect(emailWithSla.text).toContain('Hello Jane,')
    expect(emailWithSla.text).toContain('will reply within 2 business days.')
    expect(emailWithSla.text).toContain('Your reference is SW-2026-0142.')

    // Without responseTimeStatement: must fall back to "as soon as we can", never hardcode SLA
    const emailFallback = buildCustomerAckEmail({
      name: 'Peter Mutua',
      type: 'hire',
      reference: 'SW-2026-0143',
      phoneDisplay: '+254 718 971 896',
      meruAddress: 'Makutano, Meru County, Kenya',
      website: 'https://www.shenaworksltd.com',
      responseTimeStatement: null,
    })

    expect(emailFallback.text).toContain('Hello Peter,')
    expect(emailFallback.text).toContain('will reply as soon as we can.')
    expect(emailFallback.text).not.toContain('within 24 hours')
  })

  it('sets Reply-To on staff notification email when customer provides email (AUD-08)', () => {
    const staffEmailWithCustomerEmail = buildStaffNotificationEmail({
      reference: 'SW-2026-0142',
      type: 'project',
      name: 'Jane Wanjiru',
      phone: '+254712345678',
      email: 'jane@example.com',
      recipientEmail: 'shenaworksltd@gmail.com',
      fromEmail: 'Shena Works <onboarding@resend.dev>',
    })
    expect(staffEmailWithCustomerEmail.replyTo).toBe('jane@example.com')

    const staffEmailWithoutCustomerEmail = buildStaffNotificationEmail({
      reference: 'SW-2026-0143',
      type: 'hire',
      name: 'Peter Mutua',
      phone: '+254712345678',
      email: undefined,
      recipientEmail: 'shenaworksltd@gmail.com',
      fromEmail: 'Shena Works <onboarding@resend.dev>',
    })
    expect(staffEmailWithoutCustomerEmail.replyTo).toBeUndefined()
  })

  it('formats sw_last_enquiry cookie according to exact specification (AUD-10, D-10)', () => {
    const cookie = formatLastEnquiryCookie({
      ref: 'SW-2026-0142',
      type: 'project',
      service: 'road-construction',
      equipment: undefined,
      sourcePage: '/services/road-construction',
    })

    expect(cookie.name).toBe('sw_last_enquiry')
    expect(cookie.options.httpOnly).toBe(true)
    expect(cookie.options.sameSite).toBe('lax')
    expect(cookie.options.path).toBe('/')
    expect(cookie.options.maxAge).toBe(300)

    const parsedValue = JSON.parse(cookie.value)
    expect(parsedValue.ref).toBe('SW-2026-0142')
    expect(parsedValue.type).toBe('project')
    expect(parsedValue.service).toBe('road-construction')
    expect(parsedValue.sourcePage).toBe('/services/road-construction')
  })
})
