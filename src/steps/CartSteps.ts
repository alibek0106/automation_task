import { expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";
import { Locator } from "@playwright/test";
import { PRODUCT_NAMES } from "../constants/ProductData";

export class CartSteps {
  constructor(
    private productsPage: ProductsPage,
    private detailsPage: ProductDetailsPage,
    private cartPage: CartPage,
  ) { }

  private async extractCartItemData(row: Locator) {
    const name = await this.cartPage.rowNameLink(row).innerText();
    const priceText = await this.cartPage.rowPrice(row).innerText();
    const quantityText = await this.cartPage.rowQuantity(row).innerText();
    const totalText = await this.cartPage.rowTotal(row).innerText();
    const rowId = await row.getAttribute("id");
    const cleanPrice = (val: string) => parseInt(val.replace(/\D/g, ""), 10);

    return {
      id: rowId || "unknown",
      name: name.trim(),
      price: cleanPrice(priceText),
      quantity: parseInt(quantityText, 10),
      total: cleanPrice(totalText),
    };
  }

  async getCartItemByName(productName: string) {
    const row = this.cartPage.getProductRow(productName);
    return this.extractCartItemData(row);
  }

  async getCartItemByIndex(index: number) {
    const row = this.cartPage.getRowByIndex(index);
    return this.extractCartItemData(row);
  }

  async getCartCount(): Promise<number> {
    if (await this.cartPage.emptyCartMessage.isVisible()) {
      return 0;
    }
    return this.cartPage.getAllRows().count();
  }

  async getCalculatedTotal(): Promise<number> {
    const count = await this.getCartCount();
    let total = 0;
    for (let i = 0; i < count; i++) {
      const item = await this.getCartItemByIndex(i);
      total += item.total;
    }
    return total;
  }

  async getProductQuantity(productName: string): Promise<number> {
    const row = this.cartPage.getProductRow(productName);
    const quantityText = await this.cartPage.rowQuantity(row).innerText();
    return parseInt(quantityText, 10);
  }

  async getProductTotal(productName: string): Promise<number> {
    const row = this.cartPage.getProductRow(productName);
    const totalText = await this.cartPage.rowTotal(row).innerText();
    return parseInt(totalText.replace(/\D/g, ""), 10);
  }

  /**
   * Verifies cart item details (name, quantity, total calculation).
   * Use this to avoid repetitive verification code in tests.
   */
  async verifyCartItemDetails(productName: string, expectedQuantity: number) {
    const item = await this.getCartItemByName(productName);
    expect(item.name, "Item name should match").toBe(productName);
    expect(item.quantity, "Item quantity should match").toBe(
      expectedQuantity,
    );
    expect(item.total, "Item total should match").toBe(
      item.price * expectedQuantity,
    );
  }

  /**
   * Adds a specific product by name with custom quantity.
   * Assumes you are already on the products page.
   * Does NOT navigate - use openAndAddProductWithQuantity() if you need navigation.
   */
  async addProductWithQuantity(productName: string, quantity: number) {
    await this.productsPage.viewProductByName(productName);

    // Verify we landed on the right page
    await expect(
      this.detailsPage.productName,
      "Product name does not match",
    ).toHaveText(productName);

    await this.detailsPage.setQuantity(quantity);
    await this.detailsPage.addToCart();

    await expect(
      this.detailsPage.continueShoppingBtn,
      "Continue shopping button is not visible",
    ).toBeVisible();
    await this.detailsPage.clickContinueShopping();
  }

  /**
   * Navigates to products page and adds a specific product by name with custom quantity.
   * Use this when you need to open the products page and add a product in one step.
   * If already on products page, use addProductWithQuantity() instead.
   */
  async openAndAddProductWithQuantity(productName: string, quantity: number) {
    await this.productsPage.goto();
    await this.addProductWithQuantity(productName, quantity);
  }

  /**
   * Adds a specific product by name and navigates to cart.
   * Assumes you are already on the products page.
   * Does NOT navigate to products - use openAndAddProductToCart() if you need navigation.
   */
  async addProductAndGoToCart(productName: string) {
    await this.productsPage.viewProductByName(productName);

    await this.detailsPage.addToCart();
    await expect(
      this.detailsPage.viewCartModalLink,
      "View cart modal link is not visible",
    ).toBeVisible();
    await this.detailsPage.clickViewCartFromModal();
  }

  /**
   * Navigates to products page, adds a specific product by name, and goes to cart.
   * Use this when you need to open the products page, add a product, and view cart in one step.
   * If already on products page, use addProductAndGoToCart() instead.
   */
  async openAndAddProductToCart(productName: string) {
    await this.productsPage.goto();
    await this.addProductAndGoToCart(productName);
  }

  /**
   * Adds the first N products defined in our Data File.
   * Navigates to products page once, then adds multiple products.
   */
  async populateCart(count: number): Promise<string[]> {
    const productsToAdd = PRODUCT_NAMES.slice(0, count);

    for (const name of productsToAdd) {
      await this.openAndAddProductWithQuantity(name, 1);
    }

    return productsToAdd;
  }
}
