# Step Definitions Pattern

The layer where Gherkin steps are mapped to Playwright code.

---

## Responsibility

- Receive Gherkin step inputs (strings, data tables)
- Map inputs to Page Object actions
- Assert expected outcomes
- **Do NOT** contain locator definitions (keep in Page Objects)

## Dependency Injection

Step classes receive Page Objects via constructor injection, ensuring the "Single Page Object Instance" rule (DRY).

```typescript
// tests/steps/AutomationExerciseLoginSteps.ts

export class AutomationExerciseLoginSteps {
    // Receive Page Object in constructor
    constructor(
        readonly loginPage: AutomationExerciseLoginPage
    ) {}

    @step('Login with valid credentials')
    async loginValid(): Promise<void> {
        const email = getAutomationExerciseEmail();
        const password = getAutomationExercisePassword();
        await this.login(email, password);
    }

    @step('Login with "{0}"')
    async login(email: string, password: string): Promise<void> {
        await this.loginPage.enterLoginEmail(email);
        await this.loginPage.enterLoginPassword(password);
        await this.loginPage.clickLogin();
    }
}
```

## Structure

```typescript
import { AutomationExerciseLoginPage } from '../pages/AutomationExerciseLoginPage';
import { step } from '../../utils/Decorators';

export class AutomationExerciseLoginSteps {
    // 1. Dependency Injection
    constructor(readonly loginPage: AutomationExerciseLoginPage) {}

    // 2. Step implementation with @step decorator
    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
    }
    
    // 3. Complex logic using atomic PO methods
    @step('Login to Automation Exercise with "{0}"')
    async login(email: string, password: string): Promise<void> {
        await this.loginPage.enterLoginEmail(email);
        await this.loginPage.enterLoginPassword(password);
        await this.loginPage.clickLogin();
    }
}
```

## Registration in Fixtures

Steps are registered in `steps.fixture.ts` and receive their dependencies from `api.fixture.ts` (which extends `pages.fixture.ts`).

```typescript
// fixtures/steps.fixture.ts
export const test = apiTest.extend<StepsFixtures>({
    automationExerciseLoginSteps: async ({ automationExerciseLoginPage }, use) => {
        // Steps instance created with injected Page Object
        await use(new AutomationExerciseLoginSteps(automationExerciseLoginPage));
    },
});
```

---

## Rules

| Rule | Reason |
|------|--------|
| ✅ Receive PO via constructor | DRY: Single instance per test |
| ✅ Use `@step` decorator | Clear reporting in HTML report |
| ✅ Use parameters | Reusability (e.g., `enterCredentials(user, pass)`) |
| ❌ No locators in Steps | Maintainability (keep in PO) |
| ❌ No `new PageObject()` | Violation of DI pattern |

---

## Usage in Tests

```typescript
// tests/specs/login.spec.ts
import { test } from '../fixtures/index';

test('Login flow', async ({ automationExerciseLoginSteps }) => {
    // Use the Steps instance directly
    await automationExerciseLoginSteps.verifyPageOpened();
});
```