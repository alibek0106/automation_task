import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

export class CartPage extends BasePage {
  protected readonly uniqueElement: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly cartTable: Locator;
  private readonly emptyCartText: Locator;

  constructor(page: Page) {
    super(page);
    this.uniqueElement = page.locator('#cart_items');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.cartTable = page.locator('#cart_info_table');
    this.emptyCartText = page.getByText('Cart is empty!');
  }

  /**
   * Verify Cart page is loaded
   */
  async verifyCartPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.uniqueElement);
  }

  /**
   * Verify specific product is present in the cart
   */
  async verifyProductInCart(productName: string): Promise<void> {
    await this.cartTable.waitFor({ state: 'visible' });
    // Using relaxed text match to handle formatting differences
    const productLocator = this.cartTable.getByText(productName).first();
    await expect(productLocator).toBeVisible();
  }

  /**
   * Click Proceed To Checkout button
   */
  async clickProceedToCheckout(): Promise<void> {
    await this.clickElement(this.proceedToCheckoutButton);
  }

  /**
   * Verify that the cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.emptyCartText).toBeVisible();
  }
}
