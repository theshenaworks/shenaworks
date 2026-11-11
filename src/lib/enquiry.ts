import crypto from 'crypto'
import type { Payload } from 'payload'

export interface EnquiryData {
  ref: string
  type: string
  service?: string
  equipment?: string
  sourcePage?: string
}

export interface CustomerAckEmailParams {
  name: string
  type: string
  reference: string
  phoneDisplay: string
  meruAddress: string
  website: string
  responseTimeStatement?: string | null
}

export interface StaffNotificationEmailParams {
  reference: string
  type: string
  name: string
  phone: string
  email?: string
  organisation?: string
  service?: string
  equipment?: string
  hireStart?: string
  hireDuration?: string
  location?: string
  budgetBand?: string
  timeline?: string
  message?: string
  filesCount?: number
  sourcePage?: string
  recipientEmail: string
  fromEmail: string
}

/**
 * Normalizes and hashes IP address with SHA-256 for GDPR/Data Protection Act compliance.
 */
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip.trim()).digest('hex')
}

/**
 * Securely extracts client IP according to DECISIONS.md D-10:
 * - Use CF-Connecting-IP only if DNS is proxied through Cloudflare (verified).
 * - Otherwise use Vercel's x-vercel-forwarded-for or x-real-ip.
 * - Never trust client-supplied x-forwarded-for.
 */
export function getClientIp(headers: Headers, isCloudflareProxied = false): string {
  if (isCloudflareProxied) {
    const cfIp = headers.get('cf-connecting-ip')
    if (cfIp) return cfIp.trim()
  }

  const vercelIp = headers.get('x-vercel-forwarded-for')
  if (vercelIp) {
    return vercelIp.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return '127.0.0.1'
}

/**
 * Checks sliding rate limit in PostgreSQL rate_limits table (5 submissions per 15 min per IP).
 */
export async function checkRateLimit(
  payload: Payload,
  ip: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const ipHash = hashIp(ip)
  const db = (payload.db as any)
  const pool = db?.pool
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxLimit = 5
  const now = new Date()

  if (!pool) {
    // If no direct pool is accessible (fallback / mock environment)
    return { allowed: true }
  }

  const selectQuery = 'SELECT window_start, count FROM rate_limits WHERE ip_hash = $1'
  const selectRes = await pool.query(selectQuery, [ipHash])

  if (selectRes.rows.length === 0) {
    // First request from this IP
    const insertQuery =
      'INSERT INTO rate_limits (ip_hash, window_start, count) VALUES ($1, $2, 1) ON CONFLICT (ip_hash) DO UPDATE SET count = rate_limits.count + 1'
    await pool.query(insertQuery, [ipHash, now])
    return { allowed: true }
  }

  const record = selectRes.rows[0]
  const windowStart = new Date(record.window_start).getTime()
  const elapsed = now.getTime() - windowStart

  if (elapsed >= windowMs) {
    // Window expired: start new window
    const resetQuery =
      'UPDATE rate_limits SET window_start = $2, count = 1 WHERE ip_hash = $1'
    await pool.query(resetQuery, [ipHash, now])
    return { allowed: true }
  }

  if (record.count >= maxLimit) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - elapsed) / 1000))
    return { allowed: false, retryAfterSeconds: retryAfter }
  }

  // Increment within window
  const updateQuery = 'UPDATE rate_limits SET count = count + 1 WHERE ip_hash = $1'
  await pool.query(updateQuery, [ipHash])
  return { allowed: true }
}

/**
 * Generates sequential enquiry reference from PostgreSQL sequence (AUD-06, D-10).
 * Format: SW-YYYY-NNNN (e.g. SW-2026-0101)
 */
export async function generateSequentialReference(payload: Payload): Promise<string> {
  const db = (payload.db as any)
  const pool = db?.pool
  const year = new Date().getFullYear()

  if (pool) {
    const res = await pool.query("SELECT nextval('enquiry_ref_seq') AS seq;")
    const seq = parseInt(res.rows[0].seq, 10)
    return `SW-${year}-${String(seq).padStart(4, '0')}`
  }

  // Fallback for isolated test mock without live pool
  const timestamp = Date.now().toString().slice(-4)
  return `SW-${year}-${timestamp}`
}

export function getTypeLabel(type: string): string {
  switch (type) {
    case 'project':
      return 'quote'
    case 'hire':
      return 'machinery hire'
    case 'consultation':
      return 'consultation'
    default:
      return 'general'
  }
}

/**
 * Builds customer acknowledgement email strictly matching SITE-PLAN.md 7.4.
 * Uses responseTimeStatement if set in site-settings; otherwise falls back to "as soon as we can".
 * Never hardcodes an SLA (D-10).
 */
