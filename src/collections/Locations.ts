import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Locations: CollectionConfig = {
  slug: 'locations',
  versions: { drafts: true },
  admin: { useAsTitle: 'town' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'town', type: 'text', required: true },
    { name: 'county', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroHeadline', type: 'text', required: true },
    { name: 'heroLead', type: 'textarea', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'hours', type: 'text', required: true },
    { name: 'directionsUrl', type: 'text', required: true },
    { name: 'mapEmbedUrl', type: 'text' },
    {
      name: 'geo',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
