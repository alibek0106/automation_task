import { test, expect } from '../../src/fixtures';

test.describe('TC25: Verify Scroll Up using Arrow button and Scroll Down functionality', { tag: '@meladze' }, () => {
  test('should scroll down to verify SUBSCRIPTION and use arrow button to scroll up', async ({
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

    await test.step('Click on arrow at bottom right side to move upward', async () => {
      await expect(
        homePage.scrollUpArrowButton,
        'Scroll up arrow button should be visible at bottom right'
      ).toBeVisible();
      await homePage.clickScrollUpArrow();
    });

    await test.step('Verify that page is scrolled up and Full-Fledged text is visible', async () => {
      await expect(
        homePage.fullFledgedText,
        'Full-Fledged practice website for Automation Engineers text should be visible after clicking arrow button'
      ).toBeVisible();
    });
  });
});
