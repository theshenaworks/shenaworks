import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })

  // 1. Reference page
  const refPage = await context.newPage()
  const refPath = path.resolve('docs/reference/home/index.html')
  await refPage.goto(`file://${refPath}`, { waitUntil: 'networkidle' })
  await refPage.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
  })
  await refPage.waitForTimeout(500)

  // 2. Localhost page
  const targetPage = await context.newPage()
  await targetPage.context().addCookies([
    {
      name: 'sw_consent',
      value: 'analytics',
      domain: 'localhost',
      path: '/',
    },
  ])
  await targetPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await targetPage.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
  })
  await targetPage.waitForTimeout(500)

  const selector = 'section.intent'
  const refEl = refPage.locator(selector)
  const targetEl = targetPage.locator(selector)

  await fs.promises.mkdir('docs/screenshots/phase-e', { recursive: true })

  await refEl.screenshot({ path: 'docs/screenshots/phase-e/ref-1440-intent.png' })
  await targetEl.screenshot({ path: 'docs/screenshots/phase-e/target-1440-intent.png' })

  console.log('Screenshots captured successfully!')
  await browser.close()
}

main().catch(console.error)
