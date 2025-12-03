import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';

export type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    accountCreatedPage: AccountCreatedPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
};

export const pageFixtures = {
    homePage: async ({ page }: { page: Page }, use: any) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }: { page: Page }, use: any) => {
        await use(new LoginPage(page));
    },
    signupPage: async ({ page }: { page: Page }, use: any) => {
        await use(new SignupPage(page));
    },
    accountCreatedPage: async ({ page }: { page: Page }, use: any) => {
        await use(new AccountCreatedPage(page));
    },
    productsPage: async ({ page }: { page: Page }, use: (p: ProductsPage) => Promise<void>) => {
        await use(new ProductsPage(page));
    },
    productDetailsPage: async ({ page }: { page: Page }, use: (p: ProductDetailsPage) => Promise<void>) => {
        await use(new ProductDetailsPage(page));
    },
    cartPage: async ({ page }: { page: Page }, use: (p: CartPage) => Promise<void>) => {
        await use(new CartPage(page));
    },
};