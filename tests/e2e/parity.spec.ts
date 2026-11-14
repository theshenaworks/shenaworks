import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'

const VIEWPORTS = [
  { width: 1440, height: 900, label: '1440' },
  { width: 1024, height: 768, label: '1024' },
  { width: 768, height: 1024, label: '768' },
  { width: 375, height: 667, label: '375' },
]

interface SectionSpec {
  name: string
  selector: string
  minWidth?: number
  maxWidth?: number
}

const f400 = fs.readFileSync('public/fonts/roboto-v32-latin-400.woff2').toString('base64')
const f400i = fs.readFileSync('public/fonts/roboto-v32-latin-400italic.woff2').toString('base64')
const f700 = fs.readFileSync('public/fonts/roboto-v32-latin-700.woff2').toString('base64')
const fc400 = fs.readFileSync('public/fonts/roboto-condensed-v27-latin-400.woff2').toString('base64')
const fc700 = fs.readFileSync('public/fonts/roboto-condensed-v27-latin-700.woff2').toString('base64')

const SECTIONS: SectionSpec[] = [
  { name: 'header', selector: 'header#hd' },
  { name: 'hero', selector: 'section.hero' },
  { name: 'intent', selector: 'section.intent' },
  { name: 'statement', selector: 'section.stmt' },
  { name: 'services', selector: 'section#services' },
  { name: 'projects', selector: 'section[aria-labelledby="pj-h"]' },
  { name: 'equipment', selector: 'section.eq' },
  { name: 'why', selector: 'section.why' },
  { name: 'locations', selector: 'section.loc' },
  { name: 'cta', selector: 'section.cta' },
  { name: 'footer', selector: 'footer' },
  { name: 'actions', selector: 'nav.actions', maxWidth: 1023 },
]

test.describe('Phase E: Visual Parity Test (AGENTS.md Section 5)', () => {
  const screenshotsDir = path.resolve('docs/screenshots/phase-e')

  test.beforeAll(async () => {
    await fs.promises.mkdir(screenshotsDir, { recursive: true })
  })

  for (const vp of VIEWPORTS) {
    test.describe(`Viewport ${vp.label}px (${vp.width}x${vp.height})`, () => {
      for (const sec of SECTIONS) {
        if (sec.minWidth && vp.width < sec.minWidth) continue
        if (sec.maxWidth && vp.width > sec.maxWidth) continue

        test(`Section "${sec.name}" (${sec.selector}) has visual parity with maxDiffPixelRatio <= 0.01`, async ({
          browser,
        }) => {
          // 1. Reference page context
          const refContext = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            reducedMotion: 'reduce',
          })
          const refPage = await refContext.newPage()
          const refHtmlPath = path.resolve('docs/reference/home/index.html')
          await refPage.goto(`file://${refHtmlPath}`, { waitUntil: 'load' })

          // Inject matching self-hosted font-face rules and disable animations
          await refPage.addStyleTag({
            content: `
              @font-face {
                font-family: "Roboto";
                font-style: normal;
                font-weight: 400;
                src: url("data:font/woff2;base64,${f400}") format("woff2");
              }
              @font-face {
                font-family: "Roboto";
                font-style: italic;
                font-weight: 400;
                src: url("data:font/woff2;base64,${f400i}") format("woff2");
              }
              @font-face {
                font-family: "Roboto";
                font-style: normal;
                font-weight: 700;
                src: url("data:font/woff2;base64,${f700}") format("woff2");
              }
              @font-face {
                font-family: "Roboto Condensed";
                font-style: normal;
                font-weight: 400;
                src: url("data:font/woff2;base64,${fc400}") format("woff2");
              }
              @font-face {
                font-family: "Roboto Condensed";
                font-style: normal;
                font-weight: 700;
                src: url("data:font/woff2;base64,${fc700}") format("woff2");
              }
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
              }
            `,
          })
          await refPage.evaluate(() => document.fonts.ready)
          await refPage.waitForTimeout(300)

          // 2. Localhost page context
          const targetContext = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            reducedMotion: 'reduce',
          })
          await targetContext.addCookies([
            {
              name: 'sw_consent',
              value: 'analytics',
              domain: 'localhost',
              path: '/',
            },
            {
              name: 'sw_consent',
              value: 'analytics',
              domain: '127.0.0.1',
              path: '/',
            },
          ])
          const targetPage = await targetContext.newPage()
          await targetPage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })

          // Disable animations/transitions and hide caret
          await targetPage.addStyleTag({
            content: `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
              }
              aside[aria-label="Cookie consent"] {
                display: none !important;
              }
            `,
          })
          await targetPage.evaluate(() => document.fonts.ready)
          await targetPage.waitForTimeout(300)

          // 3. Select locators
          const refEl = refPage.locator(sec.selector)
          const targetEl = targetPage.locator(sec.selector)

          await expect(refEl).toBeVisible({ timeout: 10000 })
          await expect(targetEl).toBeVisible({ timeout: 10000 })

          // Scroll target section into view if not header
          if (sec.name !== 'header' && sec.name !== 'actions') {
            // Temporarily hide fixed header so it doesn't overlap scrolled sections
            await refPage.evaluate(() => {
              const hd = document.getElementById('hd')
              if (hd) hd.style.display = 'none'
            })
            await targetPage.evaluate(() => {
              const hd = document.getElementById('hd')
              if (hd) hd.style.display = 'none'
            })
            await refEl.evaluate((el) => el.scrollIntoView({ block: 'start' }))
            await targetEl.evaluate((el) => el.scrollIntoView({ block: 'start' }))
            await refPage.waitForTimeout(200)
            await targetPage.waitForTimeout(200)
          }

          // Masks: images masked per AGENTS.md Section 5 Phase E
          const refMasks = [
            refPage.locator('img'),
            refPage.locator('.ph'),
          ]
          const targetMasks = [
            targetPage.locator('img'),
            targetPage.locator('.ph'),
          ]

          const refScreenshotPath = path.join(
            screenshotsDir,
            `ref-${vp.label}-${sec.name}.png`
          )
          const targetScreenshotPath = path.join(
            screenshotsDir,
            `target-${vp.label}-${sec.name}.png`
          )
          const diffScreenshotPath = path.join(
            screenshotsDir,
            `diff-${vp.label}-${sec.name}.png`
          )

          // Take screenshots with masked images
          await refEl.screenshot({
            path: refScreenshotPath,
            mask: refMasks,
            maskColor: '#FF00FF',
          })
          await targetEl.screenshot({
            path: targetScreenshotPath,
            mask: targetMasks,
            maskColor: '#FF00FF',
          })

          await refContext.close()
          await targetContext.close()

          // 4. Compare images using python pixel comparison script
          const compareOutput = execFileSync(
            'python3',
            [
              path.resolve('scripts/compare_images.py'),
              refScreenshotPath,
              targetScreenshotPath,
              diffScreenshotPath,
              '20', // color tolerance
            ],
            { encoding: 'utf-8' }
          )

          const result = JSON.parse(compareOutput)

          if (result.error) {
            throw new Error(`Comparison error: ${result.error}`)
          }

          console.log(
            `[Parity ${vp.label}px] ${sec.name}: diffRatio = ${(
              result.diffRatio * 100
            ).toFixed(4)}% (${result.diffPixels}/${result.totalPixels} px) - diff output: ${diffScreenshotPath}`
          )

          // AGENTS.md Phase E threshold: Fail above maxDiffPixelRatio: 0.01
          expect(result.diffRatio).toBeLessThanOrEqual(0.01)
        })
      }
    })
  }
})
