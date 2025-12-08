import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  // Navigation & Actions
  readonly productsNavLink: Locator;
  readonly continueShoppingBtn: Locator;
  readonly viewCartLink: Locator;

  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;

  // Product Cards
  readonly productCards: Locator;
  readonly productItems: Locator;

  // Sidebar - Categories & Brands
  readonly categorySidebar: Locator;
  readonly brandsSidebar: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.productsNavLink = page.getByRole('link', { name: 'Products' }).describe('Products Navigation Link');
    this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping Button');
    this.viewCartLink = page.getByText(' Cart', { exact: true }).describe('View Cart Link');

    // Headings - using role for better semantics
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' }).describe('All Products Heading');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' }).describe('Searched Products Heading');

    // Search
    this.searchInput = page.locator('input#search_product').describe('Search Input');
    this.searchButton = page.locator('button#submit_search').describe('Search Button');

    // Products
    this.productCards = page.locator('.product-image-wrapper').describe('Product Cards');
    this.productItems = page.locator('.features_items .col-sm-4').describe('Product Items');

    // Sidebar
    this.categorySidebar = page.locator('#accordian').describe('Category Sidebar');
    this.brandsSidebar = page.locator('.brands_products').describe('Brands Sidebar');
  }

  async goto() {
    await super.goto(Routes.WEB.PRODUCTS);
  }

  async navigateToProducts() {
    await this.productsNavLink.click();
    await this.waitForLoadState('domcontentloaded');
  }

  async verifyAllProductsVisible() {
    await expect(this.allProductsHeading, 'All products heading should be visible').toBeVisible();
    await expect(this.productItems.first(), 'First product item should be visible').toBeVisible();
  }

  async verifySearchBoxVisible() {
    await expect(this.searchInput, 'Search input should be visible').toBeVisible();
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    // Wait for search results to load by ensuring the heading is present
    await this.searchedProductsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async verifySearchedProductsVisible() {
    await expect(this.searchedProductsHeading, 'Searched products heading should be visible').toBeVisible();
  }

  async verifyProductListContains(searchTerm: string) {
    await this.productItems.first().waitFor({ state: 'visible' });
    const count = await this.productItems.count();
    expect(count, 'Product list should contain at least one item').toBeGreaterThan(0);

    // Check first few items to ensure relevance
    for (let i = 0; i < Math.min(count, 3); i++) {
      const productCard = this.productItems.nth(i);
      await expect(productCard, 'Product card should contain search term').toContainText(searchTerm, { ignoreCase: true });
    }
  }

  async verifyProductCardDetails() {
    const firstProduct = this.productItems.first();
    await expect(firstProduct.locator('.productinfo img'), 'Product image should be visible').toBeVisible();
    await expect(firstProduct.locator('.productinfo h2'), 'Product name should be visible').toBeVisible();
    await expect(firstProduct.locator('.productinfo p'), 'Product price should be visible').toBeVisible();
    await expect(firstProduct.locator('.choose a'), 'Product action buttons should be visible').toBeVisible();
  }

  async clickFirstViewProduct() {
    await this.productItems.first().locator('.choose a').click();
  }

  async selectCategory(categoryName: string, subCategoryName: string) {
    const categoryLink = this.categorySidebar.locator(`.panel-heading a[href="#${categoryName}"]`);
    await categoryLink.click();

    const subCategoryLink = this.categorySidebar.locator(`#${categoryName} a:has-text("${subCategoryName}")`);
    await subCategoryLink.click();
  }

  async verifyCategoryTitle(title: string) {
    const heading = this.page.locator('h2.title');
    await expect(heading, 'Category title should contain expected text').toContainText(title, { ignoreCase: true });
  }

  async selectBrand(brandName: string) {
    const brandLink = this.brandsSidebar.locator('li a').filter({ hasText: brandName });
    await brandLink.click();
  }

  async addProductToCart(index: number) {
    const product = this.productItems.nth(index);
    await product.hover();
    await product.locator('.productinfo a.add-to-cart').click();

    // Handle the modal
    await this.continueShoppingBtn.waitFor({ state: 'visible' });
    await this.continueShoppingBtn.click();
  }

  async viewProductByName(productName: string) {
    const card = this.productCards.filter({ hasText: productName });
    const viewLink = card.getByRole('link', { name: 'View Product' });
    await viewLink.click();
  }

  async navigateToCart() {
    await this.viewCartLink.click();
  }

  async verifyCategorySidebarVisible() {
    await expect(this.categorySidebar, 'Category sidebar should be visible').toBeVisible();
    await expect(this.page.getByText('Category', { exact: true }), 'Category text should be visible').toBeVisible();
  }

  async verifyBrandsSidebarVisible() {
    await expect(this.brandsSidebar, 'Brands sidebar should be visible').toBeVisible();
    await expect(this.page.getByText('Brands', { exact: true }), 'Brands text should be visible').toBeVisible();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async verifyProductCountGreaterThan(min: number) {
    const count = await this.getProductCount();
    expect(count, 'Product count should be greater than expected').toBeGreaterThan(min);
  }
}
