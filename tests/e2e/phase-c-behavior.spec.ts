import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots/phase-c')
const ARTIFACT_DIR = '/home/cooper/.gemini/antigravity/brain/8156e791-8428-4f50-9baa-ea3fc84de309/screenshots/phase-c'

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
fs.mkdirSync(ARTIFACT_DIR, { recursive: true })

async function saveScreenshot(pageOrLocator: any, filename: string) {
  const p1 = path.join(SCREENSHOT_DIR, filename)
  const p2 = path.join(ARTIFACT_DIR, filename)
  const buf = await pageOrLocator.screenshot()
  fs.writeFileSync(p1, buf)
  fs.writeFileSync(p2, buf)
}

test.describe('Phase C: Pinned Statement Scroll Wipe', () => {
  test('Statement wipes smoothly from layer 1 to layer 2 on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const stmtRun = page.locator('.stmt-run')
    await expect(stmtRun).toBeVisible()

    const l2 = page.locator('.stmt-layer.l2')
    await expect(l2).toBeAttached()

    // 1. Scroll so the top of .stmt-run reaches the top of the viewport
    const runTop = await stmtRun.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return r.top + window.scrollY
    })
    await page.evaluate((y) => window.scrollTo(0, y), runTop)
    await page.waitForTimeout(200)

    // At top of stmt-run (r.top = 0, t = 0), --p should be 0 (clamped)
    let pVal = await l2.evaluate((el) => {
      return parseFloat(getComputedStyle(el).getPropertyValue('--p') || '0')
    })
    expect(pVal).toBeCloseTo(0, 1)

    const stmtStick = page.locator('.stmt-stick')
    await saveScreenshot(stmtStick, 'statement-wipe-0-desktop.png')

    // 2. Scroll halfway through statement wipe range (t = 0.45, so (0.45-0.3)/0.3 = 0.5)
    const maxScroll = await stmtRun.evaluate((el) => (el as HTMLElement).offsetHeight - window.innerHeight)
    await page.evaluate(({ y, maxScroll }) => window.scrollTo(0, y + maxScroll * 0.45), {
      y: runTop,
      maxScroll,
    })
    await page.waitForTimeout(200)

    pVal = await l2.evaluate((el) => {
      return parseFloat(getComputedStyle(el).getPropertyValue('--p') || '0')
    })
    expect(pVal).toBeGreaterThan(0.3)
    expect(pVal).toBeLessThan(0.7)

    await saveScreenshot(stmtStick, 'statement-wipe-50-desktop.png')

    // 3. Scroll past wipe range (t = 0.7, so (0.7-0.3)/0.3 = 1.33 clamped to 1.0)
    await page.evaluate(({ y, maxScroll }) => window.scrollTo(0, y + maxScroll * 0.7), {
      y: runTop,
      maxScroll,
    })
    await page.waitForTimeout(200)

    pVal = await l2.evaluate((el) => {
      return parseFloat(getComputedStyle(el).getPropertyValue('--p') || '0')
    })
    expect(pVal).toBeCloseTo(1, 1)

    await saveScreenshot(stmtStick, 'statement-wipe-100-desktop.png')
  })

  test('Statement wipe works on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const stmtRun = page.locator('.stmt-run')
    const l2 = page.locator('.stmt-layer.l2')
    const stmtStick = page.locator('.stmt-stick')

    const runTop = await stmtRun.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return r.top + window.scrollY
    })
    await page.evaluate((y) => window.scrollTo(0, y), runTop)
    await page.waitForTimeout(200)

    let pVal = await l2.evaluate((el) => {
      return parseFloat(getComputedStyle(el).getPropertyValue('--p') || '0')
    })
    expect(pVal).toBeCloseTo(0, 1)
    await saveScreenshot(stmtStick, 'statement-wipe-0-mobile-375.png')

    // Scroll halfway through wipe range (t = 0.45)
    const maxScroll = await stmtRun.evaluate((el) => (el as HTMLElement).offsetHeight - window.innerHeight)
    await page.evaluate(({ y, maxScroll }) => window.scrollTo(0, y + maxScroll * 0.45), {
      y: runTop,
      maxScroll,
    })
    await page.waitForTimeout(200)

    pVal = await l2.evaluate((el) => {
      return parseFloat(getComputedStyle(el).getPropertyValue('--p') || '0')
    })
    expect(pVal).toBeGreaterThan(0.3)
    expect(pVal).toBeLessThan(0.7)
    await saveScreenshot(stmtStick, 'statement-wipe-50-mobile-375.png')
  })

  test('prefers-reduced-motion: reduce disables wipe and renders static layout', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const stmtRun = page.locator('.stmt-run')
    const stmtStick = page.locator('.stmt-stick')
    const l2 = page.locator('.stmt-layer.l2')

    // Verify CSS handles reduced-motion: height is auto, position is static, clip-path is none
    const runHeight = await stmtRun.evaluate((el) => getComputedStyle(el).height)
    const stickPosition = await stmtStick.evaluate((el) => getComputedStyle(el).position)
    const l2ClipPath = await l2.evaluate((el) => getComputedStyle(el).clipPath)

    expect(stickPosition).toBe('static')
    expect(l2ClipPath).toBe('none')

    // Scroll and ensure no scroll listener alters --p
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(100)

    const pVal = await l2.evaluate((el) => el.style.getPropertyValue('--p'))
    expect(pVal).toBe('')

    const stmtSection = page.locator('section.stmt')
    await saveScreenshot(stmtSection, 'statement-reduced-motion.png')
  })
})

