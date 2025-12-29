import { test as base, expect as baseExpect } from '@playwright/test';
import { PagesFixture, pagesFixture } from './pages.fixture';
import { StepsFixture, stepsFixture } from './steps.fixture';
import { ApiFixture, apiFixture } from './api.fixture';
import { customMatchers } from '../utils/CustomMatchers';

export type TestFixtures = PagesFixture & StepsFixture & ApiFixture;

export const test = base.extend<TestFixtures>({
    ...pagesFixture,
    ...stepsFixture,
    ...apiFixture,
});

export const expect = baseExpect.extend(customMatchers);

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toHaveStatusCode(expectedCode: number): Promise<R>;
        }
    }
}
