import { test } from '../../src/fixtures';

/**
 * TC13: Hybrid Filtering Validation
 * 
 * Validates that product filtering by Brand and Category in the UI matches API inventory data.
 * Ensures data consistency between backend (API) and frontend (UI) for filtering operations.
 */

test.describe('TC13: Hybrid Filtering Validation', { tag: '@filter @hybrid' }, () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseProductsSteps }) => {
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.verifyProductsPageVisible();
    });

    const brandsToTest = ['Polo', 'H&M', 'Madame'];

    for (const brand of brandsToTest) {
        test(`Scenario: Verify Brand Filter results match API Inventory - ${brand}`, async ({ productsApiSteps, automationExerciseProductsSteps }) => {
            const expectedProducts = await productsApiSteps.getProductsByBrand(brand);

            await automationExerciseProductsSteps.filterByBrand(brand);
            await automationExerciseProductsSteps.verifyPageHeader(`Brand - ${brand} Products`);

            if (expectedProducts.length > 0) {
                await automationExerciseProductsSteps.verifyProductCountMatchesApi(expectedProducts);
                await automationExerciseProductsSteps.verifyProductNamesMatchApi(expectedProducts);
            } else {
                await automationExerciseProductsSteps.verifyEmptySearchResults();
            }
        });
    }

    const categoriesToTest = [
        { main: 'Women', sub: 'Dress' },
        { main: 'Men', sub: 'Jeans' }
    ];

    for (const cat of categoriesToTest) {
        test(`Scenario: Verify Category Filter results match API Inventory - ${cat.main} > ${cat.sub}`, async ({ productsApiSteps, automationExerciseProductsSteps }) => {
            const expectedProducts = await productsApiSteps.getProductsByCategory(cat.main, cat.sub);

            await automationExerciseProductsSteps.filterByCategory(cat.main, cat.sub);
            await automationExerciseProductsSteps.verifyPageHeader(`${cat.main} - ${cat.sub} Products`);

            if (expectedProducts.length > 0) {
                await automationExerciseProductsSteps.verifyProductCountMatchesApi(expectedProducts);
                await automationExerciseProductsSteps.verifyProductNamesMatchApi(expectedProducts);
            } else {
                await automationExerciseProductsSteps.verifyEmptySearchResults();
            }
        });
    }
});
