import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupBtn: Locator;
    readonly newUserHeader: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginBtn: Locator;
    readonly loginHeader: Locator;

    constructor(page: Page) {
        const uniqueElement = page.getByTestId('login-email').describe('Login email input');
        super(page, uniqueElement);
        this.loginEmailInput = uniqueElement;
        this.signupNameInput = page.getByTestId('signup-name').describe('Signup name input');
        this.signupEmailInput = page.getByTestId('signup-email').describe('Signup email input');
        this.signupBtn = page.getByTestId('signup-button').describe('Signup button');
        this.newUserHeader = page.getByRole('heading', { name: 'New User Signup!' }).describe('New User Header');
        this.loginPasswordInput = page.getByTestId('login-password').describe('Login password input');
        this.loginBtn = page.getByTestId('login-button').describe('Login button');
        this.loginHeader = page.getByRole('heading', { name: 'Login to your account' }).describe('Login Header');
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
