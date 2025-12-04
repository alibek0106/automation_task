import { Page, Locator } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly signupLoginLink: Locator;
    readonly loggedInText: Locator;
    readonly deleteAccountLink: Locator;

    constructor(readonly page: Page) {
        super(page);
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
        this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' }).describe('Delete Account link');
    }

    async goto() {
        await this.page.goto(Routes.WEB.HOME);
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }
}