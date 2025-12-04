import { Page } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Get current page URL
     */
    getUrl(): string {
        return this.page.url();
    }
}
