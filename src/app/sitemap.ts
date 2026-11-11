import type { MetadataRoute } from 'next'
import {
  getPublishedCredentials,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedMachines,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedServices,
} from '@/lib/payload'
import { SITE_URL } from '@/lib/seo/jsonld'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [
    credentials,
    categories,
    locations,
    machines,
    posts,
    projects,
    services,
  ] = await Promise.all([
    getPublishedCredentials(),
    getPublishedEquipmentCategories(),
    getPublishedLocations(),
    getPublishedMachines(),
    getPublishedPosts(),
    getPublishedProjects(),
    getPublishedServices(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${SITE_URL}/about/leadership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...(credentials.length > 0
      ? [
          {
            url: `${SITE_URL}/about/credentials-and-safety`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          },
        ]
      : []),
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/equipment`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...(posts.length > 0
      ? [
          {
            url: `${SITE_URL}/insights`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          },
        ]
      : []),
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: s.parentSlug
      ? `${SITE_URL}/services/${s.parentSlug}/${s.slug}`
      : `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/equipment/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const machineRoutes: MetadataRoute.Sitemap = machines.map((m) => ({
    url: `${SITE_URL}/equipment/${m.categorySlug}/${m.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${SITE_URL}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/insights/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...categoryRoutes,
    ...machineRoutes,
    ...locationRoutes,
    ...postRoutes,
  ]
}
