import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC23: Verify Address Details in Checkout Page', { tag: '@meladze' }, () => {
  test('should verify delivery and billing addresses match registration details', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    accountDeletedPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify that home page is visible successfully', async () => {
      await expect(
        homePage.page,
        'Homepage should be loaded successfully with correct title'
      ).toHaveTitle(/Automation Exercise/);
    });

    await test.step('Click Signup / Login button', async () => {
      await homePage.clickSignupLogin();
    });

    await test.step('Fill all details in Signup and create account', async () => {
      await loginPage.signup(user.name, user.email);
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
    });

    await test.step('Verify ACCOUNT CREATED! and click Continue button', async () => {
      await expect(
        accountCreatedPage.successMessage,
        'Account Created message should be visible'
      ).toBeVisible();
      await expect(
        accountCreatedPage.successMessage,
        'Message should display Account Created!'
      ).toHaveText('Account Created!');
      await accountCreatedPage.clickContinue();
    });

    await test.step('Verify Logged in as username at top', async () => {
      await expect(
        homePage.loggedInText,
        'Logged in text should be visible'
      ).toBeVisible();
      await expect(
        homePage.loggedInText,
        `Logged in text should contain username: ${user.name}`
      ).toContainText(user.name);
    });

    await test.step('Add products to cart', async () => {
      await productsPage.navigateToProducts();
      await productsPage.addProductToCart(0);
      await productsPage.addProductToCart(1);
    });

    await test.step('Click Cart button', async () => {
      await productsPage.navigateToCart();
    });

    await test.step('Verify that cart page is displayed', async () => {
      await expect(
        cartPage.page,
        'Cart page URL should be displayed'
      ).toHaveURL(/view_cart/);
      await expect(
        cartPage.cartTable,
        'Cart table should be visible'
      ).toBeVisible();
    });

    await test.step('Click Proceed To Checkout', async () => {
      await cartPage.clickProceedToCheckout();
    });

    await test.step('Verify that the delivery address is same address filled at registration', async () => {
      await checkoutPage.verifyAddressDetails('delivery', user);
    });

    await test.step('Verify that the billing address is same address filled at registration', async () => {
      await checkoutPage.verifyAddressDetails('billing', user);
    });

    await test.step('Click Delete Account button', async () => {
      await homePage.deleteAccountLink.click();
    });

    await test.step('Verify ACCOUNT DELETED! and click Continue button', async () => {
      await expect(
        accountDeletedPage.deletedMessage,
        'Account Deleted message should be visible'
      ).toBeVisible();
      await expect(
        accountDeletedPage.deletedMessage,
        'Message should display Account Deleted!'
      ).toHaveText('Account Deleted!');
      await accountDeletedPage.clickContinue();
    });
  });
});
