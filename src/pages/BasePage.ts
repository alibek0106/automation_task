import { Page, Locator, expect } from "@playwright/test";
import { NavigationMenu } from "../components/NavigationMenu";

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
  readonly page: Page;
  readonly navigation: NavigationMenu;
  readonly uniqueLocator?: Locator;

  constructor(page: Page, uniqueLocator?: Locator) {
    this.page = page;
    this.navigation = new NavigationMenu(page);
    this.uniqueLocator = uniqueLocator;
  }

  /**
   * Navigate to a specific URL
   * Using 'load' with extended timeout to ensure all resources load
   * before interactions, preventing element-not-found errors
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      // domcontentloaded is typically more stable/faster than full load for this site
      waitUntil: "domcontentloaded",
      timeout: 60000, // 60 seconds timeout for slow-loading pages
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
   * Waits for DOM to be ready after navigation
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: "domcontentloaded" });
  }

  /**
   * Wait for the page to load completely
   */
  async waitForLoadState(
    state: "load" | "domcontentloaded" | "networkidle" = "load",
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Verify that the page is opened by checking the unique locator
   * @param customMessage Optional custom error message for the assertion
   */
  async verifyPageOpened(customMessage?: string): Promise<void> {
    if (!this.uniqueLocator) {
      throw new Error(
        "Cannot verify page opened: uniqueLocator not defined in page object constructor",
      );
    }

    const message =
      customMessage ||
      `Page should be opened (unique locator should be visible)`;
    await expect(this.uniqueLocator, message).toBeVisible();
  }

  /**
   * Scroll to the bottom of the page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.evaluate(() => {
      const scrollingElement = document.scrollingElement || document.documentElement;
      window.scrollTo(0, scrollingElement.scrollHeight);
    });
  }

  /**
   * Scroll to the top of the page
   */
  async scrollToTop(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Check if an element is in the viewport
   */
  async isElementInViewport(locator: Locator): Promise<boolean> {
    return await locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });
  }
}
