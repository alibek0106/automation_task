import { Page, expect } from '@playwright/test';
import { AutomationExerciseCheckoutPage } from '../pages/AutomationExerciseCheckoutPage';
import { User } from '../utils/DataFactory';
import { step } from '../utils/Decorators';

export class AutomationExerciseCheckoutSteps {
    constructor(private checkoutPage: AutomationExerciseCheckoutPage) { }

    @step('Verify address details for user: {0.name}')
    async verifyAddressDetails(user: User): Promise<void> {
        await this.checkoutPage.verifyDeliveryAddress(user);
        await this.checkoutPage.verifyBillingAddress(user);
    }

    @step('Verify order summary contains: {0}')
    async verifyOrderSummary(productNames: string[]): Promise<void> {
        // Basic verification that products are in the table
        for (const name of productNames) {
            await this.checkoutPage.verifyProductInOrder(name);
        }
    }

    @step('Enter comment "{0}" and place order')
    async enterCommentAndPlaceOrder(comment: string): Promise<void> {
        await this.checkoutPage.enterComment(comment);
        await this.checkoutPage.clickPlaceOrder();
    }
}
