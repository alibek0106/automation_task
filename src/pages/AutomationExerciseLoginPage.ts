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

        this.loginEmailInput = this.resolveLocator('[data-qa="login-email"]', 'Login Email Input');
        this.loginPasswordInput = this.resolveLocator('[data-qa="login-password"]', 'Login Password Input');
        this.loginButton = this.resolveLocator('[data-qa="login-button"]', 'Login Button');
        this.loginHeader = page.getByRole('heading', { name: MESSSAGES.LOGIN_HEADER }); // getByRole is self-describing enough usually

        this.signupNameInput = this.resolveLocator('[data-qa="signup-name"]', 'Signup Name Input');
        this.signupEmailInput = this.resolveLocator('[data-qa="signup-email"]', 'Signup Email Input');
        this.signupButton = this.resolveLocator('[data-qa="signup-button"]', 'Signup Button');
        this.newUserSignupHeader = page.getByRole('heading', { name: MESSSAGES.NEW_USER_SIGNUP });
    }

    async navigate() {
        await this.page.goto(Routes.LOGIN);
    }

    async verifyNewUserSignupVisible() {
        await expect(this.newUserSignupHeader).toBeVisible();
    }

    async verifyLoginHeaderVisible() {
        await expect(this.loginHeader).toBeVisible();
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
