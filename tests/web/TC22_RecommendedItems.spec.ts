import { test, expect } from '../../src/fixtures';

test.describe('TC22: Add to cart from Recommended items', { tag: '@meladze' }, () => {
  test('should add product from recommended items to cart', async ({
    homePage,
    cartPage,
  }) => {
    let productName: string;

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Scroll to bottom of page', async () => {
      await homePage.scrollToBottom();
    });

    await test.step('Verify RECOMMENDED ITEMS are visible', async () => {
      await expect(
        homePage.recommendedItemsHeading,
        'RECOMMENDED ITEMS heading should be visible at bottom of page'
      ).toBeVisible();
      // Note: Products in carousel may not be visible until scrolled into view
    });

    await test.step('Click on Add To Cart on Recommended product', async () => {
      // Get the product name before adding to cart for verification
      productName = await homePage.getRecommendedProductName(0);
      await expect(
        productName,
        'Product name should not be empty'
      ).toBeTruthy();
      
      await homePage.addRecommendedItemToCart(0);
    });

    await test.step('Click on View Cart button', async () => {
      await expect(
        homePage.viewCartModal,
        'Modal should appear after adding product to cart'
      ).toBeVisible();
      await homePage.clickViewCartFromModal();
    });

    await test.step('Verify that product is displayed in cart page', async () => {
      await expect(
        cartPage.page,
        'Should navigate to cart page'
      ).toHaveURL(/view_cart/);
      
      await expect(
        cartPage.cartTable,
        'Cart table should be visible'
      ).toBeVisible();
      
      // Verify the product we added is in the cart
      const productRow = cartPage.getProductRow(productName);
      await expect(
        productRow,
        `Product "${productName}" should be visible in cart`
      ).toBeVisible();
    });
  });
});
