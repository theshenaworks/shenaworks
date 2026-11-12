import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve(process.cwd(), 'docs/screenshots/phase-a')
fs.mkdirSync(outputDir, { recursive: true })

async function run() {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
    headless: true,
  })

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-375', width: 375, height: 667 },
  ]

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    })

    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // 1. Header at rest
    await page.screenshot({
      path: path.join(outputDir, `header-rest-${vp.name}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: vp.width >= 1024 ? 140 : 80 },
    })

    // 2. Header scrolled (McCarthy style: scroll down past limit, then scroll up slightly to reveal solid header)
    await page.evaluate(() => {
      window.scrollTo(0, 500)
    })
    await page.waitForTimeout(200)
    await page.evaluate(() => {
      window.scrollTo(0, 200)
    })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(outputDir, `header-scrolled-${vp.name}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: vp.width >= 1024 ? 140 : 80 },
    })

    // 3. Footer
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await footer.screenshot({ path: path.join(outputDir, `footer-${vp.name}.png`) })

    // Mobile Action Bar (mobile only)
    if (vp.width <= 768) {
      const actions = page.locator('.actions')
      if (await actions.isVisible()) {
        await actions.screenshot({ path: path.join(outputDir, `mobile-action-bar-${vp.name}.png`) })
      }
    }

    // Reset scroll to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)

    // 4. Dropdowns (desktop & laptop)
    if (vp.width >= 1024) {
      // Services dropdown
      const servicesHas = page.locator('.nav .has:has(a[href="/services"])')
      await servicesHas.hover()
      await page.waitForTimeout(300)
      await page.screenshot({
        path: path.join(outputDir, `dropdown-services-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: 500 },
      })

      // Equipment dropdown
      const equipHas = page.locator('.nav .has:has(a[href="/equipment"])')
      await equipHas.hover()
      await page.waitForTimeout(300)
      await page.screenshot({
        path: path.join(outputDir, `dropdown-equipment-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: 500 },
      })

      // About dropdown
      const aboutHas = page.locator('.nav .has:has(a[href="/about"])')
      await aboutHas.hover()
      await page.waitForTimeout(300)
      await page.screenshot({
        path: path.join(outputDir, `dropdown-about-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: 500 },
      })

      // Close dropdowns
      await page.mouse.move(0, 500)
      await page.waitForTimeout(300)
    }

    // 5. Drawer open (tablet & mobile)
    if (vp.width < 1024) {
      const menuBtn = page.locator('#mb')
      await menuBtn.click()
      await page.waitForTimeout(300)

      // Open a details section (Services)
      const details = page.locator('.drawer details').first()
      await details.evaluate((el: HTMLDetailsElement) => {
        el.open = true
      })
      await page.waitForTimeout(200)

      await page.screenshot({
        path: path.join(outputDir, `drawer-open-${vp.name}.png`),
      })

      // Close drawer
      await menuBtn.click()
      await page.waitForTimeout(300)
    }

    await page.close()
  }

  await browser.close()
  console.log('Screenshots completed!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
