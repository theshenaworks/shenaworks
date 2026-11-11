import React from 'react'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { MobileActionBar } from '@/components/ui/MobileActionBar'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { BehaviorProvider } from '@/behaviors'
import {
  getPublishedCredentials,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedPosts,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/content'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings()
  const services = getPublishedServices()
  const equipmentCategories = getPublishedEquipmentCategories()
  const locations = getPublishedLocations()
  const hasCredentials = getPublishedCredentials().length > 0
  const hasInsights = getPublishedPosts().length > 0
  const hasCompanyProfile = Boolean(settings.files.companyProfile?.url)

  return (
    <>
      <BehaviorProvider />
      <Header
        services={services}
        equipmentCategories={equipmentCategories}
        locations={locations}
        hasCredentials={hasCredentials}
        hasInsights={hasInsights}
        hasCompanyProfile={hasCompanyProfile}
        phoneE164={settings.contact.phoneE164}
        phoneDisplay={settings.contact.phoneDisplay}
        whatsappNumber={settings.contact.whatsappNumber}
        email={settings.contact.email}
      />

      <main id="main-content">{children}</main>

      <Footer
        services={services}
        equipmentCategories={equipmentCategories}
        locations={locations}
        hasCredentials={hasCredentials}
        hasInsights={hasInsights}
        hasCompanyProfile={hasCompanyProfile}
        motto={settings.company.motto}
        phoneE164={settings.contact.phoneE164}
        phoneDisplay={settings.contact.phoneDisplay}
        whatsappNumber={settings.contact.whatsappNumber}
        email={settings.contact.email}
        officeHours={settings.contact.officeHours}
        linkedinUrl={settings.social.linkedinUrl}
        facebookUrl={settings.social.facebookUrl}
        regNumber={settings.company.regNumber}
      />

      <MobileActionBar
        phoneE164={settings.contact.phoneE164}
        whatsappNumber={settings.contact.whatsappNumber}
        email={settings.contact.email}
      />

      <CookieBanner />
    </>
  )
}
