import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountDeletedPage extends BasePage {
    readonly accountDeletedHeading: Locator = this.page
        .getByRole("heading", { name: /account deleted/i })
        .describe("Account deleted heading");
    readonly continueButton: Locator = this.page
        .getByRole("link", { name: /continue/i })
        .describe("Continue button");

    constructor(page: Page) {
        super(
            page,
            page.getByRole("heading", { name: /account deleted/i }).describe("Account deleted heading")
        );
    }

    /**
     * Verify account deleted message is visible
     */
    async verifyAccountDeleted(): Promise<void> {
        await expect(
            this.accountDeletedHeading,
            "Account deleted heading should be visible"
        ).toBeVisible();
    }

    /**
     * Click continue button
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
