import { Page, BrowserContext } from '@playwright/test';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';

export type StepsFixtures = {
    registrationSteps: RegistrationSteps;
};

export const stepsFixtures = {
    registrationSteps: async ({ page, homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: any) => {
        await use(new RegistrationSteps(page, homePage, loginPage, signupPage, accountCreatedPage));
    },
};