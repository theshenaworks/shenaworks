import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const EquipmentIndex: GlobalConfig = {
  slug: 'equipment-index',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [
    {
      name: 'hireTerms',
      type: 'group',
      fields: [
        { name: 'operator', type: 'text' },
        { name: 'fuel', type: 'text' },
        { name: 'transport', type: 'text' },
        { name: 'serviceArea', type: 'text' },
        { name: 'minimumHire', type: 'text' },
        { name: 'rates', type: 'text' },
      ],
    },
  ],
}
