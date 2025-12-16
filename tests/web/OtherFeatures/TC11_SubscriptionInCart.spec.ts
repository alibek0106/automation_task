import { test, expect } from "../../../src/fixtures";

test.describe("TC11: Verify Subscription in Cart page", () => {
    test("should allow subscription from cart page footer", async ({
        homePage,
        cartPage,
    }) => {
        const testEmail = `subscriber${Date.now()}@example.com`;

        // Step 1-3: Navigate to home and verify
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4: Click Cart button
        await test.step("Navigate to cart page", async () => {
            await homePage.navigation.clickCart();
            // Don't verify page opened - cart might be empty
        });

        // Step 5: Scroll down to footer
        await test.step("Scroll to footer", async () => {
            await cartPage.scrollToBottom();
        });

        // Step 6: Verify 'SUBSCRIPTION' text
        await test.step("Verify SUBSCRIPTION text is visible", async () => {
            await cartPage.verifySubscriptionVisible();
        });

        // Step 7: Enter email and click arrow button
        await test.step("Subscribe with email", async () => {
            await cartPage.subscribeWithEmail(testEmail);
        });

        // Step 8: Verify success message
        await test.step("Verify subscription success message", async () => {
            await cartPage.verifySubscriptionSuccess();
        });
    });
});
