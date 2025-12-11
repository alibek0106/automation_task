import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../models/UserModels';

export class CheckoutPage extends BasePage {
  readonly deliveryAddressSection: Locator = this.page.locator('#address_delivery').describe('Delivery address section');
  readonly billingAddressSection: Locator = this.page.locator('#address_invoice').describe('Billing address section');
  readonly orderReviewTable: Locator = this.page.locator('table.table-condensed').describe('Order review table');
  readonly commentTextarea: Locator = this.page.locator('textarea[name="message"]').describe('Comment textarea');
  readonly placeOrderButton: Locator = this.page.getByRole('link', { name: 'Place Order' }).describe('Place order button');

  constructor(page: Page) {
    super(page);
  }

  async verifyCheckoutPageVisible() {
    await expect(this.deliveryAddressSection, 'Delivery address section should be visible').toBeVisible();
    await expect(this.billingAddressSection, 'Billing address section should be visible').toBeVisible();
  }

  async verifyAddressDetails(type: 'delivery' | 'billing', user: User) {
    const section = type === 'delivery' ? this.deliveryAddressSection : this.billingAddressSection;

    // Hard assertion: Section visibility is critical for flow control
    await expect(section, 'Address section should be visible').toBeVisible();

    const text = await section.textContent();
    if (!text) throw new Error(`${type} address section is empty`);

    // Soft assertions: Verify all fields to see all failures at once (data verification)
    expect.soft(text, 'Address section should contain user first name').toContain(user.firstName);
    expect.soft(text, 'Address section should contain user last name').toContain(user.lastName);
    expect.soft(text, 'Address section should contain user address1').toContain(user.address1);
    expect.soft(text, 'Address section should contain user city').toContain(user.city);
    expect.soft(text, 'Address section should contain user state').toContain(user.state);
    expect.soft(text, 'Address section should contain user zipcode').toContain(user.zipcode);
    expect.soft(text, 'Address section should contain user country').toContain(user.country);
    expect.soft(text, 'Address section should contain user mobile number').toContain(user.mobileNumber);
  }

  async enterComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}
