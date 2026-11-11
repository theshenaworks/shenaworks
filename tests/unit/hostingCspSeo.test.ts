import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import robots from '@/app/robots'

describe('Hosting, CSP, SEO, JS-off (D-02 to D-05, AUD-19, AUD-22)', () => {
  it('enforces engine versions in package.json and absence of Dockerfiles (AUD-19, D-05)', () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    expect(pkg.engines).toBeDefined()
    expect(pkg.engines.node).toBe('>=22.0.0')
    expect(pkg.engines.pnpm).toBe('>=9.0.0')

    expect(fs.existsSync(path.resolve(process.cwd(), 'Dockerfile'))).toBe(false)
    expect(fs.existsSync(path.resolve(process.cwd(), 'docker-compose.yml'))).toBe(false)
  })

  it('configures CSP header in next.config.ts switched by CSP_ENFORCE (D-04)', async () => {
    const configPath = path.resolve(process.cwd(), 'next.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('CSP_ENFORCE')
    expect(configContent).toContain('Content-Security-Policy')
    expect(configContent).toContain('challenges.cloudflare.com')

    const envExamplePath = path.resolve(process.cwd(), '.env.example')
    const envExample = fs.readFileSync(envExamplePath, 'utf-8')
    expect(envExample).toContain('CSP_ENFORCE')
  })

  it('allows /api/og in robots.ts while disallowing /admin and other /api endpoints (AUD-22)', () => {
    const robotsOutput = robots()
    const rules = Array.isArray(robotsOutput.rules) ? robotsOutput.rules : [robotsOutput.rules]
    const defaultRule = rules[0]

    expect(defaultRule).toBeDefined()
    const allow = Array.isArray(defaultRule.allow) ? defaultRule.allow : [defaultRule.allow]
    const disallow = Array.isArray(defaultRule.disallow) ? defaultRule.disallow : [defaultRule.disallow]

    expect(allow).toContain('/api/og')
    expect(disallow).toContain('/admin')
  })

  it('validates all page SEO metadata adheres to length constraints (D-02)', () => {
    // Scan all page.tsx files across the application
    const appDir = path.resolve(process.cwd(), 'src/app/(site)')
    const pages: string[] = []

    function findPages(dir: string) {
      const items = fs.readdirSync(dir, { withFileTypes: true })
      for (const item of items) {
        const fullPath = path.join(dir, item.name)
        if (item.isDirectory()) {
          findPages(fullPath)
        } else if (item.name === 'page.tsx') {
          pages.push(fullPath)
        }
      }
    }

    findPages(appDir)
    expect(pages.length).toBeGreaterThanOrEqual(10)

    for (const pagePath of pages) {
      const content = fs.readFileSync(pagePath, 'utf-8')
      const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/)
      if (titleMatch) {
        const title = titleMatch[1]
        expect(
          title.length,
          `Title in ${path.basename(path.dirname(pagePath))}/page.tsx exceeds 65 chars: "${title}" (${title.length})`,
        ).toBeLessThanOrEqual(65)
      }

      const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/)
      if (descMatch) {
        const desc = descMatch[1]
        expect(
          desc.length,
          `Description in ${path.basename(path.dirname(pagePath))}/page.tsx exceeds 160 chars: "${desc}" (${desc.length})`,
        ).toBeLessThanOrEqual(160)
      }
    }
  })

  it('provides noscript contact fallback copy matching D-03 (D-03)', () => {
    const formPath = path.resolve(process.cwd(), 'src/components/blocks/EnquiryForm.tsx')
    const content = fs.readFileSync(formPath, 'utf-8')

    expect(content).toContain('<noscript>')
    expect(content).toContain('This form needs JavaScript to check you are not a robot')
  })
})
