# Complete Test Example

This example demonstrates a full test implementation using:
1.  **Page Objects** (Atomic actions)
2.  **Steps Classes** (Business logic with composite methods)
3.  **Fixtures** (Dependency injection)
4.  **Playwright Test** (Execution)

## 1. Page Object (`tests/pages/AutomationExerciseSignupPage.ts`)

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AutomationExerciseSignupPage extends BasePage {
    private readonly nameInput: Locator;
    private readonly emailInput: Locator;
    private readonly signupButton: Locator;

    constructor(page: Page) {
        super(page, page.locator(".signup-form"), "Signup Page");
        this.nameInput = page.locator("[data-qa='signup-name']").describe("Signup name input");
        this.emailInput = page.locator("[data-qa='signup-email']").describe("Signup email input");
        this.signupButton = page.locator("[data-qa='signup-button']").describe("Signup button");
    }

    async enterName(name: string): Promise<void> {
        await this.elementToBeVisible(this.nameInput);
        await this.nameInput.fill(name);
    }

    async enterEmail(email: string): Promise<void> {
        await this.elementToBeVisible(this.emailInput);
        await this.emailInput.fill(email);
    }

    async clickSignup(): Promise<void> {
        await this.elementToBeVisible(this.signupButton);
        await this.signupButton.click();
    }
}
```

## 2. Steps Class (`tests/steps/AutomationExerciseSignupSteps.ts`)

```typescript
import { Page } from "@playwright/test";
import { AutomationExerciseSignupPage } from "../pages/AutomationExerciseSignupPage";
import { step } from "../../utils/Decorators";

export class AutomationExerciseSignupSteps {
    // ✅ Dependency Injection via Constructor
    constructor(
        private signupPage: AutomationExerciseSignupPage
    ) {}

    @step('Enter signup details Name: "{0}", Email: "{1}"')
    async enterSignupDetails(name: string, email: string): Promise<void> {
        await this.signupPage.enterName(name);
        await this.signupPage.enterEmail(email);
    }

    @step('Click "Signup"')
    async clickSignupButton(): Promise<void> {
        await this.signupPage.clickSignup();
    }

    // ✅ Composite method: combines related actions
    @step('Start signup process for "{0}"')
    async signup(name: string, email: string): Promise<void> {
        await this.enterSignupDetails(name, email);
        await this.clickSignupButton();
    }
}
```

## 3. Fixtures (`tests/fixtures/steps.fixture.ts`)

The framework separates Page Object creation from Steps creation.

```typescript
import { test as apiTest } from "./api.fixture";
import { AutomationExerciseSignupSteps } from "../steps/AutomationExerciseSignupSteps";

type StepsFixtures = {
    automationExerciseSignupSteps: AutomationExerciseSignupSteps;
};

// Extend apiTest (which extends pagesTest)
export const test = apiTest.extend<StepsFixtures>({
    // Inject existing Page Objects into Step Classes
    automationExerciseSignupSteps: async ({ automationExerciseSignupPage }, use) => {
        await use(new AutomationExerciseSignupSteps(automationExerciseSignupPage));
    },
});
```

## 4. Test Spec (`tests/specs/register-user.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { testDataGenerator } from '../../utils/TestDataGenerator';
// Import fixture that combines everything
import { test as base } from '../fixtures';

test.describe('User Registration', () => {
    // Test constants - no magic values!
    const ACCOUNT_CREATED_MSG = 'ACCOUNT CREATED!';

    test('Register User', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseSignupSteps
    }) => {
        // Generate random credentials
        const name = testDataGenerator.randomFullName();
        const email = testDataGenerator.randomEmail();

        // Step 1: Open landing page
        await automationExerciseLandingSteps.verifyPageOpened();

        // Step 2: Click Signup/Login
        await automationExerciseNavigationSteps.clickSignupLogin();

        // Step 3: Enter name and email and signup
        await automationExerciseSignupSteps.signup(name, email);

        // ... continue with account information form
    });
});
```

## Key Patterns Demonstrated

1. **Test constants** - No magic values, use named constants
2. **Composite methods** - Combine related actions (`signup`)
3. **`@step` decorator** - All Steps methods are decorated for reporting
4. **Random data** - Use `testDataGenerator` for unique test data
5. **Steps only in tests** - No direct Page Object calls in spec files.