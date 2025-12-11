import { expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import { PaymentDetails } from "../models/PaymentModels";

export class CheckoutSteps {
  constructor(
    private cartPage: CartPage,
    private checkoutPage: CheckoutPage,
    private paymentPage: PaymentPage,
  ) { }

  /**
   * Clicks Proceed to Checkout.
   * Handles the case where user is not logged in (expects modal).
   */
  async proceedToCheckoutExpectLoginModal() {
    await this.cartPage.clickProceedToCheckout();
    await expect(
      this.cartPage.checkoutModalRegisterLoginLink,
      "Checkout modal register/login link is not visible",
    ).toBeVisible();
    await this.cartPage.clickRegisterLoginFromModal();
  }

  /**
   * Clicks Proceed to Checkout when already logged in.
   */
  async proceedToCheckoutSuccess() {
    await this.cartPage.clickProceedToCheckout();
    await expect(
      this.checkoutPage.deliveryAddressSection,
      "Delivery address section is not visible",
    ).toBeVisible();
  }

  async placeOrder(comment: string) {
    await this.checkoutPage.enterComment(comment);
    await this.checkoutPage.clickPlaceOrder();
  }

  async enterPaymentAndConfirm(payment: PaymentDetails) {
    await this.paymentPage.fillPaymentDetails(payment.nameOnCard, payment.cardNumber, payment.cvc, payment.expiryMonth, payment.expiryYear);
    await this.paymentPage.clickPayAndConfirm();
    await expect(this.paymentPage.successMessage, 'Success message is not visible').toBeVisible();
  }
}
