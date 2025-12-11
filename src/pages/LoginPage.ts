import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly signupNameInput: Locator = this.getByDataQa('signup-name', 'Signup name input');
    readonly signupEmailInput: Locator = this.getByDataQa('signup-email', 'Signup email input');
    readonly signupBtn: Locator = this.getByDataQa('signup-button', 'Signup button');
    readonly newUserHeader: Locator = this.page.getByRole('heading', { name: 'New User Signup!' }).describe('New User Header');
    readonly loginEmailInput: Locator = this.getByDataQa('login-email', 'Login email input');
    readonly loginPasswordInput: Locator = this.getByDataQa('login-password', 'Login password input');
    readonly loginBtn: Locator = this.getByDataQa('login-button', 'Login button');
    readonly loginHeader: Locator = this.page.getByRole('heading', { name: 'Login to your account' }).describe('Login Header');

    constructor(page: Page) {
        super(page);
    }

    async signup(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupBtn.click();
    }

    async login(email: string, pass: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(pass);
        await this.loginBtn.click();
    }

    async verifyLoginFormVisible() {
        // Soft assertions: Check all fields to see all failures at once (data verification)
        await expect.soft(this.loginEmailInput, 'Login email input should be visible').toBeVisible();
        await expect.soft(this.loginPasswordInput, 'Login password input should be visible').toBeVisible();
    }
}
