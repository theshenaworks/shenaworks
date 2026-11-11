import React from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetailTemplate } from '@/components/blocks/ServiceDetailTemplate'
import { getPublishedServiceBySlug } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

const service = getPublishedServiceBySlug('cabro-paving')

export const metadata = buildPageMetadata({
  title: service?.metaTitle || 'Cabro Paving Contractors in Meru & Nairobi | Shena Works',
  description:
    service?.metaDescription ||
    'Heavy-duty 60mm and 80mm cabro paving in Meru and Nairobi, from subgrade compaction and kerbs to storm drainage. See our work and request a site measure.',
  path: '/services/road-construction-and-earthworks/cabro-paving',
})

export default function CabroPavingPage() {
  const record = getPublishedServiceBySlug('cabro-paving')
  if (!record) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    {
      label: 'Road construction and earthworks',
      href: '/services/road-construction-and-earthworks',
    },
    { label: 'Cabro paving' },
  ]

  return (
    <ServiceDetailTemplate
      service={record}
      breadcrumbs={breadcrumbs}
      path="/services/road-construction-and-earthworks/cabro-paving"
    />
  )
}
