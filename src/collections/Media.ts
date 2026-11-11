import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      {
        name: 'square',
        width: 800,
        height: 800,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'card',
        width: 960,
        height: 720,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'wide',
        width: 1600,
        height: 900,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg' },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
}

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
