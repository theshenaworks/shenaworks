import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  timeout: 60000,
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
            (process.env.HOME ? `${process.env.HOME}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` : undefined),
        },
      },
    },
  ],
  webServer: {
    command: 'pnpm start -p 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    env: {
      PLAYWRIGHT_TEST: 'true',
    },
  },
})
