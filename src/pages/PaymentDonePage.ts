import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentDonePage extends BasePage {
    readonly successMessage: Locator = this.page
        .locator("[data-qa='order-placed'] b")
        .describe("Order placed success message");
    readonly orderConfirmationText: Locator = this.page
        .locator(".col-sm-9 p")
        .describe("Order confirmation text");
    readonly downloadInvoiceButton: Locator = this.page
        .getByRole("link", { name: /download invoice/i })
        .describe("Download invoice button");
    readonly continueButton: Locator = this.page
        .locator("[data-qa='continue-button']")
        .describe("Continue button");

    constructor(page: Page) {
        super(
            page,
            page.locator("[data-qa='order-placed']").describe("Order placed message")
        );
    }

    /**
     * Verify order success message is displayed
     */
    async verifyOrderSuccess(): Promise<void> {
        await expect(
            this.successMessage,
            "Order success message should be visible"
        ).toBeVisible();

        const messageText = await this.successMessage.textContent();
        expect(
            messageText?.trim().toUpperCase(),
            "Success message should contain 'ORDER PLACED'"
        ).toContain("ORDER PLACED");
    }

    /**
     * Get order confirmation message
     */
    async getOrderConfirmation(): Promise<string> {
        const text = await this.orderConfirmationText.textContent();
        return text?.trim() || "";
    }

    /**
     * Download invoice
     */
    async downloadInvoice(): Promise<void> {
        await this.downloadInvoiceButton.click();
    }

    /**
     * Click continue button
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
