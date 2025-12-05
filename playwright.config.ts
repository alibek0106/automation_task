import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4, // at least 4 workers
    reporter: 'html',
    use: {
        baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 50000,
        navigationTimeout: 50000,
    },
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'chromium',
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE, },
        },
    ],
});