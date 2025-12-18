import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MESSAGES } from '../utils/Constants';

export class AutomationExerciseOrderConfirmationPage extends BasePage {
    private readonly orderPlacedMessage: Locator;
    private readonly downloadInvoiceButton: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'OrderConfirmationPage');
        this.orderPlacedMessage = page.getByText(MESSAGES.ORDER_PLACED).describe('Order Placed Message');
        this.downloadInvoiceButton = this.page.locator('a.check_out').describe('Download Invoice Button');
        this.continueButton = this.page.locator('[data-qa="continue-button"]').describe('Continue Button');
    }

    async verifyPageLoaded(): Promise<void> {
        // Title might share with Payment or be generic, checking header is safer
        await expect(this.orderPlacedMessage, 'Order Placed Message should be visible').toBeVisible();
    }

    async verifyOrderConfirmed(): Promise<void> {
        await this.verifyPageLoaded();
    }

    async clickDownloadInvoice(): Promise<void> {
        await this.downloadInvoiceButton.click();
    }

    async verifyDownloadInvoiceVisible(): Promise<void> {
        await expect(this.downloadInvoiceButton, 'Download Invoice Button should be visible').toBeVisible();
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
