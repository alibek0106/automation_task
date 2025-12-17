import { Page, Locator, expect } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export interface CartItem {
    name: string;
    price: string;
    quantity: string;
    total: string;
}

export class CartPage extends BasePage {
    readonly cartTable: Locator = this.page
        .locator("#cart_info_table")
        .describe("Cart info table");
    readonly cartTableRows: Locator = this.cartTable
        .locator("tbody tr")
        .describe("Cart table rows");
    readonly proceedToCheckoutButton: Locator = this.page
        .getByText("Proceed To Checkout")
        .describe("Proceed to checkout button");
    readonly emptyCartMessage: Locator = this.page
        .locator("#empty_cart")
        .describe("Empty cart message");
    // Subscription elements
    readonly subscriptionHeading: Locator = this.page
        .getByRole("heading", { name: /subscription/i })
        .describe("Subscription heading");
    readonly subscriptionEmailInput: Locator = this.page
        .locator("#susbscribe_email")
        .describe("Subscription email input");
    readonly subscriptionButton: Locator = this.page
        .locator("#subscribe")
        .describe("Subscription submit button");
    readonly subscriptionSuccessMessage: Locator = this.page
        .locator(".alert-success.alert")
        .describe("Subscription success message");

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    private productNameToLooseRegExp(productName: string): RegExp {
        const normalized = productName
            .replace(/\u00a0/g, " ")
            .trim()
            .replace(/\s+/g, " ");
        const parts = normalized
            .split(" ")
            .filter(Boolean)
            .map((part) => this.escapeRegExp(part));
        return new RegExp(parts.join("\\s+"), "i");
    }

    private readonly cartRowByProductName = (productName: string): Locator =>
        this.cartTableRows.filter({
            hasText: this.productNameToLooseRegExp(productName),
        });

    constructor(page: Page) {
        super(
            page,
            page.locator("#cart_info_table").describe("Cart info table")
        );
    }

    async goto() {
        await super.goto(Routes.WEB.VIEW_CART);
    }

    /**
     * Get all items in cart
     */
    async getCartItems(): Promise<CartItem[]> {
        const items: CartItem[] = [];
        const count = await this.cartTableRows.count();

        for (let i = 0; i < count; i++) {
            const row = this.cartTableRows.nth(i);

            const name = await row.locator(".cart_description h4 a").textContent();
            const price = await row.locator(".cart_price p").textContent();
            const quantity = await row.locator(".cart_quantity button").textContent();
            const total = await row.locator(".cart_total_price").textContent();

            items.push({
                name: name?.trim() || "",
                price: price?.trim() || "",
                quantity: quantity?.trim() || "",
                total: total?.trim() || "",
            });
        }

        return items;
    }

    /**
     * Get cart item count
     */
    async getCartItemCount(): Promise<number> {
        return this.cartTableRows.count();
    }

    /**
     * Remove product from cart by index
     */
    async removeProduct(index: number): Promise<void> {
        const initialCount = await this.cartTableRows.count();
        await this.cartTableRows.nth(index).locator(".cart_delete a").click();

        // Wait for the cart rows count to decrease (no hard waits)
        await expect(
            this.cartTableRows,
            `Cart rows count should decrease after removing item at index ${index}`
        ).toHaveCount(Math.max(0, initialCount - 1));
    }

    /**
     * Remove product from cart by name
     */
    async removeProductByName(productName: string): Promise<void> {
        const row = this.cartRowByProductName(productName);
        await expect(row, `Product "${productName}" should exist in cart before removal`).toHaveCount(1);
        await row.locator(".cart_delete a").click();
        await expect(row, `Product "${productName}" should be removed from cart`).toHaveCount(0);
    }

    /**
     * Verify product is in cart by name
     */
    async verifyProductInCart(productName: string): Promise<void> {
        const row = this.cartRowByProductName(productName);

        await expect(
            row,
            `Product "${productName}" should be in cart`
        ).toBeVisible();
    }

    /**
     * Verify product is NOT in cart by name
     */
    async verifyProductNotInCart(productName: string): Promise<void> {
        const row = this.cartRowByProductName(productName);

        await expect(
            row,
            `Product "${productName}" should not exist in cart`
        ).toHaveCount(0);
    }

    /**
     * Remove all products from cart (idempotent)
     */
    async clearCart(): Promise<void> {
        // Cart page can render either a table or an empty-cart message.
        // Don't hard-fail if the table doesn't exist.
        await this.page.waitForLoadState("domcontentloaded");
        await Promise.race([
            this.cartTable.waitFor({ state: "attached" }),
            this.emptyCartMessage.waitFor({ state: "attached" }),
        ]).catch(() => {});

        const hasEmptyMessage = (await this.emptyCartMessage.count()) > 0;
        const hasTable = (await this.cartTable.count()) > 0;
        if (hasEmptyMessage && !hasTable) return;
        if (!hasTable) return;

        let count = await this.cartTableRows.count();
        while (count > 0) {
            await this.removeProduct(0);
            count = await this.cartTableRows.count();
        }
    }

    /**
     * Verify cart is empty
     */
    async verifyCartEmpty(): Promise<void> {
        const count = await this.getCartItemCount();
        expect(count, "Cart should be empty").toBe(0);
    }

    /**
     * Get product quantity by name
     */
    async getProductQuantity(productName: string): Promise<number> {
        const row = this.cartRowByProductName(productName);

        const quantityText = await row.locator(".cart_quantity button").textContent();
        return parseInt(quantityText?.trim() || "0", 10);
    }

    /**
     * Get product total price by name
     */
    async getProductTotal(productName: string): Promise<string> {
        const row = this.cartRowByProductName(productName);

        const total = await row.locator(".cart_total_price").textContent();
        return total?.trim() || "";
    }

    /**
     * Get overall cart total (sum of all items)
     */
    async getCartTotal(): Promise<string> {
        // This would require summing all individual totals or finding a total element
        const items = await this.getCartItems();
        let total = 0;

        for (const item of items) {
            // Remove "Rs. " prefix and parse
            const itemTotal = parseFloat(item.total.replace(/Rs\.\s*/, "").replace(/,/g, ""));
            total += itemTotal;
        }

        return `Rs. ${total}`;
    }

    /**
     * Click proceed to checkout
     */
    async clickProceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

    /**
     * Verify cart table is visible
     */
    async verifyCartTableVisible(): Promise<void> {
        await expect(
            this.cartTable,
            "Cart table should be visible"
        ).toBeVisible();
    }

    /**
     * Subscribe with email address
     */
    async subscribeWithEmail(email: string): Promise<void> {
        await this.scrollToBottom();
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
    }

    /**
     * Verify subscription heading is visible
     */
    async verifySubscriptionVisible(): Promise<void> {
        await expect(
            this.subscriptionHeading,
            "Subscription heading should be visible"
        ).toBeVisible();
    }

    /**
     * Verify subscription success message
     */
    async verifySubscriptionSuccess(): Promise<void> {
        await expect(
            this.subscriptionSuccessMessage,
            "Subscription success message should be visible"
        ).toContainText("You have been successfully subscribed!");
    }
}
