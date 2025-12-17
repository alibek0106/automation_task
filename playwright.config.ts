import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Get worker-specific storage state path
 * Each worker gets its own authenticated session to avoid conflicts
 */
export function getWorkerStorageState(workerIndex: number): string {
    return path.join(__dirname, `playwright/.auth/worker-${workerIndex}.json`);
}

/**
 * Get worker-specific user data path
 */
export function getWorkerUserData(workerIndex: number): string {
    return path.join(__dirname, `playwright/.auth/user-${workerIndex}.json`);
}

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4, // at least 4 workers
    reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
    expect: {
        timeout: 10_000,
    },
    use: {
        baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
        trace: 'on',
        screenshot: 'on',
        video: 'on',
        headless: true,
        testIdAttribute: 'data-qa',
        actionTimeout: 15_000,
        navigationTimeout: 60_000,
    },
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'api',
            testMatch: /.*\/api\/.*\.spec\.ts/,
            use: {
                baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
            },
        },
        {
            name: 'chromium',
            dependencies: ['setup'],
            testMatch: /.*\/web\/.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                // Worker-specific storage state is loaded via auth.fixture.ts
            },
        },
    ],
});