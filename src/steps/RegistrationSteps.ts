import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { User } from '../models/UserModels';

export class RegistrationSteps {
    constructor(
        private homePage: HomePage,
        private loginPage: LoginPage,
        private signupPage: SignupPage,
        private createdPage: AccountCreatedPage,
    ) { }

    async startRegistration(user: User) {
        await test.step(`Start registration process for user: ${user.email}`, async () => {
            // Ensure this matches your HomePage method (goto or navigateToHome)
            await this.homePage.goto();
            await this.homePage.clickSignupLogin();
            await this.loginPage.signup(user.name, user.email);
        });
    }

    async fillAccountDetails(user: User) {
        await test.step('Fill detailed account information', async () => {
            await this.signupPage.fillAccountDetails(user);
            await this.signupPage.submit();
        });
    }

    async finishAccountCreation() {
        await test.step('Finish account creation and continue', async () => {
            await this.createdPage.clickContinue();
        });
    }

    async performFullRegistration(user: User) {
        await test.step(`Perform full registration flow for: ${user.name}`, async () => {
            await this.startRegistration(user);
            await this.fillAccountDetails(user);
        });
    }

    async registerNewAccount(user: User) {
        await test.step(`Register new account for ${user.name}`, async () => {
            // 1. Fill details (using your existing method)
            await this.performFullRegistration(user);

            // 2. Verify Account Created (Moved from Test to Here)
            await expect(this.createdPage.successMessage, 'Successfull account creation message should be visible')
                .toBeVisible();
            await expect(this.createdPage.successMessage, 'Successfull account creation message should have expected text')
                .toHaveText('Account Created!');

            // 3. Click Continue
            await this.finishAccountCreation(); // Assuming this clicks the button

            // 4. Verify Logged In (Moved from Test to Here)
            await expect(this.homePage.loggedInText, 'User should be logged in')
                .toContainText(user.name);
        });
    }
}