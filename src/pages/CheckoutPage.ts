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
    this.deliveryAddressSection = page.locator('#address_delivery').describe('Delivery address section');
    this.billingAddressSection = page.locator('#address_invoice').describe('Billing address section');
    this.orderReviewTable = page.locator('table.table-condensed').describe('Order review table');
    this.commentTextarea = page.locator('textarea[name="message"]').describe('Comment textarea');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' }).describe('Place order button');
  }

  async verifyCheckoutPageVisible() {
    await expect(this.deliveryAddressSection, 'Delivery address section should be visible').toBeVisible();
    await expect(this.billingAddressSection, 'Billing address section should be visible').toBeVisible();
  }

  async verifyAddressDetails(type: 'delivery' | 'billing', user: User) {
    const section = type === 'delivery' ? this.deliveryAddressSection : this.billingAddressSection;
    await expect(section, 'Address section should be visible').toBeVisible();

    const text = await section.textContent();
    if (!text) throw new Error(`${type} address section is empty`);

    // Verify key fields from flattened User model
    expect(text, 'Address section should contain user first name').toContain(user.firstName);
    expect(text, 'Address section should contain user last name').toContain(user.lastName);
    expect(text, 'Address section should contain user address1').toContain(user.address1);
    expect(text, 'Address section should contain user city').toContain(user.city);
    expect(text, 'Address section should contain user state').toContain(user.state);
    expect(text, 'Address section should contain user zipcode').toContain(user.zipcode);
    expect(text, 'Address section should contain user country').toContain(user.country);
    expect(text, 'Address section should contain user mobile number').toContain(user.mobileNumber);
  }

  async enterComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}
