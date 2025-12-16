import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
    readonly productName: Locator = this.page
        .locator(".product-information h2")
        .describe("Product name");
    readonly productPrice: Locator = this.page
        .locator(".product-information span span")
        .describe("Product price");
    readonly productCategory: Locator = this.page
        .locator(".product-information p")
        .filter({ hasText: /category/i })
        .describe("Product category");
    readonly productAvailability: Locator = this.page
        .locator(".product-information p")
        .filter({ hasText: /availability/i })
        .describe("Product availability");
    readonly productCondition: Locator = this.page
        .locator(".product-information p")
        .filter({ hasText: /condition/i })
        .describe("Product condition");
    readonly productBrand: Locator = this.page
        .locator(".product-information p")
        .filter({ hasText: /brand/i })
        .describe("Product brand");
    readonly quantityInput: Locator = this.page
        .locator("#quantity")
        .describe("Quantity input");
    readonly addToCartButton: Locator = this.page
        .locator("button.cart")
        .describe("Add to cart button");
    readonly viewCartModal: Locator = this.page
        .locator(".modal-content")
        .describe("View cart modal");
    readonly continueShoppingButton: Locator = this.viewCartModal
        .getByRole("button", { name: /continue shopping/i })
        .describe("Continue shopping button");
    readonly viewCartButton: Locator = this.viewCartModal
        .getByRole("link", { name: /view cart/i })
        .describe("View cart button in modal");
    readonly reviewSection: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextarea: Locator;
    readonly reviewSubmitButton: Locator;
    readonly reviewSuccessMessage: Locator;

    constructor(page: Page) {
        super(page, page.locator(".product-information h2"));
        // Initialize review section locators
        this.reviewSection = page.locator(".category-tab");
        this.reviewNameInput = page.locator("#name");
        this.reviewEmailInput = page.locator("#email");
        this.reviewTextarea = page.locator("#review");
        this.reviewSubmitButton = page.locator("#button-review");
        this.reviewSuccessMessage = page.locator(".alert-success").filter({ hasText: "Thank you for your review" });
    }

    /**
     * Set product quantity
     */
    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.clear();
        await this.quantityInput.fill(String(quantity));
    }

    /**
     * Add product to cart
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.viewCartModal.waitFor({ state: "visible" });
    }

    /**
     * Click "Continue Shopping" in modal after adding to cart
     */
    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
        await this.viewCartModal.waitFor({ state: "hidden" });
    }

    /**
     * Click "View Cart" in modal after adding to cart
     */
    async clickViewCart(): Promise<void> {
        await this.viewCartButton.click();
    }

    /**
     * Verify Write Your Review section is visible
     */
    async verifyReviewSectionVisible(): Promise<void> {
        await expect(
            this.page.locator("a[href='#reviews']"),
            "Write Your Review link should be visible"
        ).toBeVisible();
    }

    /**
     * Fill and submit product review
     */
    async submitReview(name: string, email: string, review: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextarea.fill(review);
        await this.reviewSubmitButton.click();
    }

    /**
     * Verify review success message
     */
    async verifyReviewSuccess(): Promise<void> {
        await expect(
            this.reviewSuccessMessage,
            "Review success message should be visible"
        ).toBeVisible();
        await expect(
            this.reviewSuccessMessage,
            "Success message should contain thank you text"
        ).toContainText("Thank you for your review");
    }
    /**
     * Get product name text
     */
    async getProductName(): Promise<string> {
        const name = await this.productName.textContent();
        return name?.trim() || "";
    }

    /**
     * Get product price text
     */
    async getProductPrice(): Promise<string> {
        const price = await this.productPrice.textContent();
        return price?.trim() || "";
    }

    /**
     * Verify product detail page is opened
     */
    async verifyProductDetailVisible(): Promise<void> {
        await expect(
            this.productName,
            "Product name should be visible on detail page"
        ).toBeVisible();
        await expect(
            this.productPrice,
            "Product price should be visible on detail page"
        ).toBeVisible();
    }

    /**
     * Get all product information
     */
    async getProductInfo(): Promise<{
        name: string;
        price: string;
        category: string;
        availability: string;
    }> {
        return {
            name: await this.getProductName(),
            price: await this.getProductPrice(),
            category: (await this.productCategory.textContent()) || "",
            availability: (await this.productAvailability.textContent()) || "",
        };
    }
}
