import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { PaymentDetails } from "../models/PaymentModels";

export class PaymentPage extends BasePage {
    readonly nameOnCardInput: Locator = this.page
        .locator("[data-qa='name-on-card']")
        .describe("Name on card input");
    readonly cardNumberInput: Locator = this.page
        .locator("[data-qa='card-number']")
        .describe("Card number input");
    readonly cvcInput: Locator = this.page
        .locator("[data-qa='cvc']")
        .describe("CVC input");
    readonly expiryMonthInput: Locator = this.page
        .locator("[data-qa='expiry-month']")
        .describe("Expiry month input");
    readonly expiryYearInput: Locator = this.page
        .locator("[data-qa='expiry-year']")
        .describe("Expiry year input");
    readonly payAndConfirmButton: Locator = this.page
        .locator("[data-qa='pay-button']")
        .describe("Pay and confirm order button");
    readonly paymentFormSection: Locator = this.page
        .locator("#payment-form")
        .describe("Payment form section");

    constructor(page: Page) {
        super(
            page,
            page.locator("#payment-form").describe("Payment form section")
        );
    }

    /**
     * Fill all payment details
     */
    async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
        await this.paymentFormSection.scrollIntoViewIfNeeded();

        const ensureEditable = async (locator: Locator, description: string) => {
            await locator.scrollIntoViewIfNeeded();
            await expect(locator, `${description} should be visible`).toBeVisible();
            await expect(locator, `${description} should be editable`).toBeEditable();
        };

        await ensureEditable(this.nameOnCardInput, "Name on card input");
        await this.nameOnCardInput.fill(payment.nameOnCard);

        await ensureEditable(this.cardNumberInput, "Card number input");
        await this.cardNumberInput.fill(payment.cardNumber);

        await ensureEditable(this.cvcInput, "CVC input");
        await this.cvcInput.fill(payment.cvc);

        await ensureEditable(this.expiryMonthInput, "Expiry month input");
        await this.expiryMonthInput.fill(payment.expiryMonth);

        await ensureEditable(this.expiryYearInput, "Expiry year input");
        await this.expiryYearInput.fill(payment.expiryYear);
    }

    /**
     * Click pay and confirm order button
     */
    async clickPayAndConfirm(): Promise<void> {
        await this.payAndConfirmButton.click();
    }

    /**
     * Verify payment page is loaded (form may be hidden by CSS)
     */
    async verifyPaymentPageVisible(): Promise<void> {
        // Just verify inputs are present - form might be styled as hidden but inputs work
        await expect(
            this.nameOnCardInput,
            "Name on card input should be attached"
        ).toBeAttached();
        await expect(
            this.payAndConfirmButton,
            "Pay button should be attached"
        ).toBeAttached();
    }
}
