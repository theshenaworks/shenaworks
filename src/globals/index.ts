import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  fields: [
    { name: 'heroOverline', type: 'text' },
    { name: 'heroHeadline', type: 'text' },
    { name: 'heroLead', type: 'textarea' },
  ],
}

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  fields: [
    { name: 'heroHeadline', type: 'text' },
    { name: 'intro', type: 'textarea' },
  ],
}

export const CredentialsPage: GlobalConfig = {
  slug: 'credentials-page',
  fields: [
    { name: 'safetySummary', type: 'textarea' },
    { name: 'insuranceSummary', type: 'textarea' },
  ],
}

export const ServicesIndex: GlobalConfig = {
  slug: 'services-index',
  fields: [{ name: 'heroLead', type: 'textarea' }],
}

export const ProjectsIndex: GlobalConfig = {
  slug: 'projects-index',
  fields: [{ name: 'heroLead', type: 'textarea' }],
}

export const EquipmentIndex: GlobalConfig = {
  slug: 'equipment-index',
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
