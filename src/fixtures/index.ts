import { test as base } from '@playwright/test';
import { ApiFixtures, apiFixtures } from './api.fixture';
import { PageFixtures, pageFixtures } from './pages.fixture';
import { StepsFixtures, stepsFixtures } from './steps.fixture';
import { AuthFixtures, authFixture } from './auth.fixture';

type AppFixtures = ApiFixtures & PageFixtures & StepsFixtures & AuthFixtures;

export const test = base.extend<AppFixtures>({
    ...apiFixtures,
    ...pageFixtures,
    ...stepsFixtures,
    ...authFixture,
});

export const isolatedTest = test.extend({
    storageState: { cookies: [], origins: [] },
});

export { expect } from '@playwright/test';