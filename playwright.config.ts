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
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4, // at least 4 workers
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        testIdAttribute: 'data-qa',
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