test.describe('Phase C: Project Filter Chips (JS Enabled)', () => {
  test('Filter chips toggle, hide/show cards, and update live announcement on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const pgridSection = page.locator('section[aria-labelledby="pj-h"]')
    await pgridSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    const allChip = page.locator('.chip[data-f="all"]')
    const roadsChip = page.locator('.chip[data-f="roads"]')
    const buildChip = page.locator('.chip[data-f="build"]')
    const hospChip = page.locator('.chip[data-f="hosp"]')
    const intChip = page.locator('.chip[data-f="int"]')
    const pcount = page.locator('#pcount')

    // Initial state: all cards visible
    await expect(allChip).toHaveAttribute('aria-pressed', 'true')
    await expect(roadsChip).toHaveAttribute('aria-pressed', 'false')

    const cards = page.locator('#pgrid .card')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThanOrEqual(3)
    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }

    // 1. Click Roads and paving (data-f="roads")
    await roadsChip.click()
    await expect(roadsChip).toHaveAttribute('aria-pressed', 'true')
    await expect(allChip).toHaveAttribute('aria-pressed', 'false')

    // Count how many cards have data-t including 'roads'
    const roadCards = page.locator('#pgrid .card[data-t~="roads"]')
    const roadCount = await roadCards.count()
    await expect(pcount).toHaveText(`${roadCount} projects shown`)

    // The Black Perch Lounge & The Pin Hideout have roads -> visible
    await expect(page.locator('#pgrid .card:has-text("The Black Perch Lounge")')).toBeVisible()
    await expect(page.locator('#pgrid .card:has-text("The Pin Hideout")')).toBeVisible()
    // Dukes Cottages (build hosp, no roads) -> hidden
    await expect(page.locator('#pgrid .card:has-text("Dukes Cottages")')).toBeHidden()

    await saveScreenshot(pgridSection, 'chips-desktop-roads.png')

    // 2. Click Interiors (data-f="int")
    await intChip.click()
    await expect(intChip).toHaveAttribute('aria-pressed', 'true')
    await expect(roadsChip).toHaveAttribute('aria-pressed', 'false')

    const intCards = page.locator('#pgrid .card[data-t~="int"]')
    const intCount = await intCards.count()
    await expect(pcount).toHaveText(`${intCount} project${intCount === 1 ? '' : 's'} shown`)

    await expect(page.locator('#pgrid .card:has-text("The Black Perch Lounge")')).toBeVisible()
    await expect(page.locator('#pgrid .card:has-text("The Pin Hideout")')).toBeHidden()
    await expect(page.locator('#pgrid .card:has-text("Dukes Cottages")')).toBeHidden()

    await saveScreenshot(pgridSection, 'chips-desktop-interiors.png')

    // 3. Click All (data-f="all")
    await allChip.click()
    await expect(allChip).toHaveAttribute('aria-pressed', 'true')
    await expect(intChip).toHaveAttribute('aria-pressed', 'false')
    await expect(pcount).toHaveText(`${cardCount} projects shown`)

    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
  })

  test('Filter chips work on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const pgridSection = page.locator('section[aria-labelledby="pj-h"]')
    await pgridSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    const roadsChip = page.locator('.chip[data-f="roads"]')
    const pcount = page.locator('#pcount')

    await roadsChip.click()
    await expect(roadsChip).toHaveAttribute('aria-pressed', 'true')
    await expect(pcount).toContainText('projects shown')

    await saveScreenshot(pgridSection, 'chips-mobile-375-roads.png')
  })
})

