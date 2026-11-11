import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Structure & Refactoring (AUD-17, AUD-18, D-06)', () => {
  it('splits all 15 collections into individual files matching BUILD-GUIDE.md (AUD-17, D-06)', () => {
    const expectedCollections = [
      'Users.ts',
      'Media.ts',
      'EnquiryAttachments.ts',
      'Services.ts',
      'Projects.ts',
      'EquipmentCategories.ts',
      'Equipment.ts',
      'Credentials.ts',
      'Team.ts',
      'Testimonials.ts',
      'PostCategories.ts',
      'Posts.ts',
      'Locations.ts',
      'LegalPages.ts',
      'Enquiries.ts',
    ]

    const collectionsDir = path.resolve(process.cwd(), 'src/collections')
    for (const colFile of expectedCollections) {
      const exists = fs.existsSync(path.join(collectionsDir, colFile))
      expect(exists, `Expected collection file ${colFile} to exist`).toBe(true)
    }
  })

  it('splits all 7 globals into individual files matching BUILD-GUIDE.md (AUD-17, D-06)', () => {
    const expectedGlobals = [
      'SiteSettings.ts',
      'HomePage.ts',
      'AboutPage.ts',
      'CredentialsPage.ts',
      'ServicesIndex.ts',
      'ProjectsIndex.ts',
      'EquipmentIndex.ts',
    ]

    const globalsDir = path.resolve(process.cwd(), 'src/globals')
    for (const globFile of expectedGlobals) {
      const exists = fs.existsSync(path.join(globalsDir, globFile))
      expect(exists, `Expected global file ${globFile} to exist`).toBe(true)
    }
  })

  it('provides the four UI wrappers matching D-06 and BUILD-GUIDE.md (AUD-18, D-06)', () => {
    const expectedUi = [
      'MegaPanel.tsx',
      'Pagination.tsx',
      'PhoneLink.tsx',
      'WhatsAppLink.tsx',
    ]

    const uiDir = path.resolve(process.cwd(), 'src/components/ui')
    for (const uiFile of expectedUi) {
      const exists = fs.existsSync(path.join(uiDir, uiFile))
      expect(exists, `Expected UI file ${uiFile} to exist`).toBe(true)
    }
  })

  it('verifies PhoneLink and WhatsAppLink build canonical URLs (D-06)', () => {
    const phoneLinkContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/ui/PhoneLink.tsx'),
      'utf-8',
    )
    expect(phoneLinkContent).toContain('href={`tel:${phoneE164}`}')
    expect(phoneLinkContent).toContain('call_click')

    const waLinkContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/ui/WhatsAppLink.tsx'),
      'utf-8',
    )
    expect(waLinkContent).toContain('buildWhatsAppUrl')
    expect(waLinkContent).toContain('whatsapp_click')
  })
})
