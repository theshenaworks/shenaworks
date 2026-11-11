import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.shenaworksltd.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/((?!admin).*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  redirects: async () => [
    { source: '/about-us', destination: '/about', permanent: true },
    { source: '/our-services', destination: '/services', permanent: true },
    { source: '/portfolio', destination: '/projects', permanent: true },
    { source: '/our-projects', destination: '/projects', permanent: true },
    { source: '/contact-us', destination: '/contact', permanent: true },
    { source: '/machinery-hire', destination: '/equipment', permanent: true },
    { source: '/plant-hire', destination: '/equipment', permanent: true },
    { source: '/blog', destination: '/insights', permanent: true },
  ],
}

export default withPayload(nextConfig)