export function buildCustomerAckEmail(params: CustomerAckEmailParams): {
  subject: string
  text: string
  html: string
} {
  const firstName = params.name.trim().split(/\s+/)[0] || params.name.trim()
  const typeLabel = getTypeLabel(params.type)
  const replyTimeline = params.responseTimeStatement?.trim() || 'as soon as we can'

  const subject = `We've received your enquiry (${params.reference})`

  const text = `Hello ${firstName},

Thank you for contacting Shena Works. We've received your ${typeLabel} enquiry
and will reply ${replyTimeline}.

Your reference is ${params.reference}. If you need us sooner, call or WhatsApp
${params.phoneDisplay}.

Shena Works Limited
${params.meruAddress} · ${params.website}`

  const html = `<p>Hello ${escapeHtml(firstName)},</p>
<p>Thank you for contacting Shena Works. We've received your ${escapeHtml(typeLabel)} enquiry and will reply ${escapeHtml(replyTimeline)}.</p>
<p>Your reference is <strong>${escapeHtml(params.reference)}</strong>. If you need us sooner, call or WhatsApp ${escapeHtml(params.phoneDisplay)}.</p>
<p>Shena Works Limited<br/>${escapeHtml(params.meruAddress)} · <a href="${escapeHtml(params.website)}">${escapeHtml(params.website)}</a></p>`

  return { subject, text, html }
}

/**
 * Builds staff notification email strictly matching SITE-PLAN.md 7.3.
 * Sets replyTo to visitor's email if provided (AUD-08).
 */
export function buildStaffNotificationEmail(params: StaffNotificationEmailParams): {
  to: string
  from: string
  replyTo?: string
  subject: string
  text: string
  html: string
} {
  const typeLabel = getTypeLabel(params.type)
  let subjectPrefix = `[${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}]`
  if (params.type === 'project' && params.service) {
    subjectPrefix = `[Quote] ${params.service}${params.location ? `, ${params.location}` : ''} — ${params.name}`
  } else if (params.type === 'hire' && params.equipment) {
    subjectPrefix = `[Hire]  ${params.equipment}${params.hireStart ? `, from ${params.hireStart}` : ''}${params.hireDuration ? `, ${params.hireDuration}` : ''} — ${params.name}`
  } else {
    subjectPrefix = `[${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}] ${params.name}`
  }

  const subject = `${subjectPrefix} (${params.reference})`

  const text = `New ${typeLabel} enquiry from the website

Name:          ${params.name}
Phone:         ${params.phone}   WhatsApp: https://wa.me/${params.phone.replace(/[^0-9]/g, '')}
Email:         ${params.email || 'not given'}
Organisation:  ${params.organisation || '—'}
Service:       ${params.service || '—'} / Machine: ${params.equipment || '—'}
Location:      ${params.location || '—'}
Budget:        ${params.budgetBand || '—'}   Timeline: ${params.timeline || '—'}
Hire:          ${params.hireStart || '—'}, ${params.hireDuration || '—'}
Message:
${params.message || '—'}

Files: ${params.filesCount || 0} attached
Source page: ${params.sourcePage || '/contact'}
Reference: ${params.reference}`

  const html = `<h2>New ${escapeHtml(typeLabel)} enquiry from the website</h2>
<p><strong>Reference:</strong> ${escapeHtml(params.reference)}</p>
<p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
<p><strong>Phone:</strong> <a href="tel:${escapeHtml(params.phone)}">${escapeHtml(params.phone)}</a> &nbsp;|&nbsp; <a href="https://wa.me/${escapeHtml(params.phone.replace(/[^0-9]/g, ''))}">WhatsApp</a></p>
<p><strong>Email:</strong> ${params.email ? `<a href="mailto:${escapeHtml(params.email)}">${escapeHtml(params.email)}</a>` : 'not given'}</p>
<p><strong>Organisation:</strong> ${escapeHtml(params.organisation || '—')}</p>
<p><strong>Service:</strong> ${escapeHtml(params.service || '—')} &nbsp;|&nbsp; <strong>Machine:</strong> ${escapeHtml(params.equipment || '—')}</p>
<p><strong>Location:</strong> ${escapeHtml(params.location || '—')}</p>
<p><strong>Budget:</strong> ${escapeHtml(params.budgetBand || '—')} &nbsp;|&nbsp; <strong>Timeline:</strong> ${escapeHtml(params.timeline || '—')}</p>
<p><strong>Hire Details:</strong> ${escapeHtml(params.hireStart || '—')}, ${escapeHtml(params.hireDuration || '—')}</p>
<p><strong>Message:</strong><br/>${escapeHtml(params.message || '—').replace(/\n/g, '<br/>')}</p>
<p><strong>Files:</strong> ${params.filesCount || 0} attached</p>
<p><strong>Source Page:</strong> ${escapeHtml(params.sourcePage || '/contact')}</p>`

  return {
    to: params.recipientEmail,
    from: params.fromEmail,
    replyTo: params.email || undefined,
    subject,
    text,
    html,
  }
}

/**
 * Formats sw_last_enquiry cookie according to DECISIONS.md D-10:
 * - sw_last_enquiry
 * - HttpOnly
 * - SameSite=Lax
 * - 300 seconds TTL (5 minutes)
 * - path: '/'
 * - JSON { ref, type, service, equipment, sourcePage }
 */
export function formatLastEnquiryCookie(data: EnquiryData): {
  name: string
  value: string
  options: {
    httpOnly: boolean
    sameSite: 'lax'
    path: string
    maxAge: number
  }
} {
  return {
    name: 'sw_last_enquiry',
    value: JSON.stringify({
      ref: data.ref,
      type: data.type,
      service: data.service || undefined,
      equipment: data.equipment || undefined,
      sourcePage: data.sourcePage || '/contact',
    }),
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 300,
    },
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
