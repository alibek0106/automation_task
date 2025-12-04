# Web GUI Playwright TypeScript Coding Guidelines

**AI-Assisted Code Quality Control Guidelines for Web GUI Automation**

This document describes the requirements and best practices for Web GUI automation using Playwright and TypeScript. These guidelines ensure maintainable, reliable, and scalable test automation code.

---

## Table of Contents

1. [Framework Encapsulation](#1-framework-encapsulation)
2. [Locator Stability](#2-locator-stability)
3. [Locator Reusability](#3-locator-reusability)
4. [Configuration Management](#4-configuration-management)
5. [Element Initialization](#5-element-initialization)
6. [Locator Composition](#6-locator-composition)

---

## 1. Framework Encapsulation

**Priority:** High  
**Category:** Structural issue

### Rule

All interactions with web elements must be encapsulated within the framework layer. Direct calls to Playwright's low-level APIs should not appear in test files.

### Benefits

1. **Enhanced Logging** - Centralized action logging produces clear, detailed test reports
2. **Error Handling** - Prevents cryptic errors like `TimeoutError` or detached element exceptions with meaningful context
3. **Custom Actions** - Enables creation of domain-specific actions (e.g., `clickAndWait`, `fillWithValidation`)

### Implementation Pattern

```typescript
// ❌ BAD: Direct Playwright API calls in tests
test('should submit form', async ({ page }) => {
    await page.locator('#submit-btn').click();  // No logging, poor error context
    await page.waitForURL('/success');
});

// ✅ GOOD: Encapsulated in Page Object
export class FormPage {
    readonly page: Page;
    readonly submitBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
    }

    async submit() {
        // Encapsulated action with logging
        await this.submitBtn.click();
        await this.page.waitForURL('/success');
    }
}

// In test
await formPage.submit();  // Clean, logged, with proper error context
```

### Custom Action Example

```typescript
// Framework extension for common patterns
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Click and wait for navigation - encapsulated custom action
     */
    async clickAndWaitForNavigation(locator: Locator, expectedUrl: RegExp) {
        await Promise.all([
            this.page.waitForURL(expectedUrl),
            locator.click()
        ]);
    }

    /**
     * Fill input with validation
     */
    async fillWithValidation(locator: Locator, value: string) {
        await locator.fill(value);
        await expect(locator, `Input should contain "${value}"`).toHaveValue(value);
    }
}
```

---

## 2. Locator Stability

**Priority:** High  
**Category:** Vulnerable locator

### Rule

XPath locators must avoid:
- Long chains of intermediate elements (`//form/span/div/div/input`)
- Index-based selectors (`//form[2]/div[1]/div[3]/span[1]/input`)

These patterns create brittle locators that break with minor HTML changes.

### Anti-Patterns

```typescript
// ❌ BAD: Fragile XPath with deep nesting
page.locator('//form/div[1]/section/div[2]/span[3]/input')

// ❌ BAD: Index-dependent XPath
page.locator('//nav/ul[2]/li[5]/a')

// ❌ BAD: Dynamic ID binding
page.locator('//div[@id="element_1235152"]')  // ID changes per build

// ❌ BAD: Fragile class binding
page.locator('//button[@class="btn-primary-large-submit-active"]')  // CSS refactor breaks this
```

### Best Practices

```typescript
// ✅ GOOD: Role-based selector (resilient to HTML changes)
page.getByRole('textbox', { name: 'Email' })

// ✅ GOOD: Test ID selector (stable, explicit)
page.getByTestId('email-input')

// ✅ GOOD: Label association (semantic, accessible)
page.getByLabel('Email address')

// ✅ GOOD: Relative locator with semantic anchor
page.getByRole('button', { name: 'Submit' })
    .locator('..') // Navigate to parent if needed
    .getByText('Required')

// ✅ GOOD: Stable attribute selector
page.locator('[name="email"]')
```

### Locator Priority

```typescript
// Priority order (most stable to least stable)
1. page.getByRole()           // BEST - semantic, accessible, resilient
2. page.getByLabel()          // Excellent - user-facing
3. page.getByTestId()         // Good - explicit, stable
4. page.getByText()           // Good for static text
5. page.locator('[attr]')     // Last resort - stable attributes only
```

---

## 3. Locator Reusability

**Priority:** High  
**Category:** Vulnerable locator

### Rule

When multiple elements share similar locator patterns, use parameterized locator templates instead of duplicating locators.

### Anti-Pattern

```typescript
// ❌ BAD: Duplicated locator patterns
export class NavigationMenu {
    readonly mainLink = this.page.locator("//div[@class='menu']//a[text()='Main']");
    readonly settingsLink = this.page.locator("//div[@class='menu']//a[text()='Settings']");
    readonly profileLink = this.page.locator("//div[@class='menu']//a[text()='Profile']");
    readonly logoutLink = this.page.locator("//div[@class='menu']//a[text()='Logout']");
}
```

### Best Practice

```typescript
// ✅ GOOD: Parameterized locator template
export class NavigationMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get menu link by text - reusable template
     */
    getMenuLink(linkText: string): Locator {
        return this.page
            .locator('.menu')
            .getByRole('link', { name: linkText });
    }

    // Usage in methods
    async navigateToSettings() {
        await this.getMenuLink('Settings').click();
    }

    async navigateToProfile() {
        await this.getMenuLink('Profile').click();
    }
}

// Or using modern Playwright features
export class NavigationMenu {
    readonly page: Page;
    readonly menuContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuContainer = page.locator('.menu');
    }

    getLink(name: string): Locator {
        return this.menuContainer.getByRole('link', { name });
    }
}
```

### Dynamic Locator Pattern

```typescript
// ✅ GOOD: Template for dynamic table rows
export class DataTable {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get table row by ID - parameterized locator
     */
    getRowById(id: string): Locator {
        return this.page.getByTestId(`table-row-${id}`);
    }

    /**
     * Get cell in specific row and column
     */
    getCell(rowId: string, columnName: string): Locator {
        return this.getRowById(rowId).getByTestId(`cell-${columnName}`);
    }

    /**
     * Get action button for specific row
     */
    getActionButton(rowId: string, action: 'edit' | 'delete'): Locator {
        return this.getRowById(rowId).getByRole('button', { name: action });
    }
}

// Usage in test
await dataTable.getActionButton('user-123', 'edit').click();
await dataTable.getCell('user-123', 'email').fill('new@email.com');
```

---

## 4. Configuration Management

**Priority:** High  
**Category:** Code issue

### Rule

Never hardcode full URLs or API endpoints in test code. Store base URLs in configuration files to enable easy environment switching.

### Anti-Patterns

```typescript
// ❌ BAD: Hardcoded full URLs
await page.goto('https://prod.example.com/dashboard');
await request.get('https://api.prod.example.com/users/123');

// ❌ BAD: Environment-specific URLs in code
const apiUrl = isProduction 
    ? 'https://api.prod.example.com' 
    : 'https://api.staging.example.com';
```

### Best Practice - Configuration File

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    use: {
        baseURL: process.env.BASE_URL,  // Environment-specific
        apiURL: process.env.API_URL,
    },
});
```

```bash
# .env.production
BASE_URL=https://prod.example.com
API_URL=https://api.prod.example.com

# .env.staging
BASE_URL=https://staging.example.com
API_URL=https://api.staging.example.com
```

### Routes Constants Pattern

```typescript
// src/constants/Routes.ts
export const Routes = {
    // UI Routes - relative paths
    HOME: '/',
    DASHBOARD: '/dashboard',
    SETTINGS: '/settings',
    PROFILE: '/profile/:userId',
    
    // API Endpoints - relative paths
    USERS: '/api/users',
    ORDERS: '/api/orders',
    
    // Dynamic route builders
    userProfile: (userId: string) => `/profile/${userId}`,
    orderDetails: (orderId: string) => `/orders/${orderId}`,
    apiUserById: (id: number) => `/api/users/${id}`,
} as const;
```

### Usage in Tests

```typescript
// ✅ GOOD: Using configuration + route constants
import { Routes } from '../constants/Routes';

test('should navigate to dashboard', async ({ page }) => {
    await page.goto(Routes.DASHBOARD);  // Resolves to baseURL + /dashboard
    await expect(page).toHaveURL(Routes.DASHBOARD);
});

test('should fetch user data', async ({ request }) => {
    const response = await request.get(Routes.apiUserById(123));
    // Resolves to apiURL + /api/users/123
    expect(response.status()).toBe(200);
});

// ✅ GOOD: Dynamic routes
export class ProfilePage {
    async goto(userId: string) {
        await this.page.goto(Routes.userProfile(userId));
    }
}
```

### Multi-Environment Setup

```typescript
// src/config/environment.ts
export const Environment = {
    baseURL: process.env.BASE_URL!,
    apiURL: process.env.API_URL!,
    
    // Other environment-specific configs
    timeout: process.env.CI ? 60000 : 30000,
    retries: process.env.CI ? 2 : 0,
} as const;

// Validate required env vars
if (!Environment.baseURL || !Environment.apiURL) {
    throw new Error('BASE_URL and API_URL must be defined in environment');
}
```

---

## 5. Element Initialization

**Priority:** Medium  
**Category:** Code issue

### Rule

- **Static elements** with stable locators must be initialized once in the constructor
- **Dynamic elements** whose locators depend on parameters must use private getter methods

This avoids duplication and improves maintainability.

### Anti-Pattern - Duplicate Initialization

```typescript
// ❌ BAD: Locators recreated in every method
export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addToCart() {
        // Recreating locator every time
        const button = this.page.getByRole('button', { name: 'Add to Cart' });
        await button.click();
    }

    async checkAvailability() {
        // Same locator recreated again
        const button = this.page.getByRole('button', { name: 'Add to Cart' });
        return await button.isEnabled();
    }
}
```

### Best Practice - Static Elements

```typescript
// ✅ GOOD: Initialize once in constructor
export class ProductPage {
    readonly page: Page;
    
    // Static locators - initialized once
    readonly addToCartBtn: Locator;
    readonly productTitle: Locator;
    readonly priceLabel: Locator;
    readonly quantityInput: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize all static locators once
        this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        this.productTitle = page.getByRole('heading', { level: 1 });
        this.priceLabel = page.getByTestId('product-price');
        this.quantityInput = page.getByLabel('Quantity');
    }

    async addToCart(quantity: number = 1) {
        await this.quantityInput.fill(String(quantity));
        await this.addToCartBtn.click();  // Reuse initialized locator
    }

    async isAvailable(): Promise<boolean> {
        return await this.addToCartBtn.isEnabled();  // Reuse same locator
    }
}
```

### Best Practice - Dynamic Elements

```typescript
// ✅ GOOD: Dynamic locators with private getters
export class ProductCatalog {
    readonly page: Page;
    
    // Static locator templates as private properties
    private readonly productCardTemplate = '[data-testid="product-card"]';
    private readonly addButtonTemplate = 'button[data-action="add"]';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Private getter for dynamic product card locator
     */
    private getProductCard(productName: string): Locator {
        return this.page.locator(this.productCardTemplate, {
            has: this.page.getByText(productName, { exact: true })
        });
    }

    /**
     * Private getter for add button within specific product
     */
    private getAddButton(productName: string): Locator {
        return this.getProductCard(productName)
            .locator(this.addButtonTemplate);
    }

    // Public methods use private getters
    async addProduct(productName: string) {
        await this.getAddButton(productName).click();
    }

    async getProductPrice(productName: string): Promise<string> {
        const priceLocator = this.getProductCard(productName)
            .getByTestId('price');
        return await priceLocator.textContent() ?? '';
    }

    async isProductAvailable(productName: string): Promise<boolean> {
        return await this.getAddButton(productName).isEnabled();
    }
}
```

### Comparison Table

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Constructor initialization** | Locator never changes | `this.submitBtn = page.getByRole('button', { name: 'Submit' })` |
| **Private getter method** | Locator depends on parameters | `private getRow(id: string): Locator` |
| **Template variable** | Base locator reused in getters | `private readonly rowTemplate = '[data-row-id]'` |

---

## 6. Locator Composition

**Priority:** Medium  
**Category:** Vulnerable locator

### Rule

When multiple locators share common parent elements, extract the shared portion into a separate locator to reduce duplication and improve maintainability.

### Anti-Pattern - Repeated Base Locators

```typescript
// ❌ BAD: Duplicate base locator in every element
export class InfoPopup {
    readonly closeBtn = this.page.locator("//div[@class='info_popup']//button[@aria-label='Close']");
    readonly readMoreLink = this.page.locator("//div[@class='info_popup']//a[text()='Read more']");
    readonly title = this.page.locator("//div[@class='info_popup']//h2[@class='popup-title']");
    readonly description = this.page.locator("//div[@class='info_popup']//p[@class='popup-text']");
}
```

### Best Practice - Compose from Base Locator

```typescript
// ✅ GOOD: Extract shared parent locator
export class InfoPopup {
    readonly page: Page;
    
    // Base container locator - defined once
    readonly container: Locator;
    
    // Child elements composed from base
    readonly closeBtn: Locator;
    readonly readMoreLink: Locator;
    readonly title: Locator;
    readonly description: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Define base container once
        this.container = page.locator('.info_popup');
        
        // Compose child locators from container
        this.closeBtn = this.container.getByRole('button', { name: 'Close' });
        this.readMoreLink = this.container.getByRole('link', { name: 'Read more' });
        this.title = this.container.locator('.popup-title');
        this.description = this.container.locator('.popup-text');
    }

    async close() {
        await this.closeBtn.click();
    }

    async readMore() {
        await this.readMoreLink.click();
    }
}
```

### Complex Component Example

```typescript
// ✅ GOOD: Multi-level locator composition
export class UserProfileCard {
    readonly page: Page;
    
    // Level 1: Main container
    readonly container: Locator;
    
    // Level 2: Section containers
    readonly headerSection: Locator;
    readonly statsSection: Locator;
    readonly actionsSection: Locator;
    
    // Level 3: Elements within sections
    readonly avatar: Locator;
    readonly username: Locator;
    readonly followersCount: Locator;
    readonly followingCount: Locator;
    readonly followButton: Locator;
    readonly messageButton: Locator;

    constructor(page: Page, userId: string) {
        this.page = page;
        
        // Level 1: Main container
        this.container = page.getByTestId(`profile-card-${userId}`);
        
        // Level 2: Sections within container
        this.headerSection = this.container.locator('[data-section="header"]');
        this.statsSection = this.container.locator('[data-section="stats"]');
        this.actionsSection = this.container.locator('[data-section="actions"]');
        
        // Level 3: Elements within sections
        this.avatar = this.headerSection.getByRole('img', { name: /avatar/i });
        this.username = this.headerSection.getByTestId('username');
        
        this.followersCount = this.statsSection.getByTestId('followers-count');
        this.followingCount = this.statsSection.getByTestId('following-count');
        
        this.followButton = this.actionsSection.getByRole('button', { name: 'Follow' });
        this.messageButton = this.actionsSection.getByRole('button', { name: 'Message' });
    }

    async follow() {
        await this.followButton.click();
    }

    async getFollowerCount(): Promise<number> {
        const text = await this.followersCount.textContent();
        return parseInt(text ?? '0', 10);
    }
}
```

### Benefits of Locator Composition

```typescript
// ✅ Benefits demonstrated

export class ModalDialog {
    readonly container: Locator;
    readonly header: Locator;
    readonly content: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.container = page.getByRole('dialog');
        
        // 1. DRY - No repetition of base locator
        this.header = this.container.locator('[data-modal-section="header"]');
        this.content = this.container.locator('[data-modal-section="content"]');
        this.footer = this.container.locator('[data-modal-section="footer"]');
    }

    // 2. Maintainability - Change base selector in one place
    // If '.modal-dialog' changes to '[role="dialog"]', update constructor only

    // 3. Scoping - All searches scoped to container
    async getHeaderText(): Promise<string> {
        // Searches only within dialog, not entire page
        return await this.header.textContent() ?? '';
    }

    // 4. Readability - Clear hierarchy
    async clickConfirm() {
        await this.footer
            .getByRole('button', { name: 'Confirm' })
            .click();
    }
}
```

### Nested Component Pattern

```typescript
// ✅ GOOD: Reusable nested components
export class FormField {
    readonly container: Locator;
    readonly label: Locator;
    readonly input: Locator;
    readonly errorMessage: Locator;

