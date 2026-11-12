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

const f400 = fs.readFileSync('public/fonts/roboto-v32-latin-400.woff2').toString('base64')
const f400i = fs.readFileSync('public/fonts/roboto-v32-latin-400italic.woff2').toString('base64')
const f700 = fs.readFileSync('public/fonts/roboto-v32-latin-700.woff2').toString('base64')
const fc400 = fs.readFileSync('public/fonts/roboto-condensed-v27-latin-400.woff2').toString('base64')
const fc700 = fs.readFileSync('public/fonts/roboto-condensed-v27-latin-700.woff2').toString('base64')

const BATCH_1_PAGES = [
  {
    name: 'about',
    route: '/about',
    refHtml: 'docs/reference/pages/about.html',
    sections: [
      { name: 'hero', selector: 'section.hero.page' },
      { name: 'intro', selector: 'section[aria-labelledby="who-h"]' },
      { name: 'how-we-work', selector: 'section#how-we-work' },
      { name: 'statement', selector: 'section.statement' },
      { name: 'locations', selector: 'section.loc' },
      { name: 'cta', selector: 'section.cta' },
    ],
  },
  {
    name: 'leadership',
    route: '/about/leadership',
    refHtml: 'docs/reference/pages/leadership.html',
    sections: [
      { name: 'ph-head', selector: 'div.ph-head' },
      { name: 'person', selector: 'section[aria-labelledby="nm-h"]' },
      { name: 'bio', selector: 'section.bio' },
      { name: 'experience', selector: 'section[aria-labelledby="ex-h"]' },
      { name: 'areas', selector: 'section[aria-labelledby="aw-h"]' },
      { name: 'cta', selector: 'section.cta' },
    ],
  },
  {
    name: 'credentials',
    route: '/about/credentials-and-safety',
    refHtml: 'docs/reference/pages/credentials-and-safety.html',
    sections: [
      { name: 'ph-head', selector: 'div.ph-head' },
      { name: 'table', selector: 'section[aria-labelledby="ct-h"]' },
      { name: 'safety', selector: 'section.fsec' },
      { name: 'prose', selector: 'section[aria-label="Environment and data protection"]' },
      { name: 'enquiry', selector: 'section#enquiry' },
    ],
  },
]

