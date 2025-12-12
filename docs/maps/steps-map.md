# Steps Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW STEPS!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Steps methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing methods instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Steps/methods

---

## Existing Steps Classes

### WikipediaLandingSteps (tests/steps/WikipediaLandingSteps.ts)
**Fixture:** `wikipediaLandingSteps`
**Purpose:** Landing page navigation and language selection

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| openWikipedia() | - | Navigate to wikipedia.org | ❌ |
| verifyPageOpened() | - | Verify landing page loaded | ❌ |
| openAndVerify() | - | Navigate + verify | ✅ |
| selectEnglish() | - | Click English link | ❌ |
| selectEnglishAndVerifyMainPage() | - | Select English + verify main page | ✅ |

---

### WikipediaMainSteps (tests/steps/WikipediaMainSteps.ts)
**Fixture:** `wikipediaMainSteps`
**Purpose:** Main page verification

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyPageOpened() | - | Verify main page loaded | ❌ |

---

### WikipediaNavigationSteps (tests/steps/WikipediaNavigationSteps.ts)
**Fixture:** `wikipediaNavigationSteps`
**Purpose:** Top navigation menu actions

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| clickLogIn() | - | Click Log in link | ❌ |
| clickCreateAccount() | - | Click Create account link | ❌ |
| verifyUsernameDisplayed() | expectedUsername: string | Verify username in menu | ❌ |
| verifyAlertDisplayed() | - | Verify alert is displayed | ❌ |
| verifyUserLinkDisplayed() | - | Verify user link is displayed | ❌ |
| verifyUserMenuLinkDisplayed() | - | Verify user menu link is displayed | ❌ |
| verifyWatchListLinkDisplayed() | - | Verify watchlist link is displayed | ❌ |
| verifyNotificationsLinkDisplayed() | - | Verify notifications link is displayed | ❌ |
| verifyLogInLinkIsHidden() | - | Verify log in link is hidden | ❌ |
| verifyCreateAccountLinkIsHidden() | - | Verify create account link is hidden | ❌ |
| enterSearchText() | text: string | Type text into nav search | ❌ |
| clickSearch() | - | Click nav search button | ❌ |
| verifySearchInputIsEmpty() | - | Verify nav search input is empty | ❌ |

---

### WikipediaLoginSteps (tests/steps/WikipediaLoginSteps.ts)
**Fixture:** `wikipediaLoginSteps`
**Purpose:** Login flow

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyPageOpened() | - | Verify login page loaded | ❌ |
| enterCredentials() | username, password | Enter username + password | ✅ |
| clickLoginButton() | - | Click login button | ❌ |
| login() | username, password | Full login flow | ✅ |

---

### WikipediaCreateAccountSteps (tests/steps/WikipediaCreateAccountSteps.ts)
**Fixture:** `wikipediaCreateAccountSteps`
**Purpose:** Account creation flow + Get Started popup

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyPageOpened() | - | Verify create account page | ❌ |
| enterUsername() | username: string | Enter username | ❌ |
| enterPassword() | password: string | Enter password | ❌ |
| enterConfirmPassword() | password: string | Confirm password | ❌ |
| clickCreateAccount() | - | Submit form | ❌ |
| fillAccountForm() | username, password | Fill all form fields | ✅ |
| verifyGetStartedPopupDisplayed() | expectedText: string | Verify popup visible + text | ✅ |
| clickGotItOnPopup() | - | Click Got it button | ❌ |
| verifyAndDismissGetStartedPopup() | expectedText: string | Verify + dismiss + verify closed | ✅ |

---

### WikipediaSearchMediaSteps (tests/steps/WikipediaSearchMediaSteps.ts)
**Fixture:** `wikipediaSearchMediaSteps`
**Purpose:** Search media page verification

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyPageOpened() | - | Verify Search Media page loaded | ❌ |
| verifySearchInputValue() | expectedValue: string | Verify search input has value | ❌ |

---

## Common Patterns

### Authentication Flow
```typescript
await wikipediaNavigationSteps.clickLogIn();
await wikipediaLoginSteps.login(username, password);
await wikipediaNavigationSteps.verifyUsernameDisplayed(username);
```

### Account Creation Flow
```typescript
await wikipediaNavigationSteps.clickCreateAccount();
await wikipediaCreateAccountSteps.fillAccountForm(username, password);
await wikipediaCreateAccountSteps.clickCreateAccount();
await wikipediaCreateAccountSteps.verifyAndDismissGetStartedPopup(message);
```

### Navigate to Main Page
```typescript
await wikipediaLandingSteps.openAndVerify();
await wikipediaLandingSteps.selectEnglishAndVerifyMainPage();
```

---

## Update History

| Date | Steps Class | Changes |
|------|-------------|---------|
| 2025-12-05 | WikipediaNavigationSteps | Added 7 missing verification methods |
| 2025-12-04 | WikipediaCreateAccountSteps | Added verifyAndDismissGetStartedPopup() |
| 2025-12-04 | WikipediaNavigationSteps | Added clickCreateAccount() |
| 2025-12-03 | All | Initial creation |
