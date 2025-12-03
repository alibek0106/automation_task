import { test, expect } from '../../src/fixtures';
import { AccountCreatedPage } from '../../src/pages/AccountCreatedPage';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC01: User Registration', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Should register a new user succesfully', async ({ registrationSteps, accountCreatedPage, homePage }) => {
        const user = DataFactory.generateUser();
        const successMessage = 'Account Created!';

        // Perform registration
        await registrationSteps.performFullRegistration(user);
        await expect(accountCreatedPage.successMessage, 'Success message should be visible').toBeVisible();
        await expect(accountCreatedPage.successMessage, `Message should have text: ${successMessage}`).toHaveText(successMessage);

        await registrationSteps.finishAccountCreation();

        await expect(homePage.loggedInText, 'User should be logged in with correct username').toContainText(user.name);
    });
});