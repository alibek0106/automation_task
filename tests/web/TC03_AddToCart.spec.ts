import { isolatedTest as test, expect } from "../../src/fixtures";
import { PRODUCT_NAMES } from "../../src/constants/ProductData";
import { Routes } from "../../src/constants/Routes";

test.describe(
  "TC03: Add Multiple Products by Name",
  { tag: "@Abdykarimov" },
  () => {
    test("should verify quantities, prices, and totals", async ({
      cartSteps,
      cartPage,
      page,
    }) => {
      // 1. Arrange
      const product1 = PRODUCT_NAMES[0];
      const product2 = PRODUCT_NAMES[1];

      // 2. Act
      await test.step("Add products to cart", async () => {
        await cartSteps.openAndAddProductWithQuantity(product1, 3);
        await cartSteps.openAndAddProductToCart(product2);
      });

      // 3. Assert
      await test.step("Verify Navigation to Cart", async () => {
        await expect(page, "Page should have expected URL").toHaveURL(
          Routes.WEB.VIEW_CART,
        );
      });

      await cartSteps.verifyCartItemDetails(product1, 3);
      await cartSteps.verifyCartItemDetails(product2, 1);

      await test.step("Verify Cart Total", async () => {
        const item1 = await cartSteps.getCartItemByName(product1);
        const item2 = await cartSteps.getCartItemByName(product2);
        const calculatedTotal = await cartSteps.getCalculatedTotal();

        expect(calculatedTotal, "Total matches sum of items").toBe(
          item1.total + item2.total,
        );
      });
    });
  },
);
