import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly signupNameInput: Locator = this.page.getByTestId('signup-name').describe('Signup name input');
    readonly signupEmailInput: Locator = this.page.getByTestId('signup-email').describe('Signup email input');
    readonly signupBtn: Locator = this.page.getByTestId('signup-button').describe('Signup button');
    readonly newUserHeader: Locator = this.page.getByRole('heading', { name: 'New User Signup!' }).describe('New User Header');
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator = this.page.getByTestId('login-password').describe('Login password input');
    readonly loginBtn: Locator = this.page.getByTestId('login-button').describe('Login button');
    readonly loginHeader: Locator = this.page.getByRole('heading', { name: 'Login to your account' }).describe('Login Header');

    constructor(page: Page) {
        const uniqueElement = page.getByTestId('login-email').describe('Login email input');
        super(page, uniqueElement);
        this.loginEmailInput = uniqueElement;
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
}
