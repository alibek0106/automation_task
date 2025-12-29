import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly name: string;

    constructor(page: Page, name: string) {
        this.page = page;
        this.name = name;
    }

    async verifyPageOpened(locator: Locator) {
        await expect(locator, `${this.name} should be opened`).toBeVisible();
    }
}
