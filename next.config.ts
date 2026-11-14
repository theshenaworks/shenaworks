import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const isProd = process.env.NODE_ENV === 'production'
const cspKey =
  process.env.CSP_ENFORCE === 'true'
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only'

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${!isProd ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://media.shenaworksltd.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

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
        { key: cspKey, value: cspDirectives },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  redirects: async () => [
    { source: '/api/enquiry', destination: '/api/enquiries', permanent: false },
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
