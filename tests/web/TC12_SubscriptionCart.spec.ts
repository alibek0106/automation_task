import { Routes } from '../../src/constants/Routes';
import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC12: Verify Subscription in Cart page', { tag: '@Abdykarimov' }, () => {

    test('User verifies subscription in cart page footer', async ({
        page,
        homePage,
        productsPage,
        cartPage
    }) => {
        // 1. Data Setup
        const randomEmail = DataFactory.generateUser().email;

        // 2. Launch browser & Navigate to url (Steps 1-2)
        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        // 3. Verify that home page is visible successfully (Step 3)
        await test.step('Verify Home Page', async () => {
            await expect(page, 'Page should have expected title').toHaveTitle(Routes.WEB.HOME_TITLE);
        });

        // 4. Click 'Cart' button (Step 4)
        await test.step('Navigate to Cart Page', async () => {
            await productsPage.navigateToCart();
            await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);
        });

        // 5. Scroll to footer & Verify text 'SUBSCRIPTION' (Steps 5-6)
        await test.step('Scroll to Footer and Verify Heading', async () => {
            await cartPage.subscriptionHeading.scrollIntoViewIfNeeded();

            await expect(cartPage.subscriptionHeading, 'Subscription heading should be visible').toBeVisible();
            await expect(cartPage.subscriptionHeading, 'Subscription heading should have expected text').toHaveText('Subscription');
        });

        // 6. Enter email address and click arrow button (Step 7)
        await test.step(`Enter email: ${randomEmail}`, async () => {
            // cartPage inherits this method from BasePage
            await cartPage.performSubscription(randomEmail);
        });

        // 7. Verify success message (Step 8)
        await test.step('Verify Success Message', async () => {
            await expect(cartPage.subscriptionSuccessMsg, 'Subscription success message should be visible').toBeVisible();
            await expect(cartPage.subscriptionSuccessMsg, 'Subscription success message should have expected text').toHaveText('You have been successfully subscribed!');
        });
    });
});