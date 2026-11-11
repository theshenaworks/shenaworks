import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const EquipmentCategories: CollectionConfig = {
  slug: 'equipment-categories',
  versions: { drafts: true },
  admin: { useAsTitle: 'name' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'singular', type: 'text', required: true },
    { name: 'article', type: 'select', required: true, defaultValue: 'an', options: ['a', 'an'] },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroHeadline', type: 'text', required: true },
    { name: 'heroLead', type: 'textarea', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'uses',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'primaryKeyword', type: 'text' },
  ],
}
