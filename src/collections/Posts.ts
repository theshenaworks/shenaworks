import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true },
  admin: { useAsTitle: 'title' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', maxLength: 160, required: true },
    { name: 'category', type: 'relationship', relationTo: 'post-categories', required: true },
    { name: 'author', type: 'relationship', relationTo: 'team', required: true },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'readingTimeMinutes', type: 'number', defaultValue: 5 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'textarea', required: true },
    { name: 'relatedService', type: 'relationship', relationTo: 'services' },
  ],
}
