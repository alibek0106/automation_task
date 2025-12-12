# Test Data Example

## Environment & Credentials

```typescript
import { getEnvironment, getAutomationExerciseEmail, getAutomationExercisePassword } from '../../utils/Config';

// Get URLs from environment JSON
const env = getEnvironment();
console.log(env.baseUrl);

// Get credentials from .env
const email = getAutomationExerciseEmail();
const password = getAutomationExercisePassword();
```

---

## Random Data Generation

```typescript
import { testDataGenerator } from '../../utils/TestDataGenerator';

// Account data
const username = testDataGenerator.randomUsername();
const password = testDataGenerator.randomPassword(12);
const email = testDataGenerator.randomEmail();

// Contact data
const phone = testDataGenerator.randomMobileNumber();
const name = testDataGenerator.randomFullName();
```

---

## Complete Test Example

```typescript
import { test } from '../fixtures';
import { getAutomationExerciseEmail, getAutomationExercisePassword } from '../../utils/Config';
import { testDataGenerator } from '../../utils/TestDataGenerator';

test.describe('Automation Exercise Tests', () => {
    test('Register User', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseSignupSteps
    }) => {
        // Random data for account creation
        const name = testDataGenerator.randomFullName();
        const email = testDataGenerator.randomEmail();

        await automationExerciseLandingSteps.verifyPageOpened();
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseSignupSteps.signup(name, email);
    });

    test('Login with existing account', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps
    }) => {
        // Credentials from .env
        const email = getAutomationExerciseEmail();
        const password = getAutomationExercisePassword();

        await automationExerciseLandingSteps.verifyPageOpened();
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.login(email, password);
    });
});
```

---

## Setup

### Local (.env file)
```
ENV=dev
AUTOMATION_EXERCISE_EMAIL=user@example.com
AUTOMATION_EXERCISE_PASSWORD=password123
```

### CI (environment variables)
```yaml
env:
  ENV: prod
  AUTOMATION_EXERCISE_EMAIL: ${{ secrets.AUTOMATION_EXERCISE_EMAIL }}
  AUTOMATION_EXERCISE_PASSWORD: ${{ secrets.AUTOMATION_EXERCISE_PASSWORD }}
```

---

## See Also

- [patterns/test-data-management.md](../patterns/test-data-management.md) - Full pattern guide.