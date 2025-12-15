import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MESSAGES } from '../utils/Constants';

export class AutomationExerciseOrderConfirmationPage extends BasePage {
    private readonly orderPlacedMessage: Locator;
    private readonly downloadInvoiceButton: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'OrderConfirmationPage');
        this.orderPlacedMessage = page.getByText(MESSAGES.ORDER_PLACED); // getByText is okay
        this.downloadInvoiceButton = this.resolveLocator('a.check_out', 'Download Invoice Button');
        this.continueButton = this.resolveLocator('[data-qa="continue-button"]', 'Continue Button');
    }

    async verifyPageLoaded(): Promise<void> {
        // Title might share with Payment or be generic, checking header is safer
        await expect(this.orderPlacedMessage).toBeVisible();
    }

    async clickDownloadInvoice(): Promise<void> {
        await this.downloadInvoiceButton.click();
    }

    async verifyDownloadInvoiceVisible(): Promise<void> {
        await expect(this.downloadInvoiceButton).toBeVisible();
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
