import { Page, BrowserContext } from '@playwright/test';
import { AuthSteps } from '../steps/AuthSteps';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';
import { CartSteps } from '../steps/CartSteps';
import { CheckoutSteps } from '../steps/CheckoutSteps';

export type StepsFixtures = {
    authSteps: AuthSteps;
    registrationSteps: RegistrationSteps;
    cartSteps: CartSteps;
    checkoutSteps: CheckoutSteps;
};

export const stepsFixtures = {
    authSteps: async ({ page, context, homePage, loginPage }: PageFixtures & { page: Page, context: BrowserContext }, use: (s: AuthSteps) => Promise<void>) => {
        await use(new AuthSteps(page, homePage, loginPage, context));
    },
    registrationSteps: async ({ page, homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: any) => {
        await use(new RegistrationSteps(page, homePage, loginPage, signupPage, accountCreatedPage));
    },
    cartSteps: async ({ productsPage, productDetailsPage }: PageFixtures, use: (s: CartSteps) => Promise<void>) => {
        await use(new CartSteps(productsPage, productDetailsPage));
    },
    checkoutSteps: async ({ cartPage, checkoutPage, paymentPage }: PageFixtures, use: (s: CheckoutSteps) => Promise<void>) => {
        await use(new CheckoutSteps(cartPage, checkoutPage, paymentPage));
    },
};