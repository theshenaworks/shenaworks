import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  CredentialRecord,
  EquipmentCategoryRecord,
  EquipmentIndexRecord,
  HomePageRecord,
  LegalPageRecord,
  LocationRecord,
  MachineRecord,
  MediaItem,
  PostCategoryRecord,
  PostRecord,
  ProjectRecord,
  ServiceRecord,
  SiteSettingsRecord,
  TeamRecord,
  TestimonialRecord,
} from '@/types/content'

let cachedPayload: any = null

export async function getPayloadClient() {
  if (!process.env.DATABASE_URI) {
    try {
      process.loadEnvFile?.('.env.local')
    } catch {
      try {
        process.loadEnvFile?.('.env')
      } catch {}
    }
  }
  if (!cachedPayload) {
    cachedPayload = await getPayload({ config })
  }
  return cachedPayload
}

function cacheWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options?: { tags?: string[]; revalidate?: number | false },
): T {
  const cached = unstable_cache(fn, keyParts, options)
  return (async (...args: any[]) => {
    try {
      return await cached(...args)
    } catch (err: any) {
      if (err?.message?.includes('incrementalCache missing')) {
        return await fn(...args)
      }
      throw err
    }
  }) as T
}

function resolveMedia(
  media: any,
  fallbackUrl: string,
  fallbackAlt: string,
  fallbackCaption: string,
): MediaItem {
  if (typeof media === 'object' && media !== null && media.url) {
    return {
      url: media.url,
      alt: media.alt || fallbackAlt,
      caption: media.caption || fallbackCaption,
      width: media.width,
      height: media.height,
    }
  }
  return {
    url: fallbackUrl,
    alt: fallbackAlt,
    caption: fallbackCaption,
  }
}

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

export const getSiteSettings = cacheWrapper(
  async (): Promise<SiteSettingsRecord> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return {
      company: {
        legalName: doc.company?.legalName || 'Shena Works Limited',
        tradingName: doc.company?.tradingName || 'Shena Works',
        tagline: doc.company?.tagline || 'Roads & Building Construction Contractors',
        motto: doc.company?.motto || 'Connecting communities. Building the future.',
        regNumber: doc.company?.regNumber || null,
        incorporationDate: doc.company?.incorporationDate || null,
        kraPin: doc.company?.kraPin || null,
        directors: doc.company?.directors || null,
      },
      contact: {
        phoneE164: doc.contact?.phoneE164 || '+254718971896',
        phoneDisplay: doc.contact?.phoneDisplay || '+254 718 971 896',
        whatsappNumber: doc.contact?.whatsappNumber || '254718971896',
        email: doc.contact?.email || 'shenaworksltd@gmail.com',
        officeHours:
          doc.contact?.officeHours ||
          'Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm',
        responseTimeStatement: doc.contact?.responseTimeStatement || null,
      },
      social: {
        linkedinUrl: doc.social?.linkedinUrl || null,
        facebookUrl: doc.social?.facebookUrl || null,
      },
      proofItems: (doc.proofItems || []).map((p: any, idx: number) => ({
        slot: idx + 1,
        label: p.label,
        value: p.value,
        verified: Boolean(p.verified),
        credentialId: p.credentialId || null,
      })),
      ctaImage: {
        url: '/media/hero-aerial-road.svg',
        alt: 'Aerial perspective of a civil road construction project by Shena Works',
        caption: 'Civil road construction and earthworks across Kenya.',
      },
      files: {
        companyProfile: null,
        safetyPolicy: null,
      },
    }
  },
  ['global-site-settings'],
  { tags: ['site-settings', 'globals'], revalidate: 3600 },
)

