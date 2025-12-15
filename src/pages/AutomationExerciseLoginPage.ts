import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseLoginPage extends BasePage {
    // Login Form Locators
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly loginHeader: Locator;

    // Signup Form Locators
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly newUserSignupHeader: Locator;

    constructor(page: Page) {
        super(page);

        this.loginEmailInput = page.locator('[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.loginHeader = page.getByRole('heading', { name: MESSSAGES.LOGIN_HEADER });

        this.signupNameInput = page.locator('[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
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
