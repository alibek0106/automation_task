import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PAGE_TITLES } from '../utils/Constants';

export class AutomationExercisePaymentPage extends BasePage {
    private readonly nameOnCardInput: Locator;
    private readonly cardNumberInput: Locator;
    private readonly cvcInput: Locator;
    private readonly expirationInput: Locator; // Note: Site might separate MM/YYYY
    private readonly expirationMonthInput: Locator;
    private readonly expirationYearInput: Locator;
    private readonly payButton: Locator;
    private readonly successMessage: Locator;
    private readonly downloadInvoiceButton: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'PaymentPage');
        this.nameOnCardInput = this.resolveLocator('input[name="name_on_card"]', 'Name on Card Input');
        this.cardNumberInput = this.resolveLocator('input[name="card_number"]', 'Card Number Input');
        this.cvcInput = this.resolveLocator('input[name="cvc"]', 'CVC Input');
        this.expirationInput = this.resolveLocator('input[name="expiry_date"]', 'Expiration Input'); // Fallback if single field
        this.expirationMonthInput = this.resolveLocator('input[name="expiry_month"]', 'Expiration Month Input');
        this.expirationYearInput = this.resolveLocator('input[name="expiry_year"]', 'Expiration Year Input');
        this.payButton = this.resolveLocator('[data-qa="pay-button"]', 'Pay and Confirm Order Button');
        // Success message is usually on a subsequent page or dynamic state, but let's assume it transitions
        this.successMessage = this.resolveLocator('.alert-success', 'Success Message'); // Common boostrap class, or text match
        this.downloadInvoiceButton = this.resolveLocator('a.check_out', 'Download Invoice Button'); // Updated to potentially correct locator
        this.continueButton = this.resolveLocator('[data-qa="continue-button"]', 'Continue Button');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveTitle(PAGE_TITLES.PAYMENT);
    }

    async enterPaymentDetails(name: string, number: string, cvc: string, month: string, year: string): Promise<void> {
        await this.nameOnCardInput.fill(name);
        await this.cardNumberInput.fill(number);
        await this.cvcInput.fill(cvc);
        await this.expirationMonthInput.fill(month);
        await this.expirationYearInput.fill(year);
    }

    async clickPayAndConfirm(): Promise<void> {
        await this.payButton.click();
    }

}
