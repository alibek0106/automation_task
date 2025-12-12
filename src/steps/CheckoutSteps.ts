import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentDonePage } from '../pages/PaymentDonePage';
import { User } from '../models/UserModels';
import { PaymentDetails } from '../models/PaymentModels';

/**
 * Reusable steps for checkout flow
 */
export class CheckoutSteps {
    constructor(
        private homePage: HomePage,
        private cartPage: CartPage,
        private checkoutPage: CheckoutPage,
        private paymentPage: PaymentPage,
        private paymentDonePage: PaymentDonePage
    ) { }

    /**
     * Complete full checkout flow from cart to order confirmation
     */
    async completeCheckout(userData: User, paymentData: PaymentDetails, comment?: string): Promise<void> {
        // Go to cart and proceed to checkout
        await this.cartPage.clickProceedToCheckout();

        // Verify addresses
        await this.checkoutPage.verifyDeliveryAddress(userData);
        await this.checkoutPage.verifyBillingAddress(userData);

        // Enter comment if provided
        if (comment) {
            await this.checkoutPage.enterComment(comment);
        }

        // Place order
        await this.checkoutPage.clickPlaceOrder();

        // Complete payment
        await this.paymentPage.verifyPaymentPageVisible();
        await this.paymentPage.fillPaymentDetails(paymentData);
        await this.paymentPage.clickPayAndConfirm();

        // Verify success
        await this.paymentDonePage.verifyOrderSuccess();
    }

    /**
     * Proceed to checkout (for tests that need to do steps manually)
     */
    async proceedToCheckout(): Promise<void> {
        await this.cartPage.clickProceedToCheckout();
    }

    /**
     * Verify addresses in checkout
     */
    async verifyAddresses(userData: User): Promise<void> {
        await this.checkoutPage.verifyDeliveryAddress(userData);
        await this.checkoutPage.verifyBillingAddress(userData);
    }

    /**
     * Place order with optional comment
     */
    async placeOrder(comment?: string): Promise<void> {
        if (comment) {
            await this.checkoutPage.enterComment(comment);
        }
        await this.checkoutPage.clickPlaceOrder();
    }

    /**
     * Complete payment
     */
    async completePayment(paymentData: PaymentDetails): Promise<void> {
        await this.paymentPage.verifyPaymentPageVisible();
        await this.paymentPage.fillPaymentDetails(paymentData);
        await this.paymentPage.clickPayAndConfirm();
        await this.paymentDonePage.verifyOrderSuccess();
    }
}
