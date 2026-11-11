import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const ServicesIndex: GlobalConfig = {
  slug: 'services-index',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [{ name: 'heroLead', type: 'textarea' }],
}
