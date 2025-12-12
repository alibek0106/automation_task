# Page Object Example

## Automation Exercise Example

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AutomationExerciseLoginPage extends BasePage {
    // Define elements as private readonly Locator properties
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        // Initialize BasePage with page, locator, and name
        super(page, page.locator(".login-form"), "LoginPage");

        // Initialize elements with locators and descriptions
        this.emailInput = page.locator("[data-qa='login-email']").describe("Login email input");
        this.passwordInput = page.locator("[data-qa='login-password']").describe("Login password input");
        this.loginButton = page.locator("[data-qa='login-button']").describe("Login button");
    }

    // Atomic Actions

    async enterEmail(email: string): Promise<void> {
        await this.elementToBeVisible(this.emailInput);
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.loginButton);
        await this.loginButton.click();
    }
}
```

## PopupPage Example

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentDonePopupPage extends BasePage {
    private readonly continueButton: Locator;

    constructor(page: Page) {
        // formLocator IS the popup container - no separate container needed
        super(page, page.locator("#success_message"), 'PaymentDonePopupPage');
        this.continueButton = page.locator('[data-qa="continue-button"]').describe('Continue button');
    }

    // ✅ Use inherited verifyPageOpened() for visibility - DON'T create verifyPopupVisible()

    async verifySuccessMessage(expectedText: string): Promise<void> {
        await this.elementToContainText(this.formLocator, expectedText);
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
```

## Key Points

1. **Extend BasePage** - All Page Objects inherit from BasePage
2. **Private locators** - Use `private readonly` for encapsulation  
3. **`.describe()`** - Always add descriptions for debugging
4. **BasePage methods** - Use `elementToBeVisible()`, `elementToHaveText()`, etc.
5. **Playwright API** - Use `.fill()`, `.click()` directly on locators
6. **formLocator as container** - Use `formLocator` for container checks, don't duplicate
7. **NEVER duplicate BasePage methods** - Use inherited `verifyPageOpened()`, don't create `verifyPopupVisible()`
8. **PopupPage pattern** - Create separate `*PopupPage` classes for popups.