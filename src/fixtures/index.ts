import { test as base } from '@playwright/test';
import { PagesFixture, pagesFixture } from './pages.fixture';
import { StepsFixture, stepsFixture } from './steps.fixture';

export type TestFixtures = PagesFixture & StepsFixture;

export const test = base.extend<TestFixtures>({
    ...pagesFixture,
    ...stepsFixture,
});

export { expect } from '@playwright/test';
