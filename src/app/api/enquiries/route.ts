import { NextRequest, NextResponse } from 'next/server'
import { enquirySchema } from '@/lib/validation/enquiry'
import { siteSettingsSeed } from '@/seed/data'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const ipHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (ipHits.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent)
    return true
  }
  recent.push(now)
  ipHits.set(ip, recent)
  return false
}

function generateReference(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `SW-${year}-${rand}`
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: `You've sent several enquiries in a short time. Please wait a few minutes or call us on ${siteSettingsSeed.contact.phoneDisplay}.`,
      },
      { status: 429 },
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 })
  }

  // Honeypot check
  const honeypot = String(formData.get('company_website') ?? '')
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true, redirectUrl: '/thank-you' }, { status: 200 })
  }

  // Validate file attachments if present
  const files = formData
    .getAll('files')
    .filter((f): f is File => f instanceof File && f.size > 0)

  if (files.length > 3) {
    return NextResponse.json({ error: 'You can attach up to 3 files' }, { status: 400 })
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `${file.name} is larger than 10 MB` },
        { status: 400 },
      )
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `${file.name} must be a PDF, JPG, PNG or WEBP` },
        { status: 400 },
      )
    }
  }

  const rawPayload = {
    type: String(formData.get('type') ?? 'project'),
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    organisation: String(formData.get('organisation') ?? ''),
    service: String(formData.get('service') ?? ''),
    equipment: String(formData.get('equipment') ?? ''),
    hireStart: String(formData.get('hireStart') ?? ''),
    hireDuration: String(formData.get('hireDuration') ?? ''),
    location: String(formData.get('location') ?? ''),
    budgetBand: String(formData.get('budgetBand') ?? ''),
    timeline: String(formData.get('timeline') ?? ''),
    message: String(formData.get('message') ?? ''),
    consent:
      formData.get('consent') === 'true' || formData.get('consent') === 'on'
        ? (true as const)
        : (false as unknown as true),
    company_website: '',
    sourcePage: String(formData.get('sourcePage') ?? '/contact'),
  }

  const parsed = enquirySchema.safeParse(rawPayload)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Please check the form fields.'
    return NextResponse.json({ error: firstIssue, issues: parsed.error.issues }, { status: 400 })
  }

  const reference = generateReference()
  const redirectUrl = `/thank-you?type=${encodeURIComponent(parsed.data.type)}`

  const acceptsJson = req.headers.get('accept')?.includes('application/json')
  const response = acceptsJson
    ? NextResponse.json({ ok: true, reference, redirectUrl }, { status: 200 })
    : NextResponse.redirect(new URL(redirectUrl, req.url), 303)

  response.cookies.set('sw_enquiry_ref', reference, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/thank-you',
    maxAge: 600, // 10 minutes
  })

  return response
}
