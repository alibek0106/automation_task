import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC01: User Registration @Abdykarimov', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should register a new user with complete profile', async ({
        registrationSteps,
        homePage,
        accountCreatedPage
    }) => {
        const user = DataFactory.generateUser();

        // Step 1: Start
        await test.step('Navigate to Signup and enter basic details', async () => {
            await registrationSteps.startRegistration(user);
        });

        // Step 2: Form
        await test.step('Fill detailed account information', async () => {
            await registrationSteps.fillAccountDetails(user);
        });

        // Step 3: Verify Creation
        await test.step('Verify account creation success', async () => {
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await expect(accountCreatedPage.successMessage).toHaveText('Account Created!');
        });

        // Step 4: Continue & Login Check
        await test.step('Continue and verify logged-in state', async () => {
            await registrationSteps.finishAccountCreation();
            // Using robust locator from HomePage
            await expect(homePage.loggedInText).toContainText(user.name);
        });
    });
});