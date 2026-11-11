export interface MediaItem {
  url: string
  alt: string
  caption: string
  width?: number
  height?: number
}

export interface KeyFactItem {
  term: string
  value: string
  href?: string
}

export interface ScopeItem {
  title: string
  description: string
}

export interface ProcessStepItem {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServiceRecord {
  slug: string
  parentSlug?: string
  title: string
  shortTitle: string
  group: 'Roads and earthworks' | 'Buildings and interiors' | 'Planning and delivery'
  _status: 'published' | 'draft'
  primaryKeyword: string
  formType: 'project' | 'consultation'
  ctaLabel: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  summary: string
  keyFacts: KeyFactItem[]
  intro: string[]
  scope: ScopeItem[]
  process: ProcessStepItem[]
  faqs: FaqItem[]
  formHeading: string
  formIntro: string
  equipmentSlugs?: string[]
  registeredProfessionalName?: string
  boraqsOrEbkRegNumber?: string
}

export interface ProjectRecord {
  slug: string
  title: string
  location: {
    town: string
    county: string
  }
  clientType: 'Commercial & Hospitality' | 'Hospitality' | 'Hospitality & Residential' | 'Civil & Roads'
  status: 'Completed' | 'In progress'
  year: string
  role: string
  deliveringCompany: string
  verificationEvidenceNote: string
  serviceSlugs: string[]
  equipmentSlugs: string[]
  featured: boolean
  _status: 'published' | 'draft'
  metaTitle: string
  metaDescription: string
  heroImage: MediaItem
  keyFigures: { value: string; label: string }[]
  brief: string
  work: string
  result: string
  gallery: MediaItem[]
}

export interface EquipmentCategoryRecord {
  slug: string
  name: string
  singular: string
  plural: string
  article: 'a' | 'an'
  primaryKeyword: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  summary: string
  intro: string[]
  uses: ScopeItem[]
  faqs: FaqItem[]
}

export interface MachineRecord {
  slug: string
  name: string
  categorySlug: string
  make: string
  model: string
  year?: string
  capacity: string
  operatingWeight?: string
  attachmentSize?: string
  enginePower?: string
  availability: 'available' | 'on_hire'
  featured: boolean
  _status: 'published' | 'draft'
  heroImage: MediaItem
  gallery: MediaItem[]
  uses: ScopeItem[]
  hireTerms: {
    operator: string
    fuel: string
    transport: string
    minimumHire: string
    serviceArea: string
  }
}

export interface TeamRecord {
  slug: string
  name: string
  role: string
  summary: string
  portrait: MediaItem
  phone?: string
  email: string
  linkedinUrl?: string
  bio: string[]
  experience: {
    period: string
    role: string
    organisation: string
    location: string
    summary: string
  }[]
  areasOfWork: KeyFactItem[]
}

export interface CredentialRecord {
  id: string
  name: string
  issuer: string
  number: string
  category: string
  validUntil: string
  certificateFileUrl?: string
  holderSlug?: string
  order: number
  _status: 'published' | 'draft'
}

export interface TestimonialRecord {
  id: string
  person: string
  title: string
  organisation: string
  projectSlug?: string
  serviceSlugs: string[]
  isPublicOfficial: boolean
  date: string
  permissionFileUrl?: string
  quote: string
  _status: 'published' | 'draft'
}

export interface LocationRecord {
  slug: string
  town: string
  county: string
  _status: 'published' | 'draft'
  primaryKeyword: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  address: string
  directionsUrl: string
  mapEmbedUrl?: string
  phone: string
  email: string
  hours?: string
  intro: string[]
  faqs: FaqItem[]
}

export interface PostCategoryRecord {
  slug: string
  name: string
}

export interface PostRecord {
  slug: string
  title: string
  categorySlug: string
  relatedServiceSlug: string
  excerpt: string
  publishedAt: string
  readingTimeMinutes: number
  authorSlug: string
  coverImage: MediaItem
  sections: { heading: string; paragraphs: string[] }[]
  _status: 'published' | 'draft'
}

export interface LegalPageRecord {
  slug: 'privacy' | 'cookies'
  title: string
  lastUpdated: string
  metaTitle: string
  metaDescription: string
  sections: {
    heading: string
    paragraphs: string[]
    bullets?: string[]
    table?: {
      headers: string[]
      rows: string[][]
    }
  }[]
}

export interface SiteSettingsRecord {
  company: {
    legalName: string
    tradingName: string
    tagline: string
    motto: string
    regNumber?: string | null
    incorporationDate?: string | null
    kraPin?: string | null
    directors?: string | null
  }
  contact: {
    phoneE164: string
    phoneDisplay: string
    whatsappNumber: string
    email: string
    officeHours: string
    responseTimeStatement?: string | null
  }
  social: {
    linkedinUrl?: string | null
    facebookUrl?: string | null
  }
  proofItems: {
    slot: number
    label: string
    value: string
    verified: boolean
    credentialId?: string | null
  }[]
  ctaImage: MediaItem
  files: {
    companyProfile?: {
      url: string
      sizeBytes?: number
      sizeMb?: string
      updatedAt?: string
    } | null
    safetyPolicy?: {
      url: string
      sizeBytes?: number
      sizeMb?: string
      updatedAt?: string
    } | null
  }
}

export interface HomePageRecord {
  heroOverline: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  whyShena: {
    overline: string
    heading: string
    image: MediaItem
    points: {
      number: string
      title: string
      description: string
      verified: boolean
    }[]
  }
}

export interface EquipmentIndexRecord {
  hireTerms: KeyFactItem[]
  faqs: FaqItem[]
}
