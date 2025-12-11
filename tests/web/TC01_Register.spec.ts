import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC01: User Registration', { tag: '@Abdykarimov' }, () => {
    test('should register a new user with complete profile', async ({
        registrationSteps,
        homePage,
        accountCreatedPage
    }) => {
        const user = DataFactory.generateUser();

        // Step 1: Start
        await registrationSteps.startRegistration(user);

        // Step 2: Form
        await registrationSteps.fillAccountDetails(user);

        // Step 3: Verify Creation
        await test.step('Verify account creation success', async () => {
            await expect(accountCreatedPage.successMessage, 'Success message should be visible and contain expected text').toHaveText('Account Created!');
        });

        // Step 4: Continue & Login Check
        await test.step('Continue and verify logged-in state', async () => {
            await registrationSteps.finishAccountCreation();
            await expect(homePage.loggedInText, 'User should be logged in').toContainText(user.name);
        });
    });
});