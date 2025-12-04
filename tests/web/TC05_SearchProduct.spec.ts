import { test, expect } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';

test.describe('TC05: Search Product and Verify Results', () => {

    test('@meladze should search for products and verify results', async ({
        homePage,
        productsPage,
        productDetailsPage
    }) => {
        await homePage.goto();
        await productsPage.navigateToProducts();
        await productsPage.verifyAllProductsVisible();
        await productsPage.verifySearchBoxVisible();

        const searchTerm1 = TestData.SEARCH.VALID_TERM_1;
        await productsPage.searchProduct(searchTerm1);
        await productsPage.verifySearchedProductsVisible();
        await productsPage.verifyProductListContains(searchTerm1);

        await productsPage.verifyProductCardDetails();

        // Click on first product and verify details page
        await productsPage.clickFirstViewProduct();
        await productDetailsPage.verifyProductDetailsVisible();

        // Return to products page for next steps
        await productsPage.navigateToProducts();

        // Perform search with different keyword
        const searchTerm2 = TestData.SEARCH.VALID_TERM_2;
        await productsPage.searchProduct(searchTerm2);
        await productsPage.verifySearchedProductsVisible();
        await productsPage.verifyProductListContains(searchTerm2);

        // Perform search with non-existent product
        const invalidTerm = TestData.SEARCH.INVALID_TERM;
        await productsPage.searchProduct(invalidTerm);
        await productsPage.verifySearchedProductsVisible();

        // Verify results are empty for invalid search
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBe(0);
    });
});
