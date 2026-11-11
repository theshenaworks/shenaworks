import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  versions: { drafts: true },
  admin: { useAsTitle: 'title' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'lastUpdated', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
}
