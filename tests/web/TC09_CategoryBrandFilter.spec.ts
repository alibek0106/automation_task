import { test } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';

test.describe('TC09: Product Category and Brand Filtering', { tag: '@meladze' }, () => {

  test('should verify product filtering by category and brand', async ({
    homePage,
    productsPage
  }) => {

    await test.step('Navigate to homepage and verify category sidebar', async () => {
      await homePage.goto();
      await productsPage.verifyCategorySidebarVisible();
    });

    await test.step('Filter by Women > Dress category', async () => {
      await productsPage.selectCategory(
        TestData.CATEGORIES.WOMEN_DRESS.category,
        TestData.CATEGORIES.WOMEN_DRESS.subcategory
      );
      await productsPage.verifyCategoryTitle(TestData.CATEGORIES.WOMEN_DRESS.expectedTitle);
      await productsPage.verifyProductCountGreaterThan(0);
    });

    await test.step('Filter by Men > Jeans category', async () => {
      await productsPage.selectCategory(
        TestData.CATEGORIES.MEN_JEANS.category,
        TestData.CATEGORIES.MEN_JEANS.subcategory
      );
      await productsPage.verifyCategoryTitle(TestData.CATEGORIES.MEN_JEANS.expectedTitle);
      await productsPage.verifyProductCountGreaterThan(0);
    });

    await test.step('Verify and filter by Polo brand', async () => {
      await productsPage.verifyBrandsSidebarVisible();
      await productsPage.selectBrand(TestData.BRANDS.POLO.name);
      await productsPage.verifyCategoryTitle(TestData.BRANDS.POLO.expectedTitle);
      await productsPage.verifyProductCountGreaterThan(0);
    });

    await test.step('Filter by H&M brand', async () => {
      await productsPage.selectBrand(TestData.BRANDS.H_AND_M.name);
      await productsPage.verifyCategoryTitle(TestData.BRANDS.H_AND_M.expectedTitle);
      await productsPage.verifyProductCountGreaterThan(0);
    });
  });
});
