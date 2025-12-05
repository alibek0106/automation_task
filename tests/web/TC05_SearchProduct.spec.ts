import { test, expect } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';

test.describe('TC05: Search Product and Verify Results', { tag: '@meladze' }, () => {

  test('should search for products and verify results', async ({
    homePage,
    productsPage,
    productDetailsPage
  }) => {

    await test.step('Navigate to Products page', async () => {
      await homePage.goto();
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await productsPage.verifySearchBoxVisible();
    });

    await test.step('Search for first product and verify results', async () => {
      const searchTerm1 = TestData.SEARCH.VALID_TERM_1;
      await productsPage.searchProduct(searchTerm1);
      await productsPage.verifySearchedProductsVisible();
      await productsPage.verifyProductListContains(searchTerm1);
    });

    await test.step('Verify product card details', async () => {
      await productsPage.verifyProductCardDetails();
    });

    await test.step('View product details page', async () => {
      await productsPage.clickFirstViewProduct();
      await productDetailsPage.verifyProductDetailsVisible();
    });

    await test.step('Search for second product and verify results', async () => {
      await productsPage.navigateToProducts();
      const searchTerm2 = TestData.SEARCH.VALID_TERM_2;
      await productsPage.searchProduct(searchTerm2);
      await productsPage.verifySearchedProductsVisible();
      await productsPage.verifyProductListContains(searchTerm2);
    });

    await test.step('Search for invalid product and verify no results', async () => {
      const invalidTerm = TestData.SEARCH.INVALID_TERM;
      await productsPage.searchProduct(invalidTerm);
      await productsPage.verifySearchedProductsVisible();
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBe(0);
    });
  });
});
