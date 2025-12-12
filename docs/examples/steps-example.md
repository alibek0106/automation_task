# Steps Class Example

## TypeScript Implementation

### ✅ RECOMMENDED: Parameterized Methods with Composite Actions

Methods accept data as parameters and combine related actions.

```typescript
import { Page } from "@playwright/test";
import { AutomationExerciseLoginPage } from "../pages/AutomationExerciseLoginPage";
import { AutomationExerciseNavigationMenu } from "../pages/AutomationExerciseNavigationMenu";
import { step } from "../../utils/Decorators";

export class AutomationExerciseLoginSteps {
    readonly loginPage: AutomationExerciseLoginPage;
    readonly navigationMenu: AutomationExerciseNavigationMenu;

    constructor(page: Page) {
        this.loginPage = new AutomationExerciseLoginPage(page);
        this.navigationMenu = new AutomationExerciseNavigationMenu(page);
    }

    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
    }

    // ✅ Atomic: accepts credentials as parameters
    @step('Enter Email "{0}" and Password on the Login Page')
    async enterCredentials(email: string, password: string): Promise<void> {
        await this.loginPage.enterEmail(email);
        await this.loginPage.enterPassword(password);
    }

    @step('Click "Login" on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    // ✅ Composite: combines enterCredentials + clickLoginButton
    @step('Login to Automation Exercise with "{0}"')
    async login(email: string, password: string): Promise<void> {
        await this.enterCredentials(email, password);
        await this.clickLoginButton();
    }
}
```

### Usage in Tests

```typescript
import { test } from '../fixtures';
import { getAutomationExerciseEmail, getAutomationExercisePassword } from '../../utils/Config';

test.describe('Automation Exercise Login Tests', () => {
    test('Login with valid credentials', async ({ 
        automationExerciseNavigationSteps, 
        automationExerciseLoginSteps 
    }) => {
        // Get data at test level
        const email = getAutomationExerciseEmail();
        const password = getAutomationExercisePassword();
        
        // Use Steps methods
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.verifyPageOpened();
        await automationExerciseLoginSteps.login(email, password);
        await automationExerciseNavigationSteps.verifyUserLoggedIn("John Doe");
    });
});
```

## Fixture Registration

```typescript
// tests/fixtures.ts
import { test as base } from "@playwright/test";
import { AutomationExerciseLoginSteps } from "./steps/AutomationExerciseLoginSteps";

type StepsFixtures = {
    automationExerciseLoginSteps: AutomationExerciseLoginSteps;
};

export const test = base.extend<StepsFixtures>({
    automationExerciseLoginSteps: async ({ page }, use) => {
        await use(new AutomationExerciseLoginSteps(page));
    },
});
```

## Parameterized Methods Pattern

✅ **Versatile** - Same method works for valid/invalid/edge case data
✅ **Reusable** - No duplication for different data sets
✅ **Data-Driven** - Perfect for parameterized tests

## Anti-Pattern to Avoid

❌ **DON'T hardcode or read from secrets inside Steps:**

```typescript
// ❌ BAD: Hardcoded, inflexible
@step("Login")
async login(): Promise<void> {
    const email = process.env.EMAIL; // DON'T DO THIS
    const password = "hardcoded123";  // DON'T DO THIS
    
    await this.loginPage.enterEmail(email);
    await this.loginPage.enterPassword(password);
}
```