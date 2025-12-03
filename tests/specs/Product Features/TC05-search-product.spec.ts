import { test, expect } from '../../fixtures/pageFixtures';

test.describe('TC05: Search Product and Verify Results', () => {

  test('should search for products and verify results', async ({
    page,
    homePage,
    productsPage,
    productDetailsPage
  }) => {

    // Step 1: Navigate to homepage
    await test.step('Navigate to homepage', async () => {
      await homePage.navigateToHome();
      await homePage.verifyHomepageLoaded();
    });

    // Step 2: Navigate to "Products" page
    await test.step('Navigate to Products page', async () => {
      await productsPage.navigateToProducts();
    });

    // Step 3-4: Verify "ALL PRODUCTS" page and search box
    await test.step('Verify Products page loaded', async () => {
      await productsPage.verifyAllProductsPageVisible();
      await productsPage.verifySearchBoxVisible();
    });

    // Step 5-8: Search for "Tshirt" and verify results
    const searchTerm1 = 'T-Shirt';
    await test.step(`Search for "${searchTerm1}"`, async () => {
      await productsPage.searchProduct(searchTerm1);
      await productsPage.verifySearchedProductsVisible();
      await productsPage.verifyProductListContains(searchTerm1);
    });

    // Step 9: Verify product card details
    await test.step('Verify product card details', async () => {
      await productsPage.verifyProductCardDetails();
    });

    // Step 10-11: Click on first product and verify details page
    await test.step('Verify product details page', async () => {
      await productsPage.clickFirstViewProduct();
      await productDetailsPage.verifyProductDetailsPageLoaded();
      await productDetailsPage.verifyProductInformationVisible();
    });

    // Return to products page for next steps
    await productsPage.navigateToProducts();

    // Step 12-13: Perform search with different keyword
    const searchTerm2 = 'Jeans';
    await test.step(`Search for "${searchTerm2}"`, async () => {
      await productsPage.searchProduct(searchTerm2);
      await productsPage.verifySearchedProductsVisible();
      await productsPage.verifyProductListContains(searchTerm2);
    });

    // Step 14-15: Perform search with non-existent product
    const invalidTerm = 'XYZ123NOTFOUND';
    await test.step(`Search for invalid term "${invalidTerm}"`, async () => {
      await productsPage.searchProduct(invalidTerm);
      await productsPage.verifySearchedProductsVisible();

      // Verify results are empty for invalid search
      // Directly checking the locator count here as a specific check for this test case
      const productCount = await page.locator('.features_items .col-sm-4').count();
      expect(productCount).toBe(0);
    });
  });
});
