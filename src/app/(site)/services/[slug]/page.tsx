import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ServiceDetailTemplate } from '@/components/blocks/ServiceDetailTemplate'
import { getPublishedServiceBySlug, getPublishedServices } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return getPublishedServices()
    .filter((s) => !s.parentSlug)
    .map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getPublishedServiceBySlug(slug)
  if (!service || service.parentSlug) {
    return {}
  }
  return buildPageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getPublishedServiceBySlug(slug)
  // Gated or child services accessed directly at /services/[slug] return 404
  if (!service || service.parentSlug) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title },
  ]

  return (
    <ServiceDetailTemplate
      service={service}
      breadcrumbs={breadcrumbs}
      path={`/services/${service.slug}`}
    />
  )
}
