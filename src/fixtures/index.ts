import { test as base } from '@playwright/test';
import { ApiFixtures, apiFixtures } from './api.fixture';
import { PageFixtures, pageFixtures } from './pages.fixture';
import { StepsFixtures, stepsFixtures } from './steps.fixture';

type AppFixtures = ApiFixtures & PageFixtures & StepsFixtures;

export const test = base.extend<AppFixtures>({
    ...apiFixtures,
    ...pageFixtures,
    ...stepsFixtures,
});

export { expect } from '@playwright/test';