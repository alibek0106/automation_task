import { test as base } from '@playwright/test';
import { PagesFixture, pagesFixture } from './pages.fixture';
import { StepsFixture, stepsFixture } from './steps.fixture';
import { ApiFixture, apiFixture } from './api.fixture';

export type TestFixtures = PagesFixture & StepsFixture & ApiFixture;

export const test = base.extend<TestFixtures>({
    ...pagesFixture,
    ...stepsFixture,
    ...apiFixture,
});

export { expect } from '@playwright/test';
