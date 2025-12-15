import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseNavigationMenu extends BasePage {
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly signupLoginLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;
    readonly loggedInAsText: Locator;

    constructor(page: Page) {
        super(page);
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.productsLink = page.getByRole('link', { name: 'Products' });
        this.cartLink = page.getByRole('link', { name: 'Cart' });
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.loggedInAsText = page.getByText('Logged in as');
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
