import { Page, Locator, expect } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  // Navigation & Actions
  readonly continueShoppingBtn: Locator = this.page
    .getByRole("button", { name: "Continue Shopping" })
    .describe("Continue Shopping Button");

  // Expose navigation links for backward compatibility
  get productsNavLink() {
    return this.navigation.productsLink;
  }
  get viewCartLink() {
    return this.navigation.cartLink;
  }

  // Search
  readonly searchInput: Locator = this.page
    .locator("input#search_product")
    .describe("Search Input");
  readonly searchButton: Locator = this.page
    .locator("button#submit_search")
    .describe("Search Button");
  readonly allProductsHeading: Locator = this.page
    .getByRole("heading", { name: "All Products" })
    .describe("All Products Heading");
  readonly searchedProductsHeading: Locator = this.page
    .getByRole("heading", { name: "Searched Products" })
    .describe("Searched Products Heading");

  // Product Cards
  readonly productCards: Locator = this.page
    .locator(".product-image-wrapper")
    .describe("Product Cards");
  readonly productItems: Locator = this.page
    .locator(".features_items .col-sm-4")
    .describe("Product Items");

  // Sidebar - Categories & Brands
  readonly categorySidebar: Locator = this.page
    .locator("#accordian")
    .describe("Category Sidebar");
  readonly brandsSidebar: Locator = this.page
    .locator(".brands_products")
    .describe("Brands Sidebar");

  // Dynamic Locators
  categoryLink = (categoryName: string) =>
    this.categorySidebar.locator(`.panel-heading a[href="#${categoryName}"]`);
  subCategoryLink = (categoryName: string, subCategoryName: string) =>
    this.categorySidebar.locator(
      `#${categoryName} a:has-text("${subCategoryName}")`,
    );
  categoryTitleHeading = this.page.locator("h2.title");
  brandLink = (brandName: string) =>
    this.brandsSidebar.locator("li a").filter({ hasText: brandName });
  productCardByName = (productName: string) =>
    this.productCards.filter({ hasText: productName });
  viewProductLink = (card: Locator) =>
    card.getByRole("link", { name: "View Product" });

  constructor(page: Page) {
    super(
      page,
      page
        .getByRole("heading", { name: "All Products" })
        .describe("All Products Heading"),
    );
  }

  async goto() {
    await super.goto(Routes.WEB.PRODUCTS);
  }

  async navigateToProducts() {
    await this.navigation.clickProducts();
    await this.waitForLoadState("domcontentloaded");
  }

  async verifyAllProductsVisible() {
    await this.verifyPageOpened("All products heading should be visible");
    await expect(
      this.productItems.first(),
      "First product item should be visible",
    ).toBeVisible();
  }

  async verifySearchBoxVisible() {
    await expect(
      this.searchInput,
      "Search input should be visible",
    ).toBeVisible();
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    // Wait for search results to load by ensuring the heading is present
    await this.searchedProductsHeading.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async verifySearchedProductsVisible() {
    await expect(
      this.searchedProductsHeading,
      "Searched products heading should be visible",
    ).toBeVisible();
  }

  async verifyProductCardDetails() {
    const firstProduct = this.productItems.first();
    await expect(
      firstProduct.locator(".productinfo img"),
      "Product image should be visible",
    ).toBeVisible();
    await expect(
      firstProduct.locator(".productinfo h2"),
      "Product name should be visible",
    ).toBeVisible();
    await expect(
      firstProduct.locator(".productinfo p"),
      "Product price should be visible",
    ).toBeVisible();
    await expect(
      firstProduct.locator(".choose a"),
      "Product action buttons should be visible",
    ).toBeVisible();
  }

  async clickFirstViewProduct() {
    await this.productItems.first().locator(".choose a").click();
  }

  async addProductToCart(index: number) {
    const product = this.productItems.nth(index);
    await product.hover();
    await product.locator(".productinfo a.add-to-cart").click();

    // Handle the modal
    await this.continueShoppingBtn.waitFor({ state: "visible" });
    await this.continueShoppingBtn.click();
  }

  /**
   * Add multiple products to cart sequentially
   * @param count Number of products to add (starting from index 0)
   */
  async addMultipleProductsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addProductToCart(i);
    }
  }

  async viewProductByName(productName: string) {
    const card = this.productCardByName(productName);
    await this.viewProductLink(card).click();
  }

  async navigateToCart() {
    await this.navigation.clickCart();
  }

  async verifyCategorySidebarVisible() {
    await expect(
      this.categorySidebar,
      "Category sidebar should be visible",
    ).toBeVisible();
    await expect(
      this.page.getByText("Category", { exact: true }),
      "Category text should be visible",
    ).toBeVisible();
  }

  async verifyBrandsSidebarVisible() {
    await expect(
      this.brandsSidebar,
      "Brands sidebar should be visible",
    ).toBeVisible();
    await expect(
      this.page.getByText("Brands", { exact: true }),
      "Brands text should be visible",
    ).toBeVisible();
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async verifyProductCountGreaterThan(min: number) {
    const count = await this.getProductCount();
    expect(
      count,
      "Product count should be greater than expected",
    ).toBeGreaterThan(min);
  }
}
