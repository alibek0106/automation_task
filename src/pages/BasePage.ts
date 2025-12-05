import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
    readonly page: Page;
    readonly subscriptionHeading: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionSubmitBtn: Locator;
    readonly subscriptionSuccessMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription', level: 2 }).describe('Subscribtion heading');
        this.subscriptionEmailInput = page.getByPlaceholder('Your email address').describe('Email Input Field');
        this.subscriptionSubmitBtn = page.locator('#subscribe').describe('Subscribe button');
        this.subscriptionSuccessMsg = page.getByText('You have been successfully subscribed!').describe('Subscription success message');
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

    /**
     * Navigate back in history
     */
    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    /**
     * Wait for the page to load completely
     */
    async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
        await this.page.waitForLoadState(state);
    }

    async performSubscription(email: string) {
        await this.subscriptionHeading.scrollIntoViewIfNeeded();
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionSubmitBtn.click();
    }
}
