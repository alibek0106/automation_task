import { AutomationExerciseProductDetailPage } from '../pages/AutomationExerciseProductDetailPage';

export class AutomationExerciseProductDetailSteps {
    constructor(private productDetailPage: AutomationExerciseProductDetailPage) { }

    async verifyProductDetailVisible() {
        await this.productDetailPage.verifyProductDetailVisible();
    }

    async addProductToCartWithQuantity(quantity: string) {
        await this.productDetailPage.setQuantity(quantity);
        await this.productDetailPage.addToCart();
    }

    async clickContinueShopping() {
        await this.productDetailPage.clickContinueShopping();
    }

    async clickViewCart() {
        await this.productDetailPage.clickViewCart();
    }
}
