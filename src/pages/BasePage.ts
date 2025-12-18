import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly name: string;

    constructor(page: Page, name: string) {
        this.page = page;
        this.name = name;
    }
}
