import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// ReportPortal configuration
const rpConfig = {
    apiKey: 'alibekKey_zKw8O6yOTyur4ZNxBnxKwhoce7eaVvjgZsmNHiuGshOeDOdH4_7YEGFZedGq39-b',
    endpoint: 'http://localhost:8080/api/v2',
    project: 'project-alibek',
    launch: 'Playwright SDD Tests',
    attributes: [
        { key: 'framework', value: 'playwright' },
        { key: 'env', value: 'dev' }
    ],
    description: 'Automated tests from Playwright SDD Framework',
    skippedIssue: false,
    includeTestSteps: true,
};

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
    reporter: [
        ['list'], // Console output
        ['junit', { outputFile: 'results.xml' }], // XML for Jenkins to parse stacktraces
        ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML for screenshots
        ['@reportportal/agent-js-playwright', rpConfig]
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
        trace: 'on-first-retry',
        screenshot: 'on',
        video: 'retain-on-failure',
        testIdAttribute: 'data-qa',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'chromium',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],
                // Worker-specific storage state is loaded via auth.fixture.ts
            },
        },
    ],
});