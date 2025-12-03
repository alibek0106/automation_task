import { Page } from '@playwright/test';
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

    async performFullRegistration(user: User) {
        await this.homePage.goto();
        await this.homePage.clickSignupLogin();
        await this.loginPage.signup(user.name, user.email);

        await this.signupPage.fillAccountDetails(user);
        await this.signupPage.submit();
    }

    async finishAccountCreation() {
        await this.createdPage.clickContinue();
    }
}