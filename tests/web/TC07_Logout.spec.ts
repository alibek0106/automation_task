import { Routes } from '../../src/constants/Routes';
import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC07: User Logout Functionality', { tag: '@meladze' }, () => {

  test('should logout successfully', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Register and login new user', async () => {
      await homePage.goto();
      await homePage.clickSignupLogin();
      await loginPage.signup(user.name, user.email);
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
      await expect(accountCreatedPage.successMessage).toBeVisible();
      await accountCreatedPage.clickContinue();
      await expect(homePage.loggedInText).toContainText(user.name);
      await expect(homePage.logoutLink).toBeVisible();
    });

    await test.step('Logout and verify logged out state', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
      await loginPage.verifyLoginFormVisible();
    });
  });

  test('should terminate session after logout', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
    cartPage,
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Register and login new user', async () => {
      await homePage.goto();
      await homePage.clickSignupLogin();
      await loginPage.signup(user.name, user.email);
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
      await expect(accountCreatedPage.successMessage).toBeVisible();
      await accountCreatedPage.clickContinue();
      await expect(homePage.loggedInText).toContainText(user.name);
    });

    await test.step('Logout', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
    });

    await test.step('Verify session is terminated for checkout', async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await productsPage.addProductToCart(0);
      await productsPage.navigateToCart();
      await cartPage.clickProceedToCheckout();
      await cartPage.verifyRegisterLoginModal();
    });
  });

  test('should require login for protected pages after logout', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    paymentPage,
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Register and login new user', async () => {
      await homePage.goto();
      await homePage.clickSignupLogin();
      await loginPage.signup(user.name, user.email);
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
      await expect(accountCreatedPage.successMessage).toBeVisible();
      await accountCreatedPage.clickContinue();
      await expect(homePage.loggedInText).toContainText(user.name);
    });

    await test.step('Logout', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
    });

    await test.step('Verify protected pages require re-login', async () => {
      await paymentPage.goto(Routes.WEB.PAYMENT);
      await paymentPage.waitForLoadState('domcontentloaded');
      await homePage.verifyLoggedInNotVisible();
      await expect(homePage.signupLoginLink).toBeVisible();
    });
  });

  test('should not restore session with back button', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Register and login new user', async () => {
      await homePage.goto();
      await homePage.clickSignupLogin();
      await loginPage.signup(user.name, user.email);
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
      await expect(accountCreatedPage.successMessage).toBeVisible();
      await accountCreatedPage.clickContinue();
      await expect(homePage.loggedInText).toContainText(user.name);
    });

    await test.step('Verify logged in state across different pages', async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await homePage.verifyLoggedInVisible();
      await productsPage.navigateToCart();
      await homePage.verifyLoggedInVisible();
    });

    await test.step('Logout', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
    });

    await test.step('Verify back button does not restore session', async () => {
      await homePage.goBack();
      await homePage.verifyLoggedInNotVisible();
      await homePage.goto();
      await homePage.verifyLoggedInNotVisible();
      await expect(homePage.signupLoginLink).toBeVisible();
    });
  });
});
