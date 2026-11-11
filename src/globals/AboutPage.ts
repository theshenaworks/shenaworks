import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [
    { name: 'heroHeadline', type: 'text' },
    { name: 'intro', type: 'textarea' },
  ],
}
