import { Page } from '@playwright/test';
import { PageFixtures } from './pages.fixture';
import { RegistrationSteps } from '../steps/RegistrationSteps';
import { CartSteps } from '../steps/CartSteps';
import { CheckoutSteps } from '../steps/CheckoutSteps';
import { AuthSteps } from '../steps/AuthSteps';
import { NavigationSteps } from '../steps/NavigationSteps';
import { ProductSteps } from '../steps/ProductSteps';

export type StepsFixtures = {
    registrationSteps: RegistrationSteps;
    cartSteps: CartSteps;
    checkoutSteps: CheckoutSteps;
    authSteps: AuthSteps;
    navigationSteps: NavigationSteps;
    productSteps: ProductSteps;
};

export const stepsFixtures = {
    registrationSteps: async ({ page, homePage, loginPage, signupPage, accountCreatedPage }:
        PageFixtures & { page: Page }, use: (s: RegistrationSteps) => Promise<void>) => {
        await use(new RegistrationSteps(homePage, loginPage, signupPage, accountCreatedPage));
    },

    cartSteps: async ({ homePage, productsPage, productDetailPage, cartPage }:
        PageFixtures, use: (s: CartSteps) => Promise<void>) => {
        await use(new CartSteps(homePage, productsPage, productDetailPage, cartPage));
    },

    checkoutSteps: async ({ homePage, cartPage, checkoutPage, paymentPage, paymentDonePage }:
        PageFixtures, use: (s: CheckoutSteps) => Promise<void>) => {
        await use(new CheckoutSteps(homePage, cartPage, checkoutPage, paymentPage, paymentDonePage));
    },

    authSteps: async ({ homePage, loginPage, signupPage, accountCreatedPage, accountDeletedPage }:
        PageFixtures, use: (s: AuthSteps) => Promise<void>) => {
        await use(new AuthSteps(homePage, loginPage, signupPage, accountCreatedPage, accountDeletedPage));
    },

    navigationSteps: async ({ page, homePage }: PageFixtures & { page: Page }, use: (s: NavigationSteps) => Promise<void>) => {
        await use(new NavigationSteps(page, homePage));
    },

    productSteps: async ({ productsPage, productDetailPage }: PageFixtures, use: (s: ProductSteps) => Promise<void>) => {
        await use(new ProductSteps(productsPage, productDetailPage));
    },
};
