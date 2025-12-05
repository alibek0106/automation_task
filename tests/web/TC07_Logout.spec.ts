import { Routes } from '../../src/constants/Routes';
import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC07: User Logout Functionality', () => {

  test('@meladze should successfully logout and terminate session', { tag: '@meladze' }, async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
    cartPage,
    paymentPage
  }) => {
    // Generate user for this test
    const user = DataFactory.generateUser();

    // Login with new user (register first)
    await homePage.goto();
    await homePage.clickSignupLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await signupPage.submit();

    // Complete account creation
    await expect(accountCreatedPage.successMessage).toBeVisible();
    await accountCreatedPage.clickContinue();

    // Verify logged in status
    await expect(homePage.loggedInText).toContainText(user.name);
    await expect(homePage.logoutLink).toBeVisible();

    // Navigate to different pages
    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsVisible();
    await homePage.verifyLoggedInVisible();

    await productsPage.navigateToCart();
    await homePage.verifyLoggedInVisible();

    // Click Logout link
    await homePage.clickLogout();

    // Verify user is logged out
    await homePage.verifyLoggedInNotVisible();
    await loginPage.verifyLoginFormVisible();

    // Verify protected pages require re-login
    await paymentPage.goto(Routes.WEB.PAYMENT);
    await paymentPage.waitForLoadState('domcontentloaded');
    await homePage.verifyLoggedInNotVisible();
    await expect(homePage.signupLoginLink).toBeVisible();

    // Verify back button does not restore session
    await homePage.goBack();
    await homePage.verifyLoggedInNotVisible();

    await homePage.goto();
    await homePage.verifyLoggedInNotVisible();
    await expect(homePage.signupLoginLink).toBeVisible();

    // Verify session is completely terminated
    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsVisible();

    await productsPage.addProductToCart(0);

    await productsPage.navigateToCart();

    await cartPage.clickProceedToCheckout();
    await cartPage.verifyRegisterLoginModal();

    // Verify user must login again
    await homePage.goto();
    await homePage.clickSignupLogin();

    await loginPage.login(user.email, user.password);
    await expect(homePage.loggedInText).toContainText(user.name);
  });
});
