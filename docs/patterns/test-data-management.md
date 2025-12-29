# Test Data Management

## Configuration Utilities

The project uses two main utilities in `utils/`:

### `Config.ts` - Environment & Credentials

```typescript
import { getEnvironment, getAutomationExerciseEmail, getAutomationExercisePassword } from '../../utils/Config';

// Get environment config (from JSON files)
const env = getEnvironment();
console.log(env.baseUrl);  // https://automationexercise.com

// Get credentials (from .env or CI env vars)
const email = getAutomationExerciseEmail();
const password = getAutomationExercisePassword();
```

### `JsonLoader.ts` - JSON File Loading

```typescript
import { loadJson } from '../../utils/JsonLoader';

const data = loadJson('tests/data/products/dress_data');
console.log(data.price);
```

---

## Environment Setup

### Local Development

Create `.env` file in project root:
```
ENV=dev
AUTOMATION_EXERCISE_EMAIL=your_email@example.com
AUTOMATION_EXERCISE_PASSWORD=your_password
```

### CI/CD (GitHub Actions)

Set environment variables directly - no `.env` file needed:
```yaml
env:
  ENV: prod
  AUTOMATION_EXERCISE_EMAIL: ${{ secrets.AUTOMATION_EXERCISE_EMAIL }}
  AUTOMATION_EXERCISE_PASSWORD: ${{ secrets.AUTOMATION_EXERCISE_PASSWORD }}
```

---

## Environment JSON Files

**Location:** `tests/data/environment/`

### dev.json (automationexercise.com)
```json
{
    "environment": "dev",
    "baseUrl": "https://automationexercise.com",
    "apiBaseUrl": "https://automationexercise.com/api"
}
```

### prod.json (automationexercise.com)
```json
{
    "environment": "production",
    "baseUrl": "https://automationexercise.com",
    "apiBaseUrl": "https://automationexercise.com/api"
}
```

---

## Running Tests

```bash
# Default (dev)
npx playwright test

# Explicit environments
ENV=dev npx playwright test
ENV=prod npx playwright test
```

---

## Random Data: TestDataGenerator

**Location:** `utils/TestDataGenerator.ts`

```typescript
import { testDataGenerator } from '../../utils/TestDataGenerator';

const name = testDataGenerator.randomFullName();
const email = testDataGenerator.randomEmail();
const password = testDataGenerator.randomPassword(12);
```

---

## Best Practices

### ✅ DO
- Use `getEnvironment()` for URLs
- Use `getAutomationExerciseEmail()`/`getAutomationExercisePassword()` for credentials
- Use `testDataGenerator` for unique test data
- Pass data as parameters to Steps methods

### ❌ DON'T
- Hardcode URLs or credentials
- Read credentials inside Page Objects or Steps