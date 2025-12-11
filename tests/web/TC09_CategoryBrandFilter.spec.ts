import { test } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';

test.describe('TC09: Product Category and Brand Filtering', { tag: '@meladze' }, () => {

  test('should verify product filtering by category and brand', async ({
    homePage,
    productsPage,
    productSteps
  }) => {

    await test.step('Navigate to homepage and verify category sidebar', async () => {
      await homePage.goto();
      await productsPage.verifyCategorySidebarVisible();
    });

    await test.step('Filter by Women > Dress category', async () => {
      await productSteps.selectCategory(
        TestData.CATEGORIES.WOMEN_DRESS.category,
        TestData.CATEGORIES.WOMEN_DRESS.subcategory
      );
      await productSteps.verifyCategoryTitle(TestData.CATEGORIES.WOMEN_DRESS.expectedTitle);
      await productSteps.verifyProductCountGreaterThan(0);
    });

    await test.step('Filter by Men > Jeans category', async () => {
      await productSteps.selectCategory(
        TestData.CATEGORIES.MEN_JEANS.category,
        TestData.CATEGORIES.MEN_JEANS.subcategory
      );
      await productSteps.verifyCategoryTitle(TestData.CATEGORIES.MEN_JEANS.expectedTitle);
      await productSteps.verifyProductCountGreaterThan(0);
    });

    await test.step('Verify and filter by Polo brand', async () => {
      await productsPage.verifyBrandsSidebarVisible();
      await productSteps.selectBrand(TestData.BRANDS.POLO.name);
      await productSteps.verifyCategoryTitle(TestData.BRANDS.POLO.expectedTitle);
      await productSteps.verifyProductCountGreaterThan(0);
    });

    await test.step('Filter by H&M brand', async () => {
      await productSteps.selectBrand(TestData.BRANDS.H_AND_M.name);
      await productSteps.verifyCategoryTitle(TestData.BRANDS.H_AND_M.expectedTitle);
      await productSteps.verifyProductCountGreaterThan(0);
    });
  });
});
