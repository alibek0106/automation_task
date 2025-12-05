import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../models/UserModels';

export class CheckoutPage extends BasePage {
  readonly deliveryAddressSection: Locator;
  readonly billingAddressSection: Locator;
  readonly orderReviewTable: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddressSection = page.locator('#address_delivery').describe('Delivery Address Section');
    this.billingAddressSection = page.locator('#address_invoice').describe('Billing Address Section');
    this.orderReviewTable = page.locator('table.table-condensed').describe('Order Review Table');
    this.commentTextarea = page.locator('textarea[name="message"]').describe('Comment Textarea');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' }).describe('Place Order Button');
  }

  async verifyCheckoutPageVisible() {
    await expect(this.deliveryAddressSection).toBeVisible();
    await expect(this.billingAddressSection).toBeVisible();
  }

  async verifyAddressDetails(type: 'delivery' | 'billing', user: User) {
    const section = type === 'delivery' ? this.deliveryAddressSection : this.billingAddressSection;
    await expect(section).toBeVisible();

    const text = await section.textContent();
    if (!text) throw new Error(`${type} address section is empty`);

    // Verify key fields from flattened User model
    expect(text).toContain(user.firstName);
    expect(text).toContain(user.lastName);
    expect(text).toContain(user.address1);
    expect(text).toContain(user.city);
    expect(text).toContain(user.state);
    expect(text).toContain(user.zipcode);
    expect(text).toContain(user.country);
    expect(text).toContain(user.mobileNumber);
  }

  async enterComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}
