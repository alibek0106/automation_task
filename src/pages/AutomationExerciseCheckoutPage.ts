import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PAGE_TITLES } from '../utils/Constants';
import { User } from '../utils/DataFactory';

export class AutomationExerciseCheckoutPage extends BasePage {
    private readonly deliveryAddress: Locator;
    private readonly billingAddress: Locator;
    private readonly commentArea: Locator;
    private readonly placeOrderButton: Locator;
    private readonly cartItems: Locator;

    constructor(page: Page) {
        super(page, 'CheckoutPage');
        this.deliveryAddress = this.page.locator('#address_delivery').describe('Delivery Address');
        this.billingAddress = this.page.locator('#address_invoice').describe('Billing Address');
        this.commentArea = this.page.locator('textarea[name="message"]').describe('Comment Area');
        this.placeOrderButton = this.page.locator('a[href="/payment"]').describe('Place Order Button');
        this.cartItems = this.page.locator('#cart_info_table tbody tr').describe('Cart Items');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page, 'Checkout page should be loaded').toHaveTitle(PAGE_TITLES.CHECKOUT);
    }

    async verifyDeliveryAddress(user: User): Promise<void> {
        await expect(this.deliveryAddress, 'Delivery address should have expected address').toContainText(user.address);
        await expect(this.deliveryAddress, 'Delivery address should have expected city').toContainText(user.city);
        await expect(this.deliveryAddress, 'Delivery address should have expected country').toContainText(user.country);
        await expect(this.deliveryAddress, 'Delivery address should have expected mobile number').toContainText(user.mobileNumber);
    }

    async verifyBillingAddress(user: User): Promise<void> {
        await expect(this.billingAddress, 'Billing address should have expected address').toContainText(user.address);
        await expect(this.billingAddress, 'Billing address should have expected city').toContainText(user.city);
        await expect(this.billingAddress, 'Billing address should have expected country').toContainText(user.country);
        await expect(this.billingAddress, 'Billing address should have expected mobile number').toContainText(user.mobileNumber);
    }

    async enterComment(comment: string): Promise<void> {
        await this.commentArea.fill(comment);
    }

    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
    }

    async verifyCartItemsVisible(): Promise<void> {
        await expect(this.cartItems.first(), 'Cart items should be visible').toBeVisible();
    }

    async verifyProductInOrder(productName: string): Promise<void> {
        await expect(this.cartItems.filter({ hasText: productName }), 'Product should be in order').toBeVisible();
    }
}