export const getHomePage: () => Promise<HomePageRecord> = cacheWrapper(
  async (): Promise<HomePageRecord> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'home-page' })
    return {
      heroOverline: doc.heroOverline || 'Roads and building contractors · Meru and Nairobi',
      heroHeadline:
        doc.heroHeadline || 'Roads, earthworks and buildings, built with our own machines',
      heroLead:
        doc.heroLead ||
        'We grade, drain and pave roads, and we build homes, lounges and commercial premises across Meru, Nairobi and the rest of Kenya, from site clearing to handover.',
      heroImage: resolveMedia(
        doc.heroImage,
        '/media/hero-home-road-grading.svg',
        'Shena Works motor grader and vibratory roller preparing a murram road in Meru County',
        'Grading and compacting an access road in Meru County',
      ),
      whyShena: {
        overline: doc.whyShena?.overline || 'Why Shena Works',
        heading: doc.whyShena?.heading || 'We own the plant and we run the site',
        image: resolveMedia(
          doc.whyShena?.image,
          '/media/about-site-supervision.svg',
          'Shena Works site team and excavator during earthworks and drainage construction',
          'On-site supervision and earthmoving plant operation in Meru County.',
        ),
        points: (doc.whyShena?.points || [
          {
            number: '01',
            title: 'Our own machines',
            description:
              'Our excavators, graders and rollers are on your job when the programme says, not when a hire yard can spare them.',
            verified: true,
          },
          {
            number: '02',
            title: 'Roads and buildings, one contractor',
            description:
              'Earthworks, drainage, paving and the building itself are planned and supervised by one team.',
            verified: true,
          },
          {
            number: '03',
            title: 'Led from the site',
            description:
              'Our managing director has supervised county road works and inspected urban roads, and still visits every site.',
            verified: true,
          },
        ]).map((p: any) => ({
          number: p.number,
          title: p.title,
          description: p.description,
          verified: Boolean(p.verified),
        })),
      },
    }
  },
  ['global-home-page'],
  { tags: ['home-page', 'globals'], revalidate: 3600 },
)

export const getEquipmentIndex: () => Promise<EquipmentIndexRecord> = cacheWrapper(
  async (): Promise<EquipmentIndexRecord> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'equipment-index' })
    const hireTermsObj = doc.hireTerms || {}
    const terms = [
      { term: 'Operator', value: hireTermsObj.operator || 'Included with every machine' },
      {
        term: 'Fuel',
        value: hireTermsObj.fuel || 'Dry rate (client supplies diesel) or wet rate option',
      },
      {
        term: 'Transport',
        value: hireTermsObj.transport || 'Low-loader delivery quoted by distance',
      },
      {
        term: 'Service area',
        value:
          hireTermsObj.serviceArea ||
          'Meru County and surrounding counties; nationwide by arrangement',
      },
      {
        term: 'Minimum hire',
        value: hireTermsObj.minimumHire || '1 full day (8 machine working hours)',
      },
      { term: 'Rates', value: hireTermsObj.rates || 'Quoted per job' },
    ]
    return {
      hireTerms: terms,
      faqs: [
        {
          question: 'Do your machines come with an operator?',
          answer:
            'Yes. Every excavator, grader, roller and bulldozer is hired with our own trained, experienced operator who knows the machine and conducts daily pre-shift checks. We do not hire out bare machines without our operators.',
        },
        {
          question: 'Is fuel included in the hire rate (wet vs dry rate)?',
          answer:
            'We offer both wet hire (fuel provided by Shena Works) and dry hire (fuel supplied on site by the client). The option is agreed in writing before mobilising.',
        },
        {
          question: 'How is transport to the site handled?',
          answer:
            'Low-bed mobilising and demobilising to and from your site is quoted upfront based on round-trip distance from our Meru yard. The client signs off on mobilisation fees before dispatch.',
        },
        {
          question: 'What is your service area for machinery hire?',
          answer:
            'Our primary base is in Meru County, covering Meru, Isiolo, Tharaka Nithi, Embu and Laikipia. We mobilise nationwide across Kenya for medium-to-long term contracts.',
        },
        {
          question: 'What is the minimum hire period?',
          answer:
            'Standard minimum hire is 8 operating hours per day. Multi-week and monthly project contracts are available at discounted shift rates.',
        },
      ],
    }
  },
  ['global-equipment-index'],
  { tags: ['equipment-index', 'globals'], revalidate: 3600 },
)

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const SERVICE_ORDER = [
  'road-construction-and-earthworks',
  'general-construction',
  'cabro-paving',
  'interior-design',
  'project-management',
  'architecture-and-consultancy',
  'bills-of-quantities-and-estimating',
]

