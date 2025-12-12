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
        try {
            await this.cartTableRows.first().waitFor({ state: "visible", timeout: 3000 });
            return await this.cartTableRows.count();
        } catch {
            return 0;
        }
    }

    /**
     * Remove product from cart by index
     */
    async removeProduct(index: number): Promise<void> {
        await this.cartTableRows
            .nth(index)
            .locator(".cart_delete a")
            .click();

        // Wait for the row to be removed from DOM
        await this.page.waitForTimeout(500); // Small wait for animation
    }

    /**
     * Remove product from cart by name
     */
    async removeProductByName(productName: string): Promise<void> {
        const row = this.cartTableRows.filter({
            has: this.page.locator(".cart_description h4 a", { hasText: productName }),
        });

        await row.locator(".cart_delete a").click();
        await this.page.waitForTimeout(1000); // Wait for removal animation and DOM update
    }

    /**
     * Verify product is in cart by name
     */
    async verifyProductInCart(productName: string): Promise<void> {
        const row = this.cartTableRows.filter({
            has: this.page.locator(".cart_description h4 a", { hasText: productName }),
        });

        await expect(
            row,
            `Product "${productName}" should be in cart`
        ).toBeVisible();
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
        const row = this.cartTableRows.filter({
            has: this.page.locator(".cart_description h4 a", { hasText: productName }),
        });

        const quantityText = await row.locator(".cart_quantity button").textContent();
        return parseInt(quantityText?.trim() || "0", 10);
    }

    /**
     * Get product total price by name
     */
    async getProductTotal(productName: string): Promise<string> {
        const row = this.cartTableRows.filter({
            has: this.page.locator(".cart_description h4 a", { hasText: productName }),
        });

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
