import { test, expect } from '@playwright/test'

test.describe('Project Filters (JavaScript Enabled)', () => {
  test('Filtering by service narrows the project list and hides non-matching projects', async ({ page }) => {
    await page.goto('/projects')

    // Initial state: both cabro paving and general construction projects are visible
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
    await expect(page.locator('a[href="/projects/dukes-cottages-restaurant-and-garden"]')).toBeVisible()

    // Select Cabro paving filter
    const serviceFilter = page.locator('select#filter-service, select[name="service"]')
    await expect(serviceFilter).toBeVisible()
    await serviceFilter.selectOption('cabro-paving')
    await page.waitForTimeout(300)

    // Cabro paving project is visible; Dukes Cottages (general construction only) is filtered out
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
    await expect(page.locator('a[href="/projects/dukes-cottages-restaurant-and-garden"]')).not.toBeVisible()
  })

  test('Direct URL with filter query parameter pre-selects filter and filters projects', async ({
    page,
  }) => {
    await page.goto('/projects?service=cabro-paving')
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
    await expect(page.locator('a[href="/projects/dukes-cottages-restaurant-and-garden"]')).not.toBeVisible()
  })

  test('Filtering by year isolates projects by delivery period', async ({ page }) => {
    await page.goto('/projects')

    const yearFilter = page.locator('select#filter-year, select[name="year"]')
    await expect(yearFilter).toBeVisible()
    await yearFilter.selectOption('2020–2021')
    await page.waitForTimeout(300)

    await expect(page.locator('a[href="/projects/dukes-cottages-restaurant-and-garden"]')).toBeVisible()
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).not.toBeVisible()
  })
})

test.describe('Project Filters (Progressive Enhancement - JS Disabled)', () => {
  test.use({ javaScriptEnabled: false })

  test('Filtering works via standard GET submission with JS disabled', async ({ page }) => {
    const res = await page.goto('/projects?service=cabro-paving')
    expect(res?.status()).toBe(200)

    await expect(page.locator('h1')).toContainText('Work we can show you')
    await expect(page.locator('a[href="/projects/the-black-perch-lounge"]')).toBeVisible()
    await expect(page.locator('a[href="/projects/dukes-cottages-restaurant-and-garden"]')).not.toBeVisible()
  })
})
