import { test as base } from '@playwright/test';
import { ApiFixtures, apiFixtures } from './api.fixture';
import { PageFixtures, pageFixtures } from './pages.fixture';
import { StepsFixtures, stepsFixtures } from './steps.fixture';
import { AuthFixtures, authFixture, workerAuthContext } from './auth.fixture';
import '../utils/ApiMatchers';

// Base fixtures without authentication (for isolated tests)
const baseTest = base.extend<ApiFixtures & PageFixtures & StepsFixtures & AuthFixtures>({
    ...apiFixtures,
    ...pageFixtures,
    ...stepsFixtures,
    ...authFixture, // authedUser fixture (not context)
});

// Test with worker authentication - includes context override
export const test = baseTest.extend(workerAuthContext);

// Isolated test - NO context override, starts with empty storage
export const isolatedTest = baseTest.extend({
    storageState: { cookies: [], origins: [] },
});

export { expect } from '@playwright/test';