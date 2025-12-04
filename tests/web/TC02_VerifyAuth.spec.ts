import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC02: Login with Registered User @Abdykarimov', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const user = DataFactory.generateUser();

    test.beforeEach(async ({ userService }) => {
        await test.step('Precondition: Create User via API', async () => {
            await userService.createAccount(user);
        });
    });

    test('should login successfully with valid credentials', async ({
        homePage,
        loginPage,
    }) => {
        await test.step('Navigate to Login Page', async () => {
            await homePage.goto();
            await homePage.clickSignupLogin();
            await expect(loginPage.loginHeader).toBeVisible();
        });

        await test.step('Enter Credentials and Login', async () => {
            await loginPage.login(user.email, user.password);
        });

        await test.step('Verify User is Logged In', async () => {
            await expect(homePage.loggedInText).toContainText(user.name);
            await expect(homePage.page).toHaveURL('/');
        });
    });
});