function mapServiceDoc(doc: any): ServiceRecord {
  const parentSlug =
    typeof doc.parent === 'object' && doc.parent !== null ? doc.parent.slug : undefined

  return {
    slug: doc.slug,
    parentSlug,
    title: doc.title,
    shortTitle: doc.shortTitle || doc.title,
    group: doc.group,
    _status: doc._status,
    primaryKeyword: doc.primaryKeyword || '',
    formType: doc.formType || 'project',
    ctaLabel: doc.ctaLabel || 'Request a quote',
    metaTitle: doc.metaTitle || `${doc.title} | Shena Works`,
    metaDescription: doc.metaDescription || doc.summary || '',
    heroHeadline: doc.heroHeadline || doc.title,
    heroLead: doc.heroLead || doc.summary || '',
    heroImage: resolveMedia(
      doc.heroImage,
      `/media/service-${doc.slug}.svg`,
      `${doc.title} by Shena Works`,
      `${doc.title} in progress.`,
    ),
    summary: doc.summary,
    keyFacts: doc.keyFacts || [],
    intro: typeof doc.intro === 'string' ? doc.intro.split('\n\n') : doc.intro || [],
    scope: doc.scope || [],
    process: doc.process || [],
    faqs: doc.faqs || [],
    formHeading: doc.formHeading || `Request a quote for ${doc.shortTitle || doc.title}`,
    formIntro:
      doc.formIntro ||
      'Tell us about your site, location, and timeline. We respond with a site visit proposal or written estimate.',
    equipmentSlugs: doc.equipmentSlugs || [],
    registeredProfessionalName: doc.registeredProfessionalName || undefined,
    boraqsOrEbkRegNumber: doc.boraqsOrEbkRegNumber || undefined,
  }
}

export const getPublishedServices: () => Promise<ServiceRecord[]> = cacheWrapper(
  async (): Promise<ServiceRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
    })
    return res.docs
      .map(mapServiceDoc)
      .sort((a: ServiceRecord, b: ServiceRecord) => SERVICE_ORDER.indexOf(a.slug) - SERVICE_ORDER.indexOf(b.slug))
  },
  ['published-services'],
  { tags: ['services'], revalidate: 3600 },
)

export async function getPublishedServiceBySlug(slug: string): Promise<ServiceRecord | undefined> {
  const services = await getPublishedServices()
  return services.find((s) => s.slug === slug)
}

export async function getChildServices(parentSlug: string): Promise<ServiceRecord[]> {
  const services = await getPublishedServices()
  return services.filter((s) => s.parentSlug === parentSlug)
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function mapProjectDoc(doc: any): ProjectRecord {
  const serviceSlugs = Array.isArray(doc.services)
    ? doc.services.map((s: any) => (typeof s === 'object' && s !== null ? s.slug : s))
    : []

  return {
    slug: doc.slug,
    title: doc.title,
    location: doc.location || { town: 'Meru', county: 'Meru County' },
    clientType: doc.clientType,
    status: doc.status || 'Completed',
    year: doc.year,
    role: doc.role,
    deliveringCompany: doc.deliveringCompany,
    verificationEvidenceNote: doc.verificationEvidenceNote || '',
    serviceSlugs,
    equipmentSlugs: doc.equipmentSlugs || [],
    featured: Boolean(doc.featured),
    _status: doc._status,
    metaTitle: doc.metaTitle || `${doc.title} | Case Study | Shena Works`,
    metaDescription: doc.metaDescription || doc.brief || '',
    heroImage: resolveMedia(
      doc.heroImage,
      `/media/project-${doc.slug}.svg`,
      `${doc.title} project by Shena Works`,
      `${doc.title} in ${doc.location?.town || 'Meru'}.`,
    ),
    keyFigures: doc.keyFigures || [],
    brief: doc.brief || '',
    work: doc.work || '',
    result: doc.result || '',
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map((g: any, i: number) =>
          resolveMedia(
            g.image,
            `/media/project-${doc.slug}.svg`,
            `${doc.title} photo ${i + 1}`,
            g.caption || `${doc.title} construction progress`,
          ),
        )
      : [],
  }
}

export const getPublishedProjects: () => Promise<ProjectRecord[]> = cacheWrapper(
  async (): Promise<ProjectRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
    })
    return res.docs
      .map(mapProjectDoc)
      .filter((p: ProjectRecord) => Boolean(p.role) && Boolean(p.deliveringCompany))
  },
  ['published-projects'],
  { tags: ['projects'], revalidate: 3600 },
)

