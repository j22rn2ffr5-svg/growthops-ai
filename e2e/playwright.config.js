import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 75000,
  retries: 1,
  workers: 2,
  reporter: [['list'], ['json', { outputFile: 'results.json' }]],
  use: {
    baseURL: 'https://growthops-portal-roan.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    ignoreHTTPSErrors: false,
    channel: undefined,
    launchOptions: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
  },
})
