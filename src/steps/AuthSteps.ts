import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { AccountDeletedPage } from '../pages/AccountDeletedPage';
import { User } from '../models/UserModels';

/**
 * Reusable steps for authentication flows
 */
export class AuthSteps {
    constructor(
        private homePage: HomePage,
        private loginPage: LoginPage,
        private signupPage: SignupPage,
        private accountCreatedPage: AccountCreatedPage,
        private accountDeletedPage: AccountDeletedPage
    ) { }

    /**
     * Complete full registration flow
     */
    async registerNewUser(userData: User): Promise<void> {
        await this.homePage.clickSignupLogin();
        await this.loginPage.signup(userData.name, userData.email);
        await this.signupPage.fillAccountDetails(userData);
        await this.signupPage.clickCreateAccount();
        await expect(this.accountCreatedPage.successMessage).toBeVisible();
        await this.accountCreatedPage.clickContinue();
        await this.homePage.verifyLoggedInVisible();
    }

    /**
     * Login with existing user
     */
    async loginUser(email: string, password: string): Promise<void> {
        await this.homePage.clickSignupLogin();
        await this.loginPage.login(email, password);
        await this.homePage.verifyLoggedInVisible();
    }

    /**
     * Delete account and verify
     */
    async deleteAccount(): Promise<void> {
        await this.homePage.navigation.clickDeleteAccount();
        await this.accountDeletedPage.verifyAccountDeleted();
        await this.accountDeletedPage.clickContinue();
    }

    /**
     * Start signup (navigate and enter name/email)
     */
    async startSignup(name: string, email: string): Promise<void> {
        await this.homePage.clickSignupLogin();
        await this.loginPage.signup(name, email);
    }

    /**
     * Complete account details form
     */
    async completeAccountDetails(userData: User): Promise<void> {
        await this.signupPage.fillAccountDetails(userData);
        await this.signupPage.clickCreateAccount();
    }

    /**
     * Verify account created and continue
     */
    async verifyAndContinue(): Promise<void> {
        await expect(this.accountCreatedPage.successMessage).toBeVisible();
        await this.accountCreatedPage.clickContinue();
    }
}
