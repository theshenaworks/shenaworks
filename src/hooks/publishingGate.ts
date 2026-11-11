import { APIError, type CollectionBeforeChangeHook, type GlobalBeforeChangeHook } from 'payload'

export { APIError, APIError as PublishingGateError }

export const FORBIDDEN_SUPERLATIVES =
  /\b(premier|leading|best|world-class|exceptional|unrivall?ed|cutting-edge|seamless)\b/i

const SKIP_FOR_VOICE = new Set([
  'id',
  'slug',
  'url',
  'filename',
  'mimeType',
  '_status',
  'createdAt',
  'updatedAt',
  'blockType',
  'blockName',
])

const GATED_SERVICE_SLUGS = new Set([
  'architecture-and-consultancy',
  'bills-of-quantities-and-estimating',
])

function walk(
  value: unknown,
  path: string,
  skipVoice: boolean,
  out: { path: string; text: string }[],
) {
  if (typeof value === 'string') {
    out.push({ path, text: value })
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, skipVoice, out))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (skipVoice && SKIP_FOR_VOICE.has(k)) continue
      walk(v, path ? `${path}.${k}` : k, skipVoice, out)
    }
  }
}

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const output = { ...(target ?? {}) }
  if (!source || typeof source !== 'object') return output
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      output[key] &&
      typeof output[key] === 'object' &&
      !Array.isArray(output[key])
    ) {
      output[key] = deepMerge(output[key], value)
    } else {
      output[key] = value
    }
  }
  return output
}

function collectionRules(slug: string, doc: Record<string, any>) {
  switch (slug) {
    case 'credentials':
      if (!doc.certificateFile || (!doc.validUntil && !doc.isPerpetual)) {
        throw new APIError(
          'Credentials require an uploaded certificate PDF and an expiry date before publishing.',
          400,
        )
      }
      break

    case 'testimonials':
      if (!doc.permissionFile || !doc.date || !doc.person || !doc.title) {
        throw new APIError(
          'Testimonials require written permission on file, person name, title and date before publishing.',
          400,
        )
      }
      break

    case 'projects':
      if (!doc.role || !doc.deliveringCompany || !doc.verificationEvidenceNote) {
        throw new APIError(
          'Projects require Shena’s role, the delivering company, and completion/client evidence before publishing.',
          400,
        )
      }
      if (!Array.isArray(doc.gallery) || doc.gallery.length < 3) {
        throw new APIError('Projects require at least 3 captioned real photographs.', 400)
      }
      break

    case 'services': {
      const isGatedService =
        Boolean(doc.requiresRegistration) || GATED_SERVICE_SLUGS.has(String(doc.slug ?? ''))
      const hasRegNumber = Boolean(doc.registrationBodyAndNumber || doc.boraqsOrEbkRegNumber)
      if (isGatedService && (!doc.registeredProfessionalName || !hasRegNumber)) {
        throw new APIError(
          'This service requires a confirmed registered professional (EBK/BORAQS name and registration number) before publishing.',
          400,
        )
      }
      break
    }

    case 'team':
      if (
        (/\bEng\.?\b/i.test(String(doc.name ?? '')) ||
          /\bCivil Engineer\b/i.test(String(doc.role ?? ''))) &&
        !doc.ebkRegNumber
      ) {
        throw new APIError(
          'Use of the title "Eng." or "Civil Engineer" requires an EBK registration number on file.',
          400,
        )
      }
      break

    case 'equipment':
      if (
        !doc.make ||
        !doc.model ||
        !doc.capacity ||
        !Array.isArray(doc.images) ||
        doc.images.length === 0
      ) {
        throw new APIError(
          'Equipment requires make, model, capacity and at least one image before publishing.',
          400,
        )
      }
      break
  }
}

export function assertPublishable(
  slug: string,
  data: Record<string, any> | undefined,
  originalDoc: Record<string, any> | undefined,
) {
  const status = data?._status ?? originalDoc?._status
  if (status === 'draft') return // drafts and autosave are never blocked; undefined fails closed

  const doc = deepMerge(originalDoc ?? {}, data ?? {})

  const all: { path: string; text: string }[] = []
  walk(doc, '', false, all)
  const confirm = all.find((s) => s.text.includes('[CONFIRM'))
  if (confirm) {
    throw new APIError(
      `Cannot publish: field "${confirm.path}" still contains a [CONFIRM: ...] placeholder.`,
      400,
    )
  }

  const voice: { path: string; text: string }[] = []
  walk(doc, '', true, voice)
  for (const s of voice) {
    const m = s.text.match(FORBIDDEN_SUPERLATIVES)
    if (m) {
      throw new APIError(`Field "${s.path}" contains "${m[0]}". Use a plain factual term.`, 400)
    }
  }

  collectionRules(slug, doc)
}

export const enforcePublishingGate: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  collection,
}) => {
  assertPublishable(collection.slug, data, originalDoc)
  return data
}

export const enforceGlobalPublishingGate: GlobalBeforeChangeHook = ({
  data,
  originalDoc,
  global,
}) => {
  assertPublishable(global.slug, data, originalDoc)
  return data
}
