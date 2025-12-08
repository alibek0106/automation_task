import { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { User } from '../models/UserModels';
import { expect, test } from '@playwright/test';

export class AuthSteps {
    constructor(
        private page: Page,
        private homePage: HomePage,
        private loginPage: LoginPage,
    ) { }

    /**
     * Logs in via UI and validates success.
     */
    async login(user: User) {
        test.step('Log in wia UI and validate success', async () => {
            await this.homePage.goto();
            await this.homePage.clickSignupLogin();
            await this.loginPage.login(user.email, user.password);
            await expect(this.homePage.loggedInText, 'Logged in text should contain user name').toContainText(user.name);
        })
    }
}