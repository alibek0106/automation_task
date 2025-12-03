import { UserService } from '../../src/api/UserService';
import { Routes } from '../../src/constants/Routes';
import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC02: Login with Registered User', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const user = DataFactory.generateUser();

    test.beforeEach(async ({ userService }) => {
        await userService.createAccount(user);
    });

    test('should login successfully with valid credentials', async ({ homePage, loginPage }) => {
        await homePage.goto();
        await expect(homePage.page, 'Home page title should be visible').toHaveTitle(Routes.WEB.HOME_TITLE);

        await homePage.clickSignupLogin();
        await expect(loginPage.loginHeader, 'Login header should be visible').toBeVisible();
        await expect(loginPage.loginHeader, 'Login header should have correct text').toHaveText('Login to your account');

        await loginPage.login(user.email, user.password);
        await expect(homePage.loggedInText).toBeVisible();
        await expect(homePage.loggedInText, `Should display logged in use: ${user.name}`).toContainText(user.name);

        await expect(homePage.page, 'User should be on homepage').toHaveURL(Routes.WEB.HOME);
    });
});