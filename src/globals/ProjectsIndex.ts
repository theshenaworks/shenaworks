import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const ProjectsIndex: GlobalConfig = {
  slug: 'projects-index',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [{ name: 'heroLead', type: 'textarea' }],
}
