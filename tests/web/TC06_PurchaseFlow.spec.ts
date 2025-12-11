import { isolatedTest as test, expect } from "../../src/fixtures";
import { DataFactory } from "../../src/utils/DataFactory";
import { TestData } from "../../src/constants/TestData";

test.describe(
  "TC06: Complete End-to-End Purchase Flow",
  { tag: "@meladze" },
  () => {
    test("should complete end-to-end purchase flow", async ({
      homePage,
      registrationSteps,
      accountCreatedPage,
      productsPage,
      cartPage,
      cartSteps,
      checkoutPage,
      paymentPage,
    }) => {
      // Test constants
      const DELIVERY_ADDRESS = "delivery";
      const BILLING_ADDRESS = "billing";
      const PRODUCTS_TO_ADD = 2;

      const user = DataFactory.generateUser();
      const payment = DataFactory.generatePaymentDetails();

      await registrationSteps.registerNewAccount(user);

      await test.step("Add products to cart", async () => {
        await productsPage.navigateToProducts();
        await productsPage.verifyAllProductsVisible();
        await productsPage.addMultipleProductsToCart(PRODUCTS_TO_ADD);
      });

      await test.step("Verify cart contents", async () => {
        await productsPage.navigateToCart();
        expect(await cartSteps.getCartCount(), "Cart count should be 2").toBe(
          PRODUCTS_TO_ADD,
        );
      });

      await test.step("Proceed to checkout and verify details", async () => {
        await cartPage.clickProceedToCheckout();
        await checkoutPage.verifyCheckoutPageVisible();
        await checkoutPage.verifyAddressDetails(DELIVERY_ADDRESS, user);
        await checkoutPage.verifyAddressDetails(BILLING_ADDRESS, user);
        await expect(
          checkoutPage.orderReviewTable,
          "Order review table should be visible",
        ).toBeVisible();
      });

      await test.step("Place order", async () => {
        await checkoutPage.enterComment(TestData.CHECKOUT.ORDER_COMMENT);
        await checkoutPage.clickPlaceOrder();
      });

      await test.step("Complete payment", async () => {
        await paymentPage.verifyPaymentPageVisible();
        await paymentPage.fillPaymentDetails(
          payment.nameOnCard,
          payment.cardNumber,
          payment.cvc,
          payment.expiryMonth,
          payment.expiryYear,
        );
        await paymentPage.clickPayAndConfirm();
        await paymentPage.verifyOrderPlaced();
      });

      await test.step("Verify cart is empty after order", async () => {
        await productsPage.navigateToCart();
        const cartCount = await cartSteps.getCartCount();
        expect(cartCount, "Cart count should be 0").toBe(0);
      });
    });
  },
);
