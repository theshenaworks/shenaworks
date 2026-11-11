import type { GlobalConfig } from 'payload'
import { enforceGlobalPublishingGate } from '../hooks/publishingGate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: {
    beforeChange: [enforceGlobalPublishingGate as any],
  },
  fields: [
    {
      name: 'company',
      type: 'group',
      fields: [
        { name: 'legalName', type: 'text', defaultValue: 'Shena Works Limited' },
        { name: 'tradingName', type: 'text', defaultValue: 'Shena Works' },
        { name: 'tagline', type: 'text', defaultValue: 'Roads & Building Construction Contractors' },
        { name: 'motto', type: 'text', defaultValue: 'Connecting communities. Building the future.' },
        { name: 'regNumber', type: 'text' },
        { name: 'incorporationDate', type: 'text' },
        { name: 'kraPin', type: 'text' },
        { name: 'directors', type: 'text' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phoneE164', type: 'text', defaultValue: '+254718971896' },
        { name: 'phoneDisplay', type: 'text', defaultValue: '+254 718 971 896' },
        { name: 'whatsappNumber', type: 'text', defaultValue: '254718971896' },
        { name: 'email', type: 'email', defaultValue: 'shenaworksltd@gmail.com' },
        { name: 'officeHours', type: 'text' },
        { name: 'responseTimeStatement', type: 'text' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedinUrl', type: 'text' },
        { name: 'facebookUrl', type: 'text' },
      ],
    },
    {
      name: 'proofItems',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'verified', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
