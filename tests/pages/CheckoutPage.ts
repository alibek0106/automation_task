import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';
import { UserAddressInfo } from '../../types/UserData';

export class CheckoutPage extends BasePage {
  protected readonly uniqueElement: Locator;

  private readonly deliveryAddressSection: Locator;
  private readonly billingAddressSection: Locator;
  private readonly orderReviewTable: Locator;
  private readonly commentTextarea: Locator;
  private readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.uniqueElement = page.locator('.check_out');

    this.deliveryAddressSection = page.locator('#address_delivery');
    this.billingAddressSection = page.locator('#address_invoice');
    this.orderReviewTable = page.locator('table.table-condensed');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
  }

  /**
   * Verify Checkout page is visible
   */
  async verifyCheckoutPageVisible(): Promise<void> {
    await this.verifyElementVisible(this.uniqueElement);
  }

  /**
   * Verify address details match the user data
   * @param type 'delivery' or 'billing'
   * @param addressInfo Expected address information
   */
  async verifyAddressDetails(type: 'delivery' | 'billing', addressInfo: UserAddressInfo): Promise<void> {
    const section = type === 'delivery' ? this.deliveryAddressSection : this.billingAddressSection;
    await expect(section).toBeVisible();

    const text = await section.textContent();
    if (!text) throw new Error(`${type} address section is empty`);

    // Verify key fields
    expect(text).toContain(addressInfo.firstName);
    expect(text).toContain(addressInfo.lastName);
    expect(text).toContain(addressInfo.address);
    expect(text).toContain(addressInfo.city);
    expect(text).toContain(addressInfo.state);
    expect(text).toContain(addressInfo.zipcode);
    expect(text).toContain(addressInfo.country);
    expect(text).toContain(addressInfo.mobileNumber);
  }

  /**
   * Verify product is listed in the checkout review
   */
  async verifyProductInCheckout(productName: string): Promise<void> {
    await expect(this.orderReviewTable).toBeVisible();
    await expect(this.orderReviewTable).toContainText(productName);
  }

  /**
   * Enter description/comment
   */
  async enterComment(comment: string): Promise<void> {
    await this.fillInput(this.commentTextarea, comment);
  }

  /**
   * Click Place Order button to proceed to payment
   */
  async clickPlaceOrder(): Promise<void> {
    await this.clickElement(this.placeOrderButton);
  }
}
