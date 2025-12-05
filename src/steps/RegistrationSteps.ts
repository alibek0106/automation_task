import { Page, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { User } from '../models/UserModels';

export class RegistrationSteps {
    constructor(
        private page: Page,
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
}