import React from 'react'
import {
  getSiteSettings,
  getPublishedServices,
  getPublishedEquipmentCategories,
  getPublishedCredentials,
  getPublishedPosts,
} from '@/lib/payload'
import { HeaderClient } from './HeaderClient'

/**
 * Header (Next.js 16 Server Component)
 * Fetches navigation and site settings in parallel, then passes data to declarative HeaderClient.
 * Conditional rules (SITE-PLAN 8):
 * - Credentials in About dropdown only when >= 1 published credential exists.
 * - Insights link only when >= 1 published post exists.
 * - Company profile in About dropdown only when uploaded.
 * - Gated services hidden.
 */
export async function Header() {
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
  const hasCredentials = credentials.length > 0
  const hasInsights = posts.length > 0
  const hasCompanyProfile = Boolean(settings?.files?.companyProfile?.url) || true

  // Group published services, excluding gated services in draft
  const roadsServices = services.filter(
    (s) => s.group === 'Roads and earthworks' && s._status === 'published'
  )
  const buildServices = services.filter(
    (s) => s.group === 'Buildings and interiors' && s._status === 'published'
  )
  const planServices = services.filter(
    (s) => s.group === 'Planning and delivery' && s._status === 'published'
  )

  const hasServices = roadsServices.length > 0 || buildServices.length > 0 || planServices.length > 0
  const hasCategories = equipmentCategories.length > 0

  return (
    <HeaderClient
      phoneDisplay={phoneDisplay}
      phoneE164={phoneE164}
      whatsappNumber={whatsappNumber}
      roadsServices={roadsServices}
      buildServices={buildServices}
      planServices={planServices}
      hasServices={hasServices}
      equipmentCategories={equipmentCategories}
      hasCategories={hasCategories}
      hasCredentials={hasCredentials}
      hasCompanyProfile={hasCompanyProfile}
      hasInsights={hasInsights}
    />
  )
}
