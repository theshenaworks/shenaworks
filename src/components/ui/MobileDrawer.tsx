import React from 'react'
import {
  getSiteSettings,
  getPublishedServices,
  getPublishedEquipmentCategories,
  getPublishedCredentials,
  getPublishedPosts,
} from '@/lib/payload'
import { MobileDrawerClient } from './MobileDrawerClient'

/**
 * MobileDrawer (Next.js 16 Server Component)
 * Fetches menu data and passes to declarative MobileDrawerClient.
 * Toggle state, lockScroll, and accessibility are handled declaratively via React state.
 */
export async function MobileDrawer() {
  const [settings, services, equipmentCategories, credentials, posts] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPublishedServices().catch(() => []),
    getPublishedEquipmentCategories().catch(() => []),
    getPublishedCredentials().catch(() => []),
    getPublishedPosts().catch(() => []),
  ])

  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'
  const email = settings?.contact?.email || 'shenaworksltd@gmail.com'
  const hasCredentials = credentials.length > 0
  const hasInsights = posts.length > 0
  const hasCompanyProfile = Boolean(settings?.files?.companyProfile?.url)

  const publishedServices = services.filter((s) => s._status === 'published')
  const hasServices = publishedServices.length > 0
  const hasCategories = equipmentCategories.length > 0

  return (
    <MobileDrawerClient
      phoneDisplay={phoneDisplay}
      phoneE164={phoneE164}
      whatsappNumber={whatsappNumber}
      email={email}
      publishedServices={publishedServices}
      hasServices={hasServices}
      equipmentCategories={equipmentCategories}
      hasCategories={hasCategories}
      hasCredentials={hasCredentials}
      hasCompanyProfile={hasCompanyProfile}
      hasInsights={hasInsights}
    />
  )
}
