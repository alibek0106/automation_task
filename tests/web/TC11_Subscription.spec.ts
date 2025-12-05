import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { Routes } from '../../src/constants/Routes';

test.describe('TC11: Verify Subscription in home page', { tag: '@Abdykarimov' }, () => {

    test('User subscription to the newsletter', async ({
        page,
        homePage
    }) => {
        const randomEmail = DataFactory.generateUser().email;

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
            await expect(page, 'Page should have correct title').toHaveTitle(Routes.WEB.HOME_TITLE);
        });

        await test.step('Scroll to Footer and Verify Heading', async () => {
            await homePage.subscriptionHeading.scrollIntoViewIfNeeded();
            await expect(homePage.subscriptionHeading, 'Subscription heading should be visible').toBeVisible();
            await expect(homePage.subscriptionHeading, 'Subscription heading should have correct text').toHaveText('Subscription');
        });

        await test.step(`Enter email: ${randomEmail}`, async () => {
            await homePage.performSubscription(randomEmail);
        });

        await test.step('Verify Success Message', async () => {
            await expect(homePage.subscriptionSuccessMsg, 'Subscription success message should be visible').toBeVisible();
            await expect(homePage.subscriptionSuccessMsg, 'Subscription success message should have correct text').toHaveText('You have been successfully subscribed!');
        });
    });
});