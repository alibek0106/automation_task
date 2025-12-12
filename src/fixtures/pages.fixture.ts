import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';
import { AutomationExerciseLoginPage } from '../pages/AutomationExerciseLoginPage';
import { AutomationExerciseSignupPage } from '../pages/AutomationExerciseSignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { AutomationExerciseNavigationMenu } from '../pages/AutomationExerciseNavigationMenu';
import { Page } from '@playwright/test';

export interface PagesFixture {
    automationExerciseLandingPage: AutomationExerciseLandingPage;
    automationExerciseLoginPage: AutomationExerciseLoginPage;
    automationExerciseSignupPage: AutomationExerciseSignupPage;
    accountCreatedPage: AccountCreatedPage;
    automationExerciseNavigationMenu: AutomationExerciseNavigationMenu;
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
};
