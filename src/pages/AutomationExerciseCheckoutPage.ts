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
        this.deliveryAddress = this.resolveLocator('#address_delivery', 'Delivery Address');
        this.billingAddress = this.resolveLocator('#address_invoice', 'Billing Address');
        this.commentArea = this.resolveLocator('textarea[name="message"]', 'Comment Area');
        this.placeOrderButton = this.resolveLocator('a[href="/payment"]', 'Place Order Button');
        this.cartItems = this.resolveLocator('#cart_info_table tbody tr', 'Cart Items');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveTitle(PAGE_TITLES.CHECKOUT);
    }

    async verifyDeliveryAddress(user: User): Promise<void> {
        await expect(this.deliveryAddress).toContainText(user.address);
        await expect(this.deliveryAddress).toContainText(user.city);
        await expect(this.deliveryAddress).toContainText(user.country);
        await expect(this.deliveryAddress).toContainText(user.mobileNumber);
    }

    async verifyBillingAddress(user: User): Promise<void> {
        await expect(this.billingAddress).toContainText(user.address);
        await expect(this.billingAddress).toContainText(user.city);
        await expect(this.billingAddress).toContainText(user.country);
        await expect(this.billingAddress).toContainText(user.mobileNumber);
    }

    async enterComment(comment: string): Promise<void> {
        await this.commentArea.fill(comment);
    }

    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
    }

    async verifyCartItemsVisible(): Promise<void> {
        await expect(this.cartItems.first()).toBeVisible();
    }

    async verifyProductInOrder(productName: string): Promise<void> {
        await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
    }
}
