import { Page } from '@playwright/test';
import { AuthSteps } from '../steps/AuthSteps';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';
import { CartSteps } from '../steps/CartSteps';
import { CheckoutSteps } from '../steps/CheckoutSteps';
import { ContactSteps } from '../steps/ContactSteps';

export type StepsFixtures = {
    authSteps: AuthSteps;
    registrationSteps: RegistrationSteps;
    cartSteps: CartSteps;
    checkoutSteps: CheckoutSteps;
    contactSteps: ContactSteps;
};

export const stepsFixtures = {
    authSteps: async ({ homePage, loginPage }: PageFixtures & { page: Page }, use: (s: AuthSteps) => Promise<void>) => {
        await use(new AuthSteps(homePage, loginPage));
    },
    registrationSteps: async ({ homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: (s: RegistrationSteps) => Promise<void>) => {
        await use(new RegistrationSteps(homePage, loginPage, signupPage, accountCreatedPage));
    },
    cartSteps: async ({ productsPage, productDetailsPage, cartPage }: PageFixtures, use: (s: CartSteps) => Promise<void>) => {
        await use(new CartSteps(productsPage, productDetailsPage, cartPage));
    },
    checkoutSteps: async ({ cartPage, checkoutPage, paymentPage }: PageFixtures, use: (s: CheckoutSteps) => Promise<void>) => {
        await use(new CheckoutSteps(cartPage, checkoutPage, paymentPage));
    },
    contactSteps: async ({ contactPage }: PageFixtures, use: (s: ContactSteps) => Promise<void>) => {
        await use(new ContactSteps(contactPage));
    },
};