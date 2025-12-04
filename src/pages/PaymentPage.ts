import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
  readonly paymentHeading: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly orderPlacedHeading: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Payment Form - using name attributes for reliability
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cvcInput = page.locator('input[name="cvc"]');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]');
    this.expiryYearInput = page.locator('input[name="expiry_year"]');
    this.payButton = page.locator('button[data-qa="pay-button"]');

    // Order Success
    this.orderPlacedHeading = page.locator('h2[data-qa="order-placed"]');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!');
  }

  async verifyPaymentPageVisible() {
    await expect(this.paymentHeading).toBeVisible();
  }

  async fillPaymentDetails(
    name: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ) {
    await this.nameOnCardInput.fill(name);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(expiryMonth);
    await this.expiryYearInput.fill(expiryYear);
  }

  async clickPayAndConfirm() {
    await this.payButton.click();
  }

  async verifyOrderPlaced() {
    await this.orderPlacedHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.orderPlacedHeading).toContainText('Order Placed!');
    await expect(this.successMessage).toBeVisible();
  }
}
