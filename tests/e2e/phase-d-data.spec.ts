import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots/phase-d')
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || path.resolve(process.cwd(), 'docs/screenshots/artifacts/phase-d')

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
fs.mkdirSync(ARTIFACT_DIR, { recursive: true })

async function saveScreenshot(pageOrLocator: any, filename: string) {
  const p1 = path.join(SCREENSHOT_DIR, filename)
  const p2 = path.join(ARTIFACT_DIR, filename)
  const buf = await pageOrLocator.screenshot()
  fs.writeFileSync(p1, buf)
  fs.writeFileSync(p2, buf)
}

test.describe('Phase D: Payload Local API Integration & Conditional Rendering', () => {
  test('Header mega panels render Payload data and respect conditional rules', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 1. Secondary nav data from site-settings
    const topNav = page.locator('header nav.top')
    await expect(topNav).toContainText('Meru, Kenya')
    await expect(topNav.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+254718971896')

    // 2. Services Mega Panel
    const servicesTrigger = page.locator('.nav .has:has(a[href="/services"])')
    await servicesTrigger.hover()
    await page.waitForTimeout(300)

    const servicesPanel = servicesTrigger.locator('.pan')
    await expect(servicesPanel).toBeVisible()

    // Verify published services grouped correctly
    await expect(servicesPanel).toContainText('Roads and earthworks')
    await expect(servicesPanel).toContainText('Buildings and interiors')
    await expect(servicesPanel).toContainText('Planning and delivery')

    // Rule 2 / SITE-PLAN 8: Gated services in draft must NOT appear
    await expect(servicesPanel.locator('a[href*="architecture"]')).toHaveCount(0)
    await expect(servicesPanel.locator('a[href*="quantities"]')).toHaveCount(0)

    await saveScreenshot(servicesPanel, 'dropdown-services-payload.png')

    // 3. Equipment Mega Panel
    const equipmentTrigger = page.locator('.nav .has:has(a[href="/equipment"])')
    await equipmentTrigger.hover()
    await page.waitForTimeout(300)

    const equipmentPanel = equipmentTrigger.locator('.pan')
    await expect(equipmentPanel).toBeVisible()
    await expect(equipmentPanel).toContainText('Excavators')
    await expect(equipmentPanel).toContainText('Motor graders')
    await expect(equipmentPanel).toContainText('Rollers and compactors')
    await expect(equipmentPanel).toContainText('Bulldozers')
    await expect(equipmentPanel).toContainText('All equipment')
    await expect(equipmentPanel).toContainText('How hire works')

    await saveScreenshot(equipmentPanel, 'dropdown-equipment-payload.png')

    // 4. About Mega Panel
    const aboutTrigger = page.locator('.nav .has:has(a[href="/about"])')
    await aboutTrigger.hover()
    await page.waitForTimeout(300)

    const aboutPanel = aboutTrigger.locator('.pan')
    await expect(aboutPanel).toBeVisible()
    await expect(aboutPanel).toContainText('Company')
    await expect(aboutPanel).toContainText('Leadership')

    await saveScreenshot(aboutPanel, 'dropdown-about-payload.png')
  })

  test('Conditional rendering rules (SITE-PLAN 8) are strictly enforced on Home', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Rule: ProofBar hidden unless >= 2 verified proof items
    await expect(page.locator('.proof-bar')).toHaveCount(0)

    // Rule: Testimonials hidden unless >= 1 testimonial passes publishing gate
    await expect(page.locator('.testimonials')).toHaveCount(0)

    // Rule: InsightsRow renders when >= 3 published posts exist
    await expect(page.locator('.insights-row')).toBeVisible()
    await expect(page.locator('.insights-row article')).toHaveCount(3)
  })

  test('Sections render dynamic Payload data with exact reference DOM structure', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Section 1: Hero
    const hero = page.locator('section.hero')
    await expect(hero).toBeVisible()
    const heroImg = hero.locator('img')
    await expect(heroImg).toHaveAttribute('data-nimg', 'fill')

    // Section 4: Services
    const servicesSection = page.locator('section#services')
    await expect(servicesSection).toBeVisible()
    const serviceCards = servicesSection.locator('.card')
    const serviceCount = await serviceCards.count()
    expect(serviceCount).toBeGreaterThanOrEqual(5)

    // Section 5: Projects
    const projectsSection = page.locator('section[aria-labelledby="pj-h"]')
    await expect(projectsSection).toBeVisible()
    const projectCards = projectsSection.locator('.card')
    const projectCount = await projectCards.count()
    expect(projectCount).toBe(3) // 3 featured projects matching reference .grid.c3

    // Section 6: Equipment Teaser
    const eqSection = page.locator('section.eq')
    await expect(eqSection).toBeVisible()
    const eqCards = eqSection.locator('.card')
    await expect(eqCards).toHaveCount(3)

    // Section 7: Why Shena
    const whySection = page.locator('section.why')
    await expect(whySection).toBeVisible()
    await expect(whySection.locator('ol li')).toHaveCount(3)

    // Section 10: Locations
    const locSection = page.locator('section.loc')
    await expect(locSection).toBeVisible()
    await expect(locSection).toContainText('Meru')
    await expect(locSection).toContainText('Nairobi')

    // Section 11: CTA Band with dynamic contact info
    const ctaSection = page.locator('section.cta')
    await expect(ctaSection).toBeVisible()
    await expect(ctaSection).toContainText('+254 718 971 896')
    await expect(ctaSection.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+254718971896')
    await expect(ctaSection.locator('a[href*="wa.me"]')).toHaveAttribute('href', /254718971896/)

    // Footer with dynamic contact info
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('+254 718 971 896')
    await expect(footer).toContainText('Shena Works Limited')

    // Capture full-page screenshot of Phase D
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase-d-fullpage-1440.png'), fullPage: true })
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase-d-fullpage-1440.png'), fullPage: true })
  })

  test('Mobile drawer and action bar reflect dynamic site settings', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Mobile Action Bar
    const actionBar = page.locator('nav.actions')
    await expect(actionBar).toBeVisible()
    await expect(actionBar.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+254718971896')
    await expect(actionBar.locator('a[href*="wa.me"]')).toHaveAttribute('href', /254718971896/)

    // Mobile Drawer
    await page.locator('#mb').click()
    const drawer = page.locator('#dr')
    await expect(drawer).toHaveClass(/open/)
    await expect(drawer).toContainText('Services')
    await expect(drawer).toContainText('Equipment')
    await expect(drawer).toContainText('About')
    await expect(drawer).toContainText('+254 718 971 896')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase-d-fullpage-375.png'), fullPage: true })
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase-d-fullpage-375.png'), fullPage: true })
  })
})
