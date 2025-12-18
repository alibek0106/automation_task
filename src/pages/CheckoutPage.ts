import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { User } from "../models/UserModels";

export class CheckoutPage extends BasePage {
    readonly deliveryAddressSection: Locator;
    readonly billingAddressSection: Locator;
    readonly orderReviewTable: Locator;
    readonly orderCommentTextarea: Locator;
    readonly placeOrderButton: Locator;
    readonly checkoutHeading: Locator;
    readonly orderReviewRows: Locator;
    readonly orderReviewTotalRow: Locator;
    readonly totalAmountText: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator("#cart_info").describe("Order review table")
        );

        this.deliveryAddressSection = this.page
            .locator("#address_delivery")
            .describe("Delivery address section");
        this.billingAddressSection = this.page
            .locator("#address_invoice")
            .describe("Billing address section");
        this.orderReviewTable = this.page
            .locator("#cart_info")
            .describe("Order review table");
        this.orderCommentTextarea = this.page
            .locator("textarea.form-control")
            .describe("Order comment textarea");
        this.placeOrderButton = this.page
            .getByRole("link", { name: /place order/i })
            .describe("Place order button");
        this.checkoutHeading = this.page
            .getByRole("heading", { name: /review your order/i })
            .describe("Checkout heading");
        this.orderReviewRows = this.orderReviewTable
            .locator("tr")
            .describe("Order review rows");
        this.orderReviewTotalRow = this.orderReviewRows
            .last()
            .describe("Order review total row");
        this.totalAmountText = this.orderReviewTotalRow
            .locator("p")
            .last()
            .describe("Total amount text");
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
