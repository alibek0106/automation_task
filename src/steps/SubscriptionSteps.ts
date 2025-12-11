import { Page, Locator } from '@playwright/test';

/**
 * SubscriptionSteps - Reusable steps for subscription functionality
 * Can be composed into any page that has subscription features
 */
export class SubscriptionSteps {
    readonly page: Page;
    readonly subscriptionHeading: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionSubmitBtn: Locator;
    readonly subscriptionSuccessMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.subscriptionHeading = this.page.getByRole('heading', { name: 'Subscription', level: 2 }).describe('Subscription heading');
        this.subscriptionEmailInput = this.page.getByPlaceholder('Your email address').describe('Email Input Field');
        this.subscriptionSubmitBtn = this.page.locator('#subscribe').describe('Subscribe button');
        this.subscriptionSuccessMsg = this.page.getByText('You have been successfully subscribed!').describe('Subscription success message');
    }

    async performSubscription(email: string): Promise<void> {
        await this.subscriptionHeading.scrollIntoViewIfNeeded();
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionSubmitBtn.click();
    }
}
