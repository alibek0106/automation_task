# AI Code Review Guidelines for Automation Testing

**Purpose:** Guidelines for AI agents conducting code reviews on Playwright/TypeScript/Zod automation testing solutions.

**Scope:** Test files, Page Objects, Steps, Fixtures, API clients, Zod models, and configuration files.

**Reference:** See [Guidelines.md](./Guidelines.md) for detailed coding standards and patterns.

---

## Table of Contents

1. [Review Process](#1-review-process)
2. [TypeScript Quality](#2-typescript-quality)
   - 2.5 [Relative Imports](#25-relative-imports)
   - 2.6 [Naming Conventions](#26-naming-conventions)
3. [Page Object Model Compliance](#3-page-object-model-compliance)
   - 3.5 [Actions vs Assertions Separation](#35-actions-vs-assertions-separation)
   - 3.6 [Page Object Size Limit](#36-page-object-size-limit)
4. [Locator Stability](#4-locator-stability)
5. [Test Structure and Quality](#5-test-structure-and-quality)
6. [Framework Encapsulation](#6-framework-encapsulation)
   - 6.2 [Step Layer for Business Logic](#62-step-layer-for-business-logic)
7. [Configuration and Constants](#7-configuration-and-constants)
8. [API and Schema Validation](#8-api-and-schema-validation)
9. [Parallel Execution Safety](#9-parallel-execution-safety)
10. [Assertion Best Practices](#10-assertion-best-practices)
    - 10.3 [Element-Based Assertions](#103-element-based-assertions)
11. [Severity Levels](#11-severity-levels)
12. [Common Anti-Patterns](#12-common-anti-patterns)
13. [Review Comment Templates](#13-review-comment-templates)

---

## 1. Review Process

### Pre-Review Checklist

Before providing feedback, verify:

- [ ] Code compiles without TypeScript errors
- [ ] No linter warnings present
- [ ] All imports are valid and used
- [ ] File is in the correct directory based on its purpose

### Review Priorities

1. **Correctness** - Does the code work as intended?
2. **Maintainability** - Can others understand and modify this code?
3. **Consistency** - Does it follow project patterns?
4. **Performance** - Are there obvious inefficiencies?

---

## 2. TypeScript Quality

### 2.1 Strict Typing Enforcement

**Rule:** Never use `any` type. Always define explicit types or interfaces.

```typescript
// ❌ BAD: Using 'any'
async function processData(data: any): Promise<any> {
    return data.value;
}

// ✅ GOOD: Explicit typing
interface ProcessedData {
    value: string;
    timestamp: Date;
}

async function processData(data: ProcessedData): Promise<string> {
    return data.value;
}
```

### 2.2 Zod Schema Consistency

**Rule:** Types must be derived from Zod schemas using `z.infer<>`.

```typescript
// ❌ BAD: Manually defined type separate from schema
const UserSchema = z.object({
    name: z.string(),
    email: z.email(),
});

interface User {
    name: string;
    email: string;
}

// ✅ GOOD: Type inferred from schema
const UserSchema = z.object({
    name: z.string(),
    email: z.email(),
});

type User = z.infer<typeof UserSchema>;
```

### 2.3 Readonly and Const Assertions

**Rule:** Use `readonly` for locators and immutable properties. Use `as const` for constant objects.

```typescript
// ❌ BAD: Mutable locator
export class LoginPage {
    submitBtn: Locator;  // Can be reassigned
}

// ✅ GOOD: Immutable locator
export class LoginPage {
    readonly submitBtn: Locator;  // Cannot be reassigned
}

// ✅ GOOD: Const assertion for routes
export const Routes = {
    HOME: '/',
    LOGIN: '/login',
} as const;
```

### 2.4 Review Checklist - TypeScript

- [ ] No `any` types present
- [ ] All function parameters have explicit types
- [ ] All function return types are declared
- [ ] Zod types use `z.infer<typeof Schema>`
- [ ] Locators declared as `readonly`
- [ ] Constants use `as const` assertion
- [ ] No unused imports or variables
- [ ] Generic types used appropriately

### 2.5 Relative Imports

**Rule:** Always use relative imports within the project. Avoid absolute or aliased imports.

```typescript
// ❌ BAD: Absolute/aliased imports
import { HomePage } from '@pages/HomePage';
import { Routes } from '@constants/Routes';
import { UserService } from 'src/api/UserService';

// ✅ GOOD: Relative imports
import { HomePage } from '../pages/HomePage';
import { Routes } from '../../src/constants/Routes';
import { UserService } from './UserService';
```

**Benefits:**
- Consistent import style across the project
- No path alias configuration required
- Clear visibility of file relationships
- Better IDE support for refactoring

**Import Order Convention:**
```typescript
// 1. External packages (node_modules)
import { test, expect } from '@playwright/test';
import { z } from 'zod';

// 2. Internal modules (relative imports)
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';
import { User } from '../models/UserModels';
```

### 2.6 Naming Conventions

**Rule:** Follow consistent naming conventions across all code.

| Element | Convention | Example |
|---------|------------|---------|
| Environment Variables | SCREAMING_SNAKE_CASE | `HOST`, `API_URL`, `AUTH_TOKEN` |
| Classes | PascalCase | `CartPage`, `UserService`, `DataFactory` |
| Methods | camelCase | `clickSubmitButton`, `getProductByName` |
| Locator Properties | camelCase | `submitButton`, `emailInput`, `cartTable` |
| Constants (primitive) | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| Constants (objects) | PascalCase | `Routes`, `TestData`, `StatusCode` |
| Interfaces/Types | PascalCase | `User`, `CartItem`, `ApiResponse` |
| Test files | PascalCase with prefix | `TC01_Register.spec.ts` |

#### Environment Variables

```typescript
// ❌ BAD: Inconsistent naming
process.env.baseUrl
process.env.Base_URL
process.env.base-url

// ✅ GOOD: SCREAMING_SNAKE_CASE
process.env.HOST
process.env.API_URL
process.env.AUTH_TOKEN
process.env.BASE_URL
```

#### Methods

```typescript
// ❌ BAD: Inconsistent method naming
async Click_Submit() { }
async click-submit() { }
async ClickSubmit() { }

// ✅ GOOD: camelCase for all methods
async clickSubmit() { }
async getProductByName(name: string) { }
async verifyLoggedInVisible() { }
async fillAccountDetails(user: User) { }
```

#### Locator Properties

```typescript
// ❌ BAD: Inconsistent locator naming
readonly SubmitButton: Locator;
readonly submit_button: Locator;
readonly SUBMIT_BTN: Locator;

// ✅ GOOD: camelCase for locators
readonly submitButton: Locator;
readonly emailInput: Locator;
readonly cartTable: Locator;
readonly proceedToCheckoutBtn: Locator;
```

### 2.7 Review Checklist - Imports and Naming

- [ ] All imports are relative (no `@` aliases or absolute paths)
- [ ] Import order: external packages first, then internal modules
- [ ] Environment variables use SCREAMING_SNAKE_CASE
- [ ] Methods use camelCase
- [ ] Classes use PascalCase
- [ ] Locator properties use camelCase
- [ ] Constants follow appropriate convention

---

## 3. Page Object Model Compliance

### 3.1 Base Page Extension

**Rule:** All page objects must extend `BasePage`.

```typescript
// ❌ BAD: Page object without base class
export class LoginPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
}

// ✅ GOOD: Extends BasePage
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    
    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByLabel('Username');
    }
}
```

### 3.2 Static vs Dynamic Locators

**Rule:** Static locators in constructor, dynamic locators via private getter methods.

```typescript
export class ProductsPage extends BasePage {
    // ✅ Static locators - initialized once in constructor
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByPlaceholder('Search Product');
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }
    
    // ✅ Dynamic locator - getter method for parameterized locators
    private getProductCard(productName: string): Locator {
        return this.page.locator('.product-card', {
            has: this.page.getByText(productName, { exact: true })
        });
    }
    
    // ❌ BAD: Recreating static locator in method
    async search(term: string) {
        const input = this.page.getByPlaceholder('Search Product'); // Wrong!
        await input.fill(term);
    }
}
```

### 3.3 Locator Composition

**Rule:** Extract shared parent locators to reduce duplication.

```typescript
// ❌ BAD: Repeated base locator
export class ModalDialog {
    readonly title = this.page.locator('.modal .modal-title');
    readonly body = this.page.locator('.modal .modal-body');
    readonly closeBtn = this.page.locator('.modal .close-button');
}

// ✅ GOOD: Composed from base container
export class ModalDialog extends BasePage {
    readonly container: Locator;
    readonly title: Locator;
    readonly body: Locator;
    readonly closeBtn: Locator;
    
    constructor(page: Page) {
        super(page);
        this.container = page.locator('.modal');
        this.title = this.container.locator('.modal-title');
        this.body = this.container.locator('.modal-body');
        this.closeBtn = this.container.getByRole('button', { name: 'Close' });
    }
}
```

### 3.4 Review Checklist - Page Objects

- [ ] Extends `BasePage`
- [ ] All locators declared as `readonly`
- [ ] Static locators initialized in constructor
- [ ] Dynamic locators use private getter methods
- [ ] Locators composed from shared parent where applicable
- [ ] Methods encapsulate related actions
- [ ] Uses `.describe()` for locator descriptions where helpful
- [ ] No business logic in page objects (only UI interactions)

### 3.5 Actions vs Assertions Separation

**Rule:** Page objects must clearly separate action methods from assertion/verification methods.

**Structure Pattern:**

```typescript
export class CartPage extends BasePage {
    // === LOCATORS ===
    readonly cartTable: Locator;
    readonly checkoutButton: Locator;
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.cartTable = page.getByRole('table');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.emptyCartMessage = page.getByText('Cart is empty');
    }

    // === DATA EXTRACTION METHODS ===
    async getCartCount(): Promise<number> {
        return await this.cartTable.getByRole('row').count();
    }

    async getProductByName(name: string): Promise<CartItem> {
        // Returns data object, no assertions
        const row = this.getProductRow(name);
        return await this.extractRowData(row);
    }

    async getTotalAmount(): Promise<number> {
        const text = await this.totalLabel.textContent();
        return parseInt(text?.replace(/\D/g, '') ?? '0', 10);
    }

    // === ACTION METHODS ===
    async addProduct(name: string): Promise<void> {
        await this.getAddButton(name).click();
    }

    async removeProduct(name: string): Promise<void> {
        await this.getRemoveButton(name).click();
    }

    async clickCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    // === VERIFICATION METHODS (prefix: verify/assert) ===
    async verifyProductInCart(name: string): Promise<void> {
        await expect(this.getProductRow(name)).toBeVisible();
    }

    async verifyCartEmpty(): Promise<void> {
        await expect(this.emptyCartMessage).toBeVisible();
    }

    async verifyCartCount(expected: number): Promise<void> {
        const count = await this.getCartCount();
        expect(count, `Expected ${expected} items in cart`).toBe(expected);
    }
}
```

**Method Naming Conventions:**

| Type | Prefix | Example |
|------|--------|---------|
| Actions | verb | `click...`, `fill...`, `select...`, `submit...` |
| Data Extraction | `get...` | `getProductByName`, `getCartCount`, `getTotalAmount` |
| Verification | `verify...` | `verifyLoggedIn`, `verifyCartEmpty`, `verifyProductVisible` |
| Navigation | `goto`, `navigateTo...` | `goto()`, `navigateToCheckout()` |

**Anti-Pattern:**

```typescript
// ❌ BAD: Mixed concerns, no clear separation
export class CartPage {
    async doStuff(name: string) {
        await this.page.click('.add');
        const count = await this.page.locator('.count').count();
        expect(count).toBe(1);  // Assertion mixed with action
        return count;
    }
}
```

### 3.6 Page Object Size Limit

**Rule:** Page objects must not exceed **500 lines**. Large page objects should be split.

**When to Split:**

| Indicator | Action |
|-----------|--------|
| File > 500 lines | Split required |
| File > 300 lines | Consider splitting |
| Multiple distinct UI sections | Extract components |
| Repeated patterns across pages | Create base component |

**Splitting Strategies:**

#### Strategy 1: Extract UI Components

```typescript
// BEFORE: Large ProductsPage with filters, grid, and pagination
// src/pages/ProductsPage.ts (600+ lines)

// AFTER: Split into components
// src/pages/ProductsPage.ts (~200 lines)
export class ProductsPage extends BasePage {
    readonly filters: ProductFilters;
    readonly grid: ProductGrid;
    readonly pagination: Pagination;

    constructor(page: Page) {
        super(page);
        this.filters = new ProductFilters(page.locator('.filters'));
        this.grid = new ProductGrid(page.locator('.product-grid'));
        this.pagination = new Pagination(page.locator('.pagination'));
    }
}

// src/components/ProductFilters.ts (~150 lines)
export class ProductFilters {
    constructor(private readonly container: Locator) {}
    
    async filterByCategory(category: string) { ... }
    async filterByBrand(brand: string) { ... }
}

// src/components/ProductGrid.ts (~150 lines)
export class ProductGrid {
    constructor(private readonly container: Locator) {}
    
    async getProductCard(name: string): Locator { ... }
    async addToCart(name: string) { ... }
}
```

#### Strategy 2: Split by Functionality

```typescript
// BEFORE: CheckoutPage with address, payment, review sections

// AFTER: Separate pages for each step
// src/pages/checkout/AddressPage.ts
// src/pages/checkout/PaymentPage.ts
// src/pages/checkout/ReviewPage.ts
```

#### Strategy 3: Extract Reusable Components

```typescript
// src/components/Modal.ts - Reusable across pages
export class Modal {
    constructor(private readonly container: Locator) {}

    readonly closeButton: Locator = this.container.getByRole('button', { name: 'Close' });
    readonly title: Locator = this.container.locator('.modal-title');

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async verifyVisible(): Promise<void> {
        await expect(this.container).toBeVisible();
    }
}

// Usage in page
export class ProductDetailsPage extends BasePage {
    readonly addedToCartModal: Modal;

    constructor(page: Page) {
        super(page);
        this.addedToCartModal = new Modal(page.locator('.modal-content'));
    }
}
```

**Directory Structure for Large Pages:**

```
src/
├── pages/
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── CartPage.ts
│   └── checkout/           # Split checkout into sub-pages
│       ├── AddressPage.ts
│       ├── PaymentPage.ts
│       └── ReviewPage.ts
├── components/             # Reusable UI components
│   ├── Modal.ts
│   ├── Pagination.ts
│   ├── DataTable.ts
│   └── ProductCard.ts
```

### 3.7 Review Checklist - Page Structure

- [ ] Page object does not exceed 500 lines
- [ ] Actions and assertions are clearly separated
- [ ] Verification methods prefixed with `verify...`
- [ ] Data extraction methods prefixed with `get...`
- [ ] Large pages split into logical components
- [ ] Reusable components extracted to `src/components/`
- [ ] No assertions inside action methods

---

## 4. Locator Stability

### 4.1 Locator Priority

Follow this priority order (most stable to least stable):

| Priority | Method | When to Use |
|----------|--------|-------------|
| 1 | `getByRole()` | Always preferred - semantic, accessible |
| 2 | `getByLabel()` | Form fields with labels |
| 3 | `getByTestId()` | Explicit test identifiers |
| 4 | `getByText()` | Static, visible text |
| 5 | `getByPlaceholder()` | Input placeholders |
| 6 | `locator('[attr]')` | Stable attributes only |
| 7 | XPath | **Avoid** - fragile, hard to maintain |

```typescript
// ✅ BEST: Role-based
page.getByRole('button', { name: 'Submit' })

// ✅ GOOD: Label association
page.getByLabel('Email address')

// ✅ GOOD: Test ID
page.getByTestId('submit-button')

// ⚠️ ACCEPTABLE: Stable attribute
page.locator('[name="email"]')

// ❌ BAD: Fragile XPath
page.locator('//form/div[2]/button[1]')
```

### 4.2 Forbidden Locator Patterns

Flag these patterns as **Critical** issues:

```typescript
// ❌ Index-based XPath
page.locator('//div[3]/span[2]/input')

// ❌ Long XPath chains
page.locator('//form/div/section/div/span/input')

// ❌ Dynamic IDs
page.locator('#element_12345')  // ID changes per session

// ❌ Generated class names
page.locator('.css-1a2b3c4d')  // CSS-in-JS generated

// ❌ Overly specific class combinations
page.locator('.btn.btn-primary.btn-lg.btn-submit.active')
```

### 4.3 Review Checklist - Locators

- [ ] Uses semantic locators (`getByRole`, `getByLabel`)
- [ ] No index-based XPath selectors
- [ ] No long XPath chains (> 3 levels)
- [ ] No dynamic or generated IDs
- [ ] Reusable patterns for similar elements
- [ ] Locator filters use `has` or `hasText` appropriately

---

## 5. Test Structure and Quality

### 5.1 AAA Pattern

**Rule:** Tests must follow Arrange-Act-Assert pattern with clear separation.

```typescript
test('should add product to cart', async ({ productsPage, cartPage }) => {
    // 1. Arrange - Setup preconditions
    const productName = 'Blue Top';
    await productsPage.goto();
    
    // 2. Act - Execute the action under test
    await productsPage.addProductToCart(productName);
    await productsPage.navigateToCart();
    
    // 3. Assert - Verify outcomes
    const cartItem = await cartPage.getProductByName(productName);
    expect(cartItem.quantity).toBe(1);
});
```

### 5.2 Test Steps

**Rule:** Use `test.step()` for logical grouping in complex tests.

```typescript
test('should complete purchase flow', async ({ page, homePage, cartPage }) => {
    await test.step('Add products to cart', async () => {
        await homePage.goto();
        await homePage.addProduct('Blue Top');
        await homePage.addProduct('Men Tshirt');
    });
    
    await test.step('Proceed to checkout', async () => {
        await cartPage.goto();
        await cartPage.clickProceedToCheckout();
    });
    
    await test.step('Verify order confirmation', async () => {
        await expect(page).toHaveURL(/order-confirmation/);
    });
});
```

### 5.3 Test Naming and Organization

**Rule:** Descriptive names with tags, grouped by `test.describe()`.

```typescript
// ✅ GOOD: Clear naming and organization
test.describe('TC03: Add to Cart', { tag: '@cart' }, () => {
    
    test('should add single product with default quantity', async ({ ... }) => {
        // ...
    });
    
    test('should add multiple products with custom quantities', async ({ ... }) => {
        // ...
    });
});

// ❌ BAD: Vague naming
test('test1', async ({ page }) => {
    // ...
});
```

### 5.4 Fixtures Usage

**Rule:** Use custom fixtures from `src/fixtures` instead of raw Playwright fixtures.

```typescript
// ❌ BAD: Using base Playwright test
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
    const homePage = new HomePage(page);  // Manual instantiation
});

// ✅ GOOD: Using custom fixtures
import { test, expect } from '../../src/fixtures';

test('my test', async ({ homePage, cartPage }) => {
    // Pages injected via fixtures
    await homePage.goto();
});
```

### 5.5 Review Checklist - Tests

- [ ] Follows AAA pattern (Arrange, Act, Assert)
- [ ] Uses `test.step()` for complex test flows
- [ ] Imports from `src/fixtures` (not `@playwright/test`)
- [ ] Descriptive test names indicating expected behavior
- [ ] Uses `test.describe()` for grouping related tests
- [ ] Includes appropriate tags (`@smoke`, `@regression`, etc.)
- [ ] No hardcoded test data (uses constants or DataFactory)
- [ ] Single responsibility - one logical flow per test

---

## 6. Framework Encapsulation

### 6.1 No Direct Playwright Calls in Tests

**Rule:** All Playwright interactions must be encapsulated in Page Objects or Steps.

```typescript
// ❌ BAD: Direct Playwright API in test
test('should login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('user@test.com');
    await page.locator('#password').fill('password');
    await page.click('button[type="submit"]');
});

// ✅ GOOD: Encapsulated in page object
test('should login', async ({ loginPage, homePage }) => {
    await loginPage.goto();
    await loginPage.login('user@test.com', 'password');
    await homePage.verifyLoggedInVisible();
});
```

### 6.2 Step Layer for Business Logic

**Rule:** Multi-page workflows and complex business logic must use Steps classes with `test.step()` annotations for reporting and traceability.

#### Step Class Structure

```typescript
// src/steps/CartSteps.ts
import { test } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export class CartSteps {
    constructor(
        private productsPage: ProductsPage,
        private detailsPage: ProductDetailsPage
    ) {}
    
    /**
     * Add product with custom quantity
     * Annotated with test.step for clear reporting
     */
    async addProductWithQuantity(productName: string, quantity: number): Promise<void> {
        await test.step(`Add "${productName}" with quantity ${quantity}`, async () => {
            await this.productsPage.goto();
            await this.productsPage.viewProductByName(productName);
            await this.detailsPage.setQuantity(quantity);
            await this.detailsPage.addToCart();
            await this.detailsPage.clickContinueShopping();
        });
    }

    /**
     * Add product and navigate to cart
     */
    async addProductAndGoToCart(productName: string): Promise<void> {
        await test.step(`Add "${productName}" and go to cart`, async () => {
            await this.productsPage.goto();
            await this.productsPage.viewProductByName(productName);
            await this.detailsPage.addToCart();
            await this.detailsPage.clickViewCartFromModal();
        });
    }

    /**
     * Populate cart with multiple products
     */
    async populateCart(productNames: string[]): Promise<void> {
        await test.step(`Populate cart with ${productNames.length} products`, async () => {
            for (const name of productNames) {
                await this.addProductWithQuantity(name, 1);
            }
        });
    }
}
```

#### Step Annotation Benefits

| Benefit | Description |
|---------|-------------|
| **Traceability** | Each step appears in HTML report with timing |
| **Debugging** | Failed step clearly identified in trace viewer |
| **Documentation** | Step names describe business intent |
| **Nesting** | Steps can contain sub-steps for complex flows |

#### Nested Steps for Complex Flows

```typescript
// src/steps/PurchaseSteps.ts
export class PurchaseSteps {
    constructor(
        private cartSteps: CartSteps,
        private checkoutPage: CheckoutPage,
        private paymentPage: PaymentPage
    ) {}

    async completePurchase(products: string[], paymentDetails: PaymentInfo): Promise<void> {
        await test.step('Complete end-to-end purchase', async () => {
            
            await test.step('Add products to cart', async () => {
                for (const product of products) {
                    await this.cartSteps.addProductWithQuantity(product, 1);
                }
            });

            await test.step('Complete checkout', async () => {
                await this.checkoutPage.goto();
                await this.checkoutPage.fillShippingAddress();
                await this.checkoutPage.clickPlaceOrder();
            });

            await test.step('Process payment', async () => {
                await this.paymentPage.fillPaymentDetails(paymentDetails);
                await this.paymentPage.clickPayAndConfirm();
            });
        });
    }
}
```

#### When to Use Steps vs Page Objects

| Use Case | Layer | Example |
|----------|-------|---------|
| Single page interaction | Page Object | `loginPage.fillUsername()` |
| Multi-step on same page | Page Object | `loginPage.login(email, password)` |
| Cross-page workflow | Steps | `authSteps.registerAndLogin(user)` |
| Business process | Steps | `purchaseSteps.completePurchase()` |
| Reusable test setup | Steps | `cartSteps.populateCart(products)` |

#### Test Usage

```typescript
// In test - clean and readable
test('should add products', async ({ cartSteps }) => {
    await cartSteps.addProductWithQuantity('Blue Top', 3);
    await cartSteps.addProductAndGoToCart('Men Tshirt');
});

// Complex E2E test
test('should complete purchase flow', async ({ purchaseSteps, user }) => {
    const products = ['Blue Top', 'Men Tshirt'];
    const payment = TestData.PAYMENT;
    
    await purchaseSteps.completePurchase(products, payment);
});
```

### 6.3 Review Checklist - Encapsulation

- [ ] No `page.locator()` in test files
- [ ] No `page.click()`, `page.fill()` etc. in test files
- [ ] No `page.goto()` with raw URLs in test files
- [ ] Complex workflows use Steps classes
- [ ] Steps methods use `test.step()` annotations
- [ ] Step descriptions are meaningful and include parameters
- [ ] Page objects don't contain test assertions (except verification methods)
- [ ] Fixtures provide all page object and steps instances

---

## 7. Configuration and Constants

### 7.1 Routes and URLs

**Rule:** Use `Routes` constants, never hardcode URLs.

```typescript
// ❌ BAD: Hardcoded URLs
await page.goto('https://www.automationexercise.com/products');
await expect(page).toHaveURL('https://www.automationexercise.com/cart');

// ✅ GOOD: Routes constants
import { Routes } from '../constants/Routes';

await page.goto(Routes.WEB.PRODUCTS);
await expect(page).toHaveURL(Routes.WEB.VIEW_CART);
```

### 7.2 Test Data

**Rule:** Use constants or `DataFactory` for test data.

```typescript
// ❌ BAD: Hardcoded test data
const email = 'test@example.com';
const password = 'password123';

// ✅ GOOD: Constants for static data
import { TestData } from '../constants/TestData';

await paymentPage.fillCardNumber(TestData.PAYMENT.CARD_NUMBER);

// ✅ GOOD: DataFactory for dynamic data
import { DataFactory } from '../utils/DataFactory';

const user = DataFactory.generateUser();
await signupPage.fillAccountDetails(user);
```

### 7.3 Environment Variables

**Rule:** Environment-specific values must use environment variables.

```typescript
// ❌ BAD: Environment check in code
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://prod.example.com' 
    : 'https://staging.example.com';

// ✅ GOOD: Single env variable
// In .env
BASE_URL=https://staging.example.com

// In code - just use it
const baseUrl = process.env.BASE_URL;
```

### 7.4 Review Checklist - Configuration

- [ ] No hardcoded full URLs
- [ ] Uses `Routes` constants for navigation
- [ ] Test data comes from constants or DataFactory
- [ ] Environment-specific values use env variables
- [ ] Sensitive data (passwords, keys) not committed
- [ ] Route builders used for dynamic paths

---

## 8. API and Schema Validation

### 8.1 Zod Schema Validation

**Rule:** All API responses must be validated with Zod schemas.

```typescript
// ❌ BAD: No validation
async createAccount(user: User) {
    const response = await this.post(Routes.API.CREATE_ACCOUNT, user);
    return await response.json();  // Unvalidated!
}

// ✅ GOOD: Schema validation
async createAccount(user: User) {
    const response = await this.post(Routes.API.CREATE_ACCOUNT, user);
    expect(response.status()).toBe(StatusCode.OK);
    
    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);  // Throws if invalid
    
    return validated;
}
```

### 8.2 Schema Design

**Rule:** Use strict schemas with descriptive validation messages.

```typescript
// ✅ GOOD: Strict schema with descriptions
export const UserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email format'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
}).strict();  // Rejects unknown properties

// ✅ GOOD: Composed schemas
const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    zipcode: z.string(),
}).strict();

const UserWithAddressSchema = UserSchema.merge(AddressSchema);
```

### 8.3 Status Code Constants

**Rule:** Use `StatusCode` constants, not magic numbers.

```typescript
// ❌ BAD: Magic numbers
expect(response.status()).toBe(200);
expect(parsed.responseCode).toBe(201);

// ✅ GOOD: Named constants
import { StatusCode } from '../constants/StatusCode';

expect(response.status()).toBe(StatusCode.OK);
expect(parsed.responseCode).toBe(StatusCode.CREATED);
```

### 8.4 Review Checklist - API

- [ ] All API responses validated with Zod `.parse()`
- [ ] Schemas use `.strict()` to reject unknown properties
- [ ] Status codes use `StatusCode` constants
- [ ] Error responses have appropriate handling
- [ ] API clients extend `ApiClient` base class
- [ ] Request/response types inferred from Zod schemas

---

## 9. Parallel Execution Safety

### 9.1 No Shared State

**Rule:** Tests must not share mutable state or depend on execution order.

```typescript
// ❌ BAD: Shared state between tests
let sharedUser: User;

test('create user', async () => {
    sharedUser = DataFactory.generateUser();
    await api.createUser(sharedUser);
});

test('login with user', async () => {
    await loginPage.login(sharedUser.email, sharedUser.password);  // Depends on first test!
});

// ✅ GOOD: Independent tests
test('login with user', async ({ authSteps }) => {
    const user = DataFactory.generateUser();
    await authSteps.registerUser(user);
    await authSteps.login(user.email, user.password);
});
```

### 9.2 Worker-Isolated Data

**Rule:** Each parallel worker must use unique test data.

```typescript
// ✅ GOOD: Unique data per test using DataFactory
test('should register user', async ({ registrationSteps }) => {
    // DataFactory generates unique email with random suffix
    const user = DataFactory.generateUser();
    await registrationSteps.registerUser(user);
});
```

### 9.3 Fixture Scoping

**Rule:** Understand and use appropriate fixture scopes.

```typescript
// Worker-scoped - shared across tests in same worker
export const authFixture = {
    workerUser: [async ({}, use, workerInfo) => {
        const user = DataFactory.generateUser();
        await use(user);
    }, { scope: 'worker' }],
};

// Test-scoped (default) - fresh for each test
export const pageFixtures = {
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
};
```

### 9.4 Review Checklist - Parallel Safety

- [ ] No module-level mutable variables
- [ ] No test-to-test dependencies
- [ ] Uses `DataFactory` for unique test data
- [ ] Fixtures have appropriate scope (test vs worker)
- [ ] No assumptions about test execution order
- [ ] Uses `isolatedTest` when auth state should not be shared

---

## 10. Assertion Best Practices

### 10.1 Auto-Waiting Assertions

**Rule:** Use Playwright's `expect()` which auto-waits. Never use `waitForTimeout()`.

```typescript
// ❌ BAD: Hard-coded timeout
await page.waitForTimeout(2000);
const text = await element.textContent();
expect(text).toBe('Success');

// ✅ GOOD: Auto-waiting assertion
await expect(element).toHaveText('Success');
await expect(page).toHaveURL(/success/);
```

### 10.2 Custom Assertion Messages

**Rule:** Add descriptive messages to non-obvious assertions.

```typescript
// ❌ BAD: No message - unclear what failed
expect(cartCount).toBe(2);

// ✅ GOOD: Clear failure message
expect(cartCount, 'Cart should contain exactly 2 items after adding products').toBe(2);

// ✅ GOOD: Playwright assertions with descriptions
await expect(element, 'Success message should be visible after form submission').toBeVisible();
```

### 10.3 Element-Based Assertions

**Rule:** Assert on extracted element data, not just visibility or existence. Visibility checks alone provide weak test coverage.

#### Anti-Patterns

```typescript
// ❌ BAD: Visibility-only assertions (weak coverage)
await expect(cartTotal).toBeVisible();
await expect(successMessage).toBeVisible();
await expect(productRow).toBeVisible();

// ❌ BAD: Generic existence check
await expect(page.locator('.cart-item')).toHaveCount(1);  // Doesn't verify content

// ❌ BAD: Truthy check without specific value
const isVisible = await element.isVisible();
expect(isVisible).toBeTruthy();
```

#### Best Practices

```typescript
// ✅ GOOD: Extract data and assert specific values
const totalAmount = await cartPage.getTotalAmount();
expect(totalAmount, 'Cart total should be $150').toBe(150);

// ✅ GOOD: Assert on element content
const item = await cartPage.getProductByName('Blue Top');
expect(item.name).toBe('Blue Top');
expect(item.quantity).toBe(3);
expect(item.price).toBe(500);
expect(item.total).toBe(1500);

// ✅ GOOD: Verify calculated values
const calculatedTotal = await cartPage.getCalculatedTotal();
expect(calculatedTotal, 'Total should match sum of items').toBe(item1.total + item2.total);

// ✅ GOOD: Assert text content
await expect(successMessage).toHaveText('Order placed successfully');
await expect(errorMessage).toContainText('Invalid email');

// ✅ GOOD: Semantic Playwright assertions
await expect(input).toHaveValue('test@example.com');
await expect(checkbox).toBeChecked();
await expect(dropdown).toHaveValue('United States');
```

#### When Visibility Checks Are Acceptable

Visibility assertions are acceptable **only when combined with content assertions**:

```typescript
// ✅ ACCEPTABLE: Visibility + content
await expect(successMessage).toBeVisible();
await expect(successMessage).toHaveText('Registration successful');

// ✅ ACCEPTABLE: Visibility for conditional UI
await expect(errorBanner).not.toBeVisible();  // Verify no error state

// ✅ ACCEPTABLE: Visibility for dynamic elements
await expect(loadingSpinner).not.toBeVisible();  // Wait for loading to complete
await expect(dataTable).toBeVisible();
const rowCount = await dataTable.getRowCount();
expect(rowCount).toBeGreaterThan(0);
```

#### Data Extraction Pattern

```typescript
// Page Object: Extract structured data
export class CartPage extends BasePage {
    async getProductByName(name: string): Promise<CartItem> {
        const row = this.getProductRow(name);
        return {
            id: await row.getAttribute('id') ?? '',
            name: await row.locator('.name').textContent() ?? '',
            price: this.parsePrice(await row.locator('.price').textContent()),
            quantity: parseInt(await row.locator('.qty').textContent() ?? '0', 10),
            total: this.parsePrice(await row.locator('.total').textContent()),
        };
    }

    private parsePrice(text: string | null): number {
        return parseInt(text?.replace(/\D/g, '') ?? '0', 10);
    }
}

// Test: Assert on extracted data
test('should verify cart item details', async ({ cartPage }) => {
    const item = await cartPage.getProductByName('Blue Top');
    
    expect(item.name).toBe('Blue Top');
    expect(item.quantity).toBe(3);
    expect(item.total).toBe(item.price * item.quantity);
});
```

#### Assertion Priority

| Priority | Assertion Type | Example |
|----------|---------------|---------|
| 1 | Value assertions | `expect(item.price).toBe(500)` |
| 2 | Text assertions | `expect(element).toHaveText('Success')` |
| 3 | State assertions | `expect(checkbox).toBeChecked()` |
| 4 | Count assertions | `expect(rows).toHaveCount(5)` |
| 5 | Visibility (combined) | `toBeVisible()` + value check |
| ❌ | Visibility alone | `toBeVisible()` without content |

### 10.4 Soft Assertions

**Rule:** Use soft assertions for non-critical checks that shouldn't stop test execution.

```typescript
// Multiple checks where we want to see all failures
await test.step('Verify product details', async () => {
    await expect.soft(productPage.title).toHaveText('Blue Top');
    await expect.soft(productPage.price).toContainText('Rs. 500');
    await expect.soft(productPage.availability).toHaveText('In Stock');
    await expect.soft(productPage.condition).toHaveText('New');
});
```

### 10.5 Review Checklist - Assertions

- [ ] No `waitForTimeout()` usage
- [ ] Uses Playwright's auto-waiting `expect()`
- [ ] Custom messages on non-obvious assertions
- [ ] Asserts on extracted element data, not just visibility
- [ ] No standalone `toBeVisible()` without content verification
- [ ] Uses data extraction methods from page objects
- [ ] Uses `expect.soft()` where appropriate
- [ ] Assertions in test files, not page objects (except verify methods)

---

## 11. Severity Levels

### Critical (Must Fix)

Issues that **break functionality or cause test flakiness**:

- Tests fail due to incorrect locators
- Race conditions from shared state
- Missing await on async operations
- Security issues (hardcoded credentials)
- TypeScript compilation errors

### High (Should Fix)

Issues that **violate core architectural patterns**:

- Direct Playwright API calls in tests
- Missing Zod validation on API responses
- `any` type usage
- Not extending `BasePage`
- Hardcoded URLs or test data

### Medium (Recommend Fix)

Issues affecting **code quality and maintainability**:

- Missing `test.step()` in complex tests
- Locator duplication
- Missing readonly modifiers
- Inconsistent naming conventions
- Missing assertion messages

### Low (Consider)

**Style and minor optimizations**:

- JSDoc comments missing
- Import ordering
- Unused but harmless code
- Minor performance improvements
- Additional test coverage suggestions

---

## 12. Common Anti-Patterns

### Quick Reference Table

| Anti-Pattern | Severity | Correct Approach |
|--------------|----------|------------------|
| `page.locator()` in test file | High | Use page object method |
| `any` type | High | Define explicit type/interface |
| `waitForTimeout(ms)` | Critical | Use auto-waiting assertions |
| Hardcoded URL | High | Use `Routes` constants |
| XPath with indices | Critical | Use semantic locators |
| Shared mutable state | Critical | Use fixture or factory |
| Missing schema validation | High | Use `Schema.parse()` |
| Test without assertions | Critical | Add meaningful assertions |
| Magic numbers | Medium | Use named constants |
| Duplicate locators | Medium | Extract to page object |
| Absolute/aliased imports | Medium | Use relative imports |
| Visibility-only assertions | High | Assert on element data/content |
| Page object > 500 lines | Medium | Split into components |
| Mixed actions/assertions in PO | Medium | Separate into distinct methods |
| Steps without `test.step()` | Medium | Wrap in annotated steps |
| Inconsistent naming | Medium | Follow naming conventions |

---

## 13. Review Comment Templates

### Template: Encapsulation Violation

```markdown
**Issue:** Direct Playwright API call in test file

**Location:** `tests/web/TC01.spec.ts:15`

**Problem:**
await page.locator('#submit').click();

**Why it matters:**
Direct API calls bypass logging, error handling, and make tests harder to maintain.

**Suggested fix:**
// In LoginPage.ts
async clickSubmit() {
    await this.submitButton.click();
}

// In test
await loginPage.clickSubmit();
```

### Template: Locator Stability

```markdown
**Issue:** Fragile XPath locator

**Location:** `src/pages/ProductsPage.ts:25`

**Problem:**
page.locator('//div[3]/ul/li[2]/a')

**Why it matters:**
Index-based XPath breaks when DOM structure changes. This is a common source of flaky tests.

**Suggested fix:**
page.getByRole('link', { name: 'Product Name' })
// OR
page.getByTestId('product-link')
```

### Template: Type Safety

```markdown
**Issue:** Usage of `any` type

**Location:** `src/api/UserService.ts:10`

**Problem:**
async processResponse(data: any): Promise<any>

**Why it matters:**
`any` disables TypeScript's type checking, hiding potential bugs and reducing IDE support.

**Suggested fix:**
import { ApiResponse } from '../models/ApiModels';

async processResponse(data: unknown): Promise<ApiResponse> {
    return ApiResponseSchema.parse(data);
}
```

### Template: Missing Validation

```markdown
**Issue:** Unvalidated API response

**Location:** `src/api/OrderService.ts:20`

**Problem:**
const data = await response.json();
return data;  // No validation!

**Why it matters:**
Without validation, unexpected API responses cause cryptic runtime errors instead of clear validation failures.

**Suggested fix:**
const data = await response.json();
return OrderResponseSchema.parse(data);
```

### Template: Hardcoded Value

```markdown
**Issue:** Hardcoded URL in test

**Location:** `tests/web/TC05.spec.ts:8`

**Problem:**
await page.goto('https://www.automationexercise.com/products');

**Why it matters:**
Hardcoded URLs make environment switching impossible and violate DRY principle.

**Suggested fix:**
import { Routes } from '../../src/constants/Routes';

await page.goto(Routes.WEB.PRODUCTS);
// OR
await productsPage.goto();  // Encapsulated navigation
```

### Template: Parallel Safety

```markdown
**Issue:** Shared mutable state

**Location:** `tests/web/TC02.spec.ts:3`

**Problem:**
let testUser: User;

test('first test', () => {
    testUser = DataFactory.generateUser();
});

test('second test', () => {
    await loginPage.login(testUser.email);  // Depends on first test!
});

**Why it matters:**
Parallel test execution doesn't guarantee order. This pattern causes intermittent failures.

**Suggested fix:**
test('second test', async () => {
    const user = DataFactory.generateUser();
    await registrationSteps.register(user);
    await loginPage.login(user.email, user.password);
});
```

### Template: Absolute Import

```markdown
**Issue:** Absolute/aliased import used

**Location:** `src/pages/CartPage.ts:2`

**Problem:**
import { BasePage } from '@pages/BasePage';
import { Routes } from 'src/constants/Routes';

**Why it matters:**
Absolute imports require path alias configuration and can break refactoring. Relative imports are more explicit and portable.

**Suggested fix:**
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';
```

### Template: Visibility-Only Assertion

```markdown
**Issue:** Assertion only checks visibility, not content

**Location:** `tests/web/TC03.spec.ts:25`

**Problem:**
await expect(cartTotal).toBeVisible();
await expect(successMessage).toBeVisible();

**Why it matters:**
Visibility checks provide weak test coverage. The element could be visible but contain wrong data.

**Suggested fix:**
// Extract and assert actual values
const total = await cartPage.getTotalAmount();
expect(total, 'Cart total should be $150').toBe(150);

await expect(successMessage).toHaveText('Order placed successfully');
```

### Template: Page Object Too Large

```markdown
**Issue:** Page object exceeds 500 lines

**Location:** `src/pages/ProductsPage.ts` (650 lines)

**Problem:**
Large page objects are hard to maintain and indicate mixed responsibilities.

**Why it matters:**
Files over 500 lines become difficult to navigate and often contain duplicate code.

**Suggested fix:**
Split into components:
// src/pages/ProductsPage.ts (~200 lines)
// src/components/ProductFilters.ts
// src/components/ProductGrid.ts
// src/components/Pagination.ts

Or split by functionality:
// src/pages/products/ProductListPage.ts
// src/pages/products/ProductDetailsPage.ts
```

### Template: Missing Step Annotation

```markdown
**Issue:** Steps method missing test.step() annotation

**Location:** `src/steps/CartSteps.ts:15`

**Problem:**
async addProductWithQuantity(productName: string, quantity: number) {
    await this.productsPage.goto();
    await this.productsPage.viewProduct(productName);
    await this.detailsPage.setQuantity(quantity);
    await this.detailsPage.addToCart();
}

**Why it matters:**
Without test.step() annotation, this workflow won't appear as a named step in reports, making debugging harder.

**Suggested fix:**
async addProductWithQuantity(productName: string, quantity: number) {
    await test.step(`Add "${productName}" with quantity ${quantity}`, async () => {
        await this.productsPage.goto();
        await this.productsPage.viewProduct(productName);
        await this.detailsPage.setQuantity(quantity);
        await this.detailsPage.addToCart();
    });
}
```

### Template: Naming Convention Violation

```markdown
**Issue:** Method name does not follow camelCase convention

**Location:** `src/pages/LoginPage.ts:20`

**Problem:**
async Click_Submit() { }
// or
async ClickSubmit() { }

**Why it matters:**
Inconsistent naming makes code harder to read and breaks IDE autocomplete expectations.

**Suggested fix:**
async clickSubmit() { }
```

---

## Summary Checklist

Before approving any code review, verify:

### Must Pass (Blocking)
- [ ] No TypeScript compilation errors
- [ ] No `any` types
- [ ] No direct Playwright calls in tests
- [ ] No `waitForTimeout()`
- [ ] No fragile XPath locators
- [ ] No hardcoded URLs
- [ ] All API responses validated with Zod
- [ ] No shared mutable state between tests
- [ ] Assertions verify element data, not just visibility
- [ ] All imports are relative (no aliases)

### Should Pass (High Priority)
- [ ] Page objects extend `BasePage`
- [ ] Locators declared as `readonly`
- [ ] Uses `Routes` and `TestData` constants
- [ ] Uses custom fixtures from `src/fixtures`
- [ ] Tests follow AAA pattern
- [ ] Meaningful assertion messages
- [ ] Page objects separate actions from assertions
- [ ] Steps use `test.step()` annotations
- [ ] Naming conventions followed (camelCase methods, SCREAMING_SNAKE env vars)

### Nice to Have
- [ ] `test.step()` for complex tests
- [ ] JSDoc comments on public methods
- [ ] Locator `.describe()` annotations
- [ ] Soft assertions where appropriate
- [ ] Page objects under 500 lines
- [ ] Reusable components extracted

---

**Document Version:** 1.1  
**Last Updated:** 2025-12-05  
**Compatible with:** Playwright 1.40+, TypeScript 5.0+, Zod 3.x
