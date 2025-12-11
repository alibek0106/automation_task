import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
  readonly page: Page;
  readonly uniqueElement: Locator;
  readonly contactUsLink: Locator;
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitBtn: Locator;
  readonly subscriptionSuccessMsg: Locator;
  readonly signupLoginLink: Locator;
  readonly deleteAccountBtn: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page, uniqueElement: Locator) {
    this.page = page;
    this.uniqueElement = uniqueElement;
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' }).describe('Contact us link');
    this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription', level: 2 }).describe('Subscribtion heading');
    this.subscriptionEmailInput = page.getByPlaceholder('Your email address').describe('Email Input Field');
    this.subscriptionSubmitBtn = page.locator('#subscribe').describe('Subscribe button');
    this.subscriptionSuccessMsg = page.getByText('You have been successfully subscribed!').describe('Subscription success message');
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
    this.deleteAccountBtn = page.getByRole('link', { name: ' Delete Account' }).describe('Delete Account button');
    this.logoutLink = page.getByRole('link', { name: 'Logout' }).describe('Logout link');
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate back in history
   * Waits for DOM to be ready after navigation
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for the page to load completely
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async clickSignupLogin() {
    await this.signupLoginLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async verifyLogoutLinkVisible() {
    await expect(this.logoutLink, 'Logout link should be visible').toBeVisible();
  }

  /**
   * Subscription functionality is available from any page of the website
   * so it is part of the base page
   */
  async performSubscription(email: string) {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitBtn.click();
  }

  async clickDeleteAccount() {
    await this.deleteAccountBtn.click();
  }

  async clickContactUsLink() {
    await this.contactUsLink.click();
  }

  async verifyPageOpened(): Promise<void> {
    await expect(this.uniqueElement, 'Page uniques element should be visible').toBeVisible();
  }
}