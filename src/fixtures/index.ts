import { test as base } from '@playwright/test';
import { getWorkerStorageState } from '../../playwright.config';
import { PageFixtures, pageFixtures } from './pages.fixture';
import { AuthFixtures, authFixture } from './auth.fixture';
import fs from 'fs';

type AppFixtures = PageFixtures & AuthFixtures;

// Extend base test with worker-specific storage state
const workerAwareTest = base.extend<{}, { workerStorageState: string | undefined }>({
    workerStorageState: [async ({ }, use, workerInfo) => {
        let actualWorkerIndex = workerInfo.workerIndex;
        let storagePath = getWorkerStorageState(actualWorkerIndex);

        // Check if worker-specific storage exists
        if (fs.existsSync(storagePath)) {
            await use(storagePath);
        } else {
            // Find available storage state files and wrap around if necessary
            let maxAvailableWorker = -1;
            for (let i = 0; i < actualWorkerIndex; i++) {
                const testPath = getWorkerStorageState(i);
                if (fs.existsSync(testPath)) {
                    maxAvailableWorker = i;
                }
            }

            if (maxAvailableWorker >= 0) {
                // Use modulo to wrap around to existing workers
                const workerCount = maxAvailableWorker + 1;
                actualWorkerIndex = workerInfo.workerIndex % workerCount;
                storagePath = getWorkerStorageState(actualWorkerIndex);
                console.log(`Worker ${workerInfo.workerIndex}: Reusing storage state from worker ${actualWorkerIndex}`);
                await use(storagePath);
            } else {
                console.warn(`Worker ${workerInfo.workerIndex}: No auth file found at ${storagePath}, using empty storage state`);
                await use(undefined);
            }
        }
    }, { scope: 'worker', auto: true }],

    storageState: async ({ workerStorageState }, use) => {
        await use(workerStorageState);
    },
});

export const test = workerAwareTest.extend<AppFixtures>({
    ...pageFixtures,
    ...authFixture,
});

export const isolatedTest = test.extend({
    storageState: { cookies: [], origins: [] },
});

export { expect } from '@playwright/test';