test.describe('Batch 1: Company & Trust Pages (/about, /about/leadership, /about/credentials-and-safety)', () => {
  const screenshotsDir = path.resolve('docs/screenshots/batch-1')

  test.beforeAll(async () => {
    await fs.promises.mkdir(screenshotsDir, { recursive: true })
  })

  for (const pageConfig of BATCH_1_PAGES) {
    test.describe(`Page: ${pageConfig.route}`, () => {
      // 1. Functional DOM structure & data checks
      test(`Renders complete content, semantic elements and correct page title`, async ({
        page,
      }) => {
        await page.goto(`http://127.0.0.1:3000${pageConfig.route}`, { waitUntil: 'networkidle' })

        // Check header, logo, and footer
        await expect(page.locator('header#hd')).toBeVisible()
        await expect(page.locator('footer')).toBeVisible()

        // Check key sections exist
        for (const sec of pageConfig.sections) {
          await expect(page.locator(sec.selector)).toBeVisible()
        }

        // On leadership & credentials, verify solid white header class is applied
        if (pageConfig.name === 'leadership' || pageConfig.name === 'credentials') {
          const bodyHasHw = await page.evaluate(() => document.body.classList.contains('hw'))
          expect(bodyHasHw).toBe(true)
        }
      })

      // 2. Progressive enhancement check: page works with JavaScript disabled
      test(`Renders full content and accessible navigation when JavaScript is disabled`, async ({
        browser,
      }) => {
        const noJsContext = await browser.newContext({ javaScriptEnabled: false })
        const noJsPage = await noJsContext.newPage()
        await noJsPage.goto(`http://127.0.0.1:3000${pageConfig.route}`, { waitUntil: 'domcontentloaded' })

        // Key sections must render in raw SSR HTML
        for (const sec of pageConfig.sections) {
          await expect(noJsPage.locator(sec.selector)).toBeVisible()
        }

        await noJsContext.close()
      })

      // 3. Visual parity checks across key viewports (1440 and 375)
      for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
        test(`Visual parity on ${vp.label}px (${vp.width}x${vp.height}) has maxDiffPixelRatio <= 0.01`, async ({
          browser,
        }) => {
          test.setTimeout(60000)
          // Ref page context
          const refContext = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            reducedMotion: 'reduce',
          })
          const refPage = await refContext.newPage()
          const refPath = path.resolve(pageConfig.refHtml)
          await refPage.goto(`file://${refPath}`, { waitUntil: 'networkidle' })

          // Inject fonts & disable animations
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
          await refPage.waitForTimeout(200)

          // Target page context
          const targetContext = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            reducedMotion: 'reduce',
          })
          await targetContext.addCookies([
            { name: 'sw_consent', value: 'analytics', domain: 'localhost', path: '/' },
            { name: 'sw_consent', value: 'analytics', domain: '127.0.0.1', path: '/' },
          ])
          const targetPage = await targetContext.newPage()
          await targetPage.goto(`http://127.0.0.1:3000${pageConfig.route}`, { waitUntil: 'networkidle' })
          await targetPage.addStyleTag({
            content: `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
              }
              aside[aria-label="Cookie consent"] { display: none !important; }
            `,
          })
          await targetPage.evaluate(() => document.fonts.ready)
          await targetPage.waitForTimeout(200)

          // Test visual parity on the main content sections
          for (const sec of pageConfig.sections) {
            const refEl = refPage.locator(sec.selector)
            const targetEl = targetPage.locator(sec.selector)

            if ((await refEl.count()) === 0 || (await targetEl.count()) === 0) continue

            // Temporarily hide fixed header so it doesn't overlay scrolled sections
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
            await refPage.waitForTimeout(100)
            await targetPage.waitForTimeout(100)

            if (sec.name === 'intro') {
              await refPage.evaluate(() => {
                const sn = document.querySelector('aside.subnav')
                if (sn) (sn as HTMLElement).style.visibility = 'hidden'
              })
              await targetPage.evaluate(() => {
                const sn = document.querySelector('aside.subnav')
                if (sn) (sn as HTMLElement).style.visibility = 'hidden'
              })
            }

            const refShot = path.join(screenshotsDir, `ref-${pageConfig.name}-${vp.label}-${sec.name}.png`)
            const targetShot = path.join(screenshotsDir, `tgt-${pageConfig.name}-${vp.label}-${sec.name}.png`)
            const diffShot = path.join(screenshotsDir, `diff-${pageConfig.name}-${vp.label}-${sec.name}.png`)

            await refEl.screenshot({
              path: refShot,
              mask: [refPage.locator('img'), refPage.locator('.ph')],
              maskColor: '#FF00FF',
            })
            await targetEl.screenshot({
              path: targetShot,
              mask: [targetPage.locator('img'), targetPage.locator('.ph')],
              maskColor: '#FF00FF',
            })

            const compareOutput = execFileSync(
              'python3',
              [
                path.resolve('scripts/compare_images.py'),
                refShot,
                targetShot,
                diffShot,
                '20',
              ],
              { encoding: 'utf-8' }
            )

            const result = JSON.parse(compareOutput)
            console.log(
              `[Batch 1 ${pageConfig.name} ${vp.label}px] ${sec.name}: diffRatio = ${(
                result.diffRatio * 100
              ).toFixed(4)}%`
            )

            // Strict threshold: diffRatio <= 0.01
            expect(result.diffRatio).toBeLessThanOrEqual(0.01)
          }

          await refContext.close()
          await targetContext.close()
        })
      }
    })
  }
})
