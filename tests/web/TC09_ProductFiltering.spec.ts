import { test } from '../../src/fixtures';
import { PRODUCT_FILTER_DATA } from '../../src/utils/Constants';

/**
 * TC09: Product Category and Brand Filtering
 * 
 * Validates product filtering by category and brand including filter switching
 * and results verification.
 */

test.describe('TC09: Product Category and Brand Filtering', { tag: '@filter @web' }, () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseProductsSteps }) => {
        // Background: User is on Home page (sidebar also visible here)
        // or Navigate to Products page to be safe as sidebars are main feature there
        await automationExerciseLandingSteps.navigateToHomepage();
        // Check if sidebars are visible? Or just navigate to products where they definitely are.
        // Feature says "Product page is accessible".
        // Let's navigate to Products page to ensure robust interaction.
        await automationExerciseProductsSteps.navigateToProductsPage();
    });

    for (const data of PRODUCT_FILTER_DATA.CATEGORIES) {
        test(`Filter by Category: ${data.main} > ${data.sub}`, async ({ automationExerciseProductsSteps }) => {
            await automationExerciseProductsSteps.filterByCategory(data.main, data.sub);
            await automationExerciseProductsSteps.verifyPageHeader(data.expected);
            await automationExerciseProductsSteps.verifyProductCountGreaterThan(0);
        });
    }

    for (const brand of PRODUCT_FILTER_DATA.BRANDS) {
        test(`Filter by Brand: ${brand}`, async ({ automationExerciseProductsSteps }) => {
            await automationExerciseProductsSteps.filterByBrand(brand);
            // Title usually "Brand - BrandName Products"
            await automationExerciseProductsSteps.verifyPageHeader(`Brand - ${brand} Products`);
            await automationExerciseProductsSteps.verifyProductCountGreaterThan(0);
        });
    }

    test('Scenario: Verify switching between filters updates results correctly', async ({
        automationExerciseProductsSteps
    }) => {
        // Given user has filtered by Women > Dress
        const womanCategory = PRODUCT_FILTER_DATA.CATEGORIES[0];
        await automationExerciseProductsSteps.filterByCategory(womanCategory.main, womanCategory.sub);
        await automationExerciseProductsSteps.verifyPageHeader(womanCategory.expected);

        // When user switches to Men > Jeans
        const menCategory = PRODUCT_FILTER_DATA.CATEGORIES[1];
        await automationExerciseProductsSteps.filterByCategory(menCategory.main, menCategory.sub);

        // Then results should update
        await automationExerciseProductsSteps.verifyPageHeader(menCategory.expected);
        await automationExerciseProductsSteps.verifyProductCountGreaterThan(0);

        // We assume Products Page logic correctly clears previous filter. 
    });
});
