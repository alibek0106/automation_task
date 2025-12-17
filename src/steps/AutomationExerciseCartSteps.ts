import { AutomationExerciseCartPage } from '../pages/AutomationExerciseCartPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseCartSteps {
    constructor(private cartPage: AutomationExerciseCartPage) { }

    @step('Verify Cart page is visible')
    async verifyCartVisible() {
        await this.cartPage.verifyCartVisible();
    }

    @step('Verify Cart content')
    async verifyCartContent(products: Array<{ name: string, quantity: string, price: string, total: string }>) {
        for (const product of products) {
            await this.cartPage.verifyProductQuantity(product.name, product.quantity);
            await this.cartPage.verifyProductPrice(product.name, product.price);
            await this.cartPage.verifyTotalPrice(product.name, product.total);
        }
    }

    @step('Remove product: {0}')
    async removeProduct(productName: string) {
        await this.cartPage.removeProduct(productName);
    }

    @step('Verify product removed: {0}')
    async verifyProductRemoved(productName: string) {
        await this.cartPage.verifyProductRemoved(productName);
    }

    @step('Verify cart is empty')
    async verifyCartEmpty() {
        await this.cartPage.verifyCartEmpty();
    }

    @step('Click "Proceed To Checkout"')
    async proceedToCheckout() {
        await this.cartPage.proceedToCheckout();
    }

    @step('Get cart items details')
    async getCartItemsDetails(): Promise<{ name: string, price: string, quantity: string, total: string }[]> {
        return await this.cartPage.getCartItemsDetails();
    }
}
