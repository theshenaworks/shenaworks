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

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  versions: { drafts: true },
  admin: { useAsTitle: 'name' },
  hooks: {
    beforeChange: [enforcePublishingGate as any],
    afterChange: [revalidateSiteCache as any],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'relationship', relationTo: 'equipment-categories', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: true },
    { name: 'make', type: 'text', required: true },
    { name: 'model', type: 'text', required: true },
    { name: 'year', type: 'number' },
    { name: 'capacity', type: 'text', required: true },
    {
      name: 'specs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'owningEntity', type: 'text', defaultValue: 'Shena Works Limited' },
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
      name: 'hireTerms',
      type: 'group',
      fields: [
        { name: 'operator', type: 'text' },
        { name: 'fuel', type: 'text' },
        { name: 'transport', type: 'text' },
        { name: 'minimumHire', type: 'text' },
        { name: 'serviceArea', type: 'text' },
        { name: 'indicativeRate', type: 'text' },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'On hire, ask for dates', value: 'on_hire' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
  ],
}
