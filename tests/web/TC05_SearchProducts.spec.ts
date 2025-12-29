import { test } from '../../src/fixtures';

/**
 * TC05: Product Search Functionality
 * 
 * Validates product search including valid searches, case-insensitive matching,
 * navigation to product details, and empty search results handling.
 */

test.describe('Product Search Functionality', { tag: '@search @web' }, () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseNavigationSteps }) => {
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseLandingSteps.verifyPageOpened();
        await automationExerciseNavigationSteps.clickProducts();
    });

    const searchTerms = [
        { term: 'Jeans', description: 'Standard search' },
        { term: 'T-Shirt', description: 'Standard search with punctuation' },
        { term: 'tshirt', description: 'Case insensitive/punctuation check' },
        { term: 'Winter Top', description: 'Specific keyword' },
    ];

    for (const { term, description } of searchTerms) {
        test(`Search for valid products: ${term} (${description})`, async ({ automationExerciseProductsSteps }) => {
            await automationExerciseProductsSteps.verifyProductsPageVisible();
            await automationExerciseProductsSteps.searchForProduct(term);
            await automationExerciseProductsSteps.verifySearchedProductsHeader();
            await automationExerciseProductsSteps.verifySearchResultsContain(term);
        });
    }

    test('Navigate to product details from search results', async ({ automationExerciseProductsSteps, automationExerciseProductDetailSteps }) => {
        const term = 'Jeans'; // Changed from 'Dress' to 'Jeans' for stability

        await automationExerciseProductsSteps.verifyProductsPageVisible();
        await automationExerciseProductsSteps.searchForProduct(term);
        await automationExerciseProductsSteps.verifySearchedProductsHeader();

        await automationExerciseProductsSteps.verifySearchResultsContain(term);
        await automationExerciseProductsSteps.viewFirstProductDetails();
        await automationExerciseProductDetailSteps.verifyProductDetailVisible();
    });

    test('Search for non-existent product', async ({ automationExerciseProductsSteps }) => {
        const term = 'XYZ123NOTFOUND';

        await automationExerciseProductsSteps.verifyProductsPageVisible();
        await automationExerciseProductsSteps.searchForProduct(term);
        await automationExerciseProductsSteps.verifySearchedProductsHeader();
        await automationExerciseProductsSteps.verifyNoProductsDisplayed();
    });
});
