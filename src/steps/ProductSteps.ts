import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

export class ProductSteps {
    constructor(private productsPage: ProductsPage) { }

    async selectCategory(categoryName: string, subCategoryName: string) {
        await this.productsPage.categoryLink(categoryName).click();
        await this.productsPage.subCategoryLink(categoryName, subCategoryName).click();
    }

    async selectBrand(brandName: string) {
        await this.productsPage.brandLink(brandName).click();
    }

    async verifyCategoryTitle(title: string) {
        await expect(this.productsPage.categoryTitleHeading, 'Category title should contain expected text').toContainText(title, { ignoreCase: true });
    }

    async verifyProductCountGreaterThan(minCount: number) {
        await this.productsPage.productItems.first().waitFor({ state: 'visible' });
        const count = await this.productsPage.productItems.count();
        expect(count, `Product count should be greater than ${minCount}`).toBeGreaterThan(minCount);
    }

    async verifyProductListContains(searchTerm: string) {
        await this.productsPage.productItems.first().waitFor({ state: 'visible' });
        const count = await this.productsPage.productItems.count();
        expect(count, 'Product list should contain at least one item').toBeGreaterThan(0);

        // Check first few items to ensure relevance
        for (let i = 0; i < Math.min(count, 3); i++) {
            const productCard = this.productsPage.productItems.nth(i);
            await expect(productCard, 'Product card should contain search term').toContainText(searchTerm, { ignoreCase: true });
        }
    }
}