export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
  const all = await getPublishedProjects()
  const refSlugs = [
    'the-black-perch-lounge',
    'the-pin-hideout',
    'dukes-cottages-restaurant-and-garden',
  ]
  const matched = refSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is ProjectRecord => Boolean(p))
  if (matched.length === 3) return matched
  return all.filter((p) => p.featured).slice(0, 3)
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectRecord | undefined> {
  const all = await getPublishedProjects()
  return all.find((p) => p.slug === slug)
}

export async function getProjectsByService(
  serviceSlug: string,
  excludeSlug?: string,
): Promise<ProjectRecord[]> {
  const all = await getPublishedProjects()
  return all.filter((p) => p.serviceSlugs.includes(serviceSlug) && p.slug !== excludeSlug)
}

export async function getProjectsByCounty(county: string): Promise<ProjectRecord[]> {
  const all = await getPublishedProjects()
  return all.filter((p) => p.location.county.toLowerCase() === county.toLowerCase())
}

// ---------------------------------------------------------------------------
// Equipment & Machines
// ---------------------------------------------------------------------------

function mapMachineDoc(doc: any): MachineRecord {
  const categorySlug =
    typeof doc.category === 'object' && doc.category !== null ? doc.category.slug : doc.category

  const specs = Array.isArray(doc.specs) ? doc.specs : []
  const opWeight = specs.find((s: any) => s.label?.toLowerCase().includes('weight'))?.value
  const attSize = specs.find(
    (s: any) =>
      s.label?.toLowerCase().includes('bucket') ||
      s.label?.toLowerCase().includes('blade') ||
      s.label?.toLowerCase().includes('drum'),
  )?.value
  const pwr = specs.find((s: any) => s.label?.toLowerCase().includes('power'))?.value

  return {
    slug: doc.slug,
    name: doc.name,
    categorySlug: categorySlug || '',
    make: doc.make,
    model: doc.model,
    year: doc.year ? String(doc.year) : undefined,
    capacity: doc.capacity,
    operatingWeight: opWeight,
    attachmentSize: attSize,
    enginePower: pwr,
    availability: doc.availability || 'available',
    featured: Boolean(doc.featured),
    _status: doc._status,
    heroImage: resolveMedia(
      doc.heroImage,
      `/media/equipment-${doc.slug}.svg`,
      `${doc.name} available for hire from Shena Works`,
      `${doc.name} available with operator.`,
    ),
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map((g: any, i: number) =>
          resolveMedia(
            g.image,
            `/media/equipment-${doc.slug}.svg`,
            `${doc.name} site photo ${i + 1}`,
            g.caption || `${doc.name} operating on site`,
          ),
        )
      : [],
    uses: doc.uses || [],
    hireTerms: doc.hireTerms || {
      operator: 'Supplied with certified Shena Works operator.',
      fuel: 'Dry or wet hire by agreement.',
      transport: 'Quoted on round-trip distance from Meru yard.',
      minimumHire: '8 operating hours/day.',
      serviceArea: 'Meru, Isiolo, Embu, Tharaka Nithi, Laikipia, and across Kenya.',
    },
  }
}

