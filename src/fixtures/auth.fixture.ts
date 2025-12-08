import { test as base, TestInfo } from '@playwright/test';
import { getWorkerUserData } from '../../playwright.config';
import { User } from '../models/UserModels';
import fs from 'fs';

// Define the type for our new fixture
export type AuthFixtures = {
    authedUser: User;
};

// Define the fixture logic
export const authFixture = {
    authedUser: async ({ }, use: (r: User) => Promise<void>, workerInfo: TestInfo) => {
        // Map worker index to available user data (wrap around if necessary)
        // This handles cases where Playwright uses more workers than we created in setup
        let actualWorkerIndex = workerInfo.workerIndex;
        let userDataPath = getWorkerUserData(actualWorkerIndex);

        // If this worker's user data doesn't exist, try to find the max available worker
        if (!fs.existsSync(userDataPath)) {
            // Find available worker data files by checking backwards from current index
            let maxAvailableWorker = -1;
            for (let i = 0; i < actualWorkerIndex; i++) {
                const testPath = getWorkerUserData(i);
                if (fs.existsSync(testPath)) {
                    maxAvailableWorker = i;
                }
            }

            if (maxAvailableWorker >= 0) {
                // Use modulo to wrap around to existing workers
                const workerCount = maxAvailableWorker + 1;
                actualWorkerIndex = workerInfo.workerIndex % workerCount;
                userDataPath = getWorkerUserData(actualWorkerIndex);
                console.log(`Worker ${workerInfo.workerIndex}: Reusing user data from worker ${actualWorkerIndex}`);
            } else {
                throw new Error(
                    `Worker ${workerInfo.workerIndex} user data not found at ${userDataPath}. ` +
                    `Did global setup run successfully?`
                );
            }
        }

        const user: User = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

        // Provide pre-authenticated user to the test
        await use(user);
    },
};