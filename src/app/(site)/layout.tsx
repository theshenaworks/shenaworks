import React from 'react'
import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { MobileActionBar } from '@/components/ui/MobileActionBar'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { AnalyticsLoader } from '@/components/ui/AnalyticsLoader'
import { BehaviorProvider } from '@/behaviors'
import {
  getPublishedCredentials,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedPosts,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/payload'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shenaworksltd.com'),
  title: {
    default: 'Road & Building Contractors in Meru and Nairobi | Shena Works',
    template: '%s',
  },
  description:
    'Shena Works builds roads, cabro paving, drainage and buildings across Meru, Nairobi and Kenya, with its own excavators, graders and rollers. Request a quote.',
  icons: {
    icon: '/brand/favicon.svg',
  },
}

/**
 * Root layout for the public site. The `(payload)` route group has its own
 * root layout for `/admin`, so the `<html>` shell lives here, not in app/.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const services = await getPublishedServices()
  const equipmentCategories = await getPublishedEquipmentCategories()
  const locations = await getPublishedLocations()
  const credentials = await getPublishedCredentials()
  const hasCredentials = credentials.length > 0
  const posts = await getPublishedPosts()
  const hasInsights = posts.length > 0
  const hasCompanyProfile = Boolean(settings.files.companyProfile?.url)

  return (
    <html lang="en-KE">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.setAttribute("data-js", "");',
          }}
        />
      </head>
      <body>
      <AnalyticsLoader />
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
      </body>
    </html>
  )
}
