import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Global Chrome & Accessibility', () => {
  test('Skip link is the first focusable element and links to main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const activeHref = await page.evaluate(() => {
      const active = document.activeElement as HTMLAnchorElement | null
      return active ? active.getAttribute('href') : null
    })
    expect(activeHref).toBe('#main')
  })

  test('Desktop mega panel opens on hover/focus and closes on Escape', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const servicesTrigger = page.locator('header#hd nav.nav .has:has(a[href="/services"])')
    const servicesLink = servicesTrigger.locator('> a[href="/services"]')
    await expect(servicesLink).toBeVisible()

    // Test hover opens mega panel
    await servicesTrigger.hover()
    await page.waitForTimeout(300)
    const megaPanel = page.locator('#p-sv')
    await expect(megaPanel).toBeVisible()

    // Test Escape key closes panel
    await page.keyboard.press('Escape')
    await expect(megaPanel).toBeHidden()

    // Test ArrowDown key opens panel
    await servicesLink.focus()
    await page.keyboard.press('ArrowDown')
    await expect(megaPanel).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(megaPanel).toBeHidden()
  })

  test('Mobile drawer opens, traps focus, and closes on toggle or Escape', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuToggle = page.locator('button#mb')
    await expect(menuToggle).toBeVisible()
    await menuToggle.click()

    const drawer = page.getByRole('dialog', { name: 'Site navigation' })
    await expect(drawer).toBeVisible()

    // Check main content is inert when drawer is open
    const mainContent = page.locator('#main')
    await expect(mainContent).toHaveAttribute('inert', '')

    // Verify focus trap wraps on both boundaries (first visible summary <-> last visible link)
    const firstControl = drawer.locator('summary').first()
    const lastControl = drawer.locator('.meta a[href]').last()

    // 1. First focusable element receives focus on open; Shift+Tab wraps to last control
    await expect(firstControl).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(lastControl).toBeFocused()

    // 2. From last control, press Tab -> focus wraps back to first control
    await page.keyboard.press('Tab')
    await expect(firstControl).toBeFocused()

    // Press Escape to close and restore focus to menu toggle
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(menuToggle).toBeFocused()
  })

  const A11Y_PAGES = [
    { name: 'Home', path: '/' },
    { name: 'Service', path: '/services/road-construction-and-earthworks' },
    { name: 'Project', path: '/projects/the-black-perch-lounge' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Contact', path: '/contact' },
  ]

  for (const { name, path } of A11Y_PAGES) {
    test(`${name} page (${path}) has zero WCAG 2.2 AA violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})
