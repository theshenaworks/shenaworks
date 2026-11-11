import type { CollectionConfig } from 'payload'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
  ],
}
