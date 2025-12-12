import { test, expect } from "../../../src/fixtures";

test.describe("TC18: View Category Products", () => {
    test("should navigate through women and men categories and verify products", async ({
        homePage,
        productsPage,
    }) => {
        // Step 1-2: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 3: Verify categories visible on left sidebar
        await test.step("Verify categories are visible", async () => {
            await expect(
                homePage.page.locator(".left-sidebar .panel-group"),
                "Categories sidebar should be visible"
            ).toBeVisible();
        });

        // Step 4-5: Click Women category, then sub-category (Dress)
        await test.step("Navigate to Women > Dress category", async () => {
            await homePage.clickProducts();
            await productsPage.selectCategory("Women", "Dress");
        });

        // Step 6: Verify category page displayed with correct text
        await test.step("Verify Women - Dress products page", async () => {
            const heading = productsPage.page.locator(".title.text-center");
            await expect(heading).toContainText("Women");
            await expect(heading).toContainText("Dress");
        });

        // Step 7: Click Men sub-category (e.g., Jeans)
        await test.step("Navigate to Men > Jeans category", async () => {
            await productsPage.selectCategory("Men", "Jeans");
        });

        // Step 8: Verify navigated to Men category page
        await test.step("Verify Men - Jeans products page", async () => {
            const heading = productsPage.page.locator(".title.text-center");
            await expect(heading).toContainText("Men");
            await expect(heading).toContainText("Jeans");
        });
    });
});
