import { AutomationExerciseProductDetailPage } from '../pages/AutomationExerciseProductDetailPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseProductDetailSteps {
    constructor(private productDetailPage: AutomationExerciseProductDetailPage) { }

    @step('Verify Product Detail page is visible')
    async verifyProductDetailVisible() {
        await this.productDetailPage.verifyProductDetailVisible();
    }

    @step('Add product to cart with quantity: {0}')
    async addProductToCartWithQuantity(quantity: string) {
        await this.productDetailPage.setQuantity(quantity);
        await this.productDetailPage.addToCart();
    }

    @step('Click "Continue Shopping"')
    async clickContinueShopping() {
        await this.productDetailPage.clickContinueShopping();
    }

    @step('Click "View Cart"')
    async clickViewCart() {
        await this.productDetailPage.clickViewCart();
    }
}
