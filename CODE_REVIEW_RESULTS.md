# Code Review Results

**Review Date:** December 5, 2025  
**Reviewer:** AI Code Review Agent  
**Guidelines Reference:** [AI_CODE_REVIEW_GUIDELINES.md](./AI_CODE_REVIEW_GUIDELINES.md)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Engineer Feedback: @Abdykarimov](#2-engineer-feedback-abdykarimov)
3. [Engineer Feedback: @meladze](#3-engineer-feedback-meladze)
4. [Framework Review: Code Duplications](#4-framework-review-code-duplications)
5. [Framework Review: Unused Code](#5-framework-review-unused-code)
6. [Framework Review: TypeScript Issues](#6-framework-review-typescript-issues)
7. [Framework Review: Missing Step Annotations](#7-framework-review-missing-step-annotations)
8. [Common Issues](#8-common-issues)
9. [Action Items Summary](#9-action-items-summary)

---

## 1. Executive Summary

### Overall Assessment

The codebase demonstrates a solid foundation with good adoption of the Page Object Model pattern, proper use of custom fixtures, and effective use of constants for test data. However, there are several areas requiring attention to align with the project guidelines.

### Issue Statistics by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 0 | No blocking issues found |
| **High** | 8 | Architectural violations, parallel safety risks |
| **Medium** | 15 | Code quality, maintainability concerns |
| **Low** | 6 | Style, minor optimizations |

### Engineers Summary

| Engineer | Tests Reviewed | High Issues | Medium Issues |
|----------|---------------|-------------|---------------|
| @Abdykarimov | TC01, TC02, TC03, TC04, TC08 | 1 | 4 |
| @meladze | TC05, TC06, TC07, TC09, TC10 | 4 | 5 |

---

## 2. Engineer Feedback: @Abdykarimov

**Tests Reviewed:** TC01_Register, TC02_VerifyAuth, TC03_AddToCart, TC04_RemoveFromCart, TC08_UpdateCart

### Strengths

- Excellent use of `test.step()` annotations for clear test reporting
- Proper implementation of AAA (Arrange-Act-Assert) pattern
- Strong data extraction and value-based assertions (TC03, TC04, TC08)
- Correct use of `isolatedTest` for parallel execution safety
- Good use of `DataFactory` for dynamic test data generation
- Tags properly placed at `test.describe()` level

### Issues to Address

#### HIGH: Shared State at Describe Level (TC02:7)

**Location:** `tests/web/TC02_VerifyAuth.spec.ts:7`

**Problem:**
```typescript
test.describe('TC02: Login with Registered User', { tag: '@Abdykarimov' }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const user = DataFactory.generateUser();  // <-- Shared state!
```

**Why it matters:**
This creates shared mutable state between tests. When tests run in parallel, the same `user` object could be accessed by multiple workers, causing race conditions and flaky tests.

**Guideline Reference:** Section 9.1 - No Shared State

**Suggested fix:**
```typescript
test.describe('TC02: Login with Registered User', { tag: '@Abdykarimov' }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login successfully with valid credentials', async ({
        homePage,
        loginPage,
        userService,
    }) => {
        // Generate unique user per test
        const user = DataFactory.generateUser();
        
        await test.step('Precondition: Create User via API', async () => {
            await userService.createAccount(user);
        });
        
        // ... rest of test
    });
});
```

---

#### MEDIUM: Visibility-Only Assertion (TC02:22)

**Location:** `tests/web/TC02_VerifyAuth.spec.ts:22`

**Problem:**
```typescript
await expect(loginPage.loginHeader).toBeVisible();
```

**Why it matters:**
Visibility-only assertions provide weak test coverage. The element could be visible but contain wrong text.

**Guideline Reference:** Section 10.3 - Element-Based Assertions

**Suggested fix:**
```typescript
await expect(loginPage.loginHeader).toHaveText('Login to your account');
```

---

#### MEDIUM: Visibility-Only Assertion (TC04:44)

**Location:** `tests/web/TC04_RemoveFromCart.spec.ts:44`

**Problem:**
```typescript
await expect(cartPage.emptyCartMessage).toBeVisible();
```

**Suggested fix:**
```typescript
await expect(cartPage.emptyCartMessage).toHaveText('Cart is empty!');
```

---

#### MEDIUM: Missing test.step() in CartSteps

**Location:** `src/steps/CartSteps.ts`

**Problem:**
Step methods lack `test.step()` annotations, reducing traceability in reports.

**Current code:**
```typescript
async addProductWithQuantity(productName: string, quantity: number) {
    await this.productsPage.goto();
    await this.productsPage.viewProductByName(productName);
    // ...
}
```

**Guideline Reference:** Section 6.2 - Step Layer for Business Logic

**Suggested fix:**
```typescript
async addProductWithQuantity(productName: string, quantity: number) {
    await test.step(`Add "${productName}" with quantity ${quantity}`, async () => {
        await this.productsPage.goto();
        await this.productsPage.viewProductByName(productName);
        // ...
    });
}
```

---

#### MEDIUM: Missing test.step() in RegistrationSteps

**Location:** `src/steps/RegistrationSteps.ts`

All methods (`startRegistration`, `fillAccountDetails`, `finishAccountCreation`, `performFullRegistration`) should be wrapped with `test.step()` for better traceability.

---

### Recommendations for @Abdykarimov

1. **Investigate:** Parallel execution patterns - ensure no shared state between tests
2. **Avoid:** Visibility-only assertions - always verify content or values
3. **Improve:** Add `test.step()` annotations to all Step class methods
4. **Continue:** Good practices with AAA pattern and data extraction

---

## 3. Engineer Feedback: @meladze

**Tests Reviewed:** TC05_SearchProduct, TC06_PurchaseFlow, TC07_Logout, TC09_CategoryBrandFilter, TC10_ContactFormSubmission

### Strengths

- Good use of `TestData` constants for test data
- Proper fixture usage
- Good coverage of end-to-end user flows
- Comprehensive scenario coverage

### Issues to Address

#### HIGH: Tag Placement (TC05, TC06, TC07, TC09)

**Location:** Multiple test files

**Problem:**
Tags are placed inline in test names instead of at `test.describe()` level:

```typescript
// TC05_SearchProduct.spec.ts:4-6
test.describe('TC05: Search Product and Verify Results', () => {

  test('@meladze should search for products...', async ({  // <-- Tag in test name
```

**Guideline Reference:** Section 5.3 - Test Naming and Organization

**Suggested fix:**
```typescript
test.describe('TC05: Search Product and Verify Results', { tag: '@meladze' }, () => {

  test('should search for products and verify results', async ({
```

Apply this pattern to TC05, TC06, TC07, and TC09.

---

#### HIGH: Very Long Tests Without test.step() (TC06, TC07)

**Location:** 
- `tests/web/TC06_PurchaseFlow.spec.ts` (87 lines)
- `tests/web/TC07_Logout.spec.ts` (80 lines)

**Problem:**
These tests are very long without logical grouping using `test.step()`, making them hard to debug and maintain.

**Guideline Reference:** Section 5.2 - Test Steps

**Example from TC06 - Current:**
```typescript
test('@meladze should complete end-to-end purchase flow', async ({...}) => {
    const user = DataFactory.generateUser();
    await homePage.goto();
    await homePage.clickSignupLogin();
    await loginPage.signup(user.name, user.email);
    // ... 80+ more lines without grouping
});
```

**Suggested fix:**
```typescript
test('should complete end-to-end purchase flow', async ({...}) => {
    const user = DataFactory.generateUser();
    
    await test.step('Register new user', async () => {
        await homePage.goto();
        await homePage.clickSignupLogin();
        await loginPage.signup(user.name, user.email);
        await signupPage.fillAccountDetails(user);
        await signupPage.submit();
        await expect(accountCreatedPage.successMessage).toBeVisible();
        await accountCreatedPage.clickContinue();
    });
    
    await test.step('Add products to cart', async () => {
        await productsPage.navigateToProducts();
        await productsPage.addProductToCart(0);
        await productsPage.addProductToCart(1);
    });
    
    await test.step('Complete checkout', async () => {
        await productsPage.navigateToCart();
        await cartPage.clickProceedToCheckout();
        // ...
    });
    
    await test.step('Process payment', async () => {
        // ...
    });
});
```

---

#### HIGH: Incomplete Test Implementation (TC10)

**Location:** `src/pages/ContactPage.ts:131-138`

**Problem:**
The `submitContactForm()` method has commented out implementation:

```typescript
async submitContactForm(data: {...}) {
    // await this.fillContactForm(data);
    // if (data.filePath) {
    //     await this.uploadFile(data.filePath);
    // }
    // await this.clickSubmit();
}
```

This means TC10 doesn't actually test the form submission.

**Action Required:** Complete the implementation or remove the test if the website has issues.

---

#### HIGH: Duplicate Registration Flow (TC06, TC07)

**Location:** 
- `tests/web/TC06_PurchaseFlow.spec.ts:22-31`
- `tests/web/TC07_Logout.spec.ts:19-27`

**Problem:**
Both tests duplicate the full registration flow instead of using `registrationSteps`:

```typescript
// Duplicated in both TC06 and TC07:
await homePage.goto();
await homePage.clickSignupLogin();
await loginPage.signup(user.name, user.email);
await signupPage.fillAccountDetails(user);
await signupPage.submit();
await expect(accountCreatedPage.successMessage).toBeVisible();
await accountCreatedPage.clickContinue();
```

**Guideline Reference:** Section 6.2 - Step Layer for Business Logic

**Suggested fix:**
Use `registrationSteps` like TC01 does:
```typescript
await registrationSteps.startRegistration(user);
await registrationSteps.fillAccountDetails(user);
await registrationSteps.finishAccountCreation();
```

---

#### MEDIUM: Multiple Visibility-Only Assertions (TC05)

**Location:** `tests/web/TC05_SearchProduct.spec.ts:19-20`

**Problem:**
```typescript
await productsPage.verifyAllProductsVisible();
await productsPage.verifySearchBoxVisible();
```

These methods only check `toBeVisible()` without verifying content.

**Suggested improvement:** Combine visibility with content assertions where possible.

---

#### MEDIUM: Test Does Too Many Things (TC07)

**Location:** `tests/web/TC07_Logout.spec.ts`

**Problem:**
TC07 tests multiple distinct scenarios in one test:
1. Logout functionality
2. Session termination verification
3. Protected page access
4. Back button behavior
5. Cart checkout without login
6. Re-login verification

**Guideline Reference:** Section 5.5 - Single responsibility - one logical flow per test

**Suggested fix:**
Split into focused tests:
```typescript
test.describe('TC07: Logout Functionality', { tag: '@meladze' }, () => {
    test('should logout successfully', async ({...}) => {...});
    test('should terminate session after logout', async ({...}) => {...});
    test('should require login for protected pages after logout', async ({...}) => {...});
    test('should not restore session with back button', async ({...}) => {...});
});
```

---

#### MEDIUM: No test.step() Usage (TC09)

**Location:** `tests/web/TC09_CategoryBrandFilter.spec.ts`

The test has no `test.step()` grouping despite having multiple logical sections (category filtering, brand filtering).

---

### Recommendations for @meladze

1. **Investigate:** Proper tag placement at `test.describe()` level
2. **Investigate:** Using `test.step()` for logical grouping in long tests
3. **Avoid:** Duplicating code that exists in Step classes
4. **Avoid:** Creating tests that cover too many scenarios
5. **Fix:** Complete TC10 implementation or document why it's incomplete
6. **Improve:** Add content-based assertions alongside visibility checks

---

## 4. Framework Review: Code Duplications

### Duplicate Locators

| Location 1 | Location 2 | Duplicate Element |
|------------|------------|-------------------|
| `ProductsPage.ts:8,30` | `ProductDetailsPage.ts:9,18` | `continueShoppingBtn` |

**Details:**
Both pages define the exact same locator:
```typescript
// ProductsPage.ts:30
this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });

// ProductDetailsPage.ts:18
this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });
```

**Recommendation:** 
The "Continue Shopping" button appears in a modal that shows after adding to cart. Consider:
1. Creating a shared `AddToCartModal` component
2. Or removing from `ProductsPage` and only using from `ProductDetailsPage`

---

### Duplicate Locator Recreation

| File | Line | Issue |
|------|------|-------|
| `HomePage.ts` | 32, 36 | Recreates `loggedInText` locator inline |

**Problem:**
```typescript
// Line 14 - defined as class property
this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' });

// Lines 32, 36 - recreated inline instead of using property
async verifyLoggedInVisible() {
    await expect(this.page.getByText('Logged in as')).toBeVisible();  // Should use this.loggedInText
}
```

**Fix:**
```typescript
async verifyLoggedInVisible() {
    await expect(this.loggedInText).toBeVisible();
}
```

---

### Duplicate Text Check

| File | Lines | Issue |
|------|-------|-------|
| `ContactPage.ts` | 58, 59 | Double check for same text |

**Problem:**
```typescript
async verifyGetInTouchFormVisible() {
    await expect(this.getInTouchHeading).toBeVisible();           // Checks heading
    await expect(this.page.getByText('Get In Touch')).toBeVisible(); // Redundant check
}
```

**Fix:** Remove line 59 as it's redundant.

---

### Duplicate Test Logic

| Files | Duplicated Code |
|-------|-----------------|
| TC06:22-31, TC07:19-27 | Full registration flow |

Both TC06 and TC07 duplicate the entire registration sequence instead of using `registrationSteps`. This violates DRY principle and makes maintenance harder.

---

## 5. Framework Review: Unused Code

### Unused Methods

| File | Line | Method/Property | Status |
|------|------|-----------------|--------|
| `HomePage.ts` | 8, 15 | `deleteAccountLink` | Never used |
| `RegistrationSteps.ts` | 32 | `performFullRegistration()` | Never called |
| `ContactPage.ts` | 160 | `clearForm()` | Never called |
| `ContactPage.ts` | 170 | `verifyFormClearedOrRedirected()` | Never called |
| `ContactPage.ts` | 100 | `verifyFileAttached()` | Never called |
| `ProductDetailsPage.ts` | 22 | `getProductNameText()` | Never called |

**Action:** Remove unused code or implement tests that use these methods.

---

### Unused Constants

| File | Line | Constant | Status |
|------|------|----------|--------|
| `Routes.ts` | 14 | `Routes.API.VERIFY_LOGIN` | Never used |
| `TestData.ts` | 91-96 | `INVALID_EMAILS` array | Never used |
| `StatusCode.ts` | 4-7 | `BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR` | Only OK and CREATED used |

**Action:** Remove unused constants or document as placeholders for future use.

---

### Unused Imports/Parameters

| File | Line | Issue |
|------|------|-------|
| `AuthSteps.ts` | 12 | `context: BrowserContext` injected but never used |

**Code:**
```typescript
export class AuthSteps {
    constructor(
        private page: Page,
        private homePage: HomePage,
        private loginPage: LoginPage,
        private context: BrowserContext  // <-- Never used
    ) { }
```

**Action:** Remove unused `context` parameter or implement functionality that uses it.

---

### Unused Zod Schemas

| File | Schema | Issue |
|------|--------|-------|
| `ProductModels.ts` | `CartItemSchema` | Schema defined but never used for `.parse()` validation |

**Code:**
```typescript
export const CartItemSchema = z.object({...});
export type CartItem = z.infer<typeof CartItemSchema>;  // Only type is used
```

**Guideline Reference:** Section 8.1 - Zod Schema Validation

**Recommendation:** Use `CartItemSchema.parse()` when extracting cart data to validate structure:
```typescript
async getProductByName(productName: string): Promise<CartItem> {
    const row = this.getProductRow(productName);
    const rawData = await this.extractRowData(row);
    return CartItemSchema.parse(rawData);  // Validate before returning
}
```

---

## 6. Framework Review: TypeScript Issues

### `any` Type Usage (High Severity)

Per Guidelines Section 2.1, `any` type should never be used.

| File | Line | Current Code | Suggested Fix |
|------|------|--------------|---------------|
| `ApiClient.ts` | 6 | `data: Record<string, any>` | `data: Record<string, string \| number \| boolean>` |
| `steps.fixture.ts` | 18 | `use: any` | `use: (r: RegistrationSteps) => Promise<void>` |
| `pages.fixture.ts` | 27 | `use: any` | `use: (p: HomePage) => Promise<void>` |
| `pages.fixture.ts` | 30 | `use: any` | `use: (p: LoginPage) => Promise<void>` |
| `pages.fixture.ts` | 33 | `use: any` | `use: (p: SignupPage) => Promise<void>` |
| `pages.fixture.ts` | 36 | `use: any` | `use: (p: AccountCreatedPage) => Promise<void>` |
| `api.fixture.ts` | 9 | `use: any` | `use: (s: UserService) => Promise<void>` |

**Example fix for `pages.fixture.ts`:**
```typescript
// Before
homePage: async ({ page }: { page: Page }, use: any) => {
    await use(new HomePage(page));
},

// After
homePage: async ({ page }: { page: Page }, use: (p: HomePage) => Promise<void>) => {
    await use(new HomePage(page));
},
```

---

## 7. Framework Review: Missing Step Annotations

Per Guidelines Section 6.2, all Step class methods should use `test.step()` annotations for traceability.

### CartSteps.ts

| Method | Current | Should Be |
|--------|---------|-----------|
| `addProductWithQuantity()` | No annotation | `test.step(\`Add "${productName}" with quantity ${quantity}\`, ...)` |
| `addProductAndGoToCart()` | No annotation | `test.step(\`Add "${productName}" and go to cart\`, ...)` |
| `populateCart()` | No annotation | `test.step(\`Populate cart with ${count} products\`, ...)` |

### RegistrationSteps.ts

| Method | Current | Should Be |
|--------|---------|-----------|
| `startRegistration()` | No annotation | `test.step('Start registration process', ...)` |
| `fillAccountDetails()` | No annotation | `test.step('Fill account details', ...)` |
| `finishAccountCreation()` | No annotation | `test.step('Finish account creation', ...)` |
| `performFullRegistration()` | No annotation | `test.step('Perform full registration', ...)` |

### AuthSteps.ts

| Method | Current | Should Be |
|--------|---------|-----------|
| `login()` | No annotation | `test.step(\`Login as ${user.name}\`, ...)` |

---

## 8. Common Issues

### Issues Affecting Both Engineers

1. **Step Classes Missing Annotations**
   - All step methods should wrap their logic in `test.step()` for better HTML reports
   
2. **Visibility-Only Assertions in Page Objects**
   - Methods like `verifyAllProductsVisible()`, `verifySearchBoxVisible()` only check visibility
   - Should combine with content verification where possible

3. **Fixture Type Safety**
   - Multiple fixtures use `any` type instead of proper generics
   - This disables TypeScript's type checking benefits

---

## 9. Action Items Summary

### Immediate Actions (High Priority)

| # | Owner | Action | Files |
|---|-------|--------|-------|
| 1 | @Abdykarimov | Fix shared state in TC02 - move user generation inside test | `TC02_VerifyAuth.spec.ts` |
| 2 | @meladze | Move tags to `test.describe()` level | TC05, TC06, TC07, TC09 |
| 3 | @meladze | Add `test.step()` to long tests | TC06, TC07 |
| 4 | @meladze | Complete or remove TC10 implementation | `ContactPage.ts` |
| 5 | @meladze | Use `registrationSteps` instead of duplicate code | TC06, TC07 |
| 6 | Both | Fix `any` types in fixtures | `src/fixtures/*.ts` |

### Short-Term Actions (Medium Priority)

| # | Owner | Action | Files |
|---|-------|--------|-------|
| 7 | @Abdykarimov | Add `test.step()` to Step classes | `CartSteps.ts`, `RegistrationSteps.ts` |
| 8 | Both | Replace visibility-only assertions with content assertions | Multiple test files |
| 9 | @meladze | Split TC07 into focused tests | `TC07_Logout.spec.ts` |
| 10 | Framework | Remove duplicate `continueShoppingBtn` locator | `ProductsPage.ts` |
| 11 | Framework | Use existing `loggedInText` property in methods | `HomePage.ts` |

### Cleanup Actions (Low Priority)

| # | Action | Files |
|---|--------|-------|
| 12 | Remove unused `deleteAccountLink` | `HomePage.ts` |
| 13 | Remove unused `performFullRegistration()` | `RegistrationSteps.ts` |
| 14 | Remove unused methods in ContactPage | `ContactPage.ts` |
| 15 | Remove unused `context` parameter | `AuthSteps.ts` |
| 16 | Remove or use `Routes.API.VERIFY_LOGIN` | `Routes.ts` |
| 17 | Remove or use `INVALID_EMAILS` | `TestData.ts` |
| 18 | Implement `CartItemSchema.parse()` validation | `CartPage.ts` |

---

## Appendix: Guidelines Quick Reference

For detailed explanations of the rules referenced in this review, see:

- **Section 2.1** - Strict Typing Enforcement (no `any` types)
- **Section 5.2** - Test Steps (`test.step()` usage)
- **Section 5.3** - Test Naming and Organization (tag placement)
- **Section 6.2** - Step Layer for Business Logic
- **Section 8.1** - Zod Schema Validation
- **Section 9.1** - No Shared State (parallel execution safety)
- **Section 10.3** - Element-Based Assertions (avoid visibility-only)
- **Section 11** - Severity Levels

---

**Document Version:** 1.0  
**Review Completed:** December 5, 2025
