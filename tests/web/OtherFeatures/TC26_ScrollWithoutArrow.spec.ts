import { test, expect } from "../../../src/fixtures";

test.describe("TC26: Verify Scroll Up without Arrow button and Scroll Down", () => {
    test("should scroll down, verify subscription, scroll up programmatically, verify hero text", async ({
        homePage,
    }) => {
        // Step 1: Navigate to home page
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Scroll down to bottom
        await test.step("Scroll down page to bottom", async () => {
            await homePage.scrollToBottom();
        });

        // Step 3: Verify 'SUBSCRIPTION' is visible
        await test.step("Verify 'SUBSCRIPTION' is visible", async () => {
            await homePage.verifySubscriptionVisible();
        });

        // Step 4: Scroll up to top (programmatically, not using arrow button)
        await test.step("Scroll up page to top", async () => {
            await homePage.scrollToTop();
            // Wait for hero text to be in viewport (scroll complete)
            await expect(
                homePage.fullFledgedText,
                "Hero text should be in viewport after scrolling to top"
            ).toBeInViewport();
        });

        // Step 5: Verify page scrolled up and hero text is visible
        await test.step("Verify page scrolled up and hero text is visible", async () => {
            await homePage.verifyFullFledgedTextVisible();

            // Verify we're actually at the top by checking if hero text is in viewport
            const isInViewport = await homePage.isElementInViewport(homePage.fullFledgedText);
            expect(isInViewport, "Hero text should be in viewport after scrolling up").toBe(true);
        });
    });
});
