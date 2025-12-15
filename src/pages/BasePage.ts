import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly name: string;

    constructor(page: Page, name: string) {
        this.page = page;
        this.name = name;
    }

    /**
     * Helper to define a locator with a description for logging/debugging.
     * Currently just returns the locator, but enables future enhancement.
     */
    protected resolveLocator(selector: string, description: string): Locator {
        // In a real framework, you might wrap this to log usage relative to 'this.name'
        return this.page.locator(selector);
    }
}
