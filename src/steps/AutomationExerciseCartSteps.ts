import { AutomationExerciseCartPage } from '../pages/AutomationExerciseCartPage';

export class AutomationExerciseCartSteps {
    constructor(private cartPage: AutomationExerciseCartPage) { }

    async verifyCartVisible() {
        await this.cartPage.verifyCartVisible();
    }

    async verifyCartContent(products: Array<{ name: string, quantity: string, price: string, total: string }>) {
        for (const product of products) {
            await this.cartPage.verifyProductQuantity(product.name, product.quantity);
            await this.cartPage.verifyProductPrice(product.name, product.price);
            await this.cartPage.verifyTotalPrice(product.name, product.total);
        }
    }
}
