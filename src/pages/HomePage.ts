import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly signupLoginLink: Locator;
    readonly loggedInText: Locator;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        super(page);
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
        this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' }).describe('Delete Account link');
        this.logoutLink = page.getByRole('link', { name: 'Logout' }).describe('Logout link');
    }

    async goto() {
        await this.page.goto(Routes.WEB.HOME);
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }

    async verifyLoggedInVisible() {
        await expect(this.page.getByText('Logged in as')).toBeVisible();
    }

    async verifyLoggedInNotVisible() {
        await expect(this.page.getByText('Logged in as')).not.toBeVisible();
    }
}