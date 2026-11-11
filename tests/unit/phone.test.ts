import { describe, expect, it } from 'vitest'
import { enquirySchema, normalizeKenyanPhone } from '@/lib/validation/enquiry'

describe('normalizeKenyanPhone', () => {
  it('normalizes local 07xx and 01xx numbers to +254 E.164', () => {
    expect(normalizeKenyanPhone('0718 971 896')).toBe('+254718971896')
    expect(normalizeKenyanPhone('0712-345-678')).toBe('+254712345678')
    expect(normalizeKenyanPhone('0110 123 456')).toBe('+254110123456')
  })

  it('normalizes +254 and 254 numbers', () => {
    expect(normalizeKenyanPhone('+254 718 971 896')).toBe('+254718971896')
    expect(normalizeKenyanPhone('254718971896')).toBe('+254718971896')
    expect(normalizeKenyanPhone('+254 0718 971 896')).toBe('+254718971896')
  })

  it('accepts valid international E.164 numbers starting with +', () => {
    expect(normalizeKenyanPhone('+44 7911 123456')).toBe('+447911123456')
    expect(normalizeKenyanPhone('+1 415 555 2671')).toBe('+14155552671')
  })

  it('rejects invalid phone numbers', () => {
    expect(normalizeKenyanPhone('12345')).toBeNull()
    expect(normalizeKenyanPhone('071897189')).toBeNull() // 9 digits
    expect(normalizeKenyanPhone('abc')).toBeNull()
  })
})

describe('enquirySchema', () => {
  it('validates a complete project enquiry', () => {
    const parsed = enquirySchema.safeParse({
      type: 'project',
      name: 'Jane Wanjiru',
      phone: '0712 345 678',
      email: 'jane@example.com',
      service: 'road-construction-and-earthworks',
      location: 'Makutano, Meru',
      message: 'We need a 1,200 m² cabro compound and storm drain.',
      consent: true,
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.phone).toBe('+254712345678')
    }
  })

  it('validates a complete equipment hire enquiry without requiring message', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    const parsed = enquirySchema.safeParse({
      type: 'hire',
      name: 'Peter Mutua',
      phone: '+254 718 971 896',
      equipment: 'crawler-excavator',
      hireStart: tomorrow,
      hireDuration: '1–2 weeks',
      location: 'Nkubu, Meru',
      consent: true,
    })
    expect(parsed.success).toBe(true)
  })
})
