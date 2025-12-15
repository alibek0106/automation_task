# Steps Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW STEPS!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Steps methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing methods instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Steps/methods

---

## Existing Steps Classes

### AutomationExerciseLandingSteps (tests/steps/AutomationExerciseLandingSteps.ts)
**Fixture:** `automationExerciseLandingSteps`
**Purpose:** Landing page verification

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| navigateToHomepage() | - | Navigate to homepage | ❌ |
| verifyPageOpened() | - | Verify landing page loaded | ❌ |

---

### AutomationExerciseNavigationSteps (tests/steps/AutomationExerciseNavigationSteps.ts)
**Fixture:** `automationExerciseNavigationSteps`
**Purpose:** Top navigation menu actions

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| clickSignupLogin() | - | Click Signup/Login link | ❌ |
| verifyUserLoggedIn() | username: string | Verify "Logged in as {username}" visible | ❌ |
| clickLogout() | - | Click Logout link | ❌ |
| clickDeleteAccount() | - | Click Delete Account link | ❌ |
| clickHome() | - | Click Home link | ❌ |
| clickProducts() | - | Click Products link | ❌ |
| clickCart() | - | Click Cart link | ❌ |

---

### AutomationExerciseLoginSteps (tests/steps/AutomationExerciseLoginSteps.ts)
**Fixture:** `automationExerciseLoginSteps`
**Purpose:** Login and signup initiation flow

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| navigateToLoginPage() | - | Navigate to login page | ❌ |
| verifyNewUserSignupVisible() | - | Verify "New User Signup!" section | ❌ |
| enterSignupCredentials() | name, email | Enter name + email in signup form | ✅ |
| clickSignupButton() | - | Click "Signup" button | ❌ |
| signup() | name, email | Full signup initiation flow | ✅ |
| enterLoginCredentials() | email, password | Enter email + password | ✅ |
| clickLoginButton() | - | Click login button | ❌ |
| login() | email, password | Full login flow (enter + click) | ✅ |

---

### AutomationExerciseSignupSteps (tests/steps/AutomationExerciseSignupSteps.ts)
**Fixture:** `automationExerciseSignupSteps`
**Purpose:** Signup flow (ENTER ACCOUNT INFORMATION page)

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyAccountInfoPageOpened() | - | Verify "ENTER ACCOUNT INFORMATION" page | ❌ |
| fillAccountDetails() | AccountDetails | Fill title, password, DOB | ✅ |
| selectNewsletter() | - | Check newsletter checkbox | ❌ |
| selectSpecialOffers() | - | Check special offers checkbox | ❌ |
| fillAddressInfo() | AddressInfo | Fill all address fields | ✅ |
| clickCreateAccount() | - | Click Create Account button | ❌ |
| verifyAccountCreated() | - | Verify "ACCOUNT CREATED!" message | ❌ |
| clickContinue() | - | Click Continue button | ❌ |
| completeSignupForm() | AccountDetails, AddressInfo | Complete full signup form | ✅ |

---

## Common Patterns

### Registration Flow
```typescript
await automationExerciseNavigationSteps.clickSignupLogin();
await automationExerciseLoginSteps.verifyNewUserSignupVisible();
await automationExerciseLoginSteps.signup(name, email);
await automationExerciseSignupSteps.verifyAccountInfoPageOpened();
await automationExerciseSignupSteps.fillAccountDetails(accountDetails);
await automationExerciseSignupSteps.selectNewsletter();
await automationExerciseSignupSteps.selectSpecialOffers();
await automationExerciseSignupSteps.fillAddressInfo(addressInfo);
await automationExerciseSignupSteps.clickCreateAccount();
await automationExerciseSignupSteps.verifyAccountCreated();
await automationExerciseSignupSteps.clickContinue();
await automationExerciseNavigationSteps.verifyUserLoggedIn(name);
```

### Authentication Flow
```typescript
await automationExerciseNavigationSteps.clickSignupLogin();
await automationExerciseLoginSteps.login(email, password);
await automationExerciseNavigationSteps.verifyUserLoggedIn(username);
```

---

---

### AutomationExerciseProductsSteps (src/steps/AutomationExerciseProductsSteps.ts)
**Purpose:** Products listing interactions

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyProductsPageVisible() | - | Verify products page loaded | ❌ |
| viewFirstProductDetails() | - | Click first View Product button | ❌ |
| addProductToCart() | index | Add product at index to cart | ❌ |

---

### AutomationExerciseProductDetailSteps (src/steps/AutomationExerciseProductDetailSteps.ts)
**Purpose:** Product details page interactions

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyProductDetailVisible() | - | Verify details page loaded | ❌ |
| addProductToCartWithQuantity() | quantity | Set quantity and add to cart | ✅ |
| clickContinueShopping() | - | Handle modal "Continue Shopping" | ❌ |
| clickViewCart() | - | Handle modal "View Cart" | ❌ |

---

### AutomationExerciseCartSteps (src/steps/AutomationExerciseCartSteps.ts)
**Purpose:** Cart page verification

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyCartVisible() | - | Verify cart page loaded | ❌ |
| verifyCartContent() | products | Verify list of products in cart | ✅ |

---

## Update History

| Date | Steps Class | Changes |
|------|-------------|---------|
| 2025-12-12 | AutomationExerciseLandingSteps | Added navigateToHomepage() method |
| 2025-12-12 | AutomationExerciseLoginSteps | Added verifyNewUserSignupVisible(), enterSignupCredentials(), clickSignupButton(), signup() |
| 2025-12-12 | AutomationExerciseNavigationSteps | Added clickHome(), clickProducts(), clickCart() |
| 2025-12-12 | AutomationExerciseSignupSteps | Added full signup form methods |
| 2025-12-15 | AutomationExerciseProductsSteps | Added keys steps for products page |
| 2025-12-15 | AutomationExerciseProductDetailSteps | Added steps for product details |
| 2025-12-15 | AutomationExerciseCartSteps | Added steps for cart verification |
| 2025-12-12 | All | Reset for Automation Exercise project |