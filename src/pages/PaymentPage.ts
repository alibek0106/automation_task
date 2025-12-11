import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentPage extends BasePage {
  readonly paymentHeading: Locator = this.page
    .getByRole("heading", { name: "Payment" })
    .describe("Payment heading");

  // Payment Form - using name attributes for reliability
  readonly nameOnCardInput: Locator = this.page
    .locator('input[name="name_on_card"]')
    .describe("Name on card input");
  readonly cardNumberInput: Locator = this.page
    .locator('input[name="card_number"]')
    .describe("Card number input");
  readonly cvcInput: Locator = this.page
    .locator('input[name="cvc"]')
    .describe("CVC input");
  readonly expiryMonthInput: Locator = this.page
    .locator('input[name="expiry_month"]')
    .describe("Expiry month input");
  readonly expiryYearInput: Locator = this.page
    .locator('input[name="expiry_year"]')
    .describe("Expiry year input");
  readonly payButton: Locator = this.page
    .locator('button[data-qa="pay-button"]')
    .describe("Pay button");

  // Order Success
  readonly orderPlacedHeading: Locator = this.page
    .locator('h2[data-qa="order-placed"]')
    .describe("Order placed heading");
  readonly successMessage: Locator = this.page
    .getByText("Congratulations! Your order has been confirmed!")
    .describe("Success message");

  // Expose navigation link for backward compatibility
  get deleteAccountBtn() {
    return this.navigation.deleteAccountLink;
  }

  constructor(page: Page) {
    super(
      page,
      page
        .getByRole("heading", { name: "Payment" })
        .describe("Payment heading"),
    );
  }

  async verifyPaymentPageVisible() {
    await this.verifyPageOpened("Payment heading should be visible");
  }

  async fillPaymentDetails(
    name: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string,
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
    await this.orderPlacedHeading.waitFor({ state: "visible", timeout: 10000 });
    await expect(
      this.orderPlacedHeading,
      'Order placed heading should contain text "Order Placed!"',
    ).toContainText("Order Placed!");
    await expect(
      this.successMessage,
      "Success message should be visible",
    ).toBeVisible();
  }

  async clickDeleteAccount() {
    await this.navigation.clickDeleteAccount();
  }
}
