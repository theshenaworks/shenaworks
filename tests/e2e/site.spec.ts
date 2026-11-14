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
  '/insights',
  '/insights/category/roads-and-paving',
  '/insights/murram-gravel-cabro-or-tarmac-access-road',
  '/contact',
  '/privacy',
  '/cookies',
]

const GATED_ROUTES = [
  '/services/architecture-and-consultancy',
  '/services/bills-of-quantities-and-estimating',
  '/locations/nairobi',
  '/about/credentials-and-safety',
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
    '/insights',
    '/insights/murram-gravel-cabro-or-tarmac-access-road',
    '/contact',
  ]

  for (const route of A11Y_ROUTES) {
    test(`Route ${route} passes axe-core WCAG 2.2 AA checks`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')
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

    const insightsRes = await page.goto('/insights?category=equipment')
    expect(insightsRes?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Notes from site')
    await expect(page.locator('#cnt')).toContainText('Showing 2 of 8 articles')

    const contactRes = await page.goto('/contact?type=hire')
    expect(contactRes?.status()).toBe(200)
    await expect(page.locator('form[action="/api/enquiries"]')).toBeVisible()
  })
})

test.describe('Insights index, filtering, and article detail', () => {
  test('Navigation and footer expose Insights link once published posts exist', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.locator('header .nav a[href="/insights"]')).toBeVisible()
    await expect(page.locator('footer .f-nav a[href="/insights"]')).toBeVisible()
  })

  test('Insights index supports search, category filtering, reset, and featured layout', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/insights')

    await expect(page.locator('body')).toHaveClass(/\bhw\b/)
    await expect(page.locator('h1')).toContainText('Notes from site')
    await expect(page.locator('#cnt')).toContainText('Showing 8 of 8 articles')
    await expect(page.locator('#pg .pc.feat')).toHaveCount(1)
    await expect(page.locator('#pg .pc')).toHaveCount(8)
    await expect(page.locator('#promo')).toBeVisible()

    // Filter by category via select dropdown
    await page.selectOption('#cat', 'equipment')
    await expect(page.locator('#cnt')).toContainText('Showing 2 of 8 articles')
    await expect(page.locator('#pg .pc.feat')).toHaveCount(0)

    // Filter by search input
    await page.fill('#q', 'grader')
    await expect(page.locator('#cnt')).toContainText('Showing 1 of 8 articles')
    await expect(page.locator('#pg .pc h2')).toContainText('motor grader')

    // Empty state + reset
    await page.fill('#q', 'nonexistent-keyword-xyz')
    await expect(page.locator('#cnt')).toContainText('Showing 0 of 8 articles')
    await expect(page.locator('#em')).toBeVisible()
    await page.click('#clr')
    await expect(page.locator('#cnt')).toContainText('Showing 8 of 8 articles')
    await expect(page.locator('#pg .pc.feat')).toHaveCount(1)
  })

  test('Article page renders cover, body sections, share controls, author card, related service, and related articles', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/insights/murram-gravel-cabro-or-tarmac-access-road')

    await expect(page.locator('h1')).toContainText('Murram, cabro or tarmac')
    await expect(page.locator('figure.cover img')).toBeVisible()
    await expect(page.locator('article.art .body h2')).toHaveCount(5)
    await expect(page.locator('#share #wa')).toHaveAttribute('href', /wa\.me/)
    await expect(page.locator('#share #li')).toHaveAttribute('href', /linkedin\.com/)
    await expect(page.locator('aside.acard')).toContainText('Newton')
    await expect(page.locator('section.fsec .panel')).toContainText('Road construction and earthworks')
    await expect(page.locator('section.rel .pgrid .pc')).toHaveCount(3)
  })
})
