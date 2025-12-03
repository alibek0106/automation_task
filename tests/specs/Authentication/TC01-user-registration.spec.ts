import { test, expect } from '../../fixtures/pageFixtures';
import { UserDataManager } from '../../testData';

/**
 * TC01: User Registration with Complete Profile
 * 
 * Priority: High
 * Type: Functional
 * Requires: Unique user per worker
 * 
 * Objective: Verify that a new user can successfully register with complete 
 * profile information and access their account.
 */

test.describe('TC01: User Registration with Complete Profile', () => {

    test('should register a new user with complete profile information', async ({
        page,
        homePage,
        signupLoginPage,
        signupPage,
        accountCreatedPage
    }, testInfo) => {
        // Get worker ID for unique user generation
        const workerId = testInfo.parallelIndex.toString();

        // Generate unique user data for this worker
        const userData = UserDataManager.generateUniqueUser(workerId);

        // Step 1-2: Navigate to homepage and verify it loads successfully
        await test.step('Navigate to homepage', async () => {
            await homePage.navigateToHome();
            await homePage.verifyHomepageLoaded();
        });

        // Step 3: Click on "Signup / Login" link
        await test.step('Click Signup/Login link', async () => {
            await homePage.clickSignupLogin();
        });

        // Step 4-5: Verify "New User Signup!" section and fill signup form
        await test.step('Fill signup form with unique credentials', async () => {
            await signupLoginPage.verifyNewUserSignupVisible();
            await signupLoginPage.fillSignupForm(
                userData.credentials.name,
                userData.credentials.email
            );
        });

        // Step 6: Click "Signup" button
        await test.step('Submit signup form', async () => {
            await signupLoginPage.clickSignup();
        });

        // Step 7: Verify "ENTER ACCOUNT INFORMATION" page is displayed
        await test.step('Verify account information page', async () => {
            await signupPage.verifyAccountInfoPageVisible();
        });

        // Step 8-10: Fill in all account details and select checkboxes
        await test.step('Fill account information', async () => {
            await signupPage.fillAccountInformation(userData.accountInfo);
        });

        // Step 10: Fill in address information
        await test.step('Fill address information', async () => {
            await signupPage.fillAddressInformation(userData.addressInfo);
        });

        // Step 11: Click "Create Account" button
        await test.step('Submit registration form', async () => {
            await signupPage.clickCreateAccount();
        });

        // Step 12: Verify "ACCOUNT CREATED!" message is displayed
        await test.step('Verify account created message', async () => {
            await accountCreatedPage.verifyAccountCreatedVisible();
        });

        // Step 13: Click "Continue" button
        await test.step('Click continue button', async () => {
            await accountCreatedPage.clickContinue();
        });

        // Step 14: Verify "Logged in as [username]" is visible in header
        await test.step('Verify user is logged in', async () => {
            await homePage.verifyLoggedInAs(userData.credentials.name);

            // Verify user is on homepage after login
            await expect(page).toHaveURL(/.*automationexercise.com/);
        });

        // Step 15: Store user credentials for subsequent tests (TC02)
        await test.step('Save user credentials for TC02', async () => {
            UserDataManager.saveUserCredentials(workerId, userData.credentials);

            // Verify credentials were saved successfully
            const savedCredentials = UserDataManager.loadUserCredentials(workerId);
            expect(savedCredentials).not.toBeNull();
            expect(savedCredentials?.email).toBe(userData.credentials.email);
        });
    });
});
