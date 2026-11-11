import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  versions: { drafts: true },
  admin: { useAsTitle: 'person' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'person', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'organisation', type: 'text', required: true },
    { name: 'date', type: 'date' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'isPublicOfficial', type: 'checkbox', defaultValue: false },
    { name: 'permissionFile', type: 'upload', relationTo: 'media' },
  ],
}
