import { test } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

/**
 * TC01: User Registration
 * 
 * Validates complete user registration flow including account creation,
 * profile information submission, and successful login verification.
 */

test.describe('User Registration', () => {
    test('TC01: Register User with Complete Profile', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
        automationExerciseSignupSteps,
    }) => {
        // Arrange: Generate test data
        const user = DataFactory.generateUser();
        const accountDetails = DataFactory.generateAccountDetails();
        const addressInfo = DataFactory.generateAddressInfo();

        // 1. Launch browser and Navigate to url 'http://automationexercise.com'
        await automationExerciseLandingSteps.navigateToHomepage();

        // 2. Verify that home page is visible successfully
        await automationExerciseLandingSteps.verifyPageOpened();

        // 3. Click on 'Signup / Login' button
        await automationExerciseNavigationSteps.clickSignupLogin();

        // 4. Verify 'New User Signup!' is visible
        await automationExerciseLoginSteps.verifyNewUserSignupVisible();

        // 5. Enter name and email address
        // 6. Click 'Signup' button
        await automationExerciseLoginSteps.signup(user.name, user.email);

        // 7. Verify that 'ENTER ACCOUNT INFORMATION' is visible
        await automationExerciseSignupSteps.verifyAccountInfoPageOpened();

        // 8. Fill details: Title, Name, Email, Password, Date of birth
        await automationExerciseSignupSteps.fillAccountDetails(accountDetails);

        // 9. Select checkbox 'Sign up for our newsletter!'
        await automationExerciseSignupSteps.selectNewsletter();

        // 10. Select checkbox 'Receive special offers from our partners!'
        await automationExerciseSignupSteps.selectSpecialOffers();

        // 11. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
        await automationExerciseSignupSteps.fillAddressInfo(addressInfo);

        // 12. Click 'Create Account button'
        await automationExerciseSignupSteps.clickCreateAccount();

        // 13. Verify that 'ACCOUNT CREATED!' is visible
        await automationExerciseSignupSteps.verifyAccountCreated();

        // 14. Click 'Continue' button
        await automationExerciseSignupSteps.clickContinue();

        // 15. Verify that 'Logged in as username' is visible
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);

        // 16. Delete Account (Optional cleanup or part of test flow)
        await automationExerciseNavigationSteps.clickDeleteAccount();
        await automationExerciseNavigationSteps.verifyAccountDeleted();

    });
});
