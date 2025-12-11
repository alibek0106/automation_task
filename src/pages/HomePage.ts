import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly loggedInText: Locator;
  readonly subscriptionText: Locator;
  readonly fullFledgedText: Locator;
  readonly scrollUpArrowButton: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedItemsSection: Locator;
  readonly recommendedProductItems: Locator;
  readonly viewCartModal: Locator;
  readonly viewCartButton: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    const uniqueElement = page.getByText('Full-Fledged practice website for Automation Engineers').first().describe('Full-Fledged text');
    super(page, uniqueElement);
    this.fullFledgedText = uniqueElement;
    this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
    this.subscriptionText = page.getByRole('heading', { name: 'Subscription' }).describe('Subscription heading');
    this.scrollUpArrowButton = page.locator('#scrollUp').describe('Scroll up arrow button');
    this.recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items' }).describe('Recommended items heading');
    this.recommendedItemsSection = page.locator('.recommended_items').describe('Recommended items section');
    this.recommendedProductItems = this.recommendedItemsSection.locator('.product-image-wrapper').describe('Recommended product items');
    this.viewCartModal = page.locator('.modal-content').describe('View cart modal');
    this.viewCartButton = this.viewCartModal.getByRole('link', { name: /view cart/i }).describe('View cart button');
    this.deleteAccountLink = page.getByRole('link', { name: ' Delete Account' }).describe('Delete Account link');
  }

  async goto() {
    await super.goto(Routes.WEB.HOME);
  }

  async verifyLoggedInVisible() {
    await expect(this.loggedInText, 'Logged in text should be visible').toBeVisible();
  }

  async verifyLoggedInNotVisible() {
    await expect(this.loggedInText, 'Logged in text should not be visible').not.toBeVisible();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async verifySubscriptionVisible() {
    await expect(this.subscriptionText, 'Subscription text should be visible').toBeVisible();
  }

  async verifyFullFledgedTextVisible() {
    await expect(this.fullFledgedText, 'Full-Fledged text should be visible').toBeVisible();
  }

  async clickScrollUpArrow() {
    await this.scrollUpArrowButton.click();
  }

  async verifyRecommendedItemsVisible() {
    await expect(this.recommendedItemsHeading, 'Recommended items heading should be visible').toBeVisible();
    await expect(this.recommendedProductItems.first(), 'Recommended product items should be visible').toBeVisible();
  }

  async getRecommendedProductName(index: number): Promise<string> {
    const product = this.recommendedProductItems.nth(index);
    const name = await product.locator('.productinfo p').textContent();
    return name?.trim() || '';
  }

  async addRecommendedItemToCart(index: number) {
    const product = this.recommendedProductItems.nth(index);
    // Ensure the product is scrolled into view within the carousel
    await product.scrollIntoViewIfNeeded();
    await product.locator('.productinfo a.add-to-cart').click();
  }

  async clickViewCartFromModal() {
    await this.viewCartButton.click();
  }
}
