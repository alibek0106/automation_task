import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseLoginPage extends BasePage {
    // Login Form Locators
    private readonly loginEmailInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeader: Locator;

    // Signup Form Locators
    private readonly signupNameInput: Locator;
    private readonly signupEmailInput: Locator;
    private readonly signupButton: Locator;
    private readonly newUserSignupHeader: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');

        this.loginEmailInput = this.page.getByTestId('login-email').describe('Login Email Input');
        this.loginPasswordInput = this.page.getByTestId('login-password').describe('Login Password Input');
        this.loginButton = this.page.getByTestId('login-button').describe('Login Button');
        this.loginHeader = page.getByRole('heading', { name: MESSSAGES.LOGIN_HEADER }).describe('Login Header');

        this.signupNameInput = this.page.getByTestId('signup-name').describe('Signup Name Input');
        this.signupEmailInput = this.page.getByTestId('signup-email').describe('Signup Email Input');
        this.signupButton = this.page.getByTestId('signup-button').describe('Signup Button');
        this.newUserSignupHeader = page.getByRole('heading', { name: MESSSAGES.NEW_USER_SIGNUP }).describe('New User Signup Header');
    }

    async navigate() {
        await this.page.goto(Routes.LOGIN);
    }

    async verifyNewUserSignupVisible() {
        await expect(this.newUserSignupHeader, 'New User Signup Header should be visible').toBeVisible();
    }

    async verifyLoginHeaderVisible() {
        await expect(this.loginHeader, 'Login Header should be visible').toBeVisible();
    }

    async enterSignupName(name: string) {
        await this.signupNameInput.fill(name);
    }

    async enterSignupEmail(email: string) {
        await this.signupEmailInput.fill(email);
    }

    async clickSignup() {
        await this.signupButton.click();
    }

    async enterLoginEmail(email: string) {
        await this.loginEmailInput.fill(email);
    }

    async enterLoginPassword(password: string) {
        await this.loginPasswordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }
}
