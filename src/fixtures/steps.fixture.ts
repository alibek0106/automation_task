import { Page } from '@playwright/test';
import { AuthSteps } from '../steps/AuthSteps';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';
import { CartSteps } from '../steps/CartSteps';
import { CheckoutSteps } from '../steps/CheckoutSteps';

import { ProductSteps } from '../steps/ProductSteps';

export type StepsFixtures = {
    authSteps: AuthSteps;
    registrationSteps: RegistrationSteps;
    cartSteps: CartSteps;
    checkoutSteps: CheckoutSteps;
    productSteps: ProductSteps;
};

export const stepsFixtures = {
    authSteps: async ({ page, homePage, loginPage }: PageFixtures & { page: Page }, use: (s: AuthSteps) => Promise<void>) => {
        await use(new AuthSteps(page, homePage, loginPage));
    },
    registrationSteps: async ({ page, homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: (s: RegistrationSteps) => Promise<void>) => {
        await use(new RegistrationSteps(page, homePage, loginPage, signupPage, accountCreatedPage));
    },
    cartSteps: async ({ productsPage, productDetailsPage, cartPage }: PageFixtures, use: (s: CartSteps) => Promise<void>) => {
        await use(new CartSteps(productsPage, productDetailsPage, cartPage));
    },
    checkoutSteps: async ({ cartPage, checkoutPage, paymentPage }: PageFixtures, use: (s: CheckoutSteps) => Promise<void>) => {
        await use(new CheckoutSteps(cartPage, checkoutPage, paymentPage));
    },
    productSteps: async ({ productsPage }: PageFixtures, use: (s: ProductSteps) => Promise<void>) => {
        await use(new ProductSteps(productsPage));
    },
};