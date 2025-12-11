import { Page, Locator, expect } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";
import { SubscriptionSteps } from "../steps/SubscriptionSteps";

export class HomePage extends BasePage {
  readonly subscriptionText: Locator = this.page
    .getByRole("heading", { name: "Subscription" })
    .describe("Subscription heading");
  readonly fullFledgedText: Locator = this.page
    .getByText("Full-Fledged practice website for Automation Engineers")
    .first()
    .describe("Full-Fledged text");
  readonly scrollUpArrowButton: Locator = this.page
    .locator("#scrollUp")
    .describe("Scroll up arrow button");
  readonly recommendedItemsHeading: Locator = this.page
    .getByRole("heading", { name: "recommended items" })
    .describe("Recommended items heading");
  readonly recommendedItemsSection: Locator = this.page
    .locator(".recommended_items")
    .describe("Recommended items section");
  readonly recommendedProductItems: Locator = this.recommendedItemsSection
    .locator(".product-image-wrapper")
    .describe("Recommended product items");
  readonly viewCartModal: Locator = this.page
    .locator(".modal-content")
    .describe("View cart modal");
  readonly viewCartButton: Locator = this.viewCartModal
    .getByRole("link", { name: /view cart/i })
    .describe("View cart button");
  readonly subscription: SubscriptionSteps;

  // Expose navigation links for backward compatibility
  get signupLoginLink() {
    return this.navigation.signupLoginLink;
  }
  get loggedInText() {
    return this.navigation.loggedInText;
  }
  get logoutLink() {
    return this.navigation.logoutLink;
  }
  get deleteAccountLink() {
    return this.navigation.deleteAccountLink;
  }

  constructor(page: Page) {
    super(
      page,
      page
        .getByText("Full-Fledged practice website for Automation Engineers")
        .first()
        .describe("Full-Fledged text"),
    );
    this.subscription = new SubscriptionSteps(page);
  }

  async goto() {
    await super.goto(Routes.WEB.HOME);
  }

  async clickSignupLogin() {
    await this.navigation.clickSignupLogin();
  }

  async clickLogout() {
    await this.navigation.clickLogout();
  }

  async verifyLoggedInVisible() {
    await expect(
      this.loggedInText,
      "Logged in text should be visible",
    ).toBeVisible();
  }

  async verifyLoggedInNotVisible() {
    await expect(
      this.loggedInText,
      "Logged in text should not be visible",
    ).not.toBeVisible();
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async verifySubscriptionVisible() {
    await expect(
      this.subscriptionText,
      "Subscription text should be visible",
    ).toBeVisible();
  }

  async verifyFullFledgedTextVisible() {
    await expect(
      this.fullFledgedText,
      "Full-Fledged text should be visible",
    ).toBeVisible();
  }

  async clickScrollUpArrow() {
    await this.scrollUpArrowButton.click();
  }

  async verifyRecommendedItemsVisible() {
    await expect(
      this.recommendedItemsHeading,
      "Recommended items heading should be visible",
    ).toBeVisible();
    await expect(
      this.recommendedProductItems.first(),
      "Recommended product items should be visible",
    ).toBeVisible();
  }

  async getRecommendedProductName(index: number): Promise<string> {
    const product = this.recommendedProductItems.nth(index);
    const name = await product.locator(".productinfo p").textContent();
    return name?.trim() || "";
  }

  async addRecommendedItemToCart(index: number) {
    const product = this.recommendedProductItems.nth(index);
    // Ensure the product is scrolled into view within the carousel
    await product.scrollIntoViewIfNeeded();
    await product.locator(".productinfo a.add-to-cart").click();
  }

  async clickViewCartFromModal() {
    await this.viewCartButton.click();
  }

  async performSubscription(email: string) {
    await this.subscription.performSubscription(email);
  }

  // Expose subscription locators for backward compatibility
  get subscriptionHeading() {
    return this.subscription.subscriptionHeading;
  }
  get subscriptionEmailInput() {
    return this.subscription.subscriptionEmailInput;
  }
  get subscriptionSubmitBtn() {
    return this.subscription.subscriptionSubmitBtn;
  }
  get subscriptionSuccessMsg() {
    return this.subscription.subscriptionSuccessMsg;
  }
}
