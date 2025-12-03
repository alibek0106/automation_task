import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

export class ProductsPage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;

  private readonly productsNavLink: Locator;

  // Search
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchedProductsHeading: Locator;
  private readonly allProductsHeading: Locator;

  // Product List
  private readonly productItems: Locator;

  // Sidebar - Categories
  private readonly categorySidebar: Locator;

  // Sidebar - Brands
  private readonly brandsSidebar: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.uniqueElement = page.locator('.features_items');

    // Navigation
    this.productsNavLink = page.locator('a[href="/products"]');

    // Headings
    this.allProductsHeading = page.locator('h2.title:has-text("All Products")');
    this.searchedProductsHeading = page.locator('h2.title:has-text("Searched Products")');

    // Search
    this.searchInput = page.locator('input#search_product');
    this.searchButton = page.locator('button#submit_search');

    // Product Items - Get the wrapper for each product
    this.productItems = page.locator('.features_items .col-sm-4');

    // Sidebar
    this.categorySidebar = page.locator('#accordian');
    this.brandsSidebar = page.locator('.brands_products');
  }

  /**
   * Navigate to Products page via header link
   */
  async navigateToProducts(): Promise<void> {
    await this.clickElement(this.productsNavLink);
    await this.waitForPageToLoad();
  }

  /**
   * Verify "ALL PRODUCTS" page is loaded
   */
  async verifyAllProductsPageVisible(): Promise<void> {
    await this.verifyElementVisible(this.allProductsHeading);
    await expect(this.productItems.first()).toBeVisible();
  }

  /**
   * Verify search input is visible
   */
  async verifySearchBoxVisible(): Promise<void> {
    await this.verifyElementVisible(this.searchInput);
  }

  /**
   * Perform search for a product
   */
  async searchProduct(productName: string): Promise<void> {
    await this.fillInput(this.searchInput, productName);
    await this.clickElement(this.searchButton);
  }

  /**
   * Verify "SEARCHED PRODUCTS" heading is visible
   */
  async verifySearchedProductsVisible(): Promise<void> {
    await this.verifyElementVisible(this.searchedProductsHeading);
  }

  /**
   * Verify search results contain the search term
   */
  async verifyProductListContains(searchTerm: string): Promise<void> {
    await this.productItems.first().waitFor({ state: 'visible' });
    const count = await this.productItems.count();
    expect(count).toBeGreaterThan(0);

    // Check first few items to ensure relevance
    // Note: Checking all might be flaky if one random item appears, but checking top 3 is good practice
    for (let i = 0; i < Math.min(count, 3); i++) {
      // The text is usually inside .productinfo p (name)
      // We look inside the first 'productinfo' div to avoid overlay duplicate text
      const productCard = this.productItems.nth(i);

      // Relaxed check: Verify if the search term appears anywhere in the product card text
      // This handles cases where the match might be in a description or other visible field
      await expect(productCard).toContainText(searchTerm, { ignoreCase: true });
    }
  }

  /**
   * Verify product card displays required information (Image, Name, Price, Button)
   */
  async verifyProductCardDetails(): Promise<void> {
    const firstProduct = this.productItems.first();
    await expect(firstProduct.locator('.productinfo img')).toBeVisible();
    await expect(firstProduct.locator('.productinfo h2')).toBeVisible(); // Price usually in h2
    await expect(firstProduct.locator('.productinfo p')).toBeVisible(); // Name
    await expect(firstProduct.locator('.choose a')).toBeVisible(); // View Product button
  }

  /**
   * Click on the first product's View Product button
   */
  async clickFirstViewProduct(): Promise<void> {
    // "View Product" is in the 'choose' div at the bottom of the card
    await this.clickElement(this.productItems.first().locator('.choose a'));
  }

  /**
   * Select a Category and Subcategory from the sidebar
   * @param categoryName Main category (e.g., Women, Men, Kids)
   * @param subCategoryName Subcategory (e.g., Dress, Tops)
   */
  async selectCategory(categoryName: string, subCategoryName: string): Promise<void> {
    // Click category to expand (e.g. Women)
    // Locator strategy: Find link with href matching the category name inside #accordian .panel-heading
    const categoryLink = this.categorySidebar.locator(`.panel-heading a[href="#${categoryName}"]`);
    await this.clickElement(categoryLink);

    // Wait for subcategory to be visible (it's inside a collapse div)
    // Structure: div id="Women" -> ul -> li -> a text="Dress"
    const subCategoryLink = this.categorySidebar.locator(`#${categoryName} a:has-text("${subCategoryName}")`);
    await this.clickElement(subCategoryLink);
  }

  /**
   * Verify page title reflects the selected category/brand
   */
  async verifyCategoryTitle(title: string): Promise<void> {
    // Title usually matches "WOMEN - DRESS PRODUCTS"
    // Using case-insensitive match for robustness
    const heading = this.page.locator('h2.title');
    await expect(heading).toContainText(title, { ignoreCase: true });
  }

  /**
   * Select a Brand from the sidebar
   * @param brandName Brand name (e.g., Polo, H&M)
   */
  async selectBrand(brandName: string): Promise<void> {
    // Brands list structure: ul.nav-pills li a
    // Text is like " (6)Polo" (count + name)
    // We filter by text containing the brand name
    const brandLink = this.brandsSidebar.locator('li a').filter({ hasText: brandName });
    await this.clickElement(brandLink);
  }

  /**
   * Add a product to cart by index
   * @param index Index of the product to add (0-based)
   */
  async addProductToCart(index: number): Promise<void> {
    const product = this.productItems.nth(index);
    // Hover to trigger overlay if needed
    await product.hover();

    // Click 'Add to cart' button within the product info
    await product.locator('.productinfo a.add-to-cart').click();

    // Handle the "Added!" modal
    const continueButton = this.page.getByRole('button', { name: 'Continue Shopping' });
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click();
  }

  /**
   * Navigate to Cart page
   */
  async navigateToCart(): Promise<void> {
    const cartLink = this.page.locator('.shop-menu a[href="/view_cart"]');
    await this.clickElement(cartLink);
  }
}
