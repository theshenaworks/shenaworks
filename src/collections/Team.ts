import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Team: CollectionConfig = {
  slug: 'team',
  versions: { drafts: true },
  admin: { useAsTitle: 'name' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'role', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', required: true },
    {
      name: 'experience',
      type: 'array',
      fields: [
        { name: 'period', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'organisation', type: 'text', required: true },
        { name: 'location', type: 'text' },
        { name: 'summary', type: 'textarea', required: true },
      ],
    },
    {
      name: 'areasOfWork',
      type: 'array',
      fields: [
        { name: 'term', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'linkedinUrl', type: 'text' },
    { name: 'ebkRegNumber', type: 'text' },
  ],
}
