import { test } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';

test.describe('TC09: Product Category and Brand Filtering', () => {

  test('@meladze should verify product filtering by category and brand', { tag: '@meladze' }, async ({
    homePage,
    productsPage
  }) => {
    // Navigate to homepage
    await homePage.goto();

    // Verify category sidebar is visible
    await productsPage.verifyCategorySidebarVisible();

    // Filter by "Women" > "Dress"
    await productsPage.selectCategory(
      TestData.CATEGORIES.WOMEN_DRESS.category,
      TestData.CATEGORIES.WOMEN_DRESS.subcategory
    );
    await productsPage.verifyCategoryTitle(TestData.CATEGORIES.WOMEN_DRESS.expectedTitle);
    await productsPage.verifyProductCountGreaterThan(0);

    // Filter by "Men" > "Jeans"
    await productsPage.selectCategory(
      TestData.CATEGORIES.MEN_JEANS.category,
      TestData.CATEGORIES.MEN_JEANS.subcategory
    );
    await productsPage.verifyCategoryTitle(TestData.CATEGORIES.MEN_JEANS.expectedTitle);
    await productsPage.verifyProductCountGreaterThan(0);

    // Verify brands sidebar is visible
    await productsPage.verifyBrandsSidebarVisible();

    // Click on "Polo" brand
    await productsPage.selectBrand(TestData.BRANDS.POLO.name);
    await productsPage.verifyCategoryTitle(TestData.BRANDS.POLO.expectedTitle);
    await productsPage.verifyProductCountGreaterThan(0);

    // Click on "H&M" brand
    await productsPage.selectBrand(TestData.BRANDS.H_AND_M.name);
    await productsPage.verifyCategoryTitle(TestData.BRANDS.H_AND_M.expectedTitle);
    await productsPage.verifyProductCountGreaterThan(0);
  });
});
