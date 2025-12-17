import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { step } from '../utils/StepDecorator';

export class ProductSteps {
    constructor(
        private productsPage: ProductsPage,
        private productDetailPage: ProductDetailPage
    ) {}

    @step('Verify search results visible')
    async verifySearchResultsVisible(): Promise<void> {
        await expect(
            this.productsPage.searchedProductsHeading,
            "Searched products heading should be visible"
        ).toBeVisible();
    }

    @step('Verify products list visible')
    async verifyProductsListVisible(): Promise<void> {
        await expect(
            this.productsPage.productItems.first(),
            "At least one product should be visible"
        ).toBeVisible();
    }

    @step('Verify category title')
    async verifyCategoryTitle(expectedTitle: string): Promise<void> {
        await this.productsPage.verifyCategoryTitleVisible(expectedTitle);
    }

    @step('Verify brand title')
    async verifyBrandTitle(brandName: string): Promise<void> {
        await this.productsPage.verifyBrandTitleVisible(brandName);
    }
}
