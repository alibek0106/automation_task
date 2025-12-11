import { isolatedTest as test, expect } from "../../src/fixtures";
import { DataFactory } from "../../src/utils/DataFactory";
import { PRODUCT_NAMES } from "../../src/constants/ProductData";
import { Routes } from "../../src/constants/Routes";
import { User } from "../../src/models/UserModels";
import { PaymentDetails } from "../../src/models/PaymentModels";

test.describe(
  "TC14: Place Order: Register while Checkout",
  { tag: "@Abdykarimov" },
  () => {
    let user: User;
    let payment: PaymentDetails;
    let orderComment: string;

    test.beforeEach(async () => {
      // Setup: Generate test data
      // Note: Registration happens during the test flow for this scenario
      user = DataFactory.generateUser();
      payment = DataFactory.generatePaymentDetails();
      orderComment = DataFactory.generateOrderComment();
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

    test("User registration during checkout and delete account after successfully placing order", async ({
      page,
      homePage,
      productsPage,
      cartSteps,
      registrationSteps,
      checkoutSteps,
    }) => {
      const productToAdd = PRODUCT_NAMES[0]; // "Blue Top"

      // 1. Navigate and Verify Home
      await test.step("Navigate to Home", async () => {
        await homePage.goto();
        await expect(page, "Home page should be opened").toHaveTitle(
          Routes.WEB.HOME_TITLE,
        );
      });

      // 2. Add Products and View Cart
      await test.step("Add products to cart", async () => {
        await cartSteps.openAndAddProductToCart(productToAdd);
      });

      // 3. Proceed to Checkout (Expect Login Modal)
      await test.step("Proceed to Checkout -> Redirect to Login/Register", async () => {
        await checkoutSteps.proceedToCheckoutExpectLoginModal();
      });

      // 4. Register User (during checkout)
      await registrationSteps.registerNewAccount(user);

      // 5. Navigate to Cart (Again) & Checkout
      await test.step("Go to Cart and Proceed to Checkout (Logged In)", async () => {
        // We use ProductsPage to navigate to cart (as established in previous refactor)
        await productsPage.navigateToCart();
        await checkoutSteps.proceedToCheckoutSuccess();
      });

      // 6. Verify Address & Place Order
      await test.step("Review Order and Place Order", async () => {
        // (Optional) Add specific address verification logic here if needed
        await checkoutSteps.placeOrder(orderComment);
      });

      // 7. Payment
      await test.step("Enter Payment and Confirm", async () => {
        await checkoutSteps.enterPaymentAndConfirm(payment);
      });
    });
  },
);
