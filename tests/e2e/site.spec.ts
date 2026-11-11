import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PUBLISHED_ROUTES = [
  '/',
  '/about',
  '/about/leadership',
  '/services',
  '/services/road-construction-and-earthworks',
  '/services/road-construction-and-earthworks/cabro-paving',
  '/services/general-construction',
  '/services/interior-design',
  '/services/project-management',
  '/projects',
  '/projects/the-black-perch-lounge',
  '/projects/the-pin-hideout',
  '/projects/dukes-cottages-restaurant-and-garden',
  '/equipment',
  '/equipment/excavators',
  '/equipment/excavators/crawler-excavator',
  '/locations/meru',
  '/contact',
  '/privacy',
  '/cookies',
]

const GATED_ROUTES = [
  '/services/architecture-and-consultancy',
  '/services/bills-of-quantities-and-estimating',
  '/locations/nairobi',
  '/about/credentials-and-safety',
  '/insights',
]

const BANNED_SUPERLATIVES =
  /\b(premier|leading|best|world-class|exceptional|unrivalled|cutting-edge|seamless)\b/i

test.describe('Publishing gate & content integrity', () => {
  for (const route of PUBLISHED_ROUTES) {
    test(`Route ${route} renders 200 with zero [CONFIRM tokens or banned superlatives`, async ({
      page,
    }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      const bodyText = await page.locator('body').innerText()
      expect(bodyText).not.toContain('[CONFIRM')
      expect(BANNED_SUPERLATIVES.test(bodyText)).toBe(false)
    })
  }

  for (const route of GATED_ROUTES) {
    test(`Gated route ${route} returns 404 until verified`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(404)
    })
  }
})

test.describe('WCAG 2.2 AA Accessibility (axe-core)', () => {
  const A11Y_ROUTES = [
    '/',
    '/services/road-construction-and-earthworks',
    '/projects/the-black-perch-lounge',
    '/equipment/excavators/crawler-excavator',
    '/contact',
  ]

  for (const route of A11Y_ROUTES) {
    test(`Route ${route} passes axe-core WCAG 2.2 AA checks`, async ({ page }) => {
      await page.goto(route)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }
})

test.describe('Progressive enhancement (JavaScript disabled)', () => {
  test.use({ javaScriptEnabled: false })

  test('Home, Projects filter, and Contact form render with JS disabled', async ({ page }) => {
    const homeRes = await page.goto('/')
    expect(homeRes?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Roads, earthworks and buildings')

    const projectsRes = await page.goto('/projects?service=cabro-paving')
    expect(projectsRes?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Work we can show you')

    const contactRes = await page.goto('/contact?type=hire')
    expect(contactRes?.status()).toBe(200)
    await expect(page.locator('form[action="/api/enquiries"]')).toBeVisible()
  })
})
