import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  versions: { drafts: true },
  admin: { useAsTitle: 'name' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'issuer', type: 'text', required: true },
    { name: 'number', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'validUntil', type: 'date' },
    { name: 'isPerpetual', type: 'checkbox', defaultValue: false },
    { name: 'certificateFile', type: 'upload', relationTo: 'media' },
    { name: 'holder', type: 'relationship', relationTo: 'team' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
