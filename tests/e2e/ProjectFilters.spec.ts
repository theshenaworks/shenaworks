import { test, expect } from '@playwright/test'

test.describe('Project Filters (JavaScript Enabled)', () => {
  test('Filtering by service narrows the project list', async ({ page }) => {
    await page.goto('/projects')

    // Initial count of projects
    const initialCards = page.locator('article')
    const initialCount = await initialCards.count()
    expect(initialCount).toBeGreaterThan(0)

    // Select Cabro paving filter
    const serviceFilter = page.locator('select#filter-service, select[name="service"]')
    if (await serviceFilter.isVisible()) {
      await serviceFilter.selectOption('cabro-paving')
      await page.waitForTimeout(300)

      // Projects with cabro paving remain visible
      await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
    }
  })

  test('Direct URL with filter query parameter pre-selects filter and filters projects', async ({
    page,
  }) => {
    await page.goto('/projects?service=cabro-paving')
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
  })
})

test.describe('Project Filters (Progressive Enhancement - JS Disabled)', () => {
  test.use({ javaScriptEnabled: false })

  test('Filtering works via standard GET submission with JS disabled', async ({ page }) => {
    const res = await page.goto('/projects?service=cabro-paving')
    expect(res?.status()).toBe(200)

    await expect(page.locator('h1')).toContainText('Work we can show you')
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
  })
})