test.describe('Phase C: Progressive Enhancement (JS Disabled)', () => {
  test.use({ javaScriptEnabled: false })

  test('Page renders complete content and project filter works via GET when JS is disabled', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    // 1. Initial load with JS disabled
    await page.goto('/')

    // Verify all core sections render
    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('.intent')).toBeVisible()
    await expect(page.locator('section.stmt')).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('section[aria-labelledby="pj-h"]')).toBeVisible()
    await expect(page.locator('.eq')).toBeVisible()
    await expect(page.locator('.why')).toBeVisible()
    await expect(page.locator('.loc')).toBeVisible()
    await expect(page.locator('.cta')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()

    // 2. Click "Roads and paving" submit button
    const pgridSection = page.locator('section[aria-labelledby="pj-h"]')
    await pgridSection.scrollIntoViewIfNeeded()

    const roadsBtn = page.locator('button.chip[value="roads"]')
    await roadsBtn.click()

    // Verify URL updated via form GET
    expect(page.url()).toContain('filter=roads')

    // Verify SSR output:
    // Roads chip is pressed
    const roadsChipAfter = page.locator('.chip[value="roads"]')
    await expect(roadsChipAfter).toHaveAttribute('aria-pressed', 'true')

    const allChipAfter = page.locator('.chip[value="all"]')
    await expect(allChipAfter).toHaveAttribute('aria-pressed', 'false')

    // 2 cards visible, 1 card hidden
    await expect(page.locator('#pgrid .card:has-text("The Black Perch Lounge")')).toBeVisible()
    await expect(page.locator('#pgrid .card:has-text("The Pin Hideout")')).toBeVisible()
    await expect(page.locator('#pgrid .card:has-text("Dukes Cottages")')).toBeHidden()

    // #pcount announces road projects
    await expect(page.locator('#pcount')).toContainText('projects shown')

    await saveScreenshot(page.locator('section[aria-labelledby="pj-h"]'), 'chips-js-disabled-roads.png')

    // 3. Click "Interiors" button
    const intBtn = page.locator('button.chip[value="int"]')
    await intBtn.click()

    expect(page.url()).toContain('filter=int')
    await expect(page.locator('.chip[value="int"]')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#pcount')).toContainText('project')

    await expect(page.locator('#pgrid .card:has-text("The Black Perch Lounge")')).toBeVisible()
    await expect(page.locator('#pgrid .card:has-text("The Pin Hideout")')).toBeHidden()
    await expect(page.locator('#pgrid .card:has-text("Dukes Cottages")')).toBeHidden()

    await saveScreenshot(page.locator('section[aria-labelledby="pj-h"]'), 'chips-js-disabled-interiors.png')
  })
})
