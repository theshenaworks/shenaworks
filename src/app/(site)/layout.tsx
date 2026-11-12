import React from 'react'
import type { Metadata } from 'next'
import '@/styles/site.css'
import { LogoSprite } from '@/components/ui/LogoSprite'
import { Header } from '@/components/ui/Header'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { Footer } from '@/components/ui/Footer'
import { MobileActionBar } from '@/components/ui/MobileActionBar'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { AnalyticsLoader } from '@/components/ui/AnalyticsLoader'
import { SiteBehaviors } from '@/behaviors/SiteBehaviors'

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
 * Root layout for the public site (AGENTS.md Section 0 & Section 5 Phase A).
 * - Imports site.css verbatim (Rule 1).
 * - Inlines logo sprite once (Rule 4).
 * - Emits exact shell DOM hierarchy (Rule 2).
 * - Runs SiteBehaviors for vanilla DOM events and cleanup (Rule 5).
 * - Keeps CookieBanner mounted unstyled as known gap (Condition 5).
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
        <LogoSprite />
        <div className="scrim" id="sc" aria-hidden="true" />
        <Header />
        <MobileDrawer />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <CookieBanner />
        <SiteBehaviors />
        <AnalyticsLoader />
      </body>
    </html>
  )
}
