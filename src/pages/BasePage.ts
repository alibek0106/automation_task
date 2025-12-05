import { Page } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * Using 'load' with extended timeout to ensure all resources load
   * before interactions, preventing element-not-found errors
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'load',
      timeout: 60000 // 60 seconds timeout for slow-loading pages
    });
  }

  /**
   * Get current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate back in history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Wait for the page to load completely
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}
