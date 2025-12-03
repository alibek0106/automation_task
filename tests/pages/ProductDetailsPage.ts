import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

/**
 * ProductDetailsPage - Represents the single product details page
 */
export class ProductDetailsPage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;
  private readonly productInformationDiv: Locator;
  private readonly productName: Locator;
  private readonly productCategory: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly productCondition: Locator;
  private readonly productBrand: Locator;
  private readonly productImage: Locator;

  constructor(page: Page) {
    super(page);

    // The product information container is unique to this page
    this.uniqueElement = page.locator('.product-information');
    this.productInformationDiv = page.locator('.product-information');

    // Product details locators
    this.productName = this.productInformationDiv.locator('h2');
    this.productCategory = this.productInformationDiv.locator('p').filter({ hasText: 'Category:' });
    this.productPrice = this.productInformationDiv.locator('span span').filter({ hasText: 'Rs.' });
    this.productAvailability = this.productInformationDiv.locator('p').filter({ hasText: 'Availability:' });
    this.productCondition = this.productInformationDiv.locator('p').filter({ hasText: 'Condition:' });
    this.productBrand = this.productInformationDiv.locator('p').filter({ hasText: 'Brand:' });

    // Product image
    this.productImage = page.locator('.view-product img');
  }

  /**
   * Verify the product details page is loaded
   */
  async verifyProductDetailsPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.uniqueElement);
    await expect(this.productImage).toBeVisible();
  }

  /**
   * Verify all critical product information is visible
   */
  async verifyProductInformationVisible(): Promise<void> {
    await this.verifyElementVisible(this.productName);
    await this.verifyElementVisible(this.productCategory);
    await this.verifyElementVisible(this.productPrice);
    await this.verifyElementVisible(this.productAvailability);
    await this.verifyElementVisible(this.productCondition);
    await this.verifyElementVisible(this.productBrand);
  }

  /**
   * Get product name text
   */
  async getProductName(): Promise<string> {
    return await this.getTextContent(this.productName);
  }

  /**
   * Get product price text
   */
  async getProductPrice(): Promise<string> {
    return await this.getTextContent(this.productPrice);
  }
}
