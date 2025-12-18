import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseNavigationMenu extends BasePage {
    private readonly homeLink: Locator;
    private readonly productsLink: Locator;
    private readonly cartLink: Locator;
    private readonly signupLoginLink: Locator;
    private readonly deleteAccountLink: Locator;
    private readonly logoutLink: Locator;
    private readonly loggedInAsText: Locator;

    constructor(page: Page) {
        super(page, 'NavigationMenu');
        this.homeLink = this.page.locator('a[href="/"]').describe('Home Link').filter({ hasText: 'Home' }).first(); // Refined locator
        this.productsLink = this.page.locator('a[href="/products"]').describe('Products Link');
        this.cartLink = this.page.locator('a[href="/view_cart"]').describe('Cart Link').first();
        this.signupLoginLink = this.page.locator('a[href="/login"]').describe('Signup/Login Link');
        this.deleteAccountLink = this.page.locator('a[href="/delete_account"]').describe('Delete Account Link');
        this.logoutLink = this.page.locator('a[href="/logout"]').describe('Logout Link');
        this.loggedInAsText = this.page.locator('//a[contains(text(), "Logged in as")]').describe('Logged In User');
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    async clickDeleteAccount() {
        await this.deleteAccountLink.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }

    async verifyUserLoggedIn(username: string) {
        await expect(this.loggedInAsText, 'Should be logged in').toBeVisible();
        await expect(this.page.getByText(username), 'Username should be visible').toBeVisible();
    }

    async verifyUserNotLoggedIn() {
        await expect(this.loggedInAsText, 'Should not be logged in').not.toBeVisible();
    }

    async clickHome() {
        await this.homeLink.click();
    }

    async clickProducts() {
        await this.productsLink.click();
    }

    async clickCart() {
        await this.cartLink.click();
    }
}
