import { test as base, TestInfo, Browser, BrowserContext } from '@playwright/test';
import { getWorkerUserData, getWorkerStorageState } from '../../playwright.config';
import { User } from '../models/UserModels';
import fs from 'fs';

// Define the type for our new fixture
export type AuthFixtures = {
    authedUser: User;
};

/**
 * Get the actual worker index to use, handling cases where
 * Playwright spawns more workers than we created accounts for
 */
function getActualWorkerIndex(workerIndex: number): number {
    const userDataPath = getWorkerUserData(workerIndex);
    
    // If this worker's user data exists, use it
    if (fs.existsSync(userDataPath)) {
        return workerIndex;
    }

    // Find the maximum available worker by checking backwards
    let maxAvailableWorker = -1;
    for (let i = 0; i < workerIndex; i++) {
        const testPath = getWorkerUserData(i);
        if (fs.existsSync(testPath)) {
            maxAvailableWorker = i;
        }
    }

    if (maxAvailableWorker >= 0) {
        const workerCount = maxAvailableWorker + 1;
        return workerIndex % workerCount;
    }

    throw new Error(
        `Worker ${workerIndex} user data not found at ${userDataPath}. ` +
        `Did global setup run successfully?`
    );
}

/**
 * Context fixture that loads worker-specific authentication
 * This ONLY applies to regular tests, not setup or isolated tests
 */
export const workerAuthContext = {
    context: async ({ browser }: { browser: Browser }, use: (context: BrowserContext) => Promise<void>, workerInfo: TestInfo) => {
        // Skip worker authentication for the 'setup' project - it creates the accounts
        if (workerInfo.project.name === 'setup') {
            const context = await browser.newContext();
            await use(context);
            await context.close();
            return;
        }

        // For regular test projects, load worker-specific authentication
        const actualWorkerIndex = getActualWorkerIndex(workerInfo.workerIndex);
        const storageStatePath = getWorkerStorageState(actualWorkerIndex);

        // Create context with pre-loaded authentication state
        const context = await browser.newContext({
            storageState: fs.existsSync(storageStatePath) 
                ? storageStatePath 
                : undefined
        });

        await use(context);
        await context.close();
    },
};

// Define the fixture logic
export const authFixture = {
    /**
     * Provides the authenticated user credentials for the current worker
     * This allows tests to access user data (name, email, etc.) if needed
     */
    authedUser: async ({ }, use: (r: User) => Promise<void>, workerInfo: TestInfo) => {
        const actualWorkerIndex = getActualWorkerIndex(workerInfo.workerIndex);
        const userDataPath = getWorkerUserData(actualWorkerIndex);

        const user: User = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

        // Provide pre-authenticated user to the test
        await use(user);
    },
};