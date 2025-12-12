import { test, expect } from "../../../src/fixtures";
import { DataFactory } from "../../../src/utils/DataFactory";

test.describe("TC21: Add review on product", () => {
    test("should allow user to write and submit product review", async ({
        page,
        productsPage,
        productDetailPage,
    }) => {
        const userData = DataFactory.generateUser();
        const reviewText = "This is an excellent product! Highly recommended for quality and value.";

        // Step 1-2: Navigate to home
        await test.step("Navigate to home page", async () => {
            await page.goto("/");
        });

        // Step 3-4: Click Products and verify page
        await test.step("Navigate to products page", async () => {
            await page.getByRole('link', { name: 'Products' }).click();
            await productsPage.verifyPageOpened();
        });

        // Step 5: Click View Product
        await test.step("View product detail", async () => {
            await productsPage.clickViewProduct(0);
            await productDetailPage.verifyProductDetailVisible();
        });

        // Step 6: Verify 'Write Your Review' is visible
        await test.step("Verify review section visible", async () => {
            await productDetailPage.verifyReviewSectionVisible();
        });

        // Step 7-8: Enter review details and submit
        await test.step("Submit product review", async () => {
            await productDetailPage.submitReview(
                userData.firstName,
                userData.email,
                reviewText
            );
        });

        // Step 9: Verify success message
        await test.step("Verify review success message", async () => {
            await productDetailPage.verifyReviewSuccess();
        });
    });
});
