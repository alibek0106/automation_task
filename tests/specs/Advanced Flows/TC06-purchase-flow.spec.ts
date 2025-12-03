import { test, expect } from '../../fixtures/pageFixtures';
import { UserDataManager } from '../../testData';

/**
 * TC06: Complete End-to-End Purchase Flow
 *
 * Priority: Critical
 * Type: End-to-End
 * Requires: Registered and logged-in user
 *
 * Objective: Verify complete purchase flow from product selection to order confirmation.
 */

test.describe('TC06: Complete End-to-End Purchase Flow', () => {

  test('should complete end-to-end purchase flow', async ({
    page,
    homePage,
    signupLoginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage
  }, testInfo) => {
    // Worker-specific user setup
    const workerId = testInfo.parallelIndex.toString();
    // Always generate a fresh user for E2E flow to ensure known data state (address, empty cart)
    const userData = UserDataManager.generateUniqueUser(workerId);

    // Step 1: Register and login with new user
    await test.step('Precondition: Register new user', async () => {
      await homePage.navigateToHome();
      await homePage.verifyHomepageLoaded();

      // Logout if currently logged in to ensure clean session
      if (await homePage.isLoggedIn()) {
        await homePage.clickLogout();
      }

      await homePage.clickSignupLogin();

      console.log(`[Worker ${workerId}] Registering new user for TC06...`);
      await signupLoginPage.signup(userData.credentials.name, userData.credentials.email);
      await signupPage.completeRegistration(userData.accountInfo, userData.addressInfo);
      await accountCreatedPage.completeAccountCreation();

      // Save credentials so other tests (like TC02) can use this valid user if needed
      UserDataManager.saveUserCredentials(workerId, userData.credentials);

      // Verify final login state
      await homePage.verifyLoggedInAs(userData.credentials.name);
    });

    // Step 2: Navigate to "Products" page
    await test.step('Navigate to Products page', async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsPageVisible();
    });

    // Step 3: Add multiple products to cart (at least 2)
    await test.step('Add products to cart', async () => {
      // Add first product (index 0)
      await productsPage.addProductToCart(0);

      // Add second product (index 1)
      await productsPage.addProductToCart(1);
    });

    // Step 4: Navigate to cart page
    await test.step('Navigate to Cart page', async () => {
      await productsPage.navigateToCart();
      await cartPage.verifyCartPageLoaded();
    });

    // Step 5: Verify all products are in cart with correct details
    await test.step('Verify products in cart', async () => {
      // Verify we have 2 rows in the cart
      await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(2);
    });

    // Step 6: Click "Proceed To Checkout" button
    await test.step('Proceed to checkout', async () => {
      await cartPage.clickProceedToCheckout();
    });

    // Step 7-8: Verify delivery and billing address
    await test.step('Verify address details', async () => {
      await checkoutPage.verifyCheckoutPageVisible();
      await checkoutPage.verifyAddressDetails('delivery', userData.addressInfo);
      await checkoutPage.verifyAddressDetails('billing', userData.addressInfo);
    });

    // Step 9-10: Verify order details and total
    await test.step('Verify order review', async () => {
      // Ensure product list is visible in checkout review
      await expect(page.locator('table.table-condensed')).toBeVisible();
    });

    // Step 11 (Part 1): Enter comment and proceed
    await test.step('Place Order', async () => {
      await checkoutPage.enterComment('Test Order for Automation Task');
      await checkoutPage.clickPlaceOrder();
    });

    // Step 11 (Part 2): Enter payment details
    await test.step('Enter payment details', async () => {
      await paymentPage.verifyPaymentPageVisible();

      // Use test card data
      await paymentPage.fillPaymentDetails(
        userData.credentials.name,
        '4111 1111 1111 1111',
        '123',
        '12',
        '2025'
      );
    });

    // Step 12: Click "Pay and Confirm Order" button
    await test.step('Confirm payment', async () => {
      await paymentPage.clickPayAndConfirm();
    });

    // Step 13-14: Verify order success
    await test.step('Verify order success', async () => {
      await paymentPage.verifyOrderPlaced();
    });

    // Step 16: Verify cart is empty after order completion
    await test.step('Verify cart is empty', async () => {
      // Navigate back to cart to check status
      await productsPage.navigateToCart();
      await cartPage.verifyCartPageLoaded();
      await cartPage.verifyCartIsEmpty();
    });
  });
});
