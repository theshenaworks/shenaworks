import type { CollectionConfig } from 'payload'

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
    { name: 'sourcePage', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'consentAcceptedAt', type: 'date', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'in_review' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed - Won', value: 'closed_won' },
        { label: 'Closed - Lost', value: 'closed_lost' },
      ],
    },
    { name: 'internalNotes', type: 'textarea' },
  ],
}
