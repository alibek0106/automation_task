import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  timeout: 60_000, // Increased for form interactions
  retries: 1,
  workers: 4, // Minimum 4 workers for parallel execution
  fullyParallel: true, // Enable full parallel execution
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  use: {
    testIdAttribute: 'data-qa',
    acceptDownloads: true,
    viewport: { width: 1920, height: 1080 },
    baseURL: 'https://www.automationexercise.com/',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000, // Timeout for individual actions
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
