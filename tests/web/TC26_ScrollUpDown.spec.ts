import { test, expect } from '../../src/fixtures';

test.describe('TC26: Verify Scroll Up without Arrow button and Scroll Down functionality', { tag: '@meladze' }, () => {
  test('should scroll down to verify SUBSCRIPTION and scroll up to verify Full-Fledged text', async ({
    homePage,
  }) => {
    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify that home page is visible successfully', async () => {
      await expect(
        homePage.page,
        'Homepage should be loaded successfully with correct title'
      ).toHaveTitle(/Automation Exercise/);
    });

    await test.step('Scroll down page to bottom', async () => {
      await homePage.scrollToBottom();
    });

    await test.step('Verify SUBSCRIPTION is visible', async () => {
      await expect(
        homePage.subscriptionText,
        'SUBSCRIPTION text should be visible after scrolling to bottom'
      ).toBeVisible();
    });

    await test.step('Scroll up page to top', async () => {
      await homePage.scrollToTop();
    });

    await test.step('Verify that page is scrolled up and Full-Fledged text is visible', async () => {
      await expect(
        homePage.fullFledgedText,
        'Full-Fledged practice website for Automation Engineers text should be visible after scrolling to top'
      ).toBeVisible();
    });
  });
});
