import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { TestData } from '../../src/constants/TestData';

test.describe('TC06: Complete End-to-End Purchase Flow', { tag: '@meladze' }, () => {
  test('should complete end-to-end purchase flow', async ({
    homePage,
    registrationSteps,
    accountCreatedPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
    cartSteps,
    checkoutSteps
  }) => {
    const user = DataFactory.generateUser();
    const DELIVERY_ADDRESS_TYPE = 'delivery';
    const BILLING_ADDRESS_TYPE = 'billing';

    await test.step('Register new user', async () => {
      await registrationSteps.startRegistration(user);
      await registrationSteps.fillAccountDetails(user);
      await expect(accountCreatedPage.successMessage, 'Account Created message should be visible').toBeVisible();
      await registrationSteps.finishAccountCreation();
      await expect(homePage.loggedInText, `User Logged in text should contain username '${user.name}'`).toContainText(user.name);
    });

    // Add products to cart
    await cartSteps.addProductsToCart(2);

    await test.step('Verify cart contents', async () => {
      await productsPage.navigateToCart();
      const cartCount = await cartPage.getCartCount();
      expect(cartCount, 'Cart count should be 2').toBe(2);
    });

    await test.step('Proceed to checkout and verify details', async () => {
      await cartPage.clickProceedToCheckout();
      await checkoutPage.verifyCheckoutPageVisible();
      await checkoutPage.verifyAddressDetails(DELIVERY_ADDRESS_TYPE, user);
      await checkoutPage.verifyAddressDetails(BILLING_ADDRESS_TYPE, user);
      await expect(checkoutPage.orderReviewTable, 'Order review table should be visible').toBeVisible();
    });

    // Place order
    await checkoutSteps.placeOrder(TestData.CHECKOUT.ORDER_COMMENT);

    await test.step('Complete payment', async () => {
      const paymentData = DataFactory.generatePaymentDetails();
      await paymentPage.verifyPaymentPageVisible();
      await paymentPage.fillPaymentDetails(paymentData);
      await paymentPage.clickPayAndConfirm();
      await paymentPage.verifyOrderPlaced();
    });

    await test.step('Verify cart is empty after order', async () => {
      await productsPage.navigateToCart();
      const cartCount = await cartPage.getCartCount();
      expect(cartCount, 'Cart count should be 0').toBe(0);
    });
  });
});
