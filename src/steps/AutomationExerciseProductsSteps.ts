import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';

export class AutomationExerciseProductsSteps {
    constructor(private productsPage: AutomationExerciseProductsPage) { }

    async verifyProductsPageVisible() {
        await this.productsPage.verifyPageOpened();
    }

    async viewFirstProductDetails() {
        await this.productsPage.viewProductDetails(0);
    }

    async addProductToCart(index: number) {
        await this.productsPage.addProductToCart(index); // Assuming direct add from products page if such flow supported, otherwise leads to logic change
    }
}
