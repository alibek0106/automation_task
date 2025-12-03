import { test, expect } from '../../fixtures/pageFixtures';
import { UserDataManager } from '../../testData';

test.describe('TC02: Login with Registered User', () => {

  test('should login successfully with registered user credentials', async ({
    page,
    homePage,
    signupLoginPage,
    signupPage,
    accountCreatedPage
  }, testInfo) => {
    const workerId = testInfo.parallelIndex.toString();

    let userCredentials = UserDataManager.loadUserCredentials(workerId);

    // Precondition: Ensure a user exists. If not, register one.
    if (!userCredentials) {
      console.log(`[Worker ${workerId}] No credentials found. Registering new user for TC02...`);

      // Generate new user data
      const userData = UserDataManager.generateUniqueUser(workerId);
      userCredentials = userData.credentials;

      await test.step('Precondition: Register new user', async () => {
        await homePage.navigateToHome();
        await homePage.clickSignupLogin();

        await signupLoginPage.signup(userData.credentials.name, userData.credentials.email);
        await signupPage.completeRegistration(userData.accountInfo, userData.addressInfo);
        await accountCreatedPage.completeAccountCreation();

        // Verify logged in before logging out
        await homePage.verifyLoggedInAs(userData.credentials.name);

        // Logout to prepare for login test
        await homePage.clickLogout();

        // Save credentials for reuse
        UserDataManager.saveUserCredentials(workerId, userCredentials!);
      });
    }

    // Step 1: Navigate to homepage
    await test.step('Navigate to homepage', async () => {
      await homePage.navigateToHome();
      await homePage.verifyHomepageLoaded();
    });

    // Step 2: Click on "Signup / Login" link
    await test.step('Click Signup/Login link', async () => {
      await homePage.clickSignupLogin();
    });

    // Step 3: Verify "Login to your account" section is visible
    await test.step('Verify login section is visible', async () => {
      await signupLoginPage.verifyLoginSectionVisible();
    });

    // Step 4-5: Enter correct email address and password
    await test.step('Fill login form with registered credentials', async () => {
      if (!userCredentials) throw new Error('User credentials should exist by now');

      await signupLoginPage.fillLoginForm(
        userCredentials.email,
        userCredentials.password
      );
    });

    // Step 6: Click "Login" button
    await test.step('Submit login form', async () => {
      await signupLoginPage.clickLogin();
    });

    // Step 7: Verify "Logged in as [username]" is visible
    await test.step('Verify user is logged in', async () => {
      // Verify no error messages appear
      const hasError = await signupLoginPage.isErrorMessageVisible();
      if (hasError) {
        const errorMsg = await signupLoginPage.getErrorMessage();
        throw new Error(`Login failed with error: ${errorMsg}`);
      }

      if (!userCredentials) throw new Error('User credentials missing');
      await homePage.verifyLoggedInAs(userCredentials.name);
    });

    // Step 8: Verify user is on homepage (after login redirect)
    await test.step('Verify redirect to homepage', async () => {
      await expect(page).toHaveURL(/.*automationexercise.com/);
      await homePage.verifyHomepageLoaded();
    });

    // Additional verification: User can access account-specific features
    await test.step('Verify account features are accessible', async () => {
      const isLoggedIn = await homePage.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      const username = await homePage.getLoggedInUsername();
      if (!userCredentials) throw new Error('User credentials missing');
      expect(username).toBe(userCredentials.name);
    });
  });
});
