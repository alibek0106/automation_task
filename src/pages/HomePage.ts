import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { NavigationMenu } from "../components/NavigationMenu";

export class HomePage extends BasePage {
  readonly navigation: NavigationMenu;
  readonly loggedInText: Locator;
  readonly subscriptionText: Locator;
  readonly fullFledgedText: Locator;
  readonly scrollUpArrowButton: Locator;
  readonly recommendedItemsSection: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedProductItems: Locator;
  readonly viewCartModal: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page, navigation: NavigationMenu) {
    super(page, page.locator("h1, h2").first());
    this.navigation = navigation;

    this.loggedInText = page.locator("li").filter({ hasText: "Logged in as" });
    this.subscriptionText = page.locator("h2").filter({ hasText: "Subscription" });
    this.fullFledgedText = page.getByText("Full-Fledged practice website for Automation Engineers").first();
    this.scrollUpArrowButton = page.locator("#scrollUp");

    // Recommended items section
    this.recommendedItemsSection = page.locator(".recommended_items");
    this.recommendedItemsHeading = this.recommendedItemsSection.locator("h2.title");
    this.recommendedProductItems = this.recommendedItemsSection.locator(".product-image-wrapper");

    // Modal
    this.viewCartModal = page.locator(".modal-content");
    this.viewCartButton = this.viewCartModal.locator("u").filter({ hasText: "View Cart" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async clickSignupLogin(): Promise<void> {
    await this.navigation.clickSignupLogin();
  }

  async clickLogout(): Promise<void> {
    await this.navigation.clickLogout();
  }

  async clickProducts(): Promise<void> {
    await this.navigation.productsLink.click();
  }

  async clickContactUs(): Promise<void> {
    await this.navigation.contactUsLink.click();
  }

  async verifyLoggedInVisible(): Promise<void> {
    await expect(
      this.loggedInText,
      "Logged in text should be visible"
    ).toBeVisible();
  }

  async verifyLoggedInNotVisible(): Promise<void> {
    await expect(
      this.loggedInText,
      "Logged in text should not be visible"
    ).not.toBeVisible();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async verifySubscriptionVisible(): Promise<void> {
    await expect(
      this.subscriptionText,
      "Subscription text should be visible"
    ).toBeVisible();
  }

  async verifyFullFledgedTextVisible(): Promise<void> {
    await expect(
      this.fullFledgedText,
      "Full-Fledged text should be visible"
    ).toBeVisible();
  }

  async clickScrollUpArrow(): Promise<void> {
    await this.scrollUpArrowButton.click();
  }

  /**
   * Verify recommended items section is visible
   */
  async verifyRecommendedItemsVisible(): Promise<void> {
    await expect(
      this.recommendedItemsHeading,
      "Recommended items heading should be visible"
    ).toBeVisible();
  }

  /**
   * Get recommended product name by index
   */
  async getRecommendedProductName(index: number): Promise<string> {
    const product = this.recommendedProductItems.nth(index);
    const name = await product.locator(".productinfo p").textContent();
    return name?.trim() || "";
  }

  /**
   * Add recommended item to cart by index
   */
  async addRecommendedItemToCart(index: number): Promise<void> {
    const product = this.recommendedProductItems.nth(index);
    await product.scrollIntoViewIfNeeded();
    await product.locator(".productinfo a.add-to-cart").click();
  }

  /**
   * Click View Cart button from modal
   */
  async clickViewCartFromModal(): Promise<void> {
    await this.viewCartButton.click();
  }
}
