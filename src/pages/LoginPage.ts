import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly signupNameInput: Locator = this.page.locator('[data-qa="signup-name"]').describe('Signup name input');
    readonly signupEmailInput: Locator = this.page.locator('[data-qa="signup-email"]').describe('Signup email input');
    readonly signupBtn: Locator = this.page.locator('[data-qa="signup-button"]').describe('Signup button');
    readonly newUserHeader: Locator = this.page.getByRole('heading', { name: 'New User Signup!' }).describe('New User Header');
    readonly loginEmailInput: Locator = this.page.locator('[data-qa="login-email"]').describe('Login email input');
    readonly loginPasswordInput: Locator = this.page.locator('[data-qa="login-password"]').describe('Login password input');
    readonly loginBtn: Locator = this.page.locator('[data-qa="login-button"]').describe('Login button');
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
        await expect(this.loginEmailInput, 'Login email input should be visible').toBeVisible();
        await expect(this.loginPasswordInput, 'Login password input should be visible').toBeVisible();
    }
}
