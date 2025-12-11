import { Routes } from '../../src/constants/Routes';
import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC07: User Logout Functionality', { tag: '@meladze' }, () => {
  test('should logout successfully', async ({
    homePage,
    loginPage,
    registrationSteps,
  }) => {
    const user = DataFactory.generateUser();
    await registrationSteps.registerNewAccount(user);

    await test.step('Logout and verify logged out state', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
      await loginPage.verifyPageOpened();
    });
  });

  test('should terminate session after logout', async ({
    homePage,
    registrationSteps,
    productsPage,
    cartPage,
  }) => {
    const user = DataFactory.generateUser();
    await registrationSteps.registerNewAccount(user);

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
    registrationSteps,
    paymentPage,
  }) => {
    const user = DataFactory.generateUser();
    await registrationSteps.registerNewAccount(user);

    await test.step('Logout', async () => {
      await homePage.clickLogout();
      await homePage.verifyLoggedInNotVisible();
    });

    await test.step('Verify protected pages require re-login', async () => {
      await paymentPage.goto(Routes.WEB.PAYMENT);
      await paymentPage.waitForLoadState('domcontentloaded');
      await homePage.verifyLoggedInNotVisible();
      await expect(homePage.signupLoginLink, 'Signup/Login link should be visible').toBeVisible();
    });
  });

  test('should not restore session with back button', async ({
    homePage,
    registrationSteps,
    productsPage,
  }) => {
    const user = DataFactory.generateUser();
    await registrationSteps.registerNewAccount(user);

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
      // Reload the page to get fresh content instead of cached version
      // Using domcontentloaded instead of networkidle for reliability
      await homePage.page.reload({ waitUntil: 'domcontentloaded' });
      await homePage.verifyLoggedInNotVisible();
      await homePage.goto();
      await homePage.verifyLoggedInNotVisible();
      await expect(homePage.signupLoginLink, 'Signup/Login link should be visible').toBeVisible();
    });
  });
});
