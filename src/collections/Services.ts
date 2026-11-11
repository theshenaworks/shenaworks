import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const Services: CollectionConfig = {
  slug: 'services',
  versions: { drafts: true },
  admin: { useAsTitle: 'title' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'shortTitle', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'parent', type: 'relationship', relationTo: 'services' },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: [
        'Roads and earthworks',
        'Buildings and interiors',
        'Planning and delivery',
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'requiresRegistration', type: 'checkbox', defaultValue: false },
    { name: 'registeredProfessionalName', type: 'text' },
    { name: 'registrationBodyAndNumber', type: 'text' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroHeadline', type: 'text', required: true },
    { name: 'heroLead', type: 'textarea', required: true },
    { name: 'summary', type: 'textarea', maxLength: 160, required: true },
    {
      name: 'keyFacts',
      type: 'array',
      minRows: 3,
      maxRows: 6,
      fields: [
        { name: 'term', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'scope',
      type: 'array',
      minRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'process',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      minRows: 4,
      maxRows: 6,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'formType',
      type: 'select',
      required: true,
      defaultValue: 'project',
      options: ['project', 'consultation'],
    },
    { name: 'ctaLabel', type: 'text', required: true },
    { name: 'formHeading', type: 'text', required: true },
    { name: 'formIntro', type: 'textarea', required: true },
    { name: 'primaryKeyword', type: 'text' },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
