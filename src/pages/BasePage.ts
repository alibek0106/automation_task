import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string) {
        await this.page.goto(path);
    }

    async reload() {
        await this.page.reload();
    }

    getUrl(): string {
        return this.page.url();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async waitForUrl(url: string | RegExp) {
        await this.page.waitForURL(url);
    }
}