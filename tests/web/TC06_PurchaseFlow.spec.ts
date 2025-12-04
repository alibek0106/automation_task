import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { TestData } from '../../src/constants/TestData';

test.describe('TC06: Complete End-to-End Purchase Flow', () => {

  test('should complete end-to-end purchase flow', async ({
    page,
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage
  }) => {
    // Generate fresh user for E2E flow
    const user = DataFactory.generateUser();

    // Precondition: Register new user
    await homePage.goto();
    await homePage.clickSignupLogin();

    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await signupPage.submit();

    await expect(accountCreatedPage.successMessage).toBeVisible();
    await accountCreatedPage.clickContinue();

    // Verify logged in
    await expect(homePage.loggedInText).toContainText(user.name);

    // Navigate to Products page
    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsVisible();

    // Add multiple products to cart (at least 2)
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);

    // Navigate to cart page
    await productsPage.navigateToCart();

    // Verify we have 2 rows in the cart
    expect(await cartPage.getCartCount()).toBe(2);

    // Proceed to checkout
    await cartPage.clickProceedToCheckout();

    // Verify address details
    await checkoutPage.verifyCheckoutPageVisible();
    await checkoutPage.verifyAddressDetails('delivery', user);
    await checkoutPage.verifyAddressDetails('billing', user);

    // Verify order review
    await expect(checkoutPage.orderReviewTable).toBeVisible();

    // Place Order
    await checkoutPage.enterComment(TestData.CHECKOUT.ORDER_COMMENT);
    await checkoutPage.clickPlaceOrder();

    // Enter payment details
    await paymentPage.verifyPaymentPageVisible();

    await paymentPage.fillPaymentDetails(
      user.name,
      TestData.PAYMENT.CARD_NUMBER,
      TestData.PAYMENT.CVV,
      TestData.PAYMENT.EXPIRY_MONTH,
      TestData.PAYMENT.EXPIRY_YEAR
    );

    // Confirm payment
    await paymentPage.clickPayAndConfirm();

    // Verify order success
    await paymentPage.verifyOrderPlaced();

    // Verify cart is empty after order completion
    await productsPage.navigateToCart();

    const cartCount = await cartPage.getCartCount();
    expect(cartCount).toBe(0);
  });
});
