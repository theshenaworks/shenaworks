export class PublishingGateError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'PublishingGateError'
    this.status = status
  }
}

const FORBIDDEN_SUPERLATIVES =
  /\b(premier|leading|best|world-class|exceptional|unrivalled|cutting-edge|seamless)\b/i

const GATED_SERVICE_SLUGS = new Set([
  'architecture-and-consultancy',
  'bills-of-quantities-and-estimating',
])

export interface PublishingGateArgs {
  data: Record<string, any>
  collection?: { slug: string }
  operation?: string
}

export async function enforcePublishingGate({
  data,
  collection,
}: PublishingGateArgs): Promise<Record<string, any>> {
  const isPublishing = data?._status === 'published'
  if (!isPublishing) return data

  const serialized = JSON.stringify(data)

  // 1. Never publish unconfirmed placeholders
  if (serialized.includes('[CONFIRM')) {
    throw new PublishingGateError(
      'Cannot publish while a field still contains a [CONFIRM: ...] placeholder.',
      400,
    )
  }

  // 2. Enforce voice rule: no banned superlatives
  if (FORBIDDEN_SUPERLATIVES.test(serialized)) {
    throw new PublishingGateError(
      'Copy contains a disallowed superlative (premier, leading, best, world-class, exceptional, unrivalled, cutting-edge, seamless). Use plain factual terms.',
      400,
    )
  }

  // 3. Collection-specific gates (SITE-PLAN.md section 2)
  switch (collection?.slug) {
    case 'credentials':
      if (!data.certificateFile || (!data.validUntil && !data.isPerpetual)) {
        throw new PublishingGateError(
          'Credentials require an uploaded certificate PDF and an expiry date before publishing.',
          400,
        )
      }
      break

    case 'testimonials':
      if (!data.permissionFile || !data.date || !data.person || !data.title) {
        throw new PublishingGateError(
          'Testimonials require written permission on file, person name, title and date before publishing.',
          400,
        )
      }
      break

    case 'projects':
      if (!data.role || !data.deliveringCompany || !data.verificationEvidenceNote) {
        throw new PublishingGateError(
          'Projects require Shena’s role, the delivering company, and completion/client evidence before publishing.',
          400,
        )
      }
      if (!Array.isArray(data.gallery) || data.gallery.length < 3) {
        throw new PublishingGateError(
          'Projects require at least 3 captioned real photographs.',
          400,
        )
      }
      break

    case 'services': {
      const isGatedService =
        Boolean(data.requiresRegistration) || GATED_SERVICE_SLUGS.has(String(data.slug ?? ''))
      const hasRegNumber = Boolean(data.registrationBodyAndNumber || data.boraqsOrEbkRegNumber)
      if (isGatedService && (!data.registeredProfessionalName || !hasRegNumber)) {
        throw new PublishingGateError(
          'This service requires a confirmed registered professional (EBK/BORAQS name and registration number) before publishing.',
          400,
        )
      }
      break
    }

    case 'team':
      if (
        (/\bEng\.?\b/i.test(String(data.name ?? '')) ||
          /\bCivil Engineer\b/i.test(String(data.role ?? ''))) &&
        !data.ebkRegNumber
      ) {
        throw new PublishingGateError(
          'Use of the title "Eng." or "Civil Engineer" requires an EBK registration number on file.',
          400,
        )
      }
      break
  }

  return data
}
