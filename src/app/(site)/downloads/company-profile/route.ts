import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/content'

export async function GET() {
  const settings = getSiteSettings()
  const profileUrl = settings.files.companyProfile?.url
  if (!profileUrl) {
    return new NextResponse('Company profile not yet uploaded.', { status: 404 })
  }
  return NextResponse.redirect(new URL(profileUrl, process.env.NEXT_PUBLIC_SITE_URL || 'https://shenaworksltd.com'), 302)
}
