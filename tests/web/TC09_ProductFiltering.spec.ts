import { test } from '../../src/fixtures';

/**
 * TC09: Product Category and Brand Filtering
 * 
 * Validates product filtering by category and brand including filter switching
 * and results verification.
 */

test.describe('TC09: Product Category and Brand Filtering', () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseProductsSteps }) => {
        // Background: User is on Home page (sidebar also visible here)
        // or Navigate to Products page to be safe as sidebars are main feature there
        await automationExerciseLandingSteps.navigateToHomepage();
        // Check if sidebars are visible? Or just navigate to products where they definitely are.
        // Feature says "Product page is accessible".
        // Let's navigate to Products page to ensure robust interaction.
        await automationExerciseProductsSteps.navigateToProductsPage();
    });

    const categories = [
        { main: 'Women', sub: 'Dress', expected: 'Women - Dress Products' },
        { main: 'Men', sub: 'Jeans', expected: 'Men - Jeans Products' },
        // Kids Tops page title includes '& Shirts'
        { main: 'Kids', sub: 'Tops', expected: 'Kids - Tops & Shirts Products' }
    ];

    for (const data of categories) {
        test(`Filter by Category: ${data.main} > ${data.sub}`, async ({ automationExerciseProductsSteps }) => {
            await automationExerciseProductsSteps.filterByCategory(data.main, data.sub);
            await automationExerciseProductsSteps.verifyPageHeader(data.expected);
            await automationExerciseProductsSteps.verifyProductCountGreaterThan(0);
        });
    }

    const brands = [
        'Polo',
        'H&M',
        'Madame',
        'Mast & Harbour'
    ];

    for (const brand of brands) {
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
        await automationExerciseProductsSteps.filterByCategory('Women', 'Dress');
        await automationExerciseProductsSteps.verifyPageHeader('Women - Dress Products');

        // When user switches to Men > Jeans
        await automationExerciseProductsSteps.filterByCategory('Men', 'Jeans');

        // Then results should update
        await automationExerciseProductsSteps.verifyPageHeader('Men - Jeans Products');
        await automationExerciseProductsSteps.verifyProductCountGreaterThan(0);

        // We assume Products Page logic correctly clears previous filter. 
    });
});
