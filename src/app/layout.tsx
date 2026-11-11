import React from 'react'
import type { Metadata } from 'next'
import '@/styles/globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <body>{children}</body>
    </html>
  )
}
