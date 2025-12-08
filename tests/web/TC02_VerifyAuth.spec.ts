import { Routes } from '../../src/constants/Routes';
import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC02: Login with Registered User', { tag: '@Abdykarimov' }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login successfully with valid credentials', async ({
        homePage,
        loginPage,
        userService
    }) => {
        const user = DataFactory.generateUser();
        await test.step('Precondition: Create User via API', async () => {
            await userService.createAccount(user);
        });

        await test.step('Navigate to Login Page', async () => {
            await homePage.goto();
            await homePage.clickSignupLogin();
            await expect(loginPage.loginHeader, 'Login Header should be visible').toHaveText('Login to your account');
        });

        await test.step('Enter Credentials and Login', async () => {
            await loginPage.login(user.email, user.password);
        });

        await test.step('Verify User is Logged In', async () => {
            await expect(homePage.loggedInText, `User Logged in text should contain username '${user.name}'`).toContainText(user.name);
            await expect(homePage.page, 'Page should have expected URL').toHaveURL(Routes.WEB.HOME);
        });
    });
});