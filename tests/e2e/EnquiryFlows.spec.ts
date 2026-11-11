import { test, expect } from '@playwright/test'

test.describe('Enquiry Flows', () => {
  test('Submitting empty form triggers error banner with field anchors', async ({ page }) => {
    await page.goto('/contact')
    await page.click('button[type="submit"]')

    // Error banner should be visible
    const errorBanner = page.locator('text=Please fix')
    await expect(errorBanner).toBeVisible()

    // Required fields are marked
    await expect(page.locator('#error-name')).toBeVisible()
    await expect(page.locator('#error-phone')).toBeVisible()
    await expect(page.locator('#error-service')).toBeVisible()
    await expect(page.locator('#error-consent')).toBeVisible()
  })

  test('Submitting a project quote (F1) completes and redirects to thank-you', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('#field-name', 'John Mwangi')
    await page.fill('#field-phone', '0712 345 678')
    await page.fill('#field-email', 'john@example.com')
    await page.fill('#field-organisation', 'Meru Highlands Farm')
    await page.selectOption('#field-service', 'road-construction-and-earthworks')
    await page.fill('#field-location', 'Makutano, Meru')
    await page.fill('#field-message', 'We need a 1.2km access road formed, cambered and compacted.')
    await page.check('#field-consent')

    await page.click('button[type="submit"]')

    await page.waitForURL('**/thank-you?type=project**', { timeout: 30000 })
    await expect(page.locator('h1')).toContainText('Thank you')
  })

  test('Pre-filled machine hire flow (F2) loads machine preset and submits successfully', async ({
    page,
  }) => {
    await page.goto('/contact?type=hire&equipment=crawler-excavator')

    // Machine select should be pre-selected to crawler-excavator
    await expect(page.locator('input[value="hire"]')).toBeChecked()
    await expect(page.locator('#field-equipment')).toHaveValue('crawler-excavator')

    await page.fill('#field-name', 'David Kirimi')
    await page.fill('#field-phone', '+254 745 613 252')
    await page.fill('#field-location', 'Nanyuki town')

    // Hire start date (tomorrow)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    await page.fill('#field-hireStart', tomorrow)
    await page.selectOption('#field-hireDuration', '1–2 weeks')
    await page.check('#field-consent')

    await page.click('button[type="submit"]')

    await page.waitForURL('**/thank-you?type=hire**', { timeout: 30000 })
    await expect(page.locator('h1')).toContainText('Thank you')
  })
})