export const getPublishedMachines = cacheWrapper(
  async (): Promise<MachineRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'equipment',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
    })
    return res.docs.map(mapMachineDoc)
  },
  ['published-machines'],
  { tags: ['equipment'], revalidate: 3600 },
)

export async function getFeaturedMachines(): Promise<MachineRecord[]> {
  const published = await getPublishedMachines()
  const featured = published.filter((m) => m.featured)
  if (featured.length >= 3) return featured.slice(0, 3)
  return published.slice(0, 3)
}

function mapEquipmentCategoryDoc(doc: any): EquipmentCategoryRecord {
  return {
    slug: doc.slug,
    name: doc.name,
    singular: doc.singular,
    plural: doc.name,
    article: doc.article || 'a',
    primaryKeyword: doc.primaryKeyword || '',
    metaTitle: doc.metaTitle || `${doc.name} Hire in Meru & Kenya | Shena Works`,
    metaDescription: doc.metaDescription || doc.summary || '',
    heroHeadline: doc.heroHeadline || doc.name,
    heroLead: doc.heroLead || doc.summary || '',
    heroImage: resolveMedia(
      doc.heroImage,
      `/media/equipment-${doc.slug}.svg`,
      `${doc.name} hire from Shena Works`,
      `${doc.name} fleet in Meru.`,
    ),
    summary: doc.summary,
    intro: typeof doc.intro === 'string' ? doc.intro.split('\n\n') : doc.intro || [],
    uses: doc.uses || [],
    faqs: doc.faqs || [],
  }
}

export const getPublishedEquipmentCategories: () => Promise<EquipmentCategoryRecord[]> = cacheWrapper(
  async (): Promise<EquipmentCategoryRecord[]> => {
    const publishedMachines = await getPublishedMachines()
    // Per D-08 / SITE-PLAN.md 8: if 0 published machines, equipment categories are empty / 404
    if (publishedMachines.length === 0) return []

    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'equipment-categories',
      limit: 100,
      depth: 0,
      sort: 'order',
    })
    return res.docs
      .map(mapEquipmentCategoryDoc)
      .filter((cat: EquipmentCategoryRecord) => publishedMachines.some((m) => m.categorySlug === cat.slug))
  },
  ['published-equipment-categories'],
  { tags: ['equipment', 'equipment-categories'], revalidate: 3600 },
)

export async function getEquipmentCategoryBySlug(
  slug: string,
): Promise<EquipmentCategoryRecord | undefined> {
  const cats = await getPublishedEquipmentCategories()
  return cats.find((c) => c.slug === slug)
}

export async function getMachinesByCategory(categorySlug: string): Promise<MachineRecord[]> {
  const machines = await getPublishedMachines()
  return machines.filter((m) => m.categorySlug === categorySlug)
}

export async function getPublishedMachine(
  categorySlug: string,
  machineSlug: string,
): Promise<{ category: EquipmentCategoryRecord; machine: MachineRecord } | undefined> {
  const category = await getEquipmentCategoryBySlug(categorySlug)
  if (!category) return undefined
  const machines = await getPublishedMachines()
  const machine = machines.find((m) => m.categorySlug === categorySlug && m.slug === machineSlug)
  if (!machine) return undefined
  return { category, machine }
}

export async function getMachinesBySlugs(slugs: string[]): Promise<MachineRecord[]> {
  const published = await getPublishedMachines()
  return slugs
    .map((slug) => published.find((m) => m.slug === slug))
    .filter((m): m is MachineRecord => Boolean(m))
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export const getTeamMember = cacheWrapper(
  async (slug = 'newton-muthee'): Promise<TeamRecord> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'team',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = res.docs[0]
    if (!doc) {
      throw new Error(`Team member "${slug}" not found in database.`)
    }
    return {
      slug: doc.slug,
      name: doc.name,
      role: doc.role,
      summary: doc.summary,
      portrait: resolveMedia(
        doc.portrait,
        '/media/founder-newton-muthee.svg',
        `${doc.name}, ${doc.role}`,
        `${doc.name}, Founder and Managing Director of Shena Works Limited.`,
      ),
      phone: doc.phone || undefined,
      email: doc.email,
      linkedinUrl: doc.linkedinUrl || undefined,
      bio: typeof doc.bio === 'string' ? doc.bio.split('\n\n') : doc.bio || [],
      experience: doc.experience || [],
      areasOfWork: doc.areasOfWork || [],
    }
  },
  ['team-member'],
  { tags: ['team'], revalidate: 3600 },
)

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

