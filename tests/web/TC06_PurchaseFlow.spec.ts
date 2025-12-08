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
    paymentPage
  }) => {
    const user = DataFactory.generateUser();

    await test.step('Register new user', async () => {
      await registrationSteps.startRegistration(user);
      await registrationSteps.fillAccountDetails(user);
      await expect(accountCreatedPage.successMessage, 'Account Created message should be visible').toBeVisible();
      await registrationSteps.finishAccountCreation();
      await expect(homePage.loggedInText, `User Logged in text should contain username '${user.name}'`).toContainText(user.name);
    });

    await test.step('Add products to cart', async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await productsPage.addProductToCart(0);
      await productsPage.addProductToCart(1);
    });

    await test.step('Verify cart contents', async () => {
      await productsPage.navigateToCart();
      expect(await cartPage.getCartCount(), 'Cart count should be 2').toBe(2);
    });

    await test.step('Proceed to checkout and verify details', async () => {
      await cartPage.clickProceedToCheckout();
      await checkoutPage.verifyCheckoutPageVisible();
      await checkoutPage.verifyAddressDetails('delivery', user);
      await checkoutPage.verifyAddressDetails('billing', user);
      await expect(checkoutPage.orderReviewTable, 'Order review table should be visible').toBeVisible();
    });

    await test.step('Place order', async () => {
      await checkoutPage.enterComment(TestData.CHECKOUT.ORDER_COMMENT);
      await checkoutPage.clickPlaceOrder();
    });

    await test.step('Complete payment', async () => {
      await paymentPage.verifyPaymentPageVisible();
      await paymentPage.fillPaymentDetails(
        user.name,
        TestData.PAYMENT.CARD_NUMBER,
        TestData.PAYMENT.CVV,
        TestData.PAYMENT.EXPIRY_MONTH,
        TestData.PAYMENT.EXPIRY_YEAR
      );
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
