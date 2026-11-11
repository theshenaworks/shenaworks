import type { CollectionConfig } from 'payload'

export const EnquiryAttachments: CollectionConfig = {
  slug: 'enquiry-attachments',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
  },
  upload: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'enquiryReference',
      type: 'text',
    },
  ],
}
