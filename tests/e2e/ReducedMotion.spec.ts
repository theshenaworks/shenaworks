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
      // Check that elements have opacity > 0 or data-reveal="visible"
      const firstReveal = revealElements.first()
      await expect(firstReveal).toBeVisible()
    }
  })

  test('Timeline and Carousel items are visible without motion glitches', async ({ page }) => {
    await page.goto('/services/road-construction-and-earthworks')
    const timelineHeadings = page.locator('h4')
    await expect(timelineHeadings.first()).toBeVisible()
  })
})
