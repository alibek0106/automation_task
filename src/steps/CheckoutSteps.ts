import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentDetails } from '../models/PaymentModels';

export class CheckoutSteps {
    constructor(
        private cartPage: CartPage,
        private checkoutPage: CheckoutPage,
        private paymentPage: PaymentPage
    ) { }

    /**
     * Clicks Proceed to Checkout. 
     * Handles the case where user is not logged in (expects modal).
     */
    async proceedToCheckoutExpectLoginModal() {
        await test.step('Proceed to checkout (Expect Login Modal)', async () => {
            await this.cartPage.clickProceedToCheckout();
            await expect(this.cartPage.checkoutModalRegisterLoginLink).toBeVisible();
            await this.cartPage.clickRegisterLoginFromModal();
        });
    }

    /**
     * Clicks Proceed to Checkout when already logged in.
     */
    async proceedToCheckoutSuccess() {
        await test.step('Proceed to checkout (Logged In)', async () => {
            await this.cartPage.clickProceedToCheckout();
            await expect(this.checkoutPage.deliveryAddressSection).toBeVisible();
        });
    }

    async placeOrder(comment: string) {
        await test.step(`Place order with comment: "${comment}"`, async () => {
            await this.checkoutPage.enterComment(comment);
            await this.checkoutPage.clickPlaceOrder();
        });
    }

    async enterPaymentAndConfirm(payment: PaymentDetails) {
        await test.step('Enter payment details and confirm', async () => {
            await this.paymentPage.fillPaymentDetails(payment.nameOnCard, payment.cardNumber, payment.cvc, payment.expiryMonth, payment.expiryYear);
            await this.paymentPage.clickPayAndConfirm();
            await expect(this.paymentPage.successMessage).toBeVisible();
        })
    }
}