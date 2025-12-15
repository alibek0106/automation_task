import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseProductsSteps {
    constructor(private productsPage: AutomationExerciseProductsPage) { }

    @step('Verify Products page is visible')
    async verifyProductsPageVisible() {
        await this.productsPage.verifyPageOpened();
    }

    @step('View details of the first product')
    async viewFirstProductDetails() {
        await this.productsPage.viewProductDetails(0);
    }

    @step('Navigate to Products page')
    async navigateToProductsPage() {
        await this.productsPage.navigate();
    }

    @step('Add product at index {0} to cart')
    async addProductToCart(index: number) {
        await this.productsPage.addProductToCart(index); // Assuming direct add from products page if such flow supported, otherwise leads to logic change
    }
}
