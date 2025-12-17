import { Page, Locator, expect } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
    readonly pageHeading: Locator = this.page
        .getByRole("heading", { name: /all products/i })
        .describe("All Products heading");
    readonly searchInput: Locator = this.page
        .locator("#search_product")
        .describe("Search product input");
    readonly searchButton: Locator = this.page
        .locator("#submit_search")
        .describe("Search submit button");
    readonly searchedProductsHeading: Locator = this.page
        .getByRole("heading", { name: /searched products/i })
        .describe("Searched Products heading");
    readonly productsList: Locator = this.page
        .locator(".features_items")
        .describe("Products list container");
    readonly productItems: Locator = this.productsList
        .locator(".col-sm-4")
        .describe("Individual product items");
    readonly categorySidebar: Locator = this.page
        .locator(".left-sidebar .panel-group")
        .describe("Category sidebar");
    readonly brandsSidebar: Locator = this.page
        .locator(".brands_products")
        .describe("Brands sidebar");
    readonly categoryTitleHeading = (expectedTitle: string): Locator =>
        this.page
            .getByRole("heading", { name: new RegExp(expectedTitle, "i") })
            .describe(`Category title heading: "${expectedTitle}"`);
    readonly brandTitleHeading = (brandName: string): Locator =>
        this.page
            .getByRole("heading", { name: new RegExp(`brand.*${brandName}`, "i") })
            .describe(`Brand title heading contains: "${brandName}"`);

    constructor(page: Page) {
        super(
            page,
            page.getByRole("heading", { name: /all products/i }).describe("All Products heading")
        );
    }

    async goto() {
        await super.goto(Routes.WEB.PRODUCTS);
    }

    /**
     * Search for products by keyword
     */
    async search(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
    }

    /**
     * Verify search results heading is visible
     */
    async verifySearchResultsVisible(): Promise<void> {
        await expect(
            this.searchedProductsHeading,
            "Searched products heading should be visible"
        ).toBeVisible();
    }

    /**
     * Get all visible product names from search/listing
     */
    async getProductNames(): Promise<string[]> {
        const names: string[] = [];
        const count = await this.productItems.count();

        for (let i = 0; i < count; i++) {
            const productName = await this.productItems
                .nth(i)
                .locator(".productinfo p")
                .textContent();
            if (productName) {
                names.push(productName.trim());
            }
        }

        return names;
    }

    /**
     * Get product count
     */
    async getProductCount(): Promise<number> {
        return this.productItems.count();
    }

    /**
     * Click on "View Product" for a specific product by index
     */
    async clickViewProduct(index: number): Promise<void> {
        const link = this.productItems
            .nth(index)
            .getByRole("link", { name: /view product/i });

        await Promise.all([
            this.page.waitForURL(/\/product_details\//),
            link.click(),
        ]);
    }

    /**
     * Add product to cart directly from listing (hover + click)
     */
    async addProductToCart(index: number): Promise<void> {
        const product = this.productItems.nth(index);
        await product.hover();
        await product.locator(".add-to-cart").first().click();

        // Wait for "Added!" modal to appear so follow-up actions (continue/view cart) are stable.
        await this.page.locator(".modal-content").waitFor({ state: "visible" });
    }

    /**
     * Click Continue Shopping button from modal
     */
    async clickContinueShopping(): Promise<void> {
        const modal = this.page.locator(".modal-content");
        await modal.waitFor({ state: "visible" });
        await modal.getByRole("button", { name: /continue shopping/i }).click();
    }

    /**
     * Click View Cart button from modal
     */
    async clickViewCart(): Promise<void> {
        const modal = this.page.locator(".modal-content");
        await modal.waitFor({ state: "visible" });
        await modal.getByRole("link", { name: /view cart/i }).click();
    }

    /**
     * Select a category from sidebar
     * @param mainCategory - e.g., "Women", "Men", "Kids"
     * @param subCategory - e.g., "Dress", "Tops", "Jeans"
     */
    async selectCategory(mainCategory: string, subCategory: string): Promise<void> {
        // Click main category to expand if needed - use first() to avoid strict mode
        const mainCategoryLink = this.categorySidebar
            .getByRole("link")
            .filter({ hasText: new RegExp(`^\\s*${mainCategory}\\s*$`) })
            .first();
        await mainCategoryLink.click();

        // Click subcategory
        // Scope to the left sidebar category links to avoid strict-mode collisions with ads/popups.
        const subCategoryLink = this.categorySidebar
            .locator("a[href*='category_products']")
            .filter({ hasText: new RegExp(subCategory, "i") })
            .first();
        await subCategoryLink.click();
    }

    /**
     * Select a brand from sidebar
     */
    async selectBrand(brandName: string): Promise<void> {
        await this.brandsSidebar
            .getByRole("link", { name: new RegExp(brandName, "i") })
            .click();
    }

    /**
     * Verify category title is displayed
     */
    async verifyCategoryTitleVisible(expectedTitle: string): Promise<void> {
        await expect(this.categoryTitleHeading(expectedTitle)).toBeVisible();
    }

    async verifyBrandTitleVisible(brandName: string): Promise<void> {
        await expect(this.brandTitleHeading(brandName)).toBeVisible();
    }

    /**
     * Get product price by index
     */
    async getProductPrice(index: number): Promise<string> {
        const priceText = await this.productItems
            .nth(index)
            .locator(".productinfo h2")
            .textContent();
        return priceText?.trim() || "";
    }

}
