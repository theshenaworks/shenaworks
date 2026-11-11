import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [
    { name: 'heroOverline', type: 'text' },
    { name: 'heroHeadline', type: 'text' },
    { name: 'heroLead', type: 'textarea' },
  ],
}
