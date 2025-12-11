import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartItem, CartItemSchema } from '../models/ProductModels';
import { SubscriptionSteps } from '../steps/SubscriptionSteps';

export class CartPage extends BasePage {
    readonly emptyCartMessage: Locator = this.page.getByText('Cart is empty!').describe('Empty Cart Message');
    readonly cartTable: Locator = this.page
        .getByRole('table')
        .filter({ hasText: 'Item' })
        .filter({ hasText: 'Quantity' })
        .describe('Cart Table');
    readonly proceedToCheckoutBtn: Locator = this.page.getByText('Proceed To Checkout').describe('Proceed To Checkout Button');
    readonly checkoutModalRegisterLoginLink: Locator = this.page.getByRole('link', { name: 'Register / Login' }).describe('Checkout Modal Register/Login Link');
    readonly subscription: SubscriptionSteps;

    // Row Element Locators
    readonly deleteBtn = (row: Locator) => row.getByRole('cell').nth(5).locator('a');
    readonly rowCells = (row: Locator) => row.getByRole('cell');
    readonly rowNameLink = (row: Locator) => this.rowCells(row).nth(1).getByRole('link');
    readonly rowPrice = (row: Locator) => this.rowCells(row).nth(2);
    readonly rowQuantity = (row: Locator) => this.rowCells(row).nth(3).getByRole('button');
    readonly rowTotal = (row: Locator) => this.rowCells(row).nth(4);

    // Modal Locators
    readonly registerLoginModal = this.page.locator('.modal-content');
    readonly registerLink = this.registerLoginModal.getByRole('link', { name: /Register.*Login/i });

    constructor(page: Page) {
        super(page);
        this.subscription = new SubscriptionSteps(page);
    }

    getAllRows(): Locator {
        return this.cartTable
            .getByRole('row')
            .filter({ hasNotText: 'Description' }) // Skip Header
            .filter({ hasNotText: 'Item' });       // Safety Skip
    }

    getProductRow(productName: string): Locator {
        return this.getAllRows()
            .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    getRowByIndex(index: number): Locator {
        return this.getAllRows().nth(index);
    }

    /**
     * Remove a specific product by name
     */
    async removeProduct(productName: string): Promise<void> {
        const row = this.getProductRow(productName);
        await this.deleteBtn(row).click();
    }

    async clickProceedToCheckout() {
        await this.proceedToCheckoutBtn.click();
    }

    async clickRegisterLoginFromModal() {
        await this.checkoutModalRegisterLoginLink.click();
    }

    async verifyRegisterLoginModal() {
        await expect(this.registerLoginModal).toBeVisible();
        await expect(this.registerLink).toBeVisible();
    }

    async performSubscription(email: string) {
        await this.subscription.performSubscription(email);
    }

    // Expose subscription locators for backward compatibility
    get subscriptionHeading() { return this.subscription.subscriptionHeading; }
    get subscriptionEmailInput() { return this.subscription.subscriptionEmailInput; }
    get subscriptionSubmitBtn() { return this.subscription.subscriptionSubmitBtn; }
    get subscriptionSuccessMsg() { return this.subscription.subscriptionSuccessMsg; }
}
