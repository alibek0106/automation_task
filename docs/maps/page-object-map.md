# Page Object Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW CODE!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Page Objects and methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing code instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Page Objects/methods

**ANTI-DUPLICATION RULES:**
- 🔴 **NEVER** create a new Page Object if one exists for the same page
- 🔴 **NEVER** create a new method if similar functionality exists
- 🔴 **NEVER** skip checking this file before coding
- 🟢 **ALWAYS** extend existing Page Objects with new methods
- 🟢 **ALWAYS** reuse existing methods, even if names differ
- 🟢 **ALWAYS** update this map after ANY changes

---

## Existing Page Objects

### WikipediaLandingPage (tests/pages/WikipediaLandingPage.ts)
**URL:** https://www.wikipedia.org/
**Purpose:** Wikipedia.org language selection landing page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| navigate() | - | Promise<void> | Navigate to Wikipedia.org |
| selectEnglish() | - | Promise<void> | Click English language option |

**Locators:**
- English link: `#js-link-box-en`

---

### WikipediaMainPage (tests/pages/WikipediaMainPage.ts)
**URL:** https://en.wikipedia.org/wiki/Main_Page
**Purpose:** English Wikipedia main page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify main page is loaded (inherited) |

**Locators:**
- Page container: `#Welcome_to_Wikipedia`
- Wikipedia logo: `.mw-wiki-logo`

---

### WikipediaNavigationMenu (tests/pages/WikipediaNavigationMenu.ts)
**Purpose:** Shared navigation menu component (top right)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| clickLogIn() | - | Promise<void> | Click Log in link |
| clickCreateAccount() | - | Promise<void> | Click Create account link |
| verifyUsernameDisplayed() | expectedUsername: string | Promise<void> | Verify username in menu |
| verifyAlertDisplayed() | - | Promise<void> | Verify alert link is displayed |
| verifyUserLinkDisplayed() | - | Promise<void> | Verify user link is displayed |
| verifyUserMenuLinkDisplayed() | - | Promise<void> | Verify user menu link is displayed |
| verifyWatchListLinkDisplayed() | - | Promise<void> | Verify watchlist link is displayed |
| verifyNotificationsLinkDisplayed() | - | Promise<void> | Verify notifications link is displayed |
| verifyLogInLinkIsHidden() | - | Promise<void> | Verify log in link is hidden |
| verifyCreateAccountLinkIsHidden() | - | Promise<void> | Verify create account link is hidden |
| enterSearchText() | text: string | Promise<void> | Type text into nav search input |
| clickSearch() | - | Promise<void> | Click nav search button |
| getSearchInputValue() | - | Promise<string> | Get nav search input value |
| verifySearchInputIsEmpty() | - | Promise<void> | Verify nav search input is empty |

**Locators:**
- Menu container: `#p-personal`
- Log in link: `li#pt-login-2 a`
- Create account link: `#pt-createaccount-2`
- Username link: `#pt-userpage-2 span`
- Alert link: `#pt-notifications-alert`
- Watchlist link: `#pt-watchlist-2`
- Notifications link: `#pt-notifications-notice`
- Search input: `#searchInput`
- Search button: `form#searchform button.cdx-search-input__end-button`

---

### WikipediaLoginPage (tests/pages/WikipediaLoginPage.ts)
**URL:** https://en.wikipedia.org/w/index.php?title=Special:UserLogin
**Purpose:** Wikipedia login form

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| enterUsername() | username: string | Promise<void> | Enter username |
| enterPassword() | password: string | Promise<void> | Enter password |
| clickLogin() | - | Promise<void> | Click login button |

**Locators:**
- Username input: `input#wpName1`
- Password input: `input#wpPassword1`
- Login button: `button#wpLoginAttempt`

---

### WikipediaCreateAccountPage (tests/pages/WikipediaCreateAccountPage.ts)
**URL:** https://en.wikipedia.org/w/index.php?title=Special:CreateAccount
**Purpose:** Account creation form

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| enterUsername() | username: string | Promise<void> | Enter username |
| enterPassword() | password: string | Promise<void> | Enter password |
| enterConfirmPassword() | password: string | Promise<void> | Re-enter password |
| clickCreateAccount() | - | Promise<void> | Submit account creation |

**Locators:**
- Username input: `input#wpName2`
- Password input: `input#wpPassword2`
- Confirm password: `input#wpRetype`
- Create button: `button#wpCreateaccount`

---

### WikipediaGetStartedPopupPage (tests/pages/WikipediaGetStartedPopupPage.ts)
**Purpose:** Get Started popup after account creation

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify popup is visible (inherited from BasePage) |
| verifyPopupContainsText() | text: string | Promise<void> | Verify popup text |
| clickGotIt() | - | Promise<void> | Dismiss popup |
| verifyPopupHidden() | - | Promise<void> | Verify popup closed |

**Locators:**
- Popup container: `.oo-ui-popupWidget-popup`
- Got it button: `button:has-text("Got it")`

---

### WikipediaSearchMediaPage (tests/pages/WikipediaSearchMediaPage.ts)
**URL:** https://test.wikipedia.org/w/index.php?search=...&title=Special:MediaSearch
**Purpose:** Search media results page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify page is loaded (inherited) |
| getSearchInputValue() | - | Promise<string> | Get search input value |
| verifySearchInputValue() | expectedValue: string | Promise<void> | Verify search input value |

**Locators:**
- Page container: `#sdms-search-input__input`
- Search input: `input#sdms-search-input__input`

---

## Method Naming Conventions

### Actions
- `click*` - Click elements
- `enter*` - Input text
- `select*` - Select from dropdowns
- `navigate*` - Navigate to pages

### Validations
- `verify*` - Complex validations
- `get*` - Retrieve values

---

## Update History

| Date | Page Object | Changes | Updated By |
|------|-------------|---------|------------|
| 2025-12-05 | WikipediaNavigationMenu | Added 7 missing methods, fixed locators | System |
| 2025-12-05 | WikipediaGetStartedPopupPage | Fixed verifyPopupVisible → verifyPageOpened | System |
| 2025-12-04 | WikipediaGetStartedPopupPage | Created PopupPage | System |
| 2025-12-04 | WikipediaCreateAccountPage | Removed popup methods | System |
| 2025-12-04 | WikipediaNavigationMenu | Added clickCreateAccount() | System |
| 2025-12-03 | WikipediaLoginPage | Initial creation | System |
| 2025-12-03 | WikipediaLandingPage | Initial creation | System |
| 2025-12-03 | WikipediaMainPage | Initial creation | System |
