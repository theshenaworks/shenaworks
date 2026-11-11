import { defineConfig } from 'vitest/config'
import path from 'path'

if (!process.env.DATABASE_URI) {
  try {
    process.loadEnvFile?.('.env.local')
  } catch {
    try {
      process.loadEnvFile?.('.env')
    } catch {}
  }
}

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 30000,
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@payload-config': path.resolve(__dirname, './payload.config.ts'),
    },
  },
})
