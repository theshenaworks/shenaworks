import type { CollectionConfig } from 'payload'
import { enforcePublishingGate } from '../hooks/publishingGate'
import { revalidateSiteCache } from '../hooks/revalidateCache'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
  ],
}

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

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'lastUpdated', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: { useAsTitle: 'reference' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false, // Created exclusively via /api/enquiries
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['project', 'hire', 'consultation', 'other'],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'organisation', type: 'text' },
    { name: 'service', type: 'text' },
    { name: 'equipment', type: 'text' },
    { name: 'hireStart', type: 'date' },
    { name: 'hireDuration', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'budgetBand', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'attachments', type: 'relationship', relationTo: 'enquiry-attachments', hasMany: true },
    { name: 'consentAcceptedAt', type: 'date', required: true },
    { name: 'sourcePage', type: 'text' },
    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
        { name: 'gclid', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'quoted', 'won', 'closed_lost', 'spam'],
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'internalNotes', type: 'textarea' },
  ],
}
