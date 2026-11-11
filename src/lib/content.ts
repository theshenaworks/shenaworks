import {
  credentialsSeed,
  equipmentCategoriesSeed,
  equipmentIndexSeed,
  homePageSeed,
  legalPagesSeed,
  locationsSeed,
  machinesSeed,
  postCategoriesSeed,
  postsSeed,
  projectsSeed,
  servicesSeed,
  siteSettingsSeed,
  teamSeed,
  testimonialsSeed,
  type CredentialRecord,
  type EquipmentCategoryRecord,
  type LegalPageRecord,
  type LocationRecord,
  type MachineRecord,
  type PostCategoryRecord,
  type PostRecord,
  type ProjectRecord,
  type ServiceRecord,
  type TeamRecord,
  type TestimonialRecord,
} from '@/seed/data'

export function getSiteSettings() {
  return siteSettingsSeed
}

export function getHomePage() {
  return homePageSeed
}

export function getEquipmentIndex() {
  return equipmentIndexSeed
}

export function getTeamMember(): TeamRecord {
  return teamSeed
}

/**
 * Published services in SITE-PLAN.md 5.6 order:
 * Road construction and earthworks, General construction, Cabro paving,
 * Interior design, Project management, then gated services if published.
 */
export function getPublishedServices(): ServiceRecord[] {
  const order = [
    'road-construction-and-earthworks',
    'general-construction',
    'cabro-paving',
    'interior-design',
    'project-management',
    'architecture-and-consultancy',
    'bills-of-quantities-and-estimating',
  ]
  return servicesSeed
    .filter((s) => s._status === 'published')
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
}

export function getPublishedServiceBySlug(slug: string): ServiceRecord | undefined {
  return servicesSeed.find((s) => s.slug === slug && s._status === 'published')
}

export function getChildServices(parentSlug: string): ServiceRecord[] {
  return servicesSeed.filter((s) => s.parentSlug === parentSlug && s._status === 'published')
}

export function getPublishedProjects(): ProjectRecord[] {
  return projectsSeed.filter(
    (p) => p._status === 'published' && Boolean(p.role) && Boolean(p.deliveringCompany),
  )
}

export function getFeaturedProjects(): ProjectRecord[] {
  return getPublishedProjects()
    .filter((p) => p.featured)
    .slice(0, 6)
}

export function getPublishedProjectBySlug(slug: string): ProjectRecord | undefined {
  return getPublishedProjects().find((p) => p.slug === slug)
}

export function getProjectsByService(serviceSlug: string, excludeSlug?: string): ProjectRecord[] {
  return getPublishedProjects().filter(
    (p) => p.serviceSlugs.includes(serviceSlug) && p.slug !== excludeSlug,
  )
}

export function getProjectsByCounty(county: string): ProjectRecord[] {
  return getPublishedProjects().filter((p) => p.location.county.toLowerCase() === county.toLowerCase())
}

export function getPublishedMachines(): MachineRecord[] {
  return machinesSeed.filter((m) => m._status === 'published')
}

export function getFeaturedMachines(): MachineRecord[] {
  const published = getPublishedMachines()
  const featured = published.filter((m) => m.featured)
  if (featured.length >= 3) return featured.slice(0, 3)
  return published.slice(0, 3)
}

export function getPublishedEquipmentCategories(): EquipmentCategoryRecord[] {
  const publishedMachines = getPublishedMachines()
  return equipmentCategoriesSeed.filter((cat) =>
    publishedMachines.some((m) => m.categorySlug === cat.slug),
  )
}

export function getEquipmentCategoryBySlug(slug: string): EquipmentCategoryRecord | undefined {
  return getPublishedEquipmentCategories().find((c) => c.slug === slug)
}

export function getMachinesByCategory(categorySlug: string): MachineRecord[] {
  return getPublishedMachines().filter((m) => m.categorySlug === categorySlug)
}

export function getPublishedMachine(
  categorySlug: string,
  machineSlug: string,
): { category: EquipmentCategoryRecord; machine: MachineRecord } | undefined {
  const category = getEquipmentCategoryBySlug(categorySlug)
  if (!category) return undefined
  const machine = getPublishedMachines().find(
    (m) => m.categorySlug === categorySlug && m.slug === machineSlug,
  )
  if (!machine) return undefined
  return { category, machine }
}

export function getMachinesBySlugs(slugs: string[]): MachineRecord[] {
  const published = getPublishedMachines()
  return slugs
    .map((slug) => published.find((m) => m.slug === slug))
    .filter((m): m is MachineRecord => Boolean(m))
}

export function getPublishedCredentials(): CredentialRecord[] {
  const today = new Date().toISOString().slice(0, 10)
  return credentialsSeed
    .filter(
      (c) =>
        c._status === 'published' &&
        Boolean(c.certificateFileUrl) &&
        Boolean(c.validUntil) &&
        (c.validUntil === 'Perpetual' || c.validUntil >= today),
    )
    .sort((a, b) => a.order - b.order)
}

/**
 * Conditional rendering rule (SITE-PLAN.md 8):
 * Public-official testimonials are NEVER rendered on Home, NEVER on Leadership,
 * and NEVER first in a list.
 */
export function getPublishedTestimonials(options?: {
  excludePublicOfficials?: boolean
  serviceSlug?: string
  projectSlug?: string
}): TestimonialRecord[] {
  const filtered = testimonialsSeed.filter((t) => {
    if (t._status !== 'published' || !t.permissionFileUrl || !t.date) return false
    if (options?.excludePublicOfficials && t.isPublicOfficial) return false
    if (options?.serviceSlug && !t.serviceSlugs.includes(options.serviceSlug)) return false
    if (options?.projectSlug && t.projectSlug !== options.projectSlug) return false
    return true
  })

  // Ensure non-public-official testimonials always come first
  return filtered.sort((a, b) => Number(a.isPublicOfficial) - Number(b.isPublicOfficial))
}

export function getPublishedLocations(): LocationRecord[] {
  return locationsSeed.filter((l) => l._status === 'published')
}

export function getPublishedLocationBySlug(slug: string): LocationRecord | undefined {
  return getPublishedLocations().find((l) => l.slug === slug)
}

export function getPublishedPosts(): PostRecord[] {
  return postsSeed
    .filter((p) => p._status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPublishedPostBySlug(slug: string): PostRecord | undefined {
  return getPublishedPosts().find((p) => p.slug === slug)
}

export function getPublishedPostCategories(): PostCategoryRecord[] {
  const posts = getPublishedPosts()
  return postCategoriesSeed.filter((c) => posts.some((p) => p.categorySlug === c.slug))
}

export function getLegalPageBySlug(slug: 'privacy' | 'cookies'): LegalPageRecord | undefined {
  return legalPagesSeed.find((p) => p.slug === slug)
}
