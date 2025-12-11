import { isolatedTest as test, expect } from "../../src/fixtures";
import { DataFactory } from "../../src/utils/DataFactory";
import { PRODUCT_NAMES } from "../../src/constants/ProductData";
import { Routes } from "../../src/constants/Routes";
import { User } from "../../src/models/UserModels";
import { PaymentDetails } from "../../src/models/PaymentModels";

test.describe(
  "TC16: Place Order: Login before Checkout",
  { tag: "@Abdykarimov" },
  () => {
    let user: User;
    let payment: PaymentDetails;
    let orderComment: string;

    test.beforeEach(async ({ userService }) => {
      // Setup: Generate test data and create account via API
      user = DataFactory.generateUser();
      payment = DataFactory.generatePaymentDetails();
      orderComment = DataFactory.generateOrderComment();

      // Precondition: Create the User via API so they can log in
      await test.step("Precondition: Create User via API", async () => {
        await userService.createAccount(user);
      });
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

    test("User login before checkout and place order", async ({
      page,
      homePage,
      loginPage,
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

      // 2. Steps 4-6: Login (UI Flow)
      await test.step("Login with valid credentials", async () => {
        await homePage.clickSignupLogin();

        // Verify Login Header
        await expect(
          loginPage.loginHeader,
          "Login header should be visible",
        ).toBeVisible();

        // Perform Login
        await loginPage.login(user.email, user.password);

        // Verify Logged in state
        await expect(
          homePage.loggedInText,
          "Logged in text should contain username",
        ).toContainText(user.name);
      });

      // 3. Steps 7-9: Add Product & View Cart
      await test.step("Add products to cart", async () => {
        // This handles: Navigate to Products -> Add -> View Cart Modal
        await cartSteps.openAndAddProductToCart(productToAdd);

        // Step 9: Verify Cart Page
        await expect(page, "Page should have expected URL").toHaveURL(
          Routes.WEB.VIEW_CART,
        );
      });

      // 4. Steps 10-11: Checkout & Review
      await test.step("Proceed to Checkout", async () => {
        await checkoutSteps.proceedToCheckoutSuccess();
      });

      // 5. Step 12: Place Order
      await test.step("Enter comment and Place Order", async () => {
        await checkoutSteps.placeOrder(orderComment);
      });

      // 6. Steps 13-15: Payment
      await test.step("Enter Payment and Confirm", async () => {
        await checkoutSteps.enterPaymentAndConfirm(payment);
      });
    });
  },
);
