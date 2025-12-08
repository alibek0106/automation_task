import { Page, BrowserContext } from '@playwright/test';
import { AuthSteps } from '../steps/AuthSteps';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';
import { CartSteps } from '../steps/CartSteps';

export type StepsFixtures = {
    authSteps: AuthSteps;
    registrationSteps: RegistrationSteps;
    cartSteps: CartSteps;
};

export const stepsFixtures = {
    authSteps: async ({ page, homePage, loginPage }: PageFixtures & { page: Page }, use: (s: AuthSteps) => Promise<void>) => {
        await use(new AuthSteps(page, homePage, loginPage));
    },
    registrationSteps: async ({ page, homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: (r: RegistrationSteps) => Promise<void>) => {
        await use(new RegistrationSteps(page, homePage, loginPage, signupPage, accountCreatedPage));
    },
    cartSteps: async ({ productsPage, productDetailsPage }: PageFixtures, use: (s: CartSteps) => Promise<void>) => {
        await use(new CartSteps(productsPage, productDetailsPage));
    }
};