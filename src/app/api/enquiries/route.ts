import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
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

async function verifyTurnstile(
  token: string,
  remoteIp: string,
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    // If no secret key is configured, allow in development/testing
    return { success: true }
  }

  // Allow test mock token in development or test runs
  const isDevOrTest =
    process.env.NODE_ENV !== 'production' ||
    process.env.CI === 'true' ||
    remoteIp.includes('127.0.0.1') ||
    remoteIp.includes('::1') ||
    remoteIp === 'localhost'

  if (isDevOrTest && (token === 'managed-pass' || !token)) {
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'Please complete the security verification challenge.' }
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: remoteIp,
      }),
    })

    const outcome = await res.json()
    if (!outcome.success) {
      return { success: false, error: 'Security challenge failed. Please try again.' }
    }
    return { success: true }
  } catch (err) {
    console.error('[enquiries] Turnstile siteverify request error:', err)
    // Fall back gracefully if Cloudflare endpoint is unreachable
    return { success: true }
  }
}

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

  // Turnstile security challenge verification
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '')
  const turnstileResult = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileResult.success) {
    return NextResponse.json(
      { error: turnstileResult.error || 'Security verification failed.' },
      { status: 400 },
    )
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

  // 1. Persist to Payload CMS & Cloudflare R2 (NeonDB)
  const attachmentIds: (number | string)[] = []
  if (process.env.DATABASE_URI) {
    try {
      const payload = await getPayload({ config })

      // Upload file attachments to enquiry-attachments collection
      for (const file of files) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer())
          const attachment = await payload.create({
            collection: 'enquiry-attachments',
            overrideAccess: true,
            file: {
              data: buffer,
              name: file.name,
              mimetype: file.type,
              size: file.size,
            },
            data: {
              enquiryReference: reference,
            },
          })
          attachmentIds.push(attachment.id)
        } catch (uploadErr) {
          console.error('[enquiries] Failed to store file attachment in R2/Payload:', uploadErr)
        }
      }

      // Create enquiry document
      await payload.create({
        collection: 'enquiries',
        overrideAccess: true,
        data: {
          reference,
          type: parsed.data.type,
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: parsed.data.email || undefined,
          organisation: parsed.data.organisation || undefined,
          service: parsed.data.service || undefined,
          equipment: parsed.data.equipment || undefined,
          hireStart: parsed.data.hireStart ? new Date(parsed.data.hireStart).toISOString() : undefined,
          hireDuration: parsed.data.hireDuration || undefined,
          location: parsed.data.location || undefined,
          budgetBand: parsed.data.budgetBand || undefined,
          timeline: parsed.data.timeline || undefined,
          message: parsed.data.message || undefined,
          attachments: attachmentIds.length > 0 ? (attachmentIds as any) : undefined,
          consentAcceptedAt: new Date().toISOString(),
          sourcePage: parsed.data.sourcePage || '/contact',
          status: 'new',
        },
      })
    } catch (dbErr) {
      console.error('[enquiries] Database save error:', dbErr)
    }
  }

  // 2. Email Notification via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const recipient = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'theshenaworks@gmail.com'
      const from = process.env.ENQUIRY_FROM_EMAIL || 'Shena Works <onboarding@resend.dev>'
      await resend.emails.send({
        from,
        to: recipient,
        subject: `[${reference}] New ${parsed.data.type.toUpperCase()} enquiry: ${parsed.data.name}`,
        html: `
          <h2>New Shena Works Enquiry: ${reference}</h2>
          <p><strong>Type:</strong> ${parsed.data.type}</p>
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Phone:</strong> ${parsed.data.phone}</p>
          ${parsed.data.email ? `<p><strong>Email:</strong> ${parsed.data.email}</p>` : ''}
          ${parsed.data.organisation ? `<p><strong>Organisation:</strong> ${parsed.data.organisation}</p>` : ''}
          ${parsed.data.service ? `<p><strong>Service:</strong> ${parsed.data.service}</p>` : ''}
          ${parsed.data.equipment ? `<p><strong>Equipment:</strong> ${parsed.data.equipment}</p>` : ''}
          ${parsed.data.hireStart ? `<p><strong>Start Date:</strong> ${parsed.data.hireStart}</p>` : ''}
          ${parsed.data.hireDuration ? `<p><strong>Duration:</strong> ${parsed.data.hireDuration}</p>` : ''}
          ${parsed.data.location ? `<p><strong>Location:</strong> ${parsed.data.location}</p>` : ''}
          ${parsed.data.budgetBand ? `<p><strong>Budget:</strong> ${parsed.data.budgetBand}</p>` : ''}
          ${parsed.data.timeline ? `<p><strong>Timeline:</strong> ${parsed.data.timeline}</p>` : ''}
          ${parsed.data.message ? `<p><strong>Message:</strong><br/>${parsed.data.message.replace(/\n/g, '<br/>')}</p>` : ''}
          <p><strong>Files:</strong> ${files.length} attached</p>
          <p><strong>Source Page:</strong> ${parsed.data.sourcePage}</p>
        `,
      })
    } catch (emailErr) {
      console.error('[enquiries] Resend email notification error:', emailErr)
    }
  }

  // 3. Telegram Notification
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const messageLines = [
        `*New Shena Works Enquiry*`,
        `*Ref:* \`${reference}\``,
        `*Type:* ${parsed.data.type}`,
        `*Name:* ${parsed.data.name}`,
        `*Phone:* ${parsed.data.phone}`,
        parsed.data.email ? `*Email:* ${parsed.data.email}` : null,
        parsed.data.service ? `*Service:* ${parsed.data.service}` : null,
        parsed.data.equipment ? `*Machine:* ${parsed.data.equipment}` : null,
        parsed.data.location ? `*Location:* ${parsed.data.location}` : null,
        parsed.data.message ? `*Message:* ${parsed.data.message}` : null,
        files.length > 0 ? `*Attachments:* ${files.length} file(s)` : null,
      ]
        .filter(Boolean)
        .join('\n')

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: messageLines,
          parse_mode: 'Markdown',
        }),
      })
    } catch (tgErr) {
      console.error('[enquiries] Telegram notification error:', tgErr)
    }
  }

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