export const getPublishedCredentials: () => Promise<CredentialRecord[]> = cacheWrapper(
  async (): Promise<CredentialRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'credentials',
      where: { _status: { equals: 'published' } },
      limit: 100,
      sort: 'order',
    })
    const today = new Date().toISOString().slice(0, 10)
    return res.docs
      .map((c: any): CredentialRecord => ({
        id: String(c.id),
        name: c.name,
        issuer: c.issuer,
        number: c.number,
        category: c.category,
        validUntil: c.isPerpetual ? 'Perpetual' : c.validUntil,
        certificateFileUrl: c.certificateFile?.url || undefined,
        holderSlug: typeof c.holder === 'object' && c.holder ? c.holder.slug : undefined,
        order: c.order || 0,
        _status: c._status,
      }))
      .filter((c: CredentialRecord) => {
        if (!c.certificateFileUrl || !c.validUntil) return false
        return c.validUntil === 'Perpetual' || c.validUntil >= today
      })
  },
  ['published-credentials'],
  { tags: ['credentials'], revalidate: 3600 },
)

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const getPublishedTestimonials: (options?: {
  excludePublicOfficials?: boolean
  serviceSlug?: string
  projectSlug?: string
}) => Promise<TestimonialRecord[]> = cacheWrapper(
  async (options?: {
    excludePublicOfficials?: boolean
    serviceSlug?: string
    projectSlug?: string
  }): Promise<TestimonialRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'testimonials',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
    })
    const filtered = res.docs
      .map((t: any): TestimonialRecord => {
        const projectSlug =
          typeof t.project === 'object' && t.project !== null ? t.project.slug : undefined
        const serviceSlugs = Array.isArray(t.services)
          ? t.services.map((s: any) => (typeof s === 'object' && s !== null ? s.slug : s))
          : []
        return {
          id: String(t.id),
          person: t.person,
          title: t.title,
          organisation: t.organisation,
          projectSlug,
          serviceSlugs,
          isPublicOfficial: Boolean(t.isPublicOfficial),
          date: t.date || '',
          permissionFileUrl: t.permissionFile?.url || undefined,
          quote: t.quote,
          _status: t._status,
        }
      })
      .filter((t: TestimonialRecord) => {
        if (t._status !== 'published' || !t.permissionFileUrl || !t.date) return false
        if (options?.excludePublicOfficials && t.isPublicOfficial) return false
        if (options?.serviceSlug && !t.serviceSlugs.includes(options.serviceSlug)) return false
        if (options?.projectSlug && t.projectSlug !== options.projectSlug) return false
        return true
      })

    return filtered.sort((a: TestimonialRecord, b: TestimonialRecord) => Number(a.isPublicOfficial) - Number(b.isPublicOfficial))
  },
  ['published-testimonials'],
  { tags: ['testimonials'], revalidate: 3600 },
)

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

function mapLocationDoc(doc: any): LocationRecord {
  return {
    slug: doc.slug,
    town: doc.town,
    county: doc.county,
    _status: doc._status,
    primaryKeyword: doc.primaryKeyword || '',
    metaTitle: doc.metaTitle || `Contractor in ${doc.town}, ${doc.county} | Shena Works`,
    metaDescription: doc.metaDescription || doc.heroLead || '',
    heroHeadline: doc.heroHeadline || doc.town,
    heroLead: doc.heroLead || '',
    heroImage: resolveMedia(
      doc.heroImage,
      `/media/location-${doc.slug}.svg`,
      `Shena Works ${doc.town} office and yard`,
      `Shena Works operations base in ${doc.town}.`,
    ),
    address: doc.address,
    directionsUrl: doc.directionsUrl,
    mapEmbedUrl: doc.mapEmbedUrl || undefined,
    phone: doc.phone,
    email: doc.email,
    hours: doc.hours || undefined,
    intro: typeof doc.intro === 'string' ? doc.intro.split('\n\n') : doc.intro || [],
    faqs: doc.faqs || [],
  }
}

