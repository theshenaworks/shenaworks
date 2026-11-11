import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Design System Conformance (AUD-12 to AUD-16)', () => {
  it('enforces 0px radius on consent checkbox (AUD-12)', () => {
    const formPath = path.resolve(process.cwd(), 'src/components/blocks/EnquiryForm.tsx')
    const content = fs.readFileSync(formPath, 'utf-8')

    // Find the consent checkbox input tag
    const consentMatch = content.match(/id="field-consent"[\s\S]*?\/>/)
    expect(consentMatch).toBeDefined()
    expect(consentMatch![0]).not.toContain('rounded-full')
    expect(consentMatch![0]).toContain('rounded-none')
  })

  it('prohibits transition-all and non-token durations across UI components (AUD-13)', () => {
    const dialogPath = path.resolve(process.cwd(), 'src/components/ui/Dialog.tsx')
    const dialogContent = fs.readFileSync(dialogPath, 'utf-8')

    expect(dialogContent).not.toContain('transition-all')

    // Verify all source code files don't use transition-all
    const uiDir = path.resolve(process.cwd(), 'src/components/ui')
    const files = fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx'))
    for (const file of files) {
      const code = fs.readFileSync(path.join(uiDir, file), 'utf-8')
      expect(code, `File ${file} must not contain transition-all`).not.toContain('transition-all')
    }
  })

  it('implements desktop header hide-on-scroll-down choreography in CSS (AUD-14)', () => {
    const cssPath = path.resolve(process.cwd(), 'src/styles/globals.css')
    const css = fs.readFileSync(cssPath, 'utf-8')

    // Must define rules linking data-scroll-dir="down" to header translation
    expect(css).toContain('data-scroll-dir="down"')
    expect(css).toContain('data-site-header')
  })

  it('uses lockScroll in MobileDrawer instead of direct body overflow manipulation (AUD-15)', () => {
    const drawerPath = path.resolve(process.cwd(), 'src/components/ui/MobileDrawer.tsx')
    const content = fs.readFileSync(drawerPath, 'utf-8')

    expect(content).toContain('lockScroll')
    expect(content).not.toContain("document.body.style.overflow = 'hidden'")
  })

  it('uses only approved design system palette tokens in Open Graph route (AUD-16)', () => {
    const ogPath = path.resolve(process.cwd(), 'src/app/api/og/route.tsx')
    const ogContent = fs.readFileSync(ogPath, 'utf-8')

    // Off-palette hex colors must not exist
    expect(ogContent).not.toContain('#252627')
    expect(ogContent).not.toContain('#cccccc')
    expect(ogContent).not.toContain('#676868')

    // Must use design tokens
    expect(ogContent).toContain('#2e2a25') // ink-900
    expect(ogContent).toContain('#d7d6d6') // grey-300
    expect(ogContent).toContain('#65615d') // ink-600
    expect(ogContent).toContain('#c14a12') // accent-500
  })
})
