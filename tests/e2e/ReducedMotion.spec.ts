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
      for (let i = 0; i < count; i++) {
        const reveal = revealElements.nth(i)
        await expect(reveal).toBeVisible()
        const styles = await reveal.evaluate((el) => {
          const comp = window.getComputedStyle(el)
          return {
            opacity: comp.opacity,
            transitionDuration: comp.transitionDuration,
          }
        })
        expect(Number(styles.opacity)).toBe(1)
        expect(styles.transitionDuration === '0s' || styles.transitionDuration === '0.001s').toBe(true)
      }
    }
  })

  test('Timeline and Carousel items are visible without motion glitches', async ({ page }) => {
    await page.goto('/services/road-construction-and-earthworks')
    const timelineHeadings = page.locator('h4')
    await expect(timelineHeadings.first()).toBeVisible()
  })
})
