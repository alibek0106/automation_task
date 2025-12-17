import { test } from '../../src/fixtures/index';
import { Product } from '../../src/api/models/SearchProduct';

/**
 * TC05: Search Product with API Validation (Hybrid Test)
 * 
 * This hybrid test validates that the UI search functionality matches the API response exactly.
 * It ensures data consistency between the backend (API) and frontend (UI).
 * 
 * Tags: @functional @search @hybrid @api_ui_sync
 */

test.describe('Search Product with API Validation', () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseNavigationSteps, automationExerciseProductsSteps }) => {
        await test.step('Navigate to Products page', async () => {
            await automationExerciseLandingSteps.navigateToHomepage();
            await automationExerciseLandingSteps.verifyPageOpened();
            await automationExerciseNavigationSteps.clickProducts();
            await automationExerciseProductsSteps.verifyProductsPageVisible();
        });
    });

    const searchScenarios = [
        { searchTerm: 'Dress', description: 'Standard category item' },
        { searchTerm: 'Jeans', description: 'Standard category item' },
        { searchTerm: 'Top', description: 'Short keyword' },
    ];

    for (const { searchTerm, description } of searchScenarios) {
        test(`Verify UI search results match API for "${searchTerm}" (${description})`, async ({
            productsApiSteps,
            automationExerciseProductsSteps
        }) => {
            let apiProducts: Product[];

            await test.step(`Get API search results for "${searchTerm}"`, async () => {
                // --- API Step: Get the "Truth" ---
                apiProducts = await productsApiSteps.searchProductViaApi(searchTerm);
            });

            await test.step(`Perform UI search for "${searchTerm}"`, async () => {
                // --- UI Step: Perform the Action ---
                await automationExerciseProductsSteps.searchForProduct(searchTerm);
            });

            await test.step('Verify UI matches API response', async () => {
                // --- Verification: UI vs API Comparison ---
                await automationExerciseProductsSteps.verifySearchedProductsHeader();
                await automationExerciseProductsSteps.verifyProductCountMatchesApi(apiProducts);
                await automationExerciseProductsSteps.verifyProductNamesMatchApi(apiProducts);
                await automationExerciseProductsSteps.verifyProductPricesMatchApi(apiProducts);
            });

            await test.step('Verify product card structure', async () => {
                // --- Standard UI Structure Checks ---
                await automationExerciseProductsSteps.verifyAllProductCardsStructure();
            });
        });
    }

    test('Verify empty results handling via API and UI', async ({
        productsApiSteps,
        automationExerciseProductsSteps
    }) => {
        const searchTerm = 'XYZ123NOTFOUND';

        await test.step(`Verify API returns empty for "${searchTerm}"`, async () => {
            // --- API Step ---
            await productsApiSteps.verifyApiSearchReturnsEmptyOrNotFound(searchTerm);
        });

        await test.step(`Perform UI search for "${searchTerm}"`, async () => {
            // --- UI Step ---
            await automationExerciseProductsSteps.searchForProduct(searchTerm);
        });

        await test.step('Verify UI displays empty state', async () => {
            // --- Verification ---
            await automationExerciseProductsSteps.verifySearchedProductsHeader();
            await automationExerciseProductsSteps.verifyEmptySearchResults();
        });
    });
});
