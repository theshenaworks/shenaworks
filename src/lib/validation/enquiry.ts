import { z } from 'zod'

/**
 * Normalizes Kenyan mobile & landline numbers into E.164 format (+2547xxxxxxxx / +2541xxxxxxxx)
 * or validates international E.164 numbers starting with '+'.
 * Returns null if invalid.
 */
export function normalizeKenyanPhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-().]/g, '')
  if (!cleaned) return null

  // Kenyan local mobile: 07xxxxxxxx or 01xxxxxxxx (10 digits)
  if (/^0[17]\d{8}$/.test(cleaned)) {
    return `+254${cleaned.slice(1)}`
  }

  // Kenyan without leading +: 2547xxxxxxxx or 2541xxxxxxxx (12 digits)
  if (/^254[17]\d{8}$/.test(cleaned)) {
    return `+${cleaned}`
  }

  // Kenyan with leading +25407... or +25401...
  if (/^\+2540[17]\d{8}$/.test(cleaned)) {
    return `+254${cleaned.slice(5)}`
  }

  // Kenyan E.164: +2547xxxxxxxx or +2541xxxxxxxx
  if (/^\+254[17]\d{8}$/.test(cleaned)) {
    return cleaned
  }

  // International E.164 starting with + (non-+254): + followed by 8 to 15 digits
  if (/^\+[1-9]\d{7,14}$/.test(cleaned) && !cleaned.startsWith('+254')) {
    return cleaned
  }

  return null
}

export const enquiryTypeSchema = z.enum(['project', 'hire', 'consultation', 'other'])
export type EnquiryType = z.infer<typeof enquiryTypeSchema>

export const enquirySchema = z
  .object({
    type: enquiryTypeSchema,
    name: z
      .string()
      .trim()
      .min(2, 'Enter your name')
      .max(80, 'Name must be 80 characters or fewer'),
    phone: z
      .string()
      .trim()
      .min(1, 'Enter a phone number we can reach you on')
      .transform((val, ctx) => {
        const normalized = normalizeKenyanPhone(val)
        if (!normalized) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Enter a phone number like 0712 345 678 or +254 712 345 678',
          })
          return z.NEVER
        }
        return normalized
      }),
    email: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'Enter an email address like name@example.com',
      }),
    organisation: z
      .string()
      .trim()
      .max(120, 'Organisation must be 120 characters or fewer')
      .optional()
      .or(z.literal('')),
    service: z.string().trim().optional().or(z.literal('')),
    equipment: z.string().trim().optional().or(z.literal('')),
    hireStart: z.string().trim().optional().or(z.literal('')),
    hireDuration: z.string().trim().optional().or(z.literal('')),
    location: z.string().trim().optional().or(z.literal('')),
    budgetBand: z.string().trim().optional().or(z.literal('')),
    timeline: z.string().trim().optional().or(z.literal('')),
    message: z.string().trim().optional().or(z.literal('')),
    consent: z.literal(true, {
      errorMap: () => ({
        message: 'Tick the box to agree to how we use your details',
      }),
    }),
    company_website: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
    sourcePage: z.string().optional(),
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    gclid: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'project' || data.type === 'consultation') {
      if (!data.service) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['service'],
          message: 'Choose a service',
        })
      }
    }

    if (data.type === 'hire') {
      if (!data.equipment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['equipment'],
          message: 'Choose a machine',
        })
      }
      if (!data.hireStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hireStart'],
          message: 'Choose a start date',
        })
      } else {
        const today = new Date().toISOString().slice(0, 10)
        if (data.hireStart < today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['hireStart'],
            message: 'Choose a start date today or later',
          })
        }
      }
      if (!data.hireDuration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hireDuration'],
          message: 'Choose how long you need the machine',
        })
      }
    }

    if (data.type === 'project' || data.type === 'hire') {
      if (!data.location || data.location.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['location'],
          message: 'Enter the site location',
        })
      }
    }

    if (data.type === 'project' || data.type === 'consultation' || data.type === 'other') {
      if (!data.message || data.message.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['message'],
          message: 'Tell us a little about the project',
        })
      }
    }
  })

export type ValidatedEnquiry = z.infer<typeof enquirySchema>
