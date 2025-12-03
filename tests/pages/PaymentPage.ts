import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

export class PaymentPage extends BasePage {
  protected readonly uniqueElement: Locator;

  private readonly nameOnCardInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly cvcInput: Locator;
  private readonly expiryMonthInput: Locator;
  private readonly expiryYearInput: Locator;
  private readonly payButton: Locator;

  private readonly orderPlacedHeading: Locator;
  private readonly successMessage: Locator;
  private readonly deleteAccountLink: Locator; // Used for cleanup flow often

  constructor(page: Page) {
    super(page);
    // Unique identifier for the payment page
    this.uniqueElement = page.locator('h2:has-text("Payment")');

    // Payment Form Locators
    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');

    // Order Success Locators
    this.orderPlacedHeading = page.getByTestId('order-placed');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!');
  }

  /**
   * Verify Payment page is visible
   */
  async verifyPaymentPageVisible(): Promise<void> {
    await this.verifyElementVisible(this.uniqueElement);
  }

  /**
   * Fill payment details form
   */
  async fillPaymentDetails(
    name: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ): Promise<void> {
    await this.fillInput(this.nameOnCardInput, name);
    await this.fillInput(this.cardNumberInput, cardNumber);
    await this.fillInput(this.cvcInput, cvc);
    await this.fillInput(this.expiryMonthInput, expiryMonth);
    await this.fillInput(this.expiryYearInput, expiryYear);
  }

  /**
   * Submit payment
   */
  async clickPayAndConfirm(): Promise<void> {
    await this.clickElement(this.payButton);
  }

  /**
   * Verify order success message
   */
  async verifyOrderPlaced(): Promise<void> {
    // Wait for the success page to load
    await this.orderPlacedHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.orderPlacedHeading).toContainText('Order Placed!');
    await expect(this.successMessage).toBeVisible();
  }
}
