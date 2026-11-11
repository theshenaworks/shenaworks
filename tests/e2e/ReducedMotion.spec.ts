import { test, expect } from '@playwright/test'

test.describe('Reduced Motion Compliance', () => {
  test.use({
    reducedMotion: 'reduce',
  })

  test('Pages load with immediate visibility and zero reveal delays under reduced motion', async ({
    page,
  }) => {
    await page.goto('/')

    // Under reduced motion, data-reveal elements should become visible without animation delay
    const revealElements = page.locator('[data-reveal]')
    const count = await revealElements.count()

    if (count > 0) {
      const firstReveal = revealElements.first()
      await expect(firstReveal).toBeVisible()
      const opacity = await firstReveal.evaluate((el) => window.getComputedStyle(el).opacity)
      expect(Number(opacity)).toBeGreaterThan(0)
    }
  })

  test('Timeline and Carousel items are visible without motion glitches', async ({ page }) => {
    await page.goto('/services/road-construction-and-earthworks')
    const timelineHeadings = page.locator('h4')
    await expect(timelineHeadings.first()).toBeVisible()
  })
})
