import React from 'react'
import { getSiteSettings } from '@/lib/payload'
import { MobileActionBarClient } from './MobileActionBarClient'

export async function MobileActionBar() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <MobileActionBarClient
      phoneDisplay={settings?.contact?.phoneDisplay}
      phoneE164={settings?.contact?.phoneE164}
      whatsappNumber={settings?.contact?.whatsappNumber}
      email={settings?.contact?.email}
    />
  )
}
