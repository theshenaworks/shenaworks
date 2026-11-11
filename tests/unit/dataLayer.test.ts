import { describe, expect, it } from 'vitest'
import {
  getHomePage,
  getPayloadClient,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedProjects,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'

describe('Data Layer (src/lib/payload.ts) Local API integration', () => {
  it('reads published services from database', async () => {
    const services = await getPublishedServices()
    expect(services.length).toBeGreaterThanOrEqual(4)
    expect(services.some((s) => s.slug === 'road-construction-and-earthworks')).toBe(true)
    expect(services.some((s) => s.slug === 'general-construction')).toBe(true)
    // Architecture and BoQ are draft in seed, so they should not appear in published services
    expect(services.some((s) => s.slug === 'architecture-and-consultancy')).toBe(false)
    expect(services.some((s) => s.slug === 'bills-of-quantities-and-estimating')).toBe(false)
  })

  it('reads site-settings global from database', async () => {
    const settings = await getSiteSettings()
    expect(settings.company.legalName).toBe('Shena Works Limited')
    expect(settings.contact.phoneE164).toBe('+254718971896')
  })

  it('reads published projects from database', async () => {
    const projects = await getPublishedProjects()
    expect(projects.length).toBeGreaterThanOrEqual(3)
    const perch = projects.find((p) => p.slug === 'the-black-perch-lounge')
    expect(perch).toBeDefined()
    expect(perch?.deliveringCompany).toBe('Shena Works Limited')
  })

  it('reflects updates made through Payload Local API', async () => {
    const payload = await getPayloadClient()
    const services = await getPublishedServices()
    const target = services.find((s) => s.slug === 'road-construction-and-earthworks')
    expect(target).toBeDefined()

    // Query doc from database
    const dbRes = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'road-construction-and-earthworks' } },
      limit: 1,
    })
    const docId = dbRes.docs[0].id
    const originalHeadline = dbRes.docs[0].heroHeadline

    // Update heroHeadline via Local API
    const testHeadline = `Engineered roads & earthworks (${Date.now()})`
    await payload.update({
      collection: 'services',
      id: docId,
      data: { heroHeadline: testHeadline },
    })

    // Fetch through data layer (or direct payload)
    const updated = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'road-construction-and-earthworks' } },
      limit: 1,
    })
    expect(updated.docs[0].heroHeadline).toBe(testHeadline)

    // Restore original headline
    await payload.update({
      collection: 'services',
      id: docId,
      data: { heroHeadline: originalHeadline },
    })
  })
})
