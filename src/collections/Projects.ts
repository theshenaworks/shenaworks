import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Projects: CollectionConfig = {
  slug: 'projects',
  versions: { drafts: true },
  admin: { useAsTitle: 'title' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, required: true },
    {
      name: 'location',
      type: 'group',
      fields: [
        { name: 'town', type: 'text', required: true },
        { name: 'county', type: 'text', required: true },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'clientType',
      type: 'select',
      required: true,
      options: [
        'Commercial & Hospitality',
        'Hospitality',
        'Hospitality & Residential',
        'Residential',
        'Public / Roads',
        'Commercial',
      ],
    },
    { name: 'year', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_projects_delivery_status',
      required: true,
      defaultValue: 'Completed',
      options: ['Completed', 'In progress'],
    },
    { name: 'role', type: 'text', required: true },
    { name: 'deliveringCompany', type: 'text', required: true },
    { name: 'verificationEvidenceNote', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'brief', type: 'textarea', required: true },
    { name: 'work', type: 'textarea', required: true },
    { name: 'result', type: 'textarea', required: true },
    {
      name: 'keyFigures',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'showValueBand', type: 'checkbox', defaultValue: false },
    { name: 'valueBand', type: 'text' },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
