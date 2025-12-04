import { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { User } from '../models/UserModels';
import { expect } from '@playwright/test';

export class AuthSteps {
    constructor(
        private page: Page,
        private homePage: HomePage,
        private loginPage: LoginPage,
        private context: BrowserContext
    ) { }

    /**
     * Logs in via UI and validates success.
     */
    async login(user: User) {
        await this.homePage.goto();
        await this.homePage.clickSignupLogin();
        await this.loginPage.login(user.email, user.password);
        await expect(this.homePage.loggedInText).toContainText(user.name);
    }
}