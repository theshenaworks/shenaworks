import React from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import '@/styles/site.css'
import { LogoSprite } from '@/components/ui/LogoSprite'
import { Header } from '@/components/ui/Header'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { Footer } from '@/components/ui/Footer'
import { MobileActionBar } from '@/components/ui/MobileActionBar'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { AnalyticsLoader } from '@/components/ui/AnalyticsLoader'
import { NavigationProvider } from '@/components/ui/NavigationContext'
import { Scrim } from '@/components/ui/Scrim'

const roboto = localFont({
  src: [
    {
      path: '../../../public/fonts/roboto-v32-latin-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/roboto-v32-latin-400italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/roboto-v32-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
})

const robotoCondensed = localFont({
  src: [
    {
      path: '../../../public/fonts/roboto-condensed-v27-latin-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/roboto-condensed-v27-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

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
 * Root layout for the public site (Next.js 16 Best Practices Architecture).
 * - Optimized local fonts via next/font/local (zero CLS, preloaded).
 * - Inlines logo sprite once.
 * - Emits exact shell DOM hierarchy matching approved design.
 * - Declarative React navigation, drawer, form, and gallery components.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-KE"
      className={`${roboto.variable} ${robotoCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.setAttribute("data-js", "");',
          }}
        />
      </head>
      <body>
        <NavigationProvider>
          <LogoSprite />
          <Scrim />
          <Header />
          <MobileDrawer />
          <main id="main">{children}</main>
          <Footer />
          <MobileActionBar />
          <CookieBanner />
          <AnalyticsLoader />
        </NavigationProvider>
      </body>
    </html>
  )
}