export const getPublishedLocations = cacheWrapper(
  async (): Promise<LocationRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'locations',
      where: { _status: { equals: 'published' } },
      limit: 100,
    })
    return res.docs.map(mapLocationDoc)
  },
  ['published-locations'],
  { tags: ['locations'], revalidate: 3600 },
)

export async function getPublishedLocationBySlug(slug: string): Promise<LocationRecord | undefined> {
  const locs = await getPublishedLocations()
  return locs.find((l) => l.slug === slug)
}

// ---------------------------------------------------------------------------
// Posts & Insights
// ---------------------------------------------------------------------------

function mapPostDoc(doc: any): PostRecord {
  const categorySlug =
    typeof doc.category === 'object' && doc.category !== null ? doc.category.slug : doc.category
  const serviceSlug =
    typeof doc.relatedService === 'object' && doc.relatedService !== null
      ? doc.relatedService.slug
      : doc.relatedService
  const authorSlug =
    typeof doc.author === 'object' && doc.author !== null ? doc.author.slug : doc.author

  return {
    slug: doc.slug,
    title: doc.title,
    categorySlug: categorySlug || '',
    relatedServiceSlug: serviceSlug || '',
    excerpt: doc.excerpt || '',
    publishedAt: doc.publishedAt || '',
    readingTimeMinutes: doc.readingTimeMinutes || 5,
    authorSlug: authorSlug || 'newton-muthee',
    coverImage: resolveMedia(
      doc.coverImage,
      `/media/post-${doc.slug}.svg`,
      doc.title,
      `${doc.title} illustration.`,
    ),
    sections: doc.sections || [],
    _status: doc._status,
  }
}

export const getPublishedPosts = cacheWrapper(
  async (): Promise<PostRecord[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 1,
      sort: '-publishedAt',
    })
    return res.docs.map(mapPostDoc)
  },
  ['published-posts'],
  { tags: ['posts'], revalidate: 3600 },
)

export async function getPublishedPostBySlug(slug: string): Promise<PostRecord | undefined> {
  const posts = await getPublishedPosts()
  return posts.find((p) => p.slug === slug)
}

export const getPublishedPostCategories: () => Promise<PostCategoryRecord[]> = cacheWrapper(
  async (): Promise<PostCategoryRecord[]> => {
    const posts = await getPublishedPosts()
    if (posts.length === 0) return []

    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'post-categories',
      limit: 100,
    })
    return res.docs
      .map((c: any): PostCategoryRecord => ({ slug: c.slug, name: c.name }))
      .filter((c: PostCategoryRecord) => posts.some((p) => p.categorySlug === c.slug))
  },
  ['published-post-categories'],
  { tags: ['posts', 'post-categories'], revalidate: 3600 },
)

// ---------------------------------------------------------------------------
// Legal Pages
// ---------------------------------------------------------------------------

export const getLegalPageBySlug = cacheWrapper(
  async (slug: 'privacy' | 'cookies'): Promise<LegalPageRecord | undefined> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'legal-pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = res.docs[0]
    if (!doc) return undefined
    return {
      slug: doc.slug,
      title: doc.title,
      lastUpdated: doc.lastUpdated || '',
      metaTitle: doc.metaTitle || `${doc.title} | Shena Works`,
      metaDescription: doc.metaDescription || '',
      sections: doc.sections || [],
    }
  },
  ['legal-page'],
  { tags: ['legal-pages'], revalidate: 3600 },
)
