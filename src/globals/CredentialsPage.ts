import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const CredentialsPage: GlobalConfig = {
  slug: 'credentials-page',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [
    { name: 'safetySummary', type: 'textarea' },
    { name: 'insuranceSummary', type: 'textarea' },
  ],
}