    constructor(container: Locator) {
        this.container = container;
        this.label = container.locator('label');
        this.input = container.locator('input, textarea, select');
        this.errorMessage = container.locator('.error-message');
    }

    async fill(value: string) {
        await this.input.fill(value);
    }

    async hasError(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }
}

export class RegistrationForm {
    readonly page: Page;
    readonly container: Locator;
    
    // Composed field components
    readonly emailField: FormField;
    readonly passwordField: FormField;
    readonly confirmPasswordField: FormField;

    constructor(page: Page) {
        this.page = page;
        this.container = page.getByTestId('registration-form');
        
        // Create field components from container
        this.emailField = new FormField(
            this.container.locator('[data-field="email"]')
        );
        this.passwordField = new FormField(
            this.container.locator('[data-field="password"]')
        );
        this.confirmPasswordField = new FormField(
            this.container.locator('[data-field="confirm-password"]')
        );
    }

    async fillEmail(email: string) {
        await this.emailField.fill(email);
    }

    async hasPasswordError(): Promise<boolean> {
        return await this.passwordField.hasError();
    }
}
```

---

## Quick Reference Summary

### Locator Priorities

1. ✅ `getByRole()` - Most stable, accessible
2. ✅ `getByLabel()` - User-facing, semantic
3. ✅ `getByTestId()` - Explicit, stable
4. ⚠️ `locator('[attribute]')` - Use for stable attributes only
5. ❌ Avoid XPath chains and index-based selectors

### Code Organization Checklist

- [ ] All element interactions encapsulated in Page Objects
- [ ] No hardcoded URLs or API endpoints in tests
- [ ] Static locators initialized once in constructor
- [ ] Dynamic locators use private getter methods
- [ ] Shared locator bases extracted to separate properties
- [ ] Locator templates used for similar patterns
- [ ] Routes defined in constants file
- [ ] Environment configs in `.env` files

### Common Patterns

```typescript
// Static element
readonly submitBtn = page.getByRole('button', { name: 'Submit' });

// Dynamic element getter
private getRow(id: string): Locator {
    return this.page.getByTestId(`row-${id}`);
}

// Locator composition
readonly container = page.locator('.modal');
readonly closeBtn = this.container.getByRole('button', { name: 'Close' });

// Route constant
export const Routes = {
    DASHBOARD: '/dashboard',
    apiUsers: (id: number) => `/api/users/${id}`,
};
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-03  
**Compatible with:** Playwright 1.40+, TypeScript 5.0+
