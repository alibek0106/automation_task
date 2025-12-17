import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { User } from "../models/UserModels";

export class CheckoutPage extends BasePage {
    readonly deliveryAddressSection: Locator = this.page
        .locator("#address_delivery")
        .describe("Delivery address section");
    readonly billingAddressSection: Locator = this.page
        .locator("#address_invoice")
        .describe("Billing address section");
    readonly orderReviewTable: Locator = this.page
        .locator("#cart_info")
        .describe("Order review table");
    readonly orderCommentTextarea: Locator = this.page
        .locator("textarea.form-control")
        .describe("Order comment textarea");
    readonly placeOrderButton: Locator = this.page
        .getByRole("link", { name: /place order/i })
        .describe("Place order button");
    readonly checkoutHeading: Locator = this.page
        .getByRole("heading", { name: /review your order/i })
        .describe("Checkout heading");
    readonly orderReviewRows: Locator = this.orderReviewTable
        .locator("tr")
        .describe("Order review rows");
    readonly orderReviewTotalRow: Locator = this.orderReviewRows
        .last()
        .describe("Order review total row");
    readonly totalAmountText: Locator = this.orderReviewTotalRow
        .locator("p")
        .last()
        .describe("Total amount text");

    constructor(page: Page) {
        super(
            page,
            page.locator("#cart_info").describe("Order review table")
        );
    }

    /**
     * Verify delivery address matches user data
     */
    async verifyDeliveryAddress(user: User): Promise<void> {
        const addressText = await this.deliveryAddressSection.textContent();

        expect(addressText, "Delivery address should contain first name").toContain(user.firstName);
        expect(addressText, "Delivery address should contain last name").toContain(user.lastName);
        expect(addressText, "Delivery address should contain address1").toContain(user.address1);
        expect(addressText, "Delivery address should contain city").toContain(user.city);
        expect(addressText, "Delivery address should contain state").toContain(user.state);
        expect(addressText, "Delivery address should contain country").toContain(user.country);
    }

    /**
     * Verify billing address matches user data
     */
    async verifyBillingAddress(user: User): Promise<void> {
        const addressText = await this.billingAddressSection.textContent();

        expect(addressText, "Billing address should contain first name").toContain(user.firstName);
        expect(addressText, "Billing address should contain last name").toContain(user.lastName);
        expect(addressText, "Billing address should contain address1").toContain(user.address1);
    }

    /**
     * Verify order details contain expected products
     */
    async verifyOrderContainsProduct(productName: string): Promise<void> {
        const orderText = await this.orderReviewTable.textContent();
        const normalize = (value: string) =>
            value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

        const normalizedOrder = normalize(orderText ?? "");
        const normalizedName = normalize(productName);
        expect(
            normalizedOrder,
            `Order should contain product: ${productName}`
        ).toContain(normalizedName);
    }

    /**
     * Enter order comment
     */
    async enterComment(comment: string): Promise<void> {
        await this.orderCommentTextarea.fill(comment);
    }

    /**
     * Click place order button
     */
    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
    }

    /**
     * Get total amount from checkout
     */
    async getTotalAmount(): Promise<string> {
        const totalText = await this.totalAmountText.textContent();
        return totalText?.trim() || "";
    }
}
