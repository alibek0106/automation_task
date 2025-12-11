import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentDetails } from '../models/PaymentModels';

export class PaymentPage extends BasePage {
  readonly paymentHeading: Locator = this.page.getByRole('heading', { name: 'Payment' }).describe('Payment heading');
  readonly nameOnCardInput: Locator = this.page.locator('input[name="name_on_card"]').describe('Name on card input');
  readonly cardNumberInput: Locator = this.page.locator('input[name="card_number"]').describe('Card number input');
  readonly cvcInput: Locator = this.page.locator('input[name="cvc"]').describe('CVC input');
  readonly expiryMonthInput: Locator = this.page.locator('input[name="expiry_month"]').describe('Expiry month input');
  readonly expiryYearInput: Locator = this.page.locator('input[name="expiry_year"]').describe('Expiry year input');
  readonly payButton: Locator;
  readonly orderPlacedHeading: Locator = this.page.locator('h2[data-qa="order-placed"]').describe('Order placed heading');
  readonly successMessage: Locator = this.page.getByText('Congratulations! Your order has been confirmed!').describe('Success message');

  constructor(page: Page) {
    const uniqueElement = page.getByTestId('pay-button').describe('Pay button');
    super(page, uniqueElement);
    this.payButton = uniqueElement;
  }

  async verifyPaymentPageVisible() {
    await expect(this.paymentHeading).toBeVisible();
  }

  async fillPaymentDetails(payment: PaymentDetails) {
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cvcInput.fill(payment.cvc);
    await this.expiryMonthInput.fill(payment.expiryMonth);
    await this.expiryYearInput.fill(payment.expiryYear);
  }

  async clickPayAndConfirm() {
    await this.payButton.click();
  }

  async verifyOrderPlaced() {
    await this.orderPlacedHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.orderPlacedHeading, 'Order placed heading should contain text "Order Placed!"').toContainText('Order Placed!');
    await expect(this.successMessage, 'Success message should be visible').toBeVisible();
  }
}
