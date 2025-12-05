import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly loggedInText: Locator;
  readonly deleteAccountLink: Locator;
  readonly logoutLink: Locator;
  readonly subscriptionText: Locator;
  readonly fullFledgedText: Locator;
  readonly scrollUpArrowButton: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedItemsSection: Locator;
  readonly recommendedProductItems: Locator;
  readonly viewCartModal: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
    this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' }).describe('Delete Account link');
    this.logoutLink = page.getByRole('link', { name: 'Logout' }).describe('Logout link');
    this.subscriptionText = page.getByRole('heading', { name: 'Subscription' }).describe('Subscription heading');
    this.fullFledgedText = page.getByText('Full-Fledged practice website for Automation Engineers').first().describe('Full-Fledged text');
    this.scrollUpArrowButton = page.locator('#scrollUp').describe('Scroll up arrow button');
    this.recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items' }).describe('Recommended items heading');
    this.recommendedItemsSection = page.locator('.recommended_items').describe('Recommended items section');
    this.recommendedProductItems = this.recommendedItemsSection.locator('.product-image-wrapper').describe('Recommended product items');
    this.viewCartModal = page.locator('.modal-content').describe('View cart modal');
    this.viewCartButton = this.viewCartModal.getByRole('link', { name: /view cart/i }).describe('View cart button');
  }

  async goto() {
    await super.goto(Routes.WEB.HOME);
  }

  async clickSignupLogin() {
    await this.signupLoginLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async verifyLoggedInVisible() {
    await expect(this.page.getByText('Logged in as')).toBeVisible();
  }

  async verifyLoggedInNotVisible() {
    await expect(this.page.getByText('Logged in as')).not.toBeVisible();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async verifySubscriptionVisible() {
    await expect(this.subscriptionText).toBeVisible();
  }

  async verifyFullFledgedTextVisible() {
    await expect(this.fullFledgedText).toBeVisible();
  }

  async clickScrollUpArrow() {
    await this.scrollUpArrowButton.click();
  }

  async verifyRecommendedItemsVisible() {
    await expect(this.recommendedItemsHeading).toBeVisible();
    await expect(this.recommendedProductItems.first()).toBeVisible();
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
