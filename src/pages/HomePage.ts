import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly signupLoginLink: Locator;
    readonly loggedInText: Locator;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;
    readonly subscriptionHeading: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionSubmitBtn: Locator;
    readonly subscriptionSuccessMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
        this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
        this.deleteAccountLink = page.getByRole('link', { name: ' Delete Account' }).describe('Delete Account link');
        this.logoutLink = page.getByRole('link', { name: 'Logout' }).describe('Logout link');
        this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription', level: 2 }).describe('Subscribtion heading');
        this.subscriptionEmailInput = page.getByPlaceholder('Your email address').describe('Email Input Field');
        this.subscriptionSubmitBtn = page.locator('#subscribe').describe('Subscribe button');
        this.subscriptionSuccessMsg = page.getByText('You have been successfully subscribed!').describe('Subscription success message');
    }

    async goto() {
        await super.goto(Routes.WEB.HOME);
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

    async deleteAccount() {
        await this.deleteAccountLink.click();
    }

    async performSubscription(email: string) {
        await this.subscriptionHeading.scrollIntoViewIfNeeded();
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionSubmitBtn.click();
    }
}
