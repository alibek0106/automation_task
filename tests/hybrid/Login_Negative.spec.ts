import { isolatedTest as test, expect } from '../../src/fixtures';
import { Routes } from '../../src/constants/Routes';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC04: Login Negative Scenarios (Hybrid)', { tag: ['@Abdykarimov', '@Hybrid', '@Negative'] }, () => {
    test('should fail to login with valid password but wrong email', async ({
        loginPage,
        homePage,
        userApiSteps
    }) => {
        // 1. Hybrid Arrange: Create a valid user via API
        // We do this to ensure the password we are about to use is technically associated with a real account,
        // proving that the Email is the deciding factor for failure.
        const user = DataFactory.generateUser();
        await userApiSteps.registerUser(user);

        // 2. Act: Navigate to Login
        await test.step('Navigate to Login', async () => {
            await homePage.goto();
            await homePage.clickSignupLogin();
        });

        // 3. Act: Try to login with Wrong Email
        const wrongEmail = `wrong.${user.email}`;
        await test.step(`Attempt login with wrong email: ${wrongEmail}`, async () => {
            await loginPage.login(wrongEmail, user.password);
        });

        // 4. Assert: Verify Error Message
        await test.step('Verify "Email doesn\'t exist" error', async () => {
            await expect(loginPage.errorMsg).toBeVisible();
            await expect(loginPage.errorMsg).toHaveText('Your email or password is incorrect!');
        });
    });

    test('should fail to login when password parameter is missing', async ({
        loginPage,
        homePage,
        userApiSteps
    }) => {
        // 1. Hybrid Arrange: Create a valid user via API
        // This ensures that the email we enter is actually valid in the system.
        const user = DataFactory.generateUser();
        await userApiSteps.registerUser(user);

        // 2. Act: Navigate to Login
        await test.step('Navigate to Login', async () => {
            await homePage.goto();
            await homePage.clickSignupLogin();
        });

        // 3. Act: Enter Email but leave Password empty
        await test.step('Enter email and try to submit empty password', async () => {
            await loginPage.loginEmailInput.fill(user.email);
            // We intentionally skip filling the password
            await loginPage.loginBtn.click();
        });

        // 4. Assert: Verify HTML5 Validation
        // Since AutomationExercise uses 'required' attribute, the browser shows a bubble.
        // We check the JavaScript validation message.
        await test.step('Verify HTML5 "Please fill out this field" validation', async () => {
            const validationMessage = await loginPage.loginPasswordInput.evaluate((element) => {
                const input = element as HTMLInputElement;
                return input.validationMessage;
            });

            expect(validationMessage).toBeTruthy();
            // Browsers have slightly different messages, but standard is usually "Please fill out this field."
            expect(['Please fill out this field.', 'Fill out this field']).toContain(validationMessage);
        });
    });
});