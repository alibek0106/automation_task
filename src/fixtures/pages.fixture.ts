import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';
import { AutomationExerciseLoginPage } from '../pages/AutomationExerciseLoginPage';
import { AutomationExerciseSignupPage } from '../pages/AutomationExerciseSignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { AutomationExerciseNavigationMenu } from '../pages/AutomationExerciseNavigationMenu';
import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { AutomationExerciseProductDetailPage } from '../pages/AutomationExerciseProductDetailPage';
import { AutomationExerciseCartPage } from '../pages/AutomationExerciseCartPage';
import { Page } from '@playwright/test';

export interface PagesFixture {
    automationExerciseLandingPage: AutomationExerciseLandingPage;
    automationExerciseLoginPage: AutomationExerciseLoginPage;
    automationExerciseSignupPage: AutomationExerciseSignupPage;
    accountCreatedPage: AccountCreatedPage;
    automationExerciseNavigationMenu: AutomationExerciseNavigationMenu;
    automationExerciseProductsPage: AutomationExerciseProductsPage;
    automationExerciseProductDetailPage: AutomationExerciseProductDetailPage;
    automationExerciseCartPage: AutomationExerciseCartPage;
}

export const pagesFixture = {
    automationExerciseLandingPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseLandingPage) => Promise<void>) => {
        await use(new AutomationExerciseLandingPage(page));
    },
    automationExerciseLoginPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseLoginPage) => Promise<void>) => {
        await use(new AutomationExerciseLoginPage(page));
    },
    automationExerciseSignupPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseSignupPage) => Promise<void>) => {
        await use(new AutomationExerciseSignupPage(page));
    },
    accountCreatedPage: async ({ page }: { page: Page }, use: (p: AccountCreatedPage) => Promise<void>) => {
        await use(new AccountCreatedPage(page));
    },
    automationExerciseNavigationMenu: async ({ page }: { page: Page }, use: (p: AutomationExerciseNavigationMenu) => Promise<void>) => {
        await use(new AutomationExerciseNavigationMenu(page));
    },
    automationExerciseProductsPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseProductsPage) => Promise<void>) => {
        await use(new AutomationExerciseProductsPage(page));
    },
    automationExerciseProductDetailPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseProductDetailPage) => Promise<void>) => {
        await use(new AutomationExerciseProductDetailPage(page));
    },
    automationExerciseCartPage: async ({ page }: { page: Page }, use: (p: AutomationExerciseCartPage) => Promise<void>) => {
        await use(new AutomationExerciseCartPage(page));
    },
};
