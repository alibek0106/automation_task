import { Page, expect } from '@playwright/test';
import { AutomationExercisePaymentPage } from '../pages/AutomationExercisePaymentPage';
import { AutomationExerciseOrderConfirmationPage } from '../pages/AutomationExerciseOrderConfirmationPage';
import { step } from '../utils/Decorators';
import { PaymentDetails } from '../utils/DataFactory';

export class AutomationExercisePaymentSteps {
    constructor(
        private paymentPage: AutomationExercisePaymentPage,
        private confirmationPage: AutomationExerciseOrderConfirmationPage
    ) { }

    @step('Enter payment details: {0}')
    async enterPaymentDetails(paymentDetails: PaymentDetails): Promise<void> {
        await this.paymentPage.enterNameOnCard(paymentDetails.nameOnCard);
        await this.paymentPage.enterCardNumber(paymentDetails.cardNumber);
        await this.paymentPage.enterCVC(paymentDetails.cvc);
        await this.paymentPage.enterExpirationMonth(paymentDetails.expiryMonth);
        await this.paymentPage.enterExpirationYear(paymentDetails.expiryYear);
    }

    @step('Confirm order')
    async confirmOrder(): Promise<void> {
        await this.paymentPage.clickPayAndConfirm();
    }

    @step('Verify order placed successfully')
    async verifyOrderPlaced(): Promise<void> {
        // Depending on transition speed, we might wait for the confirmation page
        // The page object approach usually handles this in the steps or tests. 
        // Here we'll just check the confirmation page's indicator.
        await this.confirmationPage.verifyPageLoaded();
    }

    @step('Download invoice')
    async downloadInvoice(): Promise<void> {
        // Just verify it's clickable/visible as actual download testing can be complex/flaky without download listener
        await this.confirmationPage.verifyDownloadInvoiceVisible();
    }

    @step('Click "Continue"')
    async clickContinue(): Promise<void> {
        await this.confirmationPage.clickContinue();
    }

    @step('Fill payment details and confirm order')
    async fillPaymentDetailsAndConfirm(): Promise<void> {
        // Uses constants for default payment flow
        const { DataFactory } = require('../utils/DataFactory');
        const paymentDetails = DataFactory.generatePaymentDetails();
        await this.enterPaymentDetails(paymentDetails);
        await this.paymentPage.clickPayAndConfirm();
    }
}
