import { isolatedTest as test, expect } from "../../src/fixtures";
import { DataFactory } from "../../src/utils/DataFactory";
import { PRODUCT_NAMES } from "../../src/constants/ProductData";
import { Routes } from "../../src/constants/Routes";
import { User } from "../../src/models/UserModels";
import { PaymentDetails } from "../../src/models/PaymentModels";

test.describe(
  "TC15: Place Order: Register before Checkout",
  { tag: "@Abdykarimov" },
  () => {
    let user: User;
    let payment: PaymentDetails;
    let orderComment: string;

    test.beforeEach(async ({ registrationSteps }) => {
      // Setup: Generate test data and register account
      user = DataFactory.generateUser();
      payment = DataFactory.generatePaymentDetails();
      orderComment = DataFactory.generateOrderComment();

      // Precondition: Register new account
      await registrationSteps.registerNewAccount(user);
    });

    test.afterEach(async ({ paymentPage, accountDeletedPage }) => {
      // Cleanup: Delete the account after test
      await test.step("Delete Account", async () => {
        await paymentPage.clickDeleteAccount();
        await expect(
          accountDeletedPage.deletedHeader,
          "Account should be successfully deleted",
        ).toBeVisible();
        await accountDeletedPage.clickContinue();
      });
    });

    test("User registration before checkout and place order", async ({
      page,
      homePage,
      cartSteps,
      checkoutSteps,
    }) => {
      const productToAdd = PRODUCT_NAMES[0];

      // 1. Steps 1-3: Launch & Verify Home
      await test.step("Navigate to Home", async () => {
        await homePage.goto();
        await expect(page, "Page should have expected title").toHaveTitle(
          Routes.WEB.HOME_TITLE,
        );
      });

      // 2. Steps 8-10: Add Product & View Cart
      await test.step("Add products to cart", async () => {
        await cartSteps.openAndAddProductToCart(productToAdd);

        await expect(page, "Page should have expected URL").toHaveURL(
          Routes.WEB.VIEW_CART,
        );
      });

      // 3. Steps 11-12: Checkout & Review
      await test.step("Proceed to Checkout", async () => {
        await checkoutSteps.proceedToCheckoutSuccess();
      });

      // 4. Step 13: Comment & Place Order
      await test.step("Enter comment and Place Order", async () => {
        await checkoutSteps.placeOrder(orderComment);
      });

      // 5. Steps 14-16: Payment
      await test.step("Enter Payment and Confirm", async () => {
        await checkoutSteps.enterPaymentAndConfirm(payment);
      });
    });
  },
);
