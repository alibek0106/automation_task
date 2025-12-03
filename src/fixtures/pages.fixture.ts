import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';

export type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    accountCreatedPage: AccountCreatedPage;
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
};