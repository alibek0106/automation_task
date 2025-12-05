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
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' }).describe('Payment heading');
    this.nameOnCardInput = page.locator('input[name="name_on_card"]').describe('Name on card input');
    this.cardNumberInput = page.locator('input[name="card_number"]').describe('Card number input');
    this.cvcInput = page.locator('input[name="cvc"]').describe('CVC input');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]').describe('Expiry month input');
    this.expiryYearInput = page.locator('input[name="expiry_year"]').describe('Expiry year input');
    this.payButton = page.locator('button[data-qa="pay-button"]').describe('Pay button');

    // Order Success
    this.orderPlacedHeading = page.locator('h2[data-qa="order-placed"]').describe('Order placed heading');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!').describe('Success message');
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
