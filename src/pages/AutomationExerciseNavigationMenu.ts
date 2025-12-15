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
        this.homeLink = this.resolveLocator('a[href="/"]', 'Home Link').filter({ hasText: 'Home' }).first(); // Refined locator
        this.productsLink = this.resolveLocator('a[href="/products"]', 'Products Link');
        this.cartLink = this.resolveLocator('a[href="/view_cart"]', 'Cart Link').first();
        this.signupLoginLink = this.resolveLocator('a[href="/login"]', 'Signup/Login Link');
        this.deleteAccountLink = this.resolveLocator('a[href="/delete_account"]', 'Delete Account Link');
        this.logoutLink = this.resolveLocator('a[href="/logout"]', 'Logout Link');
        this.loggedInAsText = this.resolveLocator('//a[contains(text(), "Logged in as")]', 'Logged In User');
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
        await expect(this.loggedInAsText).toBeVisible();
        await expect(this.page.getByText(username)).toBeVisible();